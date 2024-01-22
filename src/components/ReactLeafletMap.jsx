import { useEffect, useState } from 'react';
import { GeoJSON, LayersControl, Marker, MapContainer, Popup, TileLayer } from 'react-leaflet';
import Control from 'react-leaflet-custom-control';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import { styled } from '@mui/system';
import L from 'leaflet';

export const StyledMapContainer = styled(MapContainer)(() => ({
  position: 'relative',
  height: '100%',
}));

export default function ReactLeafletMap() {
  const center = [35.7079, -79.8136];
  const zoom = 8;

  const [map, setMap] = useState(null);
  const [geojsonData, setGeojsonData] = useState(null);

useEffect(() => {
    // Fetch GeoJSON data
    fetch('/Inventory_20231218.geojson')
      .then(response => response.json())
      .then(data => setGeojsonData(data));
  }, []);

  return (
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
      <Control position='topright'>
        Hello world
      </Control>
      <MarkerClusterGroup>
        {geojsonData?.features.map((item, index) => {
          const [longitude, latitude] = item.geometry.coordinates;
          return (
            <Marker key={index} position={[latitude, longitude]}>
              <Popup>
                {item.properties.Dam_Name}
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>
      <link rel="stylesheet" href="https://unpkg.com/leaflet@latest/dist/leaflet.css" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@latest/dist/leaflet.draw-src.css" />
      <link rel="stylesheet" href="https://unpkg.com/esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css"/>
      <link rel="stylesheet" href="https://unpkg.com/react-leaflet-markercluster/dist/styles.min.css"/>
    </StyledMapContainer>
  );
}
