import geopandas as gpd
from shapely.geometry import shape

# Load the GeoJSON file
geojson_gdf = gpd.read_file('public/huc12_final_data.geojson')

# Load the GPKG file layers
gpkg_gdf_ml = gpd.read_file('/Users/jbliss/Downloads/nc-buildings.gpkg', layer='machine-learning-derived')
gpkg_gdf_osm = gpd.read_file('/Users/jbliss/Downloads/nc-buildings.gpkg', layer='open-street-map-derived')

# Initialize new columns in the GeoJSON DataFrame to store the counts
geojson_gdf['machine_building_count'] = 0
geojson_gdf['osm_building_count'] = 0

# For each feature in the GeoJSON file
for i, row in geojson_gdf.iterrows():
  # Create a shapely geometry object from the GeoJSON feature
  geojson_geom = shape(row['geometry'])
  
  # Count how many GPKG features from each layer are contained in the GeoJSON feature
  count_ml = gpkg_gdf_ml[gpkg_gdf_ml.geometry.within(geojson_geom)].shape[0]
  count_osm = gpkg_gdf_osm[gpkg_gdf_osm.geometry.within(geojson_geom)].shape[0]
  
  print(f'count_ml: {count_ml}, count_osm: {count_osm}')

  # Add these counts to the GeoJSON DataFrame
  geojson_gdf.at[i, 'machine_building_count'] = count_ml
  geojson_gdf.at[i, 'osm_building_count'] = count_osm
  geojson_gdf.at[i, 'total_building_count'] = count_ml+count_osm

# converting GeoDataFrame to a JSON
geojson_gdf = geojson_gdf.to_json()

# writing JSON data structure to a GeoJSON file
with open('final_data_with_buildings.geojson', 'w', encoding='utf-8') as file:
    file.write(geojson_gdf)