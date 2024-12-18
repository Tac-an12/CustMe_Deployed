import React, { useEffect, useState } from 'react';
import Header from '../components/header';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import { LatLngTuple } from 'leaflet';
import apiService from '../../../services/apiService';
import Carousel from 'react-material-ui-carousel';

const UserProfileForm: React.FC = () => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [firstname, setFirstname] = useState<string>('');
  const [lastname, setLastname] = useState<string>('');
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<string | null>(null);
  const [newProfilePicture, setNewProfilePicture] = useState<File | null>(null);
  const [newCoverPhoto, setNewCoverPhoto] = useState<File | null>(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState<string | null>(null);
  const [coverPhotoPreview, setCoverPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Fetch a general profile data without specific user ID
    const fetchGeneralProfile = async () => {
      setLoading(true);
      try {
        const response = await apiService.get('/profile'); // Adjust endpoint as needed
        setFirstname(response.data.personal_information.firstname || '');
        setLastname(response.data.personal_information.lastname || '');
        setProfilePicture(response.data.personal_information.profilepicture || null);
        setCoverPhoto(response.data.personal_information.coverphoto || null);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGeneralProfile();
  }, []);

  const handleProfilePictureChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setNewProfilePicture(file);
      setProfilePicturePreview(URL.createObjectURL(file));
    }
  };

  const handleCoverPhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      setNewCoverPhoto(file);
      setCoverPhotoPreview(URL.createObjectURL(file));
    }
  };

  const coverPhotoUrl = coverPhotoPreview || (coverPhoto ? `https://custme.site/storage/app/public/${coverPhoto}` : null);
  const profilePictureUrl = profilePicturePreview || (profilePicture ? `https://custme.site/storage/app/public/${profilePicture}` : null);
  const placeholderImageUrl = 'https://static.vecteezy.com/system/resources/previews/004/141/669/original/no-photo-or-blank-image-icon-loading-images-or-missing-image-mark-image-not-available-or-image-coming-soon-sign-simple-nature-silhouette-in-frame-isolated-illustration-vector.jpg';

  const defaultPosition: LatLngTuple = [40.785091, -73.968285];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="p-4 flex-grow">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <CircularProgress />
            </div>
          ) : (
            <>
              {/* User Profile Section */}
              <div className="relative bg-white shadow-lg rounded-lg overflow-hidden mt-20">
                <label htmlFor="cover-photo-upload" className="cursor-pointer">
                  <input
                    type="file"
                    id="cover-photo-upload"
                    accept="image/*"
                    onChange={handleCoverPhotoChange}
                    className="absolute top-0 right-0 z-10 opacity-0 cursor-pointer"
                  />
                  {coverPhotoUrl ? (
                    <img
                      src={coverPhotoUrl}
                      alt="Cover Photo"
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <img
                      src={placeholderImageUrl}
                      alt="Placeholder Cover"
                      className="w-full h-48 object-cover"
                    />
                  )}
                </label>
                <Box className="flex flex-col items-start p-4 bg-white">
                  <Box className="flex items-center -mt-16 w-full justify-between">
                    <label htmlFor="profile-picture-upload" className="cursor-pointer">
                      <input
                        type="file"
                        id="profile-picture-upload"
                        accept="image/*"
                        onChange={handleProfilePictureChange}
                        className="absolute top-0 right-0 z-10 opacity-0 cursor-pointer"
                      />
                      {profilePictureUrl ? (
                        <img
                          src={profilePictureUrl}
                          alt="Profile"
                          className="w-32 h-32 rounded-full border-4 border-white shadow-md"
                        />
                      ) : (
                        <img
                          src={placeholderImageUrl}
                          alt="Placeholder Profile"
                          className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 shadow-md"
                        />
                      )}
                    </label>
                    <Box className="flex-grow mt-10 ml-4">
                      <Box className="flex space-x-4">
                        <Box>
                          <Typography variant="h4" className="font-bold text-black">
                            {isEditing ? (
                              <input
                                type="text"
                                value={firstname}
                                onChange={(e) => setFirstname(e.target.value)}
                                placeholder="First Name"
                                className="border p-2 rounded"
                                required
                              />
                            ) : (
                              firstname
                            )}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="h4" className="font-bold text-black">
                            {isEditing ? (
                              <input
                                type="text"
                                value={lastname}
                                onChange={(e) => setLastname(e.target.value)}
                                placeholder="Last Name"
                                className="border p-2 rounded"
                                required
                              />
                            ) : (
                              lastname
                            )}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </div>

              {/* Map Section */}
              <div className="mt-4">
                <MapContainer center={defaultPosition} zoom={13} style={{ height: '300px', width: '100%' }}>
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <Marker position={defaultPosition} />
                </MapContainer>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfileForm;
