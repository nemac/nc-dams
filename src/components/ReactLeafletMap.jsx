import { useEffect, useState } from 'react';
import { FeatureGroup, GeoJSON, LayersControl, LayerGroup, Marker, MapContainer, Popup, TileLayer, Tooltip } from 'react-leaflet';
import Control from 'react-leaflet-custom-control';
import * as esri from 'esri-leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import * as turf from '@turf/turf'
import styled from '@emotion/styled';
import L from 'leaflet';

export const StyledMapContainer = styled(MapContainer)(() => ({
  height: 'calc(100% - 50px)',
  width: 'calc(100% - 20px)',
}));

export default function ReactLeafletMap() {
  const center = [35.7079, -79.8136];
  const zoom = 8;

  const [map, setMap] = useState(null);
  const [clickPoint, setClickPoint] = useState(null);
  const [damData, setDamData] = useState(null);
  const [huc12, sethuc12] = useState(null);
  const [intersectingHuc, setIntersectingHuc] = useState(null);


  // Keeping this here if/when we move over to AGOL
  // const huc12Layer = esri.featureLayer({
  //   url: 'https://services1.arcgis.com/PwLrOgCfU0cYShcG/arcgis/rest/services/huc12_processed/FeatureServer/0'
  // });
  // const query = huc12Layer.query();

  // useEffect(() => {
  //   if (!clickPoint) return;
  //   query.where = `huc12 = ${huc12}`;
  //   query.run((error, featureCollection, response) => {
  //     if (error) {
  //       return;
  //     }
  //     if (featureCollection.features.length === 0) {
  //       return;
  //     }
  //     sethuc12(featureCollection)
  //   })
  // }, [clickPoint]);

  // useEffect(() => {
  //   if (!huc12) return;
  //   const intersectingPolygon = huc12.features.find(feature => {
  //     const polygon = turf.polygon(feature.geometry.coordinates);
  //     return turf.booleanPointInPolygon(clickPoint, polygon)
  //   });
  //   setIntersectingHuc(intersectingPolygon);
  // }, [huc12]);


  useEffect(() => {
    // Fetch GeoJSON data
    fetch('/nc-dams/Inventory_20231218.geojson')
      .then(response => response.json())
      .then(data => setDamData(data));
    fetch('/nc-dams/final_data_with_buildings.geojson')
      .then(response => response.json())
      .then(data => sethuc12(data));
  }, []);

  return (
    <>
      <StyledMapContainer
        id='map-container'
        center={center}
        zoom={zoom}
        ref={setMap}
        maxZoom={18}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MarkerClusterGroup>
          {damData?.features.map((item, index) => {
            const [longitude, latitude] = item.geometry.coordinates;
            return (
              <Marker
                key={index}
                position={[latitude, longitude]}
                eventHandlers={{
                  click: () => {
                    const point = [longitude, latitude];
                    setClickPoint(point);
                    const intersectingPolygon = huc12.features.find(feature => {
                      const polygon = turf.polygon(feature.geometry.coordinates);
                      return turf.booleanPointInPolygon(point, polygon)
                    });
                    setIntersectingHuc(intersectingPolygon);
                  },
                }}
              >
                <Popup>
                  <ul>Dam Name: {item.properties.Dam_Name}</ul>
                  <ul>Dam Status: {item.properties.DAM_STATUS}</ul>
                  <ul>Dam Hazard: {item.properties.DAM_HAZARD}</ul>
                </Popup>
              </Marker>
            );
          })}
        </MarkerClusterGroup>
        {intersectingHuc && (
          <>
            <LayersControl>
              <LayersControl.Overlay checked name="Upstream Huc12">
                <LayerGroup>
                  {intersectingHuc.properties.upstream_huc_list.map((item) => {
                    const feature = huc12.features.find(feature => 
                      feature.properties.huc12 === item
                    );
                    if (!feature) return null;
                    return (
                      <GeoJSON
                        key={feature.properties.id}
                        data={feature}
                        style={{ color:'#d8b365' }}
                      >
                        <Tooltip sticky={true}>
                          <li> HUC12: {feature.properties.huc12} </li>
                          <li> One Year Change Percent: {feature.properties.ndvi_change_one_year_percent}% </li>
                          <li> One Year Change Category: {feature.properties.ndvi_change_one_year_bin} </li>
                          <li> Three Year Change Percent: {feature.properties.ndvi_change_three_year_percent}% </li>
                          <li> Three Year Change: {feature.properties.ndvi_change_three_year_bin} </li>
                          <li> Number of Buildings: {feature.properties.total_building_count} </li>
                        </Tooltip>
                      </GeoJSON>
                    );
                  })}
                </LayerGroup>
              </LayersControl.Overlay>
              <LayersControl.Overlay checked name="Downstream Huc12">
                <LayerGroup>
                  {intersectingHuc.properties.downstream_huc_list.map((item) => {
                    const feature = huc12.features.find(feature => 
                      feature.properties.huc12 === item
                    );
                    if (!feature) return null;
                    return (
                      <GeoJSON
                        key={feature.properties.id}
                        data={feature}
                        style={{ color:'#5ab4ac' }}
                      >
                        <Tooltip sticky={true}>
                          <li> HUC12: {feature.properties.huc12} </li>
                          <li> One Year Change Percent: {feature.properties.ndvi_change_one_year_percent}% </li>
                          <li> One Year Change Category: {feature.properties.ndvi_change_one_year_bin} </li>
                          <li> Three Year Change Percent: {feature.properties.ndvi_change_three_year_percent}% </li>
                          <li> Three Year Change Category: {feature.properties.ndvi_change_three_year_bin} </li>
                          <li> Number of Buildings: {feature.properties.total_building_count} </li>
                        </Tooltip>
                      </GeoJSON>
                    );
                  })}
                </LayerGroup>
              </LayersControl.Overlay>
              <LayersControl.Overlay checked name="Selected Dam Huc12">
                <GeoJSON 
                  key={intersectingHuc.properties.id}
                  data={intersectingHuc} 
                  style={{ color:'black' }}
                >
                  <Tooltip sticky={true}>
                    <li> HUC12: {intersectingHuc.properties.huc12} </li>
                    <li> One Year Change Percent: {intersectingHuc.properties.ndvi_change_one_year_percent}% </li>
                    <li> One Year Change: {intersectingHuc.properties.ndvi_change_one_year_bin} </li>
                    <li> Three Year Change Percent: {intersectingHuc.properties.ndvi_change_three_year_percent}% </li>
                    <li> Three Year Change: {intersectingHuc.properties.ndvi_change_three_year_bin} </li>
                    <li> Number of Buildings: {intersectingHuc.properties.total_building_count} </li>
                  </Tooltip>
                </GeoJSON>
              </LayersControl.Overlay>
            </LayersControl>
          </>
        )}
        <link rel="stylesheet" href="https://unpkg.com/leaflet@latest/dist/leaflet.css" />
        <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@latest/dist/leaflet.draw-src.css" />
        <link rel="stylesheet" href="https://unpkg.com/esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css"/>
        <link rel="stylesheet" href="https://unpkg.com/react-leaflet-markercluster/dist/styles.min.css"/>
      </StyledMapContainer>
    </>
    
  );
}
