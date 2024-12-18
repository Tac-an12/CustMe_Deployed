import React from 'react';
import { Card, CardContent, Typography, Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const CommunityJoin = () => {
  const navigate = useNavigate();

  const handleNavigation = (roleId) => {
    const targetPage = roleId === 3 ? '/desingner-Info' : '/printing-Info';
    navigate(targetPage, { state: { roleId } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <Box
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: '10px',
          padding: { xs: '1rem', sm: '2rem' },
          width: '95%',
          maxWidth: '800px',
          textAlign: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 'extrabold', fontSize: { xs: '1.8rem', sm: '2.5rem' } }}
        >
          Join our community
        </Typography>

        {/* Responsive Grid for Cards */}
        <Grid container spacing={2} justifyContent="center" sx={{ marginTop: 2 }}>
          <Grid item xs={12} sm={6}>
            <Card
              onClick={() => handleNavigation(3)}
              sx={{
                cursor: 'pointer',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
                padding: '1rem',
              }}
            >
              <img
                src="https://www.pngall.com/wp-content/uploads/13/Paint-Palette-Design-PNG-Photo.png"
                alt="Designer Icon"
                style={{
                  width: '80%',
                  maxWidth: '100px',
                  height: 'auto',
                  margin: '0 auto 1rem',
                }}
              />
              <CardContent>
                <Typography variant="h6" className="text-center">
                  Showcase your skills and attract clients for your design projects.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    mt: 2,
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                  }}
                >
                  I AM DESIGNER
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Card
              onClick={() => handleNavigation(4)}
              sx={{
                cursor: 'pointer',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: '10px',
                transition: 'transform 0.3s',
                '&:hover': { transform: 'scale(1.05)' },
                padding: '1rem',
              }}
            >
              <img
                src="https://cdn-icons-png.flaticon.com/512/3569/3569998.png"
                alt="Printing Provider Icon"
                style={{
                  width: '80%',
                  maxWidth: '100px',
                  height: 'auto',
                  margin: '0 auto 1rem',
                }}
              />
              <CardContent>
                <Typography variant="h6" className="text-center">
                  Offer your printing services to a wide audience and grow your business.
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 'bold',
                    mt: 2,
                    fontSize: { xs: '1rem', sm: '1.2rem' },
                  }}
                >
                  I AM PRINTING PROVIDER
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {/* Back Button */}
      <Box sx={{ position: 'absolute', top: 16, left: 16 }}>
        <Link
          to="/"
          style={{
            backgroundColor: '#FFC107',
            color: '#FFF',
            padding: '0.5rem 1rem',
            borderRadius: '5px',
            textDecoration: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
          }}
        >
          Back
        </Link>
      </Box>
    </div>
  );
};

export default CommunityJoin;