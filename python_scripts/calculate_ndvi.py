"""Using GEE, This script will calculate the 1 yr, 3yr, and 5yr NDVI
   for each huc 12 in North Carolina. Output will be a geojson file"""

# Authenticate Google Earth Engine
import ee, json, pprint
ee.Authenticate()
ee.Initialize(project='nemac-nc-dams')

# two composite median images
# 1yr start: 2022-05-11 to 2022-09-11   end: 2023-05-11 to 2023-09-11
# 3yr start: 2020-05-11 to 2020-09-11   end: 2023-05-11 to 2023-09-11
# 5yr start: 2018-05-11 to 2018-09-11   end: 2023-05-11 to 2023-09-11

# Import the North Carolina boundaries
nc = ee.FeatureCollection('TIGER/2018/States') \
  .filter(ee.Filter.eq('NAME', 'North Carolina')) \
  .geometry()

# Import the HUC12 dataset
huc12_data = ee.FeatureCollection('USGS/WBD/2017/HUC12') \
  .filter(ee.Filter.eq('states', 'NC'))
  #.filterBounds(nc

def get_filtered_collection(collection_id, start_date, end_date, bounds):
    return ee.ImageCollection(collection_id) \
        .filterDate(start_date, end_date) \
        .filterBounds(bounds)

one_year_start_fc = get_filtered_collection('COPERNICUS/S2_SR', '2022-05-11', '2022-09-11', nc.simplify(maxError=10))
one_year_end_fc = get_filtered_collection('COPERNICUS/S2_SR', '2023-05-11', '2023-09-11', nc.simplify(maxError=10))
one_year_start_cloud_fc = get_filtered_collection('COPERNICUS/S2_CLOUD_PROBABILITY', '2022-05-11', '2022-09-11', nc.simplify(maxError=10))
one_year_end_cloud_fc = get_filtered_collection('COPERNICUS/S2_CLOUD_PROBABILITY', '2023-05-11', '2023-09-11', nc.simplify(maxError=10))

MAX_CLOUD_PROBABILITY = 65

def maskClouds(img):
  clouds = ee.Image(img.get('cloud_mask')).select('probability')
  isNotCloud = clouds.lt(MAX_CLOUD_PROBABILITY)
  return img.updateMask(isNotCloud)

def maskEdges(s2_img):
  return s2_img.updateMask(
      s2_img.select('B8A').mask().updateMask(s2_img.select('B9').mask()))

# mask out edges, clouds, and return median NDVI image
def getChangeImage(start_fc, end_fc, start_cloud, end_cloud):
  start_fc = start_fc.map(maskEdges)
  end_fc = end_fc.map(maskEdges)
  # Join S2 SR with cloud probability dataset to add cloud mask.
  s2SrWithCloudMask_start = ee.Join.saveFirst('cloud_mask').apply(**{
    'primary': start_fc,
    'secondary': start_cloud,
    'condition':
        ee.Filter.equals(**{
          'leftField': 'system:index',
          'rightField': 'system:index'
        })
  })

  # Join S2 SR with cloud probability dataset to add cloud mask.
  s2SrWithCloudMask_end = ee.Join.saveFirst('cloud_mask').apply(**{
    'primary': end_fc,
    'secondary': end_cloud,
    'condition':
        ee.Filter.equals(**{
          'leftField': 'system:index',
          'rightField': 'system:index'
        })
  })

  cloud_masked_start = ee.ImageCollection(s2SrWithCloudMask_start).map(maskClouds).median()
  ndvi_start = cloud_masked_start.normalizedDifference(['B8', 'B4']).rename('NDVI')
  cloud_masked_start = cloud_masked_start.addBands(ndvi_start)
  cloud_masked_end = ee.ImageCollection(s2SrWithCloudMask_end).map(maskClouds).median()
  ndvi_end = cloud_masked_end.normalizedDifference(['B8', 'B4']).rename('NDVI')
  cloud_masked_end = cloud_masked_end.addBands(ndvi_end)
  change_image = cloud_masked_end.subtract(cloud_masked_start)

  return change_image

# Define a function to calculate NDVI
# def calculate_ndvi(feature):
#   geometry = feature.geometry()
#   mean_ndvi = change_image.reduceRegion(reducer=ee.Reducer.mean(), geometry=geometry, scale=30, bestEffort=True, tileScale=4).get('NDVI')
#   feature = feature.set('mean_ndvi_1yr', mean_ndvi)
#   feature = feature.set('mean_ndvi_1yr_percent', mean_ndvi.getInfo() * 100)
#   return ee.FeatureCollection([feature])

# Define a function to calculate NDVI
def calculate_ndvi_mapper(feature):
  geometry = feature.geometry()
  change_image = getChangeImage(one_year_start_fc, one_year_end_fc, one_year_start_cloud_fc, one_year_end_cloud_fc)
  mean_ndvi = change_image.reduceRegion(reducer=ee.Reducer.mean(), geometry=geometry, scale=30, bestEffort=True, tileScale=4).get('NDVI')
  feature = feature.set('mean_ndvi', mean_ndvi)
  mean_percent = ee.Number(mean_ndvi).multiply(100).round()
  feature = feature.set('mean_ndvi_percent', mean_percent)
  return feature

# full_huc12_list = huc12_data.aggregate_array('huc12').getInfo()
# huc12 = huc12_data.first().getInfo()['properties']['huc12']
# fc = huc12_data.filter(ee.Filter.equals('huc12', huc12))
# fc = calculate_ndvi(fc.first()) # Should only be one
# ndvi_fc = ndvi_fc.merge(fc)
# fc = huc12_data.filter(ee.Filter.equals('huc12', huc12))
# fc = calculate_ndvi(fc.first()) # Should only be one
# ndvi_fc = ndvi_fc.merge(fc)
# for huc12 in full_huc12_list:
#   print(huc12, counter)
#   counter += 1
#   fc = huc12_data.filter(ee.Filter.equals('huc12', huc12))
#   fc = calculate_ndvi(fc.first()) # Should only be one
#   fc = fc.getInfo()
#   ndvi_fc.update(fc)
#   print(ndvi_fc)
# collection_size = huc12_data.size().getInfo()
# for i in range(0, collection_size, 10):
#   chunk = huc12_data.toList(10, i)
#   fc = ee.FeatureCollection(chunk)
#   fc_unmerged = fc.map(calculate_ndvi_mapper)
#   ndvi_fc = ndvi_fc.merge(fc_unmerged)

huc12_data = huc12_data.limit(5).map(calculate_ndvi_mapper)
# Calculate mean of a single FeatureCollection property.
prop_histo = huc12_data.limit(5).reduceColumns(**{
    'reducer': ee.Reducer.histogram(),
    'selectors': ['mean_ndvi_percent']
    })
print('Histogram:', prop_histo.getInfo())
print(huc12_data.aggregate_histogram('mean_ndvi_1yr_percent').getInfo())  # Dictionary

# infoized = huc12_data.getInfo()
# with open('ndvi_fc.geojson', 'w') as f:
#     json.dump(infoized, f)

# fc = huc12_data.limit(100).map(calculate_ndvi_mapper)
# for feature in fc.getInfo()['features']:
#   print(feature['properties']['huc12'], feature['properties']['mean_ndvi_percent'])

# # Get a download URL for the FeatureCollection.
# download_url = ndvi_fc.getDownloadURL(**{
#   'filetype': 'GeoJSON',
#   'filename': 'huc',
# })
# print('URL for downloading FeatureCollection as GeoJSON:', download_url)

# print(fc.getInfo())