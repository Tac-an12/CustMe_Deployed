import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useClientProfile } from "../../../context/ClientProfileContext";
import { useAuth } from "../../../context/AuthContext";
import {
  Avatar,
  Button,
  Typography,
  CircularProgress,
  Box,
  AppBar,
  Toolbar,
  Tab,
  Tabs,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { Edit as EditIcon, Chat as ChatIcon } from "@mui/icons-material";
import Header from "../components/header";
import EditProfileModal from "../../forms/EditProfileForm";
import Carousel from "react-material-ui-carousel";
import AboutMe from "../../forms/Admin/AboutMe";
import RatingSection from "../../forms/Admin/RatingSection";

const ClientProfile = () => {
  const { id } = useParams<{ id: string | undefined }>();
  const userId = id ? parseInt(id) : undefined;
  const { profile, fetchProfile, loading } = useClientProfile();
  const { user } = useAuth();
  const [openEditModal, setOpenEditModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      fetchProfile(userId).catch((error) => console.error("Error:", error));
    }
  }, [fetchProfile, userId]);

  if (loading) return <CircularProgress />;
  if (!profile) return <Typography>No profile found</Typography>;
 
  const coverPhoto = profile.personal_information?.coverphoto
    ? `https://custme.site/storage/app/public/${profile.personal_information.coverphoto}`
    : "default-cover-image-url";

  const profilePicture = profile.personal_information?.profilepicture
    ? `https://custme.site/storage/app/public/${profile.personal_information.profilepicture}`
    : "default-profile-image-url";
    const isnotVisible = profile?.role_name === "User" || profile?.role_name === "Admin";
    const isAllowedRole = ["Printing Shop", "Graphic Designer"].includes(
          profile?.role_name || ""
        );

  const handleTabChange = (_: React.ChangeEvent<{}>, newValue: number) => {
    setSelectedTab(newValue);
  };

  return (
    <>
      <Header />
      <Box className="flex justify-center mt-4 sm:mt-16 px-2 sm:px-8 bg-gray-50">
        <Box className="w-full max-w-4xl">
          {/* Cover Photo */}
          <Box position="relative" className="h-32 sm:h-48">
            <img
              src={coverPhoto}
              alt="Cover"
              className="w-full h-full object-cover"
            />
            <Box
              position="absolute"
              bottom={-48}
              left="50%"
              className="transform -translate-x-1/2"
            >
              <Avatar
                src={profilePicture}
                sx={{
                  width: { xs: 100, sm: 120 },
                  height: { xs: 100, sm: 120 },
                  border: "4px solid white",
                }}
              />
            </Box>
          </Box>

          {/* User Details */}
          <Box textAlign="center" mt={8}>
            <Typography
              variant="h6"
              fontWeight="bold"
              className="text-lg sm:text-2xl"
            >
              {`${profile.personal_information?.firstname || ""} ${
                profile.personal_information?.lastname || ""
              }`}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              <strong>Phone Number:</strong>{" "}
              {profile.personal_information?.zipcode || "N/A"}
            </Typography>
            {user?.id !== userId && (
              <Button
                variant="contained"
                startIcon={<ChatIcon />}
                sx={{ mt: 2 }}
                onClick={() => navigate("/chats", { state: { userId } })}
              >
                Message
              </Button>
            )}
            {/* Edit Profile Modal */}
            {user?.id === userId && (
              <Box textAlign="center" mt={2}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => setOpenEditModal(true)}
                >
                  Edit Profile
                </Button>
              </Box>
            )}
            {openEditModal && (
              <EditProfileModal
                open={openEditModal}
                onClose={() => setOpenEditModal(false)}
              />
            )}
          </Box>

          {/* Tabs */}
          <AppBar position="static" color="default">
            <Tabs
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab label="Profile" />
              {!isnotVisible && <Tab label="Rating" />}

            </Tabs>
          </AppBar>

          {/* Tab Content */}
          <Box p={2}>
            {selectedTab === 0 && (
              <>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                  {isAllowedRole && (
                    <AboutMe />
                  )}
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Carousel>
                      {profile.posts?.map((post, index) => (
                        <img
                          key={index}
                          src={`http://127.0.0.1:8000/storage/${post.images[0]?.image_path}`}
                          alt="Gallery"
                          className="w-full h-32 sm:h-48 object-cover rounded-md"
                        />
                      ))}
                    </Carousel>
                  </Grid>
                </Grid>
              </>
            )}

            {selectedTab === 1 && (
              <Box>
                <RatingSection />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default ClientProfile;




// import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { useNavigate } from "react-router-dom";
// import { useClientProfile } from "../../../context/ClientProfileContext";
// import { useAuth } from "../../../context/AuthContext";
// import {
//   Avatar,
//   Button,
//   Typography,
//   CircularProgress,
//   Box,
//   AppBar,
//   Toolbar,
//   Tab,
//   Tabs,
//   Grid,
//   Card,
//   CardMedia,
//   CardContent,
// } from "@mui/material";
// import { Edit as EditIcon } from "@mui/icons-material";
// import Header from "../components/header";
// import EditProfileModal from "../../forms/EditProfileForm";
// import Carousel from "react-material-ui-carousel";
// import AboutMe from "../../forms/Admin/AboutMe";
// import RatingSection from "../../forms/Admin/RatingSection"; // Import RatingSection
// import { IconButton } from "@mui/material"; // For the IconButton component
// import { Chat as ChatIcon } from "@mui/icons-material"; // For the Chat icon


// const ClientProfile = () => {
//   const { id } = useParams<{ id: string | undefined }>();
//   const userId = id ? parseInt(id) : undefined;
//   const { profile, fetchProfile, loading } = useClientProfile();
//   const { user } = useAuth();
//   const [openEditModal, setOpenEditModal] = useState(false);
//   const [selectedTab, setSelectedTab] = useState<number>(0);
//   const navigate = useNavigate(); 

//   useEffect(() => {
//     if (userId) {
//       fetchProfile(userId).catch((error) => {
//         console.error("Error fetching profile:", error);
//       });
//     }
//   }, [fetchProfile, userId]);

//   if (loading) {
//     return <CircularProgress />;
//   }

//   if (!profile) {
//     return <Typography variant="body1">No profile found</Typography>;
//   }
// //  `http://127.0.0.1:8000/storage/${profile.personal_information.coverphoto}`
//   const coverPhoto = profile.personal_information?.coverphoto
//     ? `https://custme.site/storage/app/public/${profile.personal_information.coverphoto}`
//     : "default-cover-image-url";

//   const profilePicture = profile.personal_information?.profilepicture
//     ? `https://custme.site/storage/app/public/${profile.personal_information.profilepicture}`
//     : "default-profile-image-url";

//   const images =
//     profile.posts?.flatMap((post) =>
//       post.images.map(
//         (image) => `https://custme.site/storage/app/public/${image.image_path}`
//       )
//     ) || [];

//   const isAllowedRole = ["Printing Shop", "Graphic Designer"].includes(
//     profile?.role_name || ""
//   );
//   const canEditProfile = user?.id === userId;
//   const isUserRole = profile?.role_name === "User";

//   const handleTabChange = (event: React.ChangeEvent<{}>, newValue: number) => {
//     setSelectedTab(newValue);
//   };
//   const handleSendMessage = (userId: number) => {
//     navigate("/chats", { state: { userId } });
//   };

//   return (
//     <>
//       <Header />
//       <div className="flex justify-center mt-16 px-4 sm:px-8 bg-gray-50">
//         <div className="w-full max-w-4xl">
//           <Box className="relative bg-white shadow-lg rounded-lg overflow-hidden mb-6">
//            {/* Cover photo section */}
// <div className="relative w-full h-64"> {/* Increased height to h-64 */}
//   <img
//     src={coverPhoto}
//     alt="Cover"
//     className="object-cover w-full h-full" // Ensures the image covers the entire container
//   />
// </div>
//             {/* Profile picture */}
//             <div className="relative -mt-12 mx-auto w-32 h-32">
//               <Avatar
//                 alt={`${profile.personal_information?.firstname} ${profile.personal_information?.lastname}`}
//                 src={profilePicture}
//                 sx={{ width: 120, height: 120, border: "4px solid white" }}
//                 className="shadow-lg"
//               />
//             </div>

//             {/* User details section */}
//             <div className="pt-8 pb-6 px-6">
//               <Typography variant="h5" className="font-bold text-center">
//                 {`${profile.personal_information?.firstname || ""} ${
//                   profile.personal_information?.lastname || ""
//                 }`}
//               </Typography>

//               <div className="text-center mt-2">
//                 <Typography variant="body1">
//                   <strong>Phone Number:</strong>{" "}
//                   {profile.personal_information?.zipcode || "N/A"}
//                 </Typography>
//               </div>
//               {!canEditProfile && (
//                 <div className="flex justify-center mt-2">
//                   <Button
//                     variant="contained"
//                     color="primary"
//                     onClick={() => handleSendMessage(userId!)} // Use userId from params
//                     startIcon={<ChatIcon />}
//                     size="large"
//                   >
//                     Message
//                   </Button>
//                 </div>
//               )}

//               {/* Edit profile button */}
//               {canEditProfile && (
//                 <div className="mt-4 flex justify-center">
//                   <Button
//                     variant="outlined"
//                     startIcon={<EditIcon />}
//                     color="primary"
//                     onClick={() => setOpenEditModal(true)}
//                   >
//                     Edit Profile
//                   </Button>
//                 </div>
//               )}
//             </div>
//           </Box>

//           <AppBar position="sticky" color="default">
//             <Toolbar>
//               <Tabs
//                 value={selectedTab}
//                 onChange={handleTabChange}
//                 aria-label="profile tabs"
//                 variant="fullWidth"
//               >
//                 <Tab label="Profile" />
//                 {!isUserRole && <Tab label="Rating" />}
//               </Tabs>
//             </Toolbar>
//           </AppBar>

//           {/* Profile Content */}
//           {selectedTab === 0 && (
//             <>
//               <Box
//                 display="flex"
//                 justifyContent="space-between"
//                 className="mb-6 flex-wrap"
//               >
//                 {/* About Me Section */}
//                 {isAllowedRole && (
//                   <Box
//                     flex={1}
//                     mr={2}
//                     className="shadow-lg rounded-lg p-4 bg-white"
//                   >
//                     <Typography variant="h6" gutterBottom>
//                       About Me
//                     </Typography>
//                     <AboutMe />
//                   </Box>
//                 )}

//                 {/* Image Carousel Section */}
             
//                   <Box flex={1} className="shadow-lg rounded-lg p-2 bg-white">
//                   <Typography variant="h6" gutterBottom>
//                     Image Gallery
//                   </Typography>
//                   <Carousel>
//                     {images.map((src, index) => (
//                       <div
//                         key={index}
//                         className="relative w-full h-[400px] overflow-hidden rounded-md" // Set height and make it responsive
//                       >
//                         <img
//                           src={src}
//                           alt={`Image ${index}`}
//                           className="w-full h-full object-cover" // Ensure full coverage without distortion
//                         />
//                       </div>
//                     ))}
//                   </Carousel>
                  

                  
//                 </Box>
                
         

//                   {/* Image Carousel Section
//                   {isAllowedRole && (
//                   <Box flex={1} className="shadow-lg rounded-lg p-2 bg-white">
//                   <Typography variant="h6" gutterBottom>
//                     Image Gallery
//                   </Typography>
//                   <Carousel>
//                     {images.map((src, index) => (
//                       <div
//                         key={index}
//                         className="relative w-full h-[400px] overflow-hidden rounded-md" // Set height and make it responsive
//                       >
//                         <img
//                           src={src}
//                           alt={`Image ${index}`}
//                           className="w-full h-full object-cover" // Ensure full coverage without distortion
//                         />
//                       </div>
//                     ))}
//                   </Carousel>
                  

                  
//                 </Box>
                
//                 )} */}
//               </Box>

//               {/* User Posts Section */}
//               {/* {isUserRole && profile.posts?.length > 0 && (
//                 <div className="shadow-lg rounded-lg p-4">
//                   <Typography variant="h6" gutterBottom>
//                     Posts
//                   </Typography>
//                   <Grid container spacing={2}>
//                     {profile.posts.map((post) => (
//                       <Grid
//                         item
//                         xs={12}
//                         sm={6}
//                         md={4}
//                         lg={3}
//                         key={post.post_id}
//                       >
//                         <Card className="shadow-md">
//                           <CardMedia
//                             component="img"
//                             height="180"
//                             image={
//                               post.images.length > 0
//                                 ? `https://custme.site/storage/app/public/images/${post.images[0].image_path}`
//                                 : "default-image-url"
//                             }
//                             alt={post.title || "Post image"}
//                             className="object-cover rounded-t-md"
//                           />
//                           <CardContent>
//                             <Typography
//                               variant="subtitle1"
//                               fontWeight="bold"
//                               noWrap
//                               className="overflow-hidden"
//                             >
//                               {post.title || "Untitled"}
//                             </Typography>
//                             <Typography
//                               variant="body2"
//                               color="textSecondary"
//                               className="truncate"
//                             >
//                               {post.content}
//                             </Typography>
//                           </CardContent>
//                         </Card>
//                       </Grid>
//                     ))}
//                   </Grid>
//                 </div>
//                )} */}
//             </>
//           )}

//           {/* Rating Content */}
//           {selectedTab === 1 && (
//             <Box className="mb-6">
//               <RatingSection />
//             </Box>
//           )}
//         </div>
//       </div>

//       {/* Edit Profile Modal */}
//       {openEditModal && (
//         <EditProfileModal
//           open={openEditModal}
//           onClose={() => setOpenEditModal(false)}
//         />
//       )}
//     </>
//   );
// };

// export default ClientProfile;
