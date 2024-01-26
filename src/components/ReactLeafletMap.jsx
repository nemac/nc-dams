import { useEffect, useState } from 'react';
import { FeatureGroup, GeoJSON, LayersControl, LayerGroup, Marker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import Control from 'react-leaflet-custom-control';
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
  const [damData, setDamData] = useState(null);
  const [huc12, sethuc12] = useState(null);
  const [intersectingHuc, setIntersectingHuc] = useState(null);

  useEffect(() => {
    // Fetch GeoJSON data
    fetch('/nc-dams/Inventory_20231218.geojson')
      .then(response => response.json())
      .then(data => setDamData(data));
    fetch('/nc-dams/huc12_processed.geojson')
      .then(response => response.json())
      .then(data => sethuc12(data));
  }, []);

  return (
    <>
      <StyledMapContainer
        id='map-container'
        center={center}
        zoom={zoom}
        map={setMap}
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
                    const intersectingPolygon = huc12.features.find(feature => {
                      const polygon = turf.polygon(feature.geometry.coordinates);
                      return turf.booleanPointInPolygon(point, polygon)
                    });
                    setIntersectingHuc(intersectingPolygon);
                  },
                }}
              >
                <Popup>
                  {item.properties.Dam_Name}
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
                      <GeoJSON key={feature.properties.id} data={feature} style={{ color:'#d8b365' }}/>
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
                    return <GeoJSON key={feature.properties.id} data={feature} style={{ color:'#5ab4ac' }}/>;
                  })}
                </LayerGroup>
              </LayersControl.Overlay>
              <LayersControl.Overlay checked name="Selected Dam Huc12">
                <GeoJSON key={intersectingHuc.properties.id} data={intersectingHuc} style={{ color:'black' }} />
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
