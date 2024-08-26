import geopandas as gpd
import numpy as np
import pandas as pd

def bin_geojson_data(gdf, property, bin_name):
  # Calculate the bin edges
  bins = np.percentile(gdf[property], [33.3, 66.6])

  # Bin the property
  gdf[bin_name] = pd.cut(gdf[property], bins=[-np.inf, *bins, np.inf], labels=['high', 'medium', 'low'])

  # Convert the 'bin' column to string type
  gdf[bin_name] = gdf[bin_name].astype(str)

# Load GeoJSON data
gdf = gpd.read_file('huc12_data_with_ndvi.geojson')
bin_geojson_data(gdf, 'ndvi_change_one_year_percent', 'ndvi_change_one_year_bin')
bin_geojson_data(gdf, 'ndvi_change_three_year_percent', 'ndvi_change_three_year_bin')
# Save the updated data to a new GeoJSON file
gdf.to_file('huc12_final_data.geojson', driver='GeoJSON')