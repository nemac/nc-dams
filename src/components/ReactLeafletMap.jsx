import { useEffect, useState } from 'react';
import { FeatureGroup, GeoJSON, LayersControl, LayerGroup, Marker, MapContainer, Popup, TileLayer, Tooltip } from 'react-leaflet';
import { divIcon } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import Control from 'react-leaflet-custom-control';
import * as esri from 'esri-leaflet';
import MarkerClusterGroup from '@changey/react-leaflet-markercluster';
import * as turf from '@turf/turf'
import L from 'leaflet';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Autocomplete from '@mui/material/Autocomplete';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Grid from '@mui/material/Unstable_Grid2';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import Paper from '@mui/material/Paper';
import PentagonTwoToneIcon from '@mui/icons-material/PentagonTwoTone';
import PlaceIcon from '@mui/icons-material/Place';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import styled from '@emotion/styled';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { alpha, getContrastRatio } from '@mui/material/styles';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

export const StyledMapContainer = styled(MapContainer)(() => ({
  height: '100%',
  width: '100%'
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    right: -50,
    top: 16,
  },
}));

const upColor = '#D8B365'
const upFontColor = getContrastRatio(upColor, '#fff') > 4.5 ? '#fff' : '#111';
const upBackgroundColor =  alpha(upColor, 0.5);
const upBorderColor = alpha(upColor, 1);

const downColor = '#5AB4AC'
const downFontColor = getContrastRatio(downColor, '#fff') > 4.5 ? '#fff' : '#111';
const downBackgroundColor =  alpha(downColor, 0.5);
const downBorderColor = alpha(downColor, 1);

const currentColor = '#000000'
const currentFontColor = getContrastRatio(currentColor, '#fff') > 4.5 ? '#fff' : '#111';
const currentBackgroundColor =  alpha(currentColor, 0.5);
const currentBorderColor = alpha(currentColor, 1);

const lowColor = '#99CCFF';
const lowFontColor = getContrastRatio(lowColor, '#fff') > 4.5 ? '#fff' : '#111';
const lowBackgroundColor =  alpha(lowColor, 0.5);
const lowBorderColor = alpha(lowColor, 1);

const mediumColor = '#FEE090';
const mediumFontColor = getContrastRatio(mediumColor, '#fff') > 4.5 ? '#fff' : '#111';
const mediumBackgroundColor = alpha(mediumColor, 0.5);
const mediumBorderColor = alpha(mediumColor, 1);

const highColor = '#D7191C';
const highFontColor = getContrastRatio(highColor, '#fff') > 4.5 ? '#fff' : '#111';
const highBackgroundColor = alpha(highColor, 0.5);
const highBorderColor = alpha(highColor, 1);




const IconRank = ((rank) =>  {
  switch (rank.toUpperCase()) {
    case 'HIGH':
      return <NewReleasesIcon fontSize='small' color={highColor}/>;
    case 'MEDIUM':
      return <NewReleasesIcon fontSize='small' color={mediumColor}/>;
    case 'INTERMEDIATE':
      return <NewReleasesIcon fontSize='small' color={mediumColor}/>;
    case 'LOW':
      return <NewReleasesIcon fontSize='small' color={lowColor}/>;
    default:
      return <NewReleasesIcon fontSize='small' color={lowColor}/>;
    }
});

const chipRank = ((rank) =>  {
  switch (rank.toUpperCase()) {
    case 'UP':
      return {
        backgroundColor: upBackgroundColor,
        borderColor: upBorderColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        color: upFontColor,
        textTransform: 'capitalize',
        width: '100%'
      };
    case 'DOWN':
      return {
        backgroundColor: downBackgroundColor,
        borderColor: downBorderColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        color: downFontColor,
        textTransform: 'capitalize',
        width: '100%'
      };
    case 'CURRENT':
      return {
        backgroundColor: currentBackgroundColor,
        borderColor: currentBorderColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        color: currentFontColor,
        textTransform: 'capitalize',
        width: '100%'
      };              
    case 'HIGH':
      return {
        backgroundColor: highBackgroundColor,
        borderColor: highBorderColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        color: highFontColor,
        textTransform: 'capitalize',
        width: '100%'
      };
    case 'INTERMEDIATE':
      return {
        backgroundColor: mediumBackgroundColor,
        borderColor: mediumBorderColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        color: mediumFontColor,
        textTransform: 'capitalize', 
        width: '100%'
      };
    case 'MEDIUM':
      return {
        backgroundColor: mediumBackgroundColor,
        borderColor: mediumBorderColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        color: mediumFontColor,
        textTransform: 'capitalize', 
        width: '100%'
      };
    case 'LOW':
      return {
        backgroundColor: lowBackgroundColor,
        borderColor: lowBorderColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        color: lowFontColor,
        textTransform: 'capitalize', 
        width: '100%'
      };
    default:
      return {
        backgroundColor: lowBackgroundColor,
        borderColor: lowBorderColor,
        borderWidth: '2px',
        borderStyle: 'solid',
        color: lowFontColor,
        textTransform: 'capitalize', 
        idth: '100%'
      };
    }
  });

export const MuiMarker = (() => {
    <Box
      sx={{
        backgroundColor: bgcolor,
        width: "50px",
        height: "50px",
        borderRadius: 5,
      }}
    >
      <PlaceIcon />
    </Box>
});
 
export default function ReactLeafletMap() {
  const center = [35.7079, -79.8136];
  const zoom = 8;

  const [map, setMap] = useState(null);
  const [clickPoint, setClickPoint] = useState(null);
  const [currentDamPoint, setCurrentDamPoint] = useState(null);
  const [damData, setDamData] = useState(null);
  const [huc12, sethuc12] = useState(null);
  const [intersectingHuc, setIntersectingHuc] = useState(null);
  const [currentDam, setCurrentDam] = useState(null);
  const [mapBy, setMapBy] = useState('updown');

  const getMapColor = ((feature, hucDirection) =>  {
    let rank = 'CURRENT';

    switch (mapBy) {
      case 'updown':
        rank = hucDirection;
        break;
      case 'oneyearchange':
        rank = feature.properties.ndvi_change_one_year_bin;
        break;
      case 'threeyearchange':
        rank = feature.properties.ndvi_change_three_year_bin;
        break;
      default:
        rank = 'CURRENT';
        break;
    }

    switch (rank.toUpperCase()) {
      case 'CURRENT':
        return currentColor;    
      case 'DOWN':
        return downColor;    
      case 'UP':
        return upColor;    
      case 'HIGH':
        return highColor;
      case 'MEDIUM':
        return mediumColor;
      case 'INTERMEDIATE':
        return mediumColor;
      case 'LOW':
        return lowColor;
      default:
        return lowColor;
      }
  });

  // const [upstreamHUCS, setUpstreamHUCS] = useState(null);
  // const [downstreamHUCS, setDownstreamHUCS] = useState(null);

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

  // hold OSM styles for cartos
  // attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

  const currentDamFeature = currentDam ? damData.features.filter((item) => item.properties.NID_ID === currentDam) : null;

  const iconMarkup = renderToStaticMarkup(
    <PlaceIcon fontSize="large" variant="extended" style={{color: '#003DA5', stroke: '#003DA5', fill: '#003DA5'}}/>
  );

  const iconMarkupCurrent = renderToStaticMarkup(
    <PlaceIcon fontSize="large" variant="extended" style={{color: '#A6192E', stroke: '#C26E60', fill: '#A6192E'}}/>
  );

  const customMarkerIcon = divIcon({
    html: iconMarkup,
    iconSize: 30,
    className: 'dams-icon'
  });

  const customMarkerIconCurrent = divIcon({
    html: iconMarkupCurrent,
    iconSize: 40,
    className: 'current-dam-icon'
  });

  return (
    <Grid container spacing={1} p={1} style={{height: '100%'}}>
      <Grid xs={12} px={0} pt={0} pb={2} >
        <Paper>
          <Box p={2}>
            <Typography variant="h4" style={{ display: 'flex', alignItems: 'center'}}>
              <WaterDropIcon style={{color: '#71B2C9', fontSize: '3rem', paddingRight: '16px'}} /> North Carolina Dams & How the Connected Watersheds Have Changed
            </Typography>
            </Box>
        </Paper>
      </Grid>  
      <Grid xs={12} sm={12} md={5} px={2} py={0.5} style={{height: 'calc(100% - 96px)', overflowY: 'scroll'}}>
        <Box pb={1}>
          <Box pb={2}>
              <Typography variant="h6" style={{ display: 'flex', alignItems: 'center'}}>
                <PlaceIcon align='center' style={{ color: '#003DA5', stroke: '#003DA5', paddingRight: '8px' }}/> Search for a dam
              </Typography>
            </Box>
            <Box pb={2}>
            {damData ? (
              <Autocomplete
                  id="multiple-limit-tags"
                  options={damData.features}
                  getOptionLabel={(option) => `${option.properties.Dam_Name} (${option.properties.STATE_ID})`}
                  getOptionKey={(option) => option.properties.STATE_ID}
                  onChange={(event, newValue) => {
                    const point = [newValue.properties.LONGITUDE, newValue.properties.LATITUDE];
                    map.flyTo([newValue.properties.LATITUDE, newValue.properties.LONGITUDE], 10); // why is lat long reversed here
                    setClickPoint(point);
                    setCurrentDam(newValue.properties.NID_ID)
                    setCurrentDamPoint(newValue.geometry.coordinates)
                    const intersectingPolygon = huc12.features.find(feature => {
                      const polygon = turf.polygon(feature.geometry.coordinates);
                      return turf.booleanPointInPolygon(point, polygon)
                    });
                    setIntersectingHuc(intersectingPolygon);                    
                  }}
                  isOptionEqualToValue={(option, value) => option.properties.Dam_Name === value.properties.Dam_Name}
                  renderInput={(params) => (<TextField {...params} key={'test'} label="Search for a dam" placeholder="Search for a dam" />)} 
                  sx={{ width: '500px' }}/>
            ) : (
              <></>
            )}
            </Box>
        </Box>
        <Box pt={1} pb={2} px={1}>
          <FormControl size='small' >
            <FormLabel id="demo-row-radio-buttons-group-label">Draw selected watersheds by</FormLabel>
            <ul  style={{color: '#000000', fontSize: '0.75rem', paddingLeft: '20px', marginTop: '4px' }}>
              <li>Change is the change in NDVI between two dates. We are using NDVI as a proxy for the loss or gain of vegetation.</li>
              <li>1-year change is the 1-year change of NDVI for the HUC-12.</li>
              <li>3-year change is the 3-year change of NDVI for the HUC-12.</li>
              <li>High, Medium, and low are quantiles using the entire state.</li>
            </ul>            
            {currentDam ? (
              <RadioGroup row aria-labelledby="mapybyRG" name="mapby-radio-buttons-group" size='small' >
                <FormControlLabel onChange={() => {setMapBy('updown')}} checked={mapBy === 'updown' ? true : false} value="updown" control={<Radio />} label="Default (up and down stream)"/>
                <FormControlLabel onChange={() => {setMapBy('oneyearchange')}} checked={mapBy === 'oneyearchange' ? true: false} value="oneyearchange" control={<Radio />} label="1 year change" />
                <FormControlLabel onChange={() => {setMapBy('threeyearchange')}} checked={mapBy === 'threeyearchange' ? true : false} value="threeyearchange" control={<Radio />} label="3 year change" />
              </RadioGroup>
              ) : (
                <Typography variant="body2" style={{color: '#000000', padding: '4px' }}>
                    Select a dam to get started
                </Typography>
                
              )}
            </FormControl>
           { mapBy === 'updown' ? (
              <Stack spacing={1} p={1} alignItems="start">
                <Stack direction="row" spacing={1}>
                  <Chip size="small" label="Watershed dam is located in" style={chipRank('Current')}/> 
                  <Chip size="small" label="Up stream watershed" style={chipRank('Up')}/>
                  <Chip size="small" label="Down stream watershed"style={chipRank('Down')}/>
                </Stack>
              </Stack> 
              ) : (
                mapBy === 'oneyearchange' ? (
                  <Stack spacing={1} p={1} alignItems="start">
                  <Stack direction="row" spacing={1}>
                    <Chip size="small" label="Highest Change" style={chipRank('High')}/> 
                    <Chip size="small" label="Medium Change" style={chipRank('Medium')}/>
                    <Chip size="small" label="Lowest Change "style={chipRank('Low')}/>
                  </Stack>
                </Stack> 
                ) : (
                  mapBy === 'threeyearchange' ? (
                    <Stack spacing={1} p={1} alignItems="start">
                    <Stack direction="row" spacing={1}>
                    <Chip size="small" label="Highest Change" style={chipRank('High')}/> 
                    <Chip size="small" label="Medium Change" style={chipRank('Medium')}/>
                    <Chip size="small" label="Lowest Change "style={chipRank('Low')}/>
                    </Stack>
                  </Stack> 
                  ) : (
                    <Stack spacing={1} p={1} alignItems="start">
                    <Stack direction="row" spacing={1}>
                      <Chip size="small" label="Watershed dam is located in" style={chipRank('Current')}/> 
                      <Chip size="small" label="Up stream watershed" style={chipRank('Up')}/>
                      <Chip size="small" label="Down stream watershed"style={chipRank('Down')}/>
                    </Stack>
                  </Stack>                     
                  )
                )
              )}
        </Box>
        <Box pb={5}>
          <Accordion style={{ backgroundColor: '#F9F9F9' }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header" style={{ borderBottom: '1px solid #AFAFAF' }}>
              <Typography variant="h6" style={{ display: 'flex', alignItems: 'center'}}>
                <StyledBadge badgeContent={currentDamFeature ? '1 Dam' : '0 Dam\'s'} color="primary" showZero>
                  <PlaceIcon align='center' style={{ color: '#A6192E', stroke: '#C26E60', paddingRight: '8px' }}/> Current Dam
                </StyledBadge>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Box}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="Watershed current dam is in table">
                {!currentDam ? (
                  <TableHead>
                    <TableRow>
                      <TableCell variant='head' align="left">Dam Name</TableCell>
                    </TableRow>
                    </TableHead>                  
                ) : (
                  <TableHead>
                    <TableRow>
                      <TableCell variant='head' align="left">State ID</TableCell>
                      <TableCell variant='head' align="left">Dam Name</TableCell>
                      <TableCell variant='head' align="center">Dam Status</TableCell>
                      <TableCell variant='head' align="center">Dam Hazard</TableCell>
                      <TableCell variant='head' align="right">Last Inspection Date</TableCell>
                      <TableCell variant='head' align="right">Next Inspection Date</TableCell>
                    </TableRow>
                  </TableHead>
                  )}
                  {!currentDam ? (
                    <TableBody>
                      <TableRow key={`current-nothing`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">Select a dam to get started</TableCell>
                      </TableRow>
                    </TableBody>
                  ) : (
                    <TableBody>              
                      <TableRow key={`current-${currentDamFeature[0].properties.STATE_ID}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                        <TableCell component="th" scope="row">{currentDamFeature[0].properties.STATE_ID}</TableCell>
                        <TableCell component="th" scope="row">{currentDamFeature[0].properties.Dam_Name}</TableCell>
                        <TableCell align="center">{currentDamFeature[0].properties.DAM_STATUS}</TableCell>
                        <TableCell align="left">
                          <Chip
                            label={currentDamFeature[0].properties.DAM_HAZARD}
                            variant="filled" 
                            style={chipRank(currentDamFeature[0].properties.DAM_HAZARD)} />
                        </TableCell>                        
                        <TableCell align="center">{currentDamFeature[0].properties.LAST_INSPE}</TableCell>
                        <TableCell align="center">{currentDamFeature[0].properties.NEXT_INSPE}</TableCell>
                      </TableRow>
                    </TableBody>
                  )}
                </Table>
              </TableContainer>              
            </AccordionDetails>
          </Accordion>                
        </Box>      
        <Box pb={2}>
         <Accordion style={{ backgroundColor: '#F9F9F9' }} >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header" style={{borderBottom: '1px solid #AFAFAF'}}>
              <Typography variant="h6" style={{ display: 'flex', alignItems: 'center'}}>
                <StyledBadge badgeContent={intersectingHuc ? '1 HUC12' : '0 HUC12'} showZero color="primary" style={{right: '-15px'}}>
                  <PentagonTwoToneIcon align='center' style={{ paddingRight: '8px' }}/> Watershed Dam is Located In
                </StyledBadge>
              </Typography>
            </AccordionSummary>
            <AccordionDetails>          
              <TableContainer component={Box}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="Watershed current dam is in table">
                  <TableHead>
                    <TableRow>
                      <TableCell variant='head' align="left">HUC 12</TableCell>
                      <TableCell variant='head' align="center">1 Year Change Category</TableCell>
                      <TableCell variant='head' align="center">3 Year Change Category</TableCell>
                      <TableCell variant='head' align="center">Run Off Coefficient</TableCell>
                      <TableCell variant='head' align="center">Vegetation Density</TableCell>                      
                      <TableCell variant='head' align="right"># Structures</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>        
                  {!intersectingHuc ? (
                      <TableRow key={`current-none`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row"></TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                    ) : (
                    <TableRow key={`current-${intersectingHuc.properties.huc12}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row">{intersectingHuc.properties.huc12}</TableCell>
                      <TableCell align="left">
                      <Chip
                        label={intersectingHuc.properties.ndvi_change_one_year_bin}
                        variant="filled" 
                        style={chipRank(intersectingHuc.properties.ndvi_change_one_year_bin)} />
                      </TableCell>
                      <TableCell align="center">
                      <Chip
                        label={intersectingHuc.properties.ndvi_change_three_year_bin}
                        variant="filled" 
                        style={chipRank(intersectingHuc.properties.ndvi_change_three_year_bin)} />                        
                      </TableCell>
                      <TableCell align="right">{intersectingHuc.properties.runoff_coefficient.toFixed(4)}</TableCell>
                          <TableCell align="right">{intersectingHuc.properties.vegetation_density.toFixed(4)}</TableCell>                          
                      <TableCell align="right">{intersectingHuc.properties.total_building_count}</TableCell>
                    </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>          
        </Box>
        <Box pb={2}>
          <Accordion style={{ backgroundColor: '#F9F9F9' }} >
            <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header" style={{borderBottom: '1px solid #AFAFAF'}}>
              <Typography variant="h6" style={{ display: 'flex', alignItems: 'center'}}>
                <StyledBadge badgeContent={intersectingHuc ? `${intersectingHuc.properties.downstream_huc_list.length} HUC12`: '0 HUC12'} showZero color="primary" style={{right: '-15px'}}>
                  <PentagonTwoToneIcon align='center' style={{ color:'#5ab4ac', paddingRight: '8px' }}/> Downstream Watersheds 
                </StyledBadge>
              </Typography>          
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Box}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="Downstream Watersheds table">
                  <TableHead>
                    <TableRow>
                      <TableCell variant='head' align="left">HUC 12</TableCell>
                      <TableCell variant='head' align="center">1 Year Change Category</TableCell>
                      <TableCell variant='head' align="center">3 Year Change Category</TableCell>
                      <TableCell variant='head' align="center">Run Off Coefficient</TableCell>
                      <TableCell variant='head' align="center">Vegetation Density</TableCell>                      
                      <TableCell variant='head' align="right"># Structures</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>        
                  {!intersectingHuc ? (
                    <TableRow key={`current-none`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                      <TableCell component="th" scope="row"></TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="center"></TableCell>
                      <TableCell align="right"></TableCell>
                    </TableRow>
                  ) : (
                    intersectingHuc.properties.downstream_huc_list.map((item) => {
                      const feature = huc12.features.find(feature => 
                        feature.properties.huc12 === item
                      );
                      if (!feature) return null;
                      return (
                        <TableRow key={`downstream-${feature.properties.huc12}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row">{feature.properties.huc12}</TableCell>
                          <TableCell align="left">
                            <Chip
                              label={feature.properties.ndvi_change_one_year_bin}
                              variant="filled" 
                              style={chipRank(feature.properties.ndvi_change_one_year_bin)} />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={feature.properties.ndvi_change_three_year_bin}
                              variant="filled" 
                              style={chipRank(feature.properties.ndvi_change_three_year_bin)} />                        
                          </TableCell>
                          <TableCell align="right">{feature.properties.runoff_coefficient ? feature.properties.runoff_coefficient.toFixed(4) : 0}</TableCell>
                          <TableCell align="right">{feature.properties.runoff_coefficient ? feature.properties.vegetation_density.toFixed(4) : 0}</TableCell>                          
                          <TableCell align="right">{feature.properties.total_building_count}</TableCell>
                        </TableRow>                
                      );
                    }))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Box>
        <Box pb={2}>
        <Accordion style={{ backgroundColor: '#F9F9F9' }} >
        <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls="panel1-content" id="panel1-header" style={{borderBottom: '1px solid #AFAFAF'}}>
            <Typography variant="h6" style={{ display: 'flex', alignItems: 'center'}}>
              <StyledBadge badgeContent={intersectingHuc ? `${intersectingHuc.properties.upstream_huc_list.length} HUC12`: '0 HUC12'} showZero color="primary" style={{right: '-15px'}}>
                <PentagonTwoToneIcon align='center' style={{ color:'#d8b365', paddingRight: '8px' }}/> Upstream Watersheds 
              </StyledBadge>
            </Typography>          
            </AccordionSummary>
            <AccordionDetails>
              <TableContainer component={Box}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="Upstream Watersheds table">
                  <TableHead>
                    <TableRow>
                      <TableCell variant='head' align="left">HUC 12</TableCell>
                      <TableCell variant='head' align="center">1 Year Change Category</TableCell>
                      <TableCell variant='head' align="center">3 Year Change Category</TableCell>
                      <TableCell variant='head' align="center">Run Off Coefficient</TableCell>
                      <TableCell variant='head' align="center">Vegetation Density</TableCell>
                      <TableCell variant='head' align="right"># Structures</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>        
                  {!intersectingHuc ? (
                    <TableRow key={`current-none`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component="th" scope="row"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="center"></TableCell>
                    <TableCell align="right"></TableCell>
                  </TableRow>
                  ) : (
                    intersectingHuc.properties.upstream_huc_list.map((item) => {
                      const feature = huc12.features.find(feature => 
                        feature.properties.huc12 === item
                      );
                      if (!feature) return null;
                      return (
                        <TableRow key={`Upstream-${feature.properties.huc12}`} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                          <TableCell component="th" scope="row">{feature.properties.huc12}</TableCell>
                          <TableCell align="left">
                            <Chip
                              label={feature.properties.ndvi_change_one_year_bin}
                              variant="filled" 
                              style={chipRank(feature.properties.ndvi_change_one_year_bin)} />
                          </TableCell>
                          <TableCell align="center">
                            <Chip
                              label={feature.properties.ndvi_change_three_year_bin}
                              variant="filled" 
                              style={chipRank(feature.properties.ndvi_change_three_year_bin)} />                        
                          </TableCell>
                          <TableCell align="right">{feature.properties.runoff_coefficient ? feature.properties.runoff_coefficient.toFixed(4) : 0}</TableCell>
                          <TableCell align="right">{feature.properties.runoff_coefficient ? feature.properties.vegetation_density.toFixed(4) : 0}</TableCell>   
                          <TableCell align="right">{feature.properties.total_building_count}</TableCell>
                        </TableRow>                
                      );
                    }))}
                  </TableBody>
                </Table>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </Box>
      </Grid>      
      <Grid xs={12} sm={12} md={7} style={{height: 'calc(100% - 96px)'}}>
        <StyledMapContainer
          id='map-container'
          center={center}
          zoom={zoom}
          ref={setMap}
          maxZoom={18}
        >
          <TileLayer
            attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>, &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url='https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}}.png'
          />
          { currentDamPoint && currentDamPoint[0] ? (
              <Marker
                icon={ customMarkerIconCurrent }
                position={[currentDamPoint[1], currentDamPoint[0]]}>
              </Marker>
          ) : (<></>)}
          <MarkerClusterGroup>
            {damData?.features.map((item, index) => {
              const [longitude, latitude] = item.geometry.coordinates;
              return (
                <Marker
                  key={index}
                  icon={ currentDamPoint && currentDamPoint[0] ? currentDamPoint[0] === item.geometry.coordinates[0] ? customMarkerIconCurrent : customMarkerIcon : customMarkerIcon}
                  position={[latitude, longitude]}
                  eventHandlers={{
                    click: () => {
                      const point = [longitude, latitude];
                      setClickPoint(point);
                      setCurrentDam(item.properties.NID_ID)
                      setCurrentDamPoint(item.geometry.coordinates)
                      const intersectingPolygon = huc12.features.find(feature => {
                        const polygon = turf.polygon(feature.geometry.coordinates);
                        return turf.booleanPointInPolygon(point, polygon)
                      });
                      setIntersectingHuc(intersectingPolygon);
                    },
                  }}
                >
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
                          style={{ color: getMapColor(feature, 'up') }}
                        >
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
                          style={{ color: getMapColor(feature, 'down') }}
                        >
                        </GeoJSON>
                      );
                    })}
                  </LayerGroup>
                </LayersControl.Overlay>
                <LayersControl.Overlay checked name="Selected Dam Huc12">
                  <GeoJSON 
                    key={intersectingHuc.properties.id}
                    data={intersectingHuc} 
                    style={{ color: getMapColor(intersectingHuc, 'current') }}
                    //  intersectingHuc.properties.huc12
                  >
                  </GeoJSON>
                </LayersControl.Overlay>
              </LayersControl>
            </>
          )}
          <link rel="stylesheet" href="../assets/leaflet-override.css" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@latest/dist/leaflet.css" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet-draw@latest/dist/leaflet.draw-src.css" />
          <link rel="stylesheet" href="https://unpkg.com/esri-leaflet-geocoder/dist/esri-leaflet-geocoder.css"/>
          <link rel="stylesheet" href="https://unpkg.com/react-leaflet-markercluster/dist/styles.min.css"/>
        </StyledMapContainer>
        </Grid>
    </Grid>
  );
}
