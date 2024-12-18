import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSearch } from '../context/SearchContext';
import { getDistance } from 'geolib'; // Import geolib for distance calculation
import Header from './forms/components/header';
import SearchBar from '../views/searchbar';
import { useAuth } from "../context/AuthContext";
import L from 'leaflet';

const MapView: React.FC = () => {
  const { allStores } = useSearch();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [uniqueLocations, setUniqueLocations] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<any>(null);
  const { user } = useAuth();
  const [distancesToStores, setDistancesToStores] = useState<any[]>([]); // Change to an array to hold distances to all stores

  const customMarkerIcon = L.icon({
    iconUrl: '/build/assets/marker-icon-hN30_KVU.png', // Path to your marker icon
    iconSize: [25, 41], // Default size for Leaflet markers
    iconAnchor: [12, 41], // Anchor point for the marker (center bottom)
    popupAnchor: [0, -41], // Point where the popup opens relative to the icon
    shadowUrl: '/build/assets/marker-shadow.png', // Optional shadow image
    shadowSize: [41, 41], // Size of the shadow
    shadowAnchor: [12, 41], // Anchor point for the shadow
  });
  // Custom hook to zoom the map to the selected location
  const ZoomToLocation = ({ location }) => {
    const map = useMap();
    if (location) {
      console.log('Zooming to location:', location); // Debug log for zoom location
      map.setView([location.latitude, location.longitude], 15, {
        animate: true,
      });
    }
    return null;
  };

  useEffect(() => {
    console.log('All Stores:', allStores); // Debug log to check data

    // Handle duplicate coordinates by offsetting slightly
    const coordinateMap = new Map();

    const adjustedStores = allStores.map((store) => {
      const lat = parseFloat(store.location.latitude);
      const lng = parseFloat(store.location.longitude);
      const coordKey = `${lat.toFixed(7)},${lng.toFixed(7)}`;

      if (coordinateMap.has(coordKey)) {
        // Slightly offset repeated coordinates
        const offset = 0.0001 * coordinateMap.get(coordKey);
        coordinateMap.set(coordKey, coordinateMap.get(coordKey) + 1);
        return {
          ...store,
          location: {
            ...store.location,
            latitude: lat + offset,
            longitude: lng + offset,
          },
        };
      } else {
        coordinateMap.set(coordKey, 1);
        return store;
      }
    });

    setUniqueLocations(adjustedStores);
  }, [allStores]);

  useEffect(() => {
    // Get user location from browser or other source
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Check if user location matches any store's location and apply slight offset
          const adjustedUserLocation = { latitude, longitude };

          uniqueLocations.forEach((store) => {
            const storeLat = parseFloat(store.location.latitude);
            const storeLng = parseFloat(store.location.longitude);
            if (
              Math.abs(adjustedUserLocation.latitude - storeLat) < 0.0001 &&
              Math.abs(adjustedUserLocation.longitude - storeLng) < 0.0001
            ) {
              // Apply a small offset if the user location matches a store's location
              adjustedUserLocation.latitude += 0.0001;
            }
          });

          setUserLocation(adjustedUserLocation);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    }
  }, [uniqueLocations]);

  const handleLocationSelect = (location) => {
    console.log('Location selected from SearchBar:', location); // Debug log to check location selection from SearchBar
    setSelectedLocation(location);
  };

  // Calculate the distance between user location and store location
  const calculateDistance = (storeLocation) => {
    if (userLocation && storeLocation) {
      const distance = getDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: storeLocation.latitude, longitude: storeLocation.longitude }
      );
      return distance; // in meters
    }
    return null;
  };

  // Update the distance to all stores and display them in the top-right box
  const updateDistanceBox = () => {
    if (userLocation) {
      const distances = uniqueLocations.map((store) => {
        const distance = calculateDistance(store.location);
        return distance ? { storeName: store.storename, distance } : null;
      }).filter(Boolean); // Filter out null distances

      setDistancesToStores(distances); // Update the state with all distances
    }
  };

  // Update distance box whenever user location or stores change
  useEffect(() => {
    updateDistanceBox();
  }, [userLocation, uniqueLocations]);

  return (
    <div>
      <Header onLocationSelect={handleLocationSelect} />
      <SearchBar onLocationSelect={(location) => {
        console.log('Suggestion clicked:', location); // Debug log to check if suggestion is clicked
        handleLocationSelect(location);
      }} />

      {/* Distance box at top-right */}
      <div
        style={{
          position: 'absolute',
          top: '100px',
          right: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000, // Ensure the box is on top
        }}
      >
        <strong>Distances to Stores:</strong>
        <div style={{ maxHeight: '300px', overflowY: 'scroll' }}>
          {distancesToStores.length > 0 ? (
            distancesToStores.map((storeDistance, index) => (
              <div
                key={index}
                style={{ cursor: 'pointer', padding: '5px' }}
                onClick={() => {
                  const store = uniqueLocations.find(
                    (s) => s.storename === storeDistance.storeName
                  );
                  if (store) {
                    // Zoom to the selected store's location on the map
                    setSelectedLocation(store.location); // This will trigger zooming to the selected store
                  }
                }}
              >
                <strong>{storeDistance.storeName}</strong>: {`${(storeDistance.distance / 1000).toFixed(2)} km away from you`}
              </div>
            ))
          ) : (
            <p>No stores found</p>
          )}
        </div>
      </div>

      <MapContainer
        center={[12.8797, 121.7740]} // Center of the Philippines
        zoom={6} // Set zoom level appropriate for viewing the entire country
        style={{ height: '600px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Display all adjusted stores as markers */}
        {Array.isArray(uniqueLocations) && uniqueLocations.map((store) => {
          const latitude = parseFloat(store.location.latitude);
          const longitude = parseFloat(store.location.longitude);

          if (isNaN(latitude) || isNaN(longitude)) {
            console.warn('Invalid coordinates for store:', store);
            return null;
          }

          const distance = calculateDistance(store.location); // Calculate distance

          return (
            <Marker
              key={store.id}
              position={[latitude, longitude]}
              icon={customMarkerIcon} 
              eventHandlers={{
                click: () => {
                  console.log('Marker clicked:', store.location); // Debug log for marker click
                  setSelectedLocation(store.location);
                },
              }}
            >
              <Popup>
                <strong>Store: {store.storename}</strong>
                <p>Description: {store.description}</p>
                <p>Location: {store.location.address}</p>
                <p>Distance: {distance ? `${(distance / 1000).toFixed(2)} km` : 'N/A'}</p>
                <p>Owned by: {store.owner.firstname} {store.owner.lastname}</p>
              </Popup>
            </Marker>
          );
        })}

        {/* Zoom to the selected location if available */}
        {selectedLocation && <ZoomToLocation location={selectedLocation} />}

        {/* Add a marker for the user's location (using regular marker like stores) */}
        {userLocation && (
          <Marker
            position={[userLocation.latitude, userLocation.longitude]}
          >
            <Popup>
              <strong>Your Location</strong>
              <p>My Name: {user?.username || 'Unknown'}</p> {/* Display username, fallback to 'Unknown' */}
              {/* Calculate and display distance to store */}
              {uniqueLocations.map((store) => {
                const storeLocation = store.location;
                const distance = calculateDistance(storeLocation);
                return (
                  <p key={store.id}>
                    Distance to {store.storename}: {distance ? `${(distance / 1000).toFixed(2)} km` : 'N/A'}
                  </p>
                );
              })}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
