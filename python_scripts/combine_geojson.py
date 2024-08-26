import json, sys
def combine_geojson(file1, file2, output_file):
    with open(file1, 'r') as f1, open(file2, 'r') as f2:
        geojson1 = json.load(f1)
        geojson2 = json.load(f2)

    # Create a dictionary to store combined features
    combined_features = []

    # Iterate over features from the first file
    for feature1 in geojson1['features']:
        # Find corresponding feature in the second file
        for feature2 in geojson2['features']:
            if feature1['properties']['huc12'] == feature2['properties']['huc12']:
                # Combine properties
                combined_properties = {**feature1['properties'], **feature2['properties']}
                # Create new feature with combined properties
                combined_feature = {"type": "Feature", "geometry": feature1['geometry'], "properties": combined_properties}
                combined_features.append(combined_feature)
                break

    # Create new GeoJSON object
    combined_geojson = {
        "type": "FeatureCollection",
        "features": combined_features
    }

    # Write to output file
    with open(output_file, 'w') as f:
        json.dump(combined_geojson, f)

    print(f"Combined GeoJSON written to {output_file}")

combine_geojson('public/huc12_final_data.geojson', 'public/huc12_processed.geojson', 'combined.geojson')