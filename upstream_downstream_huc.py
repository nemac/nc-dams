import geopandas as gpd
import geojson

# Load GeoJSON file
gdf = gpd.read_file('huc12_raw.geojson')

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

# Loop through every feature and find all of the upstream and downstream hucs
for index, feature in gdf.iterrows():
  # global variables for upstream and downstream huc lists
  upstream_huc_list = []
  downstream_huc_list = [[feature['tohuc']]] # start with the tohuc of the feature
  find_upstream_huc([feature['huc12']])
  find_downstream_huc([feature['tohuc']])
  gdf.at[index, 'upstream_huc_list'] = str(sum(upstream_huc_list, [])) # flatten list of lists
  gdf.at[index, 'downstream_huc_list'] = str(sum(downstream_huc_list, [])) # flatten list of lists

gdf.to_file("huc12_processed.geojson", driver='GeoJSON')