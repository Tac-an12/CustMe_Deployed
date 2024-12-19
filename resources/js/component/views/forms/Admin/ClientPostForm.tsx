import React, { useEffect, useState } from 'react';
import { Typography, Button, Avatar, IconButton, Menu, MenuItem } from '@mui/material';
import { MoreVert as MoreVertIcon, ArrowBack as ArrowBackIcon, ArrowForward as ArrowForwardIcon } from '@mui/icons-material';
import { usePostContext } from '../../../context/PostContext';
import Header from '../components/header';
import RequestModal from '../../requestmore';
import { useRequest } from '../../../context/RequestContext';
import { useAuth } from '../../../context/AuthContext';
import { useNavigate } from "react-router-dom";

const PostCard = ({ post, onRequestSubmit }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const navigate = useNavigate(); 

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handlePrevImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : post.images.length - 1));
  };

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex < post.images.length - 1 ? prevIndex + 1 : 0));
  };
  const handleSendMessage = (userId) => {
    navigate("/chats", { state: { userId } });
  };

  return (
    <div className="bg-white p-4 mb-4 rounded-md shadow-md max-w-md w-full sm:w-11/12 md:w-10/12 lg:w-8/12">
      <div className="flex justify-between items-center mb-2">
        <div className="flex items-center">
          <Avatar 
            alt={post.user.username} 
            src={post.user.personal_information?.profilepicture
              ? `https://custme.site/storage/${post.user.personal_information.profilepicture}`
              : "https://via.placeholder.com/40"}
            sx={{ width: 40, height: 40 }} 
          />
          <div className="ml-3">
            <Typography variant="body1" className="font-bold text-sm sm:text-base">{post.user.username}</Typography>
            <Typography variant="body2" className="text-gray-500 text-xs sm:text-sm">{new Date(post.created_at).toLocaleDateString()}</Typography>
          </div>
        </div>
        <IconButton onClick={handleMenuOpen} size="small">
          <MoreVertIcon />
        </IconButton>
      </div>
      
      {post.tags && post.tags.length > 0 ? (
        <Typography variant="body2" className="bg-gray-200 px-2 py-1 text-xs sm:text-sm">
          <SeeMoreText text={post.tags.map((tag) => `#${tag.name}`).join(" ")} />
        </Typography>
      ) : (
        <Typography variant="body2" color="textSecondary" className="text-xs sm:text-sm">
          No tags available
        </Typography>
      )}

      <Typography variant="body1" className="mb-4 text-sm sm:text-base">
        <SeeMoreText text={post.title} />
      </Typography>
      <Typography variant="body1" className="mb-4 text-sm sm:text-base">
        <SeeMoreText text={post.content} />
      </Typography>
      <Typography variant="body1" className="mb-4 text-sm sm:text-base">
        Price: {post.price}
      </Typography>

      {post.images.length > 0 && (
        <div className="relative mb-4">
          <img
            src={`https://custme.site/storage/${post.images[currentIndex].image_path}`}
            alt={`Post Image ${post.images[currentIndex].image_id}`}
            className="w-full h-auto rounded-md"
          />
          {post.images.length > 1 && (
            <div className="absolute top-1/2 left-0 right-0 flex justify-between px-2 transform -translate-y-1/2">
              <IconButton onClick={handlePrevImage} size="small">
                <ArrowBackIcon />
              </IconButton>
              <IconButton onClick={handleNextImage} size="small">
                <ArrowForwardIcon />
              </IconButton>
            </div>
          )}
        </div>
      )}

      <Button variant="contained" color="warning" className="w-full text-xs sm:text-sm" onClick={() => onRequestSubmit(post)}>
        Interested
      </Button>
      <Button 
        variant="contained" 
        color="primary" 
        className="w-full mt-2 text-xs sm:text-sm" 
        onClick={() => handleSendMessage(post.user.user_id)}
      >
        Send Message
      </Button>
    </div>
  );
};

const ClientPost = () => {
  const { handleRequest } = useRequest();
  const { posts, fetchClientPosts } = usePostContext();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [targetUserId, setTargetUserId] = useState<number | null>(null);
  const [requestContent, setRequestContent] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchClientPosts(); // Fetching the first 10 client posts when component mounts
  }, [fetchClientPosts]);

  const handleRequestButtonClick = (post) => {
    setSelectedPost(post.post_id);
    setTargetUserId(post.user_id);
    setModalOpen(true);
    console.log('Selected Post:', post);
  };

  const handleRequestSubmit = async () => {
    if (selectedPost) {
      const selectedPostData = posts.find((post) => post.post_id === selectedPost);
      if (selectedPostData) {
        const userId = selectedPostData.user_id;
        console.log('Submitting request with data:', {
          selectedPost,
          userId,
          requestContent,
        });

        await handleRequest(selectedPost, userId, requestContent);
        setModalOpen(false);
        setRequestContent('');
      } else {
        console.error('Selected post not found');
      }
    }
  };

  return (
    <div className="ml-4 sm:ml-16 mt-8 p-4 flex flex-col items-center">
  <Header />
  <div className="w-full max-w-xl mt-10"> {/* Added 'mt-16' to push the content down */}
    <Typography variant="h5" className="mb-6 text-sm sm:text-lg">
      Clients Posts
    </Typography>

        {posts.length > 0 ? (
          posts
            .filter(post => post.user.role.rolename === 'User')
            .map(post => (
              <PostCard key={post.post_id} post={post} onRequestSubmit={handleRequestButtonClick} />
            ))
        ) : (
          <Typography className="text-sm sm:text-base">No client posts available</Typography>
        )}
      </div>

      {/* Request Modal */}
      <RequestModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        handleSubmit={handleRequestSubmit}
        setRequestContent={setRequestContent}
        targetUserId={targetUserId ?? 0}
        role={user.role.rolename}
        selectedPost={selectedPost}
      />
    </div>
  );
};

const SeeMoreText = ({ text }: { text: string }) => {
  const [isTruncated, setIsTruncated] = useState(true);
  const toggleTruncate = () => setIsTruncated(!isTruncated);

  return (
    <div>
      <Typography variant="body2" className="text-xs sm:text-sm">
        {isTruncated ? text.substring(0, 20) : text} {" "}
        <span className="text-blue-500 cursor-pointer" onClick={toggleTruncate}>
          {isTruncated ? "... See More" : " See Less"}
        </span>
      </Typography>
    </div>
  );
};

export default ClientPost;
