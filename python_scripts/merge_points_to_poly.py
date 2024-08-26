import geopandas as gpd
from shapely.geometry import Point, Polygon

# Load the GeoJSON files
polygons_gdf = gpd.read_file('public/huc12_final_data.geojson')
points_gdf = gpd.read_file('public/Inventory_20231218.geojson')
points_gdf = points_gdf.to_crs(polygons_gdf.crs)

# Perform a spatial join
joined_gdf = gpd.sjoin(points_gdf, polygons_gdf, how='left', op='within')

# Group by polygon ID and aggregate point names
aggregated_data = joined_gdf.groupby('index_right')['Dam_Name'].apply(lambda x: ', '.join(x))

# Merge the aggregated data back into the polygon GeoDataFrame
polygons_gdf = polygons_gdf.merge(aggregated_data, how='left', left_index=True, right_index=True)

# converting GeoDataFrame to a JSON
polygons_gdf = polygons_gdf.to_json()

# writing JSON data structure to a GeoJSON file
with open('poly_points.geojson', 'w', encoding='utf-8') as file:
    file.write(polygons_gdf)