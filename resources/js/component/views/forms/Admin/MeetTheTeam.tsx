import React, { useEffect, useState } from 'react';
import { Button, Card, CardContent, CardMedia, Typography, Rating } from '@mui/material';
import { useArtistAndProvider } from '../../../context/Artist&ProviderContext'; // Adjust the import based on your file structure
import { useNavigate } from "react-router-dom";
import Header from '../components/header'; // Import Header component

const defaultProfilePicture = "https://via.placeholder.com/200x200.png?text=%3F";

const MeetTheTeam = () => {
  const { profiles, fetchArtistAndProviderProfiles, loading } = useArtistAndProvider();
  const [currentPageDesigners, setCurrentPageDesigners] = useState(1); // State for pagination of designers
  const [currentPageProviders, setCurrentPageProviders] = useState(1); // State for pagination of providers
  const [designers, setDesigners] = useState<any[]>([]); // State for graphic designers
  const [providers, setProviders] = useState<any[]>([]); // State for printing providers

  // Fetch profiles and separate them by role when the component mounts
  useEffect(() => {
    if (!profiles) {
      fetchArtistAndProviderProfiles();
    } else {
      const graphicDesigners = profiles.filter(profile => profile.role_name === 'Graphic Designer');
      const printingProviders = profiles.filter(profile => profile.role_name === 'Printing Provider');
      setDesigners(graphicDesigners);
      setProviders(printingProviders);
    }
  }, [profiles, fetchArtistAndProviderProfiles]);

  const itemsPerPage = 3; // Set number of profiles per page to 3
    
  const navigate = useNavigate();

  // Get the current page data for designers and providers
  const paginatedDesigners = designers.slice((currentPageDesigners - 1) * itemsPerPage, currentPageDesigners * itemsPerPage);
  const paginatedProviders = providers.slice((currentPageProviders - 1) * itemsPerPage, currentPageProviders * itemsPerPage);

  const handleNextPageDesigners = () => {
    setCurrentPageDesigners(prevPage => prevPage + 1); // Move to the next page for designers
  };

  const handlePrevPageDesigners = () => {
    setCurrentPageDesigners(prevPage => (prevPage > 1 ? prevPage - 1 : 1)); // Move to the previous page for designers
  };

  const handleNextPageProviders = () => {
    setCurrentPageProviders(prevPage => prevPage + 1); // Move to the next page for providers
  };

  const handlePrevPageProviders = () => {
    setCurrentPageProviders(prevPage => (prevPage > 1 ? prevPage - 1 : 1)); // Move to the previous page for providers
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const SeeMoreText = ({ text }: { text: string }) => {
    const [isTruncated, setIsTruncated] = useState(true);
    const toggleTruncate = () => setIsTruncated(!isTruncated);
  
    return (
      <div>
        <Typography variant="body2">
          {isTruncated ? text.substring(0, 10) : text} {" "}
          <span
            style={{ color: 'blue', cursor: 'pointer' }}
            onClick={toggleTruncate}
          >
            {isTruncated ? "... See More" : " See Less"}
          </span>
        </Typography>
      </div>
    );
  };

  const renderCardContent = (profile) => (
    <CardContent>
      <Typography variant="h5" component="div" className="text-lg font-semibold">
        {profile.username}
      </Typography>
      <Typography variant="body2" color="text.secondary" className="text-gray-500">
        {profile.role_name}
      </Typography>
      <Typography variant="body2" color="text.secondary" className="mt-4 text-gray-700">
        {profile.personal_information.zipcode}
      </Typography>
      <Typography variant="body2" color="text.secondary" className="text-blue-500 mt-2">
        {profile.email}
      </Typography>

      {/* Display the "About Me" content */}
      <SeeMoreText text={profile.about_me_content || 'No about me content available.'} />

      {/* Display the rating */}
      <div className="mt-4">
        <Typography variant="body2" color="text.secondary">
          Rating:
        </Typography>
        <Rating
          value={profile.average_rating || 0}
          readOnly
          precision={0.5}
        />
      </div>
    </CardContent>
  );

  return (
    <div className="container mx-auto p-4">
      {/* Add Header component here */}
      <Header />

      <h2 className="text-2xl font-bold text-center mb-8">Meet The Team</h2>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-center">Graphic Designers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedDesigners.length > 0 ? (
            paginatedDesigners.map((profile) => (
              <div key={profile.id} className="flex justify-center">
                <Card sx={{ maxWidth: 345 }} className="shadow-lg">
                  <CardMedia
                    component="img"
                    height="200"
                    image={profile.personal_information.profilepicture ? `https://custme.site/storage/app/public/${profile.personal_information.profilepicture}` : defaultProfilePicture}
                    alt={profile.username}
                  />
                  {renderCardContent(profile)}
                  <Button
                    variant="contained"
                    color="primary"
                    className="w-full"
                    onClick={() => navigate(`/clients/${profile.id}/profile`)}
                  >
                    VIEW PROFILE
                  </Button>
                </Card>
              </div>
            ))
          ) : (
            <Typography variant="h6" color="text.secondary" className="text-center">
              No graphic designers available.
            </Typography>
          )}
        </div>
        {/* Pagination buttons for Graphic Designers */}
        <div className="flex justify-between">
          <Button
            variant="outlined"
            onClick={handlePrevPageDesigners}
            disabled={currentPageDesigners === 1}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            onClick={handleNextPageDesigners}
            disabled={paginatedDesigners.length < itemsPerPage}
          >
            Next
          </Button>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold text-center">Printing Providers</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {paginatedProviders.length > 0 ? (
            paginatedProviders.map((profile) => (
              <div key={profile.id} className="flex justify-center">
                <Card sx={{ maxWidth: 345 }} className="shadow-lg">
                  <CardMedia
                    component="img"
                    height="200"
                    image={profile.personal_information.profilepicture ? `https://custme.site/storage/app/public/${profile.personal_information.profilepicture}` : defaultProfilePicture}
                    alt={profile.username}
                  />
                  {renderCardContent(profile)}
                  <Button
                    variant="contained"
                    color="primary"
                    className="w-full"
                    onClick={() => navigate(`/clients/${profile.id}/profile`)}
                  >
                    VIEW PROFILE
                  </Button>
                </Card>
              </div>
            ))
          ) : (
            <Typography variant="h6" color="text.secondary" className="text-center">
              No printing providers available.
            </Typography>
          )}
        </div>
        {/* Pagination buttons for Printing Providers */}
        <div className="flex justify-between">
          <Button
            variant="outlined"
            onClick={handlePrevPageProviders}
            disabled={currentPageProviders === 1}
          >
            Previous
          </Button>
          <Button
            variant="outlined"
            onClick={handleNextPageProviders}
            disabled={paginatedProviders.length < itemsPerPage}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MeetTheTeam;
