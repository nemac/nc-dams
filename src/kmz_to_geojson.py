# The purpose of this script is to convert the KMZ file supplied by the NCDEQ into GeoJSON files
# https://www.deq.nc.gov/about/divisions/energy-mineral-and-land-resources/dam-safety

from osgeo import gdal
import os

# Input KMZ file
kmz_file = "./assets/Inventory_20231218.kmz"

# Output GeoJSON file
geojson_file = "dam_inventory.geojson"

# Open the KMZ file
ds = ogr.Open(kmz_file)

# Loop through all layers in the KMZ file
for i in range(ds.GetLayerCount()):

  # Get the layer
  layer = ds.GetLayerByIndex(i)

  # Create a new GeoJSON file with the same name as the layer
  geojson_path = os.path.join(os.path.dirname(geojson_file), layer.GetName() + ".geojson")

  # Convert the layer to GeoJSON
  ds = ogr.GetDriverByName('GeoJSON').CopyDataSource(layer.GetLayerDefn(), geojson_path)

# Close the KMZ file
ds = None