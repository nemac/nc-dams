# This script takes the output geojson from a google colab notebook
# and does some post processing on it as described below
# https://colab.research.google.com/drive/1eylU3waQbmvxT_mL_m5gQwFhgcJW9-jN

import geopandas as gpd
import numpy as np
import pandas as pd
from shapely.geometry import shape

# Create three bins for data and add them to the GeoJSON file
def bin_geojson_data(gdf, property, bin_name):
  print('preparing to bin data')
  # Calculate the bin edges
  bins = np.percentile(gdf[property], [33.3, 66.6])

  # Bin the property
  gdf[bin_name] = pd.cut(gdf[property], bins=[-np.inf, *bins, np.inf], labels=['high', 'medium', 'low'])

  # Convert the 'bin' column to string type
  gdf[bin_name] = gdf[bin_name].astype(str)

# Function to find all upstream huc
def find_upstream_huc(huc12_list):
  filtered_features = gdf[gdf['tohuc'].isin(huc12_list)]
  upstream_huc_unique = list(set(filtered_features['huc12'])) # remove duplicates
  if len(upstream_huc_unique) > 0:
    upstream_huc_list.append(upstream_huc_unique)
    find_upstream_huc(upstream_huc_unique)
  else:
    return

# Function to find all downstream huc
def find_downstream_huc(tohuc_list):
  filtered_features = gdf[gdf['huc12'].isin(tohuc_list)]
  downstream_huc_unique = list(set(filtered_features['tohuc'])) # remove duplicates
  if len(downstream_huc_unique) > 0:
    downstream_huc_list.append(downstream_huc_unique)
    find_downstream_huc(downstream_huc_unique)
  else:
    return

def get_building_count(gdf):
  print('preparing to get building count')
  # Grab this gpkg from slack and update path below to point to where you saved it
  # https://nemac.slack.com/files/U0C66HMC1/F06G9RQ6RU0/nc-buildings.gpkg.zip
  gpkg_file = '/Users/jbliss/Downloads/nc-buildings.gpkg'
  # Load the GPKG file layers
  gpkg_gdf_ml = gpd.read_file(gpkg_file, layer='machine-learning-derived')
  gpkg_gdf_osm = gpd.read_file(gpkg_file, layer='open-street-map-derived')
  # Initialize new columns in the GeoJSON DataFrame to store the counts
  gdf['machine_building_count'] = 0
  gdf['osm_building_count'] = 0

  for i, row in gdf.iterrows():
    # Create a shapely geometry object from the GeoJSON feature
    geojson_geom = shape(row['geometry'])
    
    # Count how many GPKG features from each layer are contained in the GeoJSON feature
    count_ml = gpkg_gdf_ml[gpkg_gdf_ml.geometry.within(geojson_geom)].shape[0]
    count_osm = gpkg_gdf_osm[gpkg_gdf_osm.geometry.within(geojson_geom)].shape[0]

    # Add these counts to the GeoJSON DataFrame
    gdf.at[i, 'machine_building_count'] = count_ml
    gdf.at[i, 'osm_building_count'] = count_osm
    gdf.at[i, 'total_building_count'] = count_ml+count_osm

    print('Feature: ', i+1, ' of ', len(gdf), ' total building count: ', count_ml+count_osm)

# Load GeoJSON data from google colab notebook output
gdf = gpd.read_file('huc12_data_with_ndvi.geojson')
bin_geojson_data(gdf, 'ndvi_change_one_year_percent', 'ndvi_change_one_year_bin')
bin_geojson_data(gdf, 'ndvi_change_three_year_percent', 'ndvi_change_three_year_bin')

# Finding upstream and downstream hucs is a bit hacky with global variables
print('preparing to find upstream and downstream hucs')
# Loop through every feature and find all of the upstream and downstream hucs
for index, feature in gdf.iterrows():
  print('Finding upstream and downstream hucs for feature: ', index+1, ' of ', len(gdf))
  # global variables for upstream and downstream huc lists
  upstream_huc_list = []
  downstream_huc_list = [[feature['tohuc']]] # start with the tohuc of the feature
  find_upstream_huc([feature['huc12']])
  find_downstream_huc([feature['tohuc']])
  gdf.at[index, 'upstream_huc_list'] = str(sum(upstream_huc_list, [])) # flatten list of lists
  gdf.at[index, 'downstream_huc_list'] = str(sum(downstream_huc_list, [])) # flatten list of lists

get_building_count(gdf)
# converting GeoDataFrame to a JSON
gdf = gdf.to_json()

# writing JSON data structure to a GeoJSON file
with open('processed_output_huc12.geojson', 'w', encoding='utf-8') as file:
    file.write(gdf)