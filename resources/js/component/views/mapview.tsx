import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useSearch } from '../context/SearchContext';
import { getDistance } from 'geolib'; // Import geolib for distance calculation
import SearchBar from '../views/searchbar';
import { useAuth } from "../context/AuthContext";
import Header from './forms/components/header';
import L from 'leaflet';

const MapView: React.FC = () => {
  const { allStores, query, setQuery, suggestions, fetchSuggestions } = useSearch();
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [uniqueLocations, setUniqueLocations] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<any>(null);
  const { user } = useAuth();
  const [graphicDesignerDistances, setGraphicDesignerDistances] = useState<any[]>([]);
  const [printingProviderDistances, setPrintingProviderDistances] = useState<any[]>([]);
  const [showGraphicDesigners, setShowGraphicDesigners] = useState(true);
  const [showPrintingProviders, setShowPrintingProviders] = useState(true);

  const customMarkerIcon = L.icon({
    iconUrl: '/build/assets/marker-icon-hN30_KVU.png', // Path to your marker icon
    iconSize: [25, 41], // Default size for Leaflet markers
    iconAnchor: [12, 41], // Anchor point for the marker (center bottom)
    popupAnchor: [0, -41], // Point where the popup opens relative to the icon
    shadowUrl: '/build/assets/marker-shadow.png', // Optional shadow image
    shadowSize: [41, 41], // Size of the shadow
    shadowAnchor: [12, 41], // Anchor point for the shadow
  });

  const ZoomToLocation = ({ location }) => {
    const map = useMap();
    if (location) {
      map.setView([location.latitude, location.longitude], 15, {
        animate: true,
      });
    }
    return null;
  };

  useEffect(() => {
    const coordinateMap = new Map();

    const adjustedStores = allStores.map((store) => {
      const lat = parseFloat(store.location.latitude);
      const lng = parseFloat(store.location.longitude);
      const coordKey = `${lat.toFixed(7)},${lng.toFixed(7)}`;

      if (coordinateMap.has(coordKey)) {
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
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const adjustedUserLocation = { latitude, longitude };

          uniqueLocations.forEach((store) => {
            const storeLat = parseFloat(store.location.latitude);
            const storeLng = parseFloat(store.location.longitude);
            if (
              Math.abs(adjustedUserLocation.latitude - storeLat) < 0.0001 &&
              Math.abs(adjustedUserLocation.longitude - storeLng) < 0.0001
            ) {
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

  const updateDistanceBox = () => {
    if (userLocation) {
      const graphicDesignerDistances = uniqueLocations
        .filter((store) => store.user.role_id === 3)
        .map((store) => {
          const distance = calculateDistance(store.location);
          return distance ? { storeName: store.storename, distance } : null;
        })
        .filter(Boolean);

      const printingProviderDistances = uniqueLocations
        .filter((store) => store.user.role_id === 4)
        .map((store) => {
          const distance = calculateDistance(store.location);
          return distance ? { storeName: store.storename, distance } : null;
        })
        .filter(Boolean);

      setGraphicDesignerDistances(graphicDesignerDistances);
      setPrintingProviderDistances(printingProviderDistances);
    }
  };

  useEffect(() => {
    updateDistanceBox();
  }, [userLocation, uniqueLocations]);

  return (
    <div>
      <Header onLocationSelect={setSelectedLocation} />
      <SearchBar onLocationSelect={setSelectedLocation} />

      <div
        style={{
          position: 'absolute',
          top: '100px',
          right: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          zIndex: 1000,
        }}
      >
        <button
          onClick={() => setShowGraphicDesigners(!showGraphicDesigners)}
          style={{ marginBottom: '10px', cursor: 'pointer' }}
        >
          {showGraphicDesigners ? 'Collapse Graphic Designers' : 'View Graphic Designers'}
        </button>

        {showGraphicDesigners && (
          <div>
            <strong>Distances to Graphic Designers:</strong>
            <div style={{ maxHeight: '150px', overflowY: 'scroll', marginBottom: '10px' }}>
              {graphicDesignerDistances.length > 0 ? (
                graphicDesignerDistances.map((storeDistance, index) => (
                  <div
                    key={index}
                    style={{ cursor: 'pointer', padding: '5px' }}
                    onClick={() => {
                      const store = uniqueLocations.find(
                        (s) => s.storename === storeDistance.storeName
                      );
                      if (store) {
                        setSelectedLocation(store.location);
                      }
                    }}
                  >
                    <strong>{storeDistance.storeName}</strong>: {`${(storeDistance.distance / 1000).toFixed(2)} km`}
                  </div>
                ))
              ) : (
                <p>No graphic designers found</p>
              )}
            </div>
          </div>
        )}

        <button
          onClick={() => setShowPrintingProviders(!showPrintingProviders)}
          style={{ marginBottom: '10px', cursor: 'pointer' }}
        >
          {showPrintingProviders ? 'Collapse Printing Providers' : 'View Printing Providers'}
        </button>

        {showPrintingProviders && (
          <div>
            <strong>Distances to Printing Providers:</strong>
            <div style={{ maxHeight: '150px', overflowY: 'scroll' }}>
              {printingProviderDistances.length > 0 ? (
                printingProviderDistances.map((storeDistance, index) => (
                  <div
                    key={index}
                    style={{ cursor: 'pointer', padding: '5px' }}
                    onClick={() => {
                      const store = uniqueLocations.find(
                        (s) => s.storename === storeDistance.storeName
                      );
                      if (store) {
                        setSelectedLocation(store.location);
                      }
                    }}
                  >
                    <strong>{storeDistance.storeName}</strong>: {`${(storeDistance.distance / 1000).toFixed(2)} km`}
                  </div>
                ))
              ) : (
                <p>No printing providers found</p>
              )}
            </div>
          </div>
        )}
      </div>

      <MapContainer
        center={[12.8797, 121.7740]}
        zoom={6}
        style={{ height: '600px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {uniqueLocations.map((store) => {
          const latitude = parseFloat(store.location.latitude);
          const longitude = parseFloat(store.location.longitude);

          if (isNaN(latitude) || isNaN(longitude)) return null;

          const distance = calculateDistance(store.location);

          return (
            <Marker
              key={store.id}
              position={[latitude, longitude]}
              icon={customMarkerIcon}
              eventHandlers={{
                click: () => setSelectedLocation(store.location),
              }}
            >
              <Popup>
                <strong>Store: {store.storename}</strong>
                <p>Description: {store.description}</p>
                <p>Location: {store.location.address}</p>
                <p>Distance: {distance ? `${(distance / 1000).toFixed(2)} km` : 'N/A'}</p>
                <p>Owned by: {store.user.personal_information.firstname} {store.user.personal_information.lastname}</p>
              </Popup>
            </Marker>
          );
        })}

        {selectedLocation && <ZoomToLocation location={selectedLocation} />}

        {userLocation && (
          <Marker position={[userLocation.latitude, userLocation.longitude]}>
            <Popup>
              <strong>Your Location</strong>
              <p>My Name: {user?.username || 'Unknown'}</p>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default MapView;
