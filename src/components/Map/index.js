import React, { Fragment, useState, useEffect, useRef } from 'react';
import { View, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import Geocoder from 'react-native-geocoding';

import { generateEdgePadding } from '../../utils';

import Search from '../Search';
import Direction from '../Directions';
import Details from '../Details';

import markerImage from '../../assets/marker.png';
import backImage from '../../assets/back.png';

import { 
  Back,
  LocationBox, 
  LocationText, 
  LocationTimeBox, 
  LocationTimeText, 
  LocationTimeTextSmall 
} from './styles';

Geocoder.init('YOUR_API_KEY_HERE');

export default function Map() {
  const [region, setRegion] = useState(null);
  const [destination, setDestination] = useState(null);
  const [duration, setDuration] = useState(null);
  const [distance, setDistance] = useState(null);
  const [location, setLocation] = useState(null);
  const mapView = useRef(null);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async ({ coords: { latitude, longitude } }) => {
        const response = await Geocoder.from({ latitude, longitude });
        const address = response.results[0].formatted_address;
        const location = address.substring(0, address.indexOf(','));

        setLocation(location);
        setRegion({ 
          latitude, 
          longitude, 
          latitudeDelta: 0.0143, 
          longitudeDelta: 0.0134 
        });
      }, //sucesso
      (error) => {console.error(error);}, //erro
      {
        timeout: 2000,
        enableHighAccuracy: true,
        maximumAge: 1000,
      }
    )
  }, []);

  function handleLocationSelected(data, { geometry }) {
    const { location: { lat: latitude, lng: longitude } } = geometry;

    setDestination({
      latitude,
      longitude,
      title: data.structured_formatting.main_text,
    });
  };

  function handleBack() {
    setDestination(null);
  };

  return(
    <View style={{ flex: 1 }}>
      <MapView 
        style={{ flex: 1 }}
        region={region}
        showsUserLocation
        loadingEnabled
        showsMyLocationButton={false}
        showsCompass={false}
        ref={mapView}
      >
        { destination != null && (
          <Fragment>
            <Direction
              origin={region}
              destination={destination}
              onReady={async (result) => {
                setDuration(Math.floor(result.duration));
                setDistance(Math.floor(result.distance));

                mapView.current.fitToCoordinates(result.coordinates, {
                  edgePadding: generateEdgePadding({
                    right: 50,
                    left: 50,
                    top: 50,
                    bottom: 350,
                  })
                });
              }}
            />
            <Marker 
              coordinate={destination} 
              anchor={{ x: 0, y: 0 }} 
              image={markerImage}
            >
              <LocationBox>
                <LocationText>{destination.title}</LocationText>
              </LocationBox>
            </Marker>

            <Marker 
              coordinate={region} 
              anchor={{ x: 0, y: 0 }}
            >
              <LocationBox>
                <LocationTimeBox>
                  <LocationTimeText>{duration}</LocationTimeText>
                  <LocationTimeTextSmall>MIN</LocationTimeTextSmall>
                </LocationTimeBox>
                <LocationText>{location}</LocationText>
              </LocationBox>
            </Marker>
          </Fragment>
        ) }
      </MapView>
      
      {destination != null ? (
        <Fragment>
          <Back onPress={handleBack}>
            <Image source={backImage} />
          </Back>
          <Details duration={duration} distance={distance} />
        </Fragment>
      ) : (
        <Search onLocationSelected={handleLocationSelected} />
      )}
    </View>
  );
}