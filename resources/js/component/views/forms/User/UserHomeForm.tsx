import React, { useEffect, useState } from "react";
import {
  Typography,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  MoreVert as MoreVertIcon,
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { usePostContext } from "../../../context/PostContext";
import { useAuth } from "../../../context/AuthContext";
import Header from "../components/header";

const UserHomeForm = () => {
  const { posts, fetchMyPosts, deletePost } = usePostContext();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyPosts(); // Fetch the first 10 posts on mount
  }, [fetchMyPosts]);

  // Filter posts to include only those created by the authenticated user
  const userPosts = posts.filter((post) => post.user_id === user?.id);

  const handleEdit = (
    postId,
    title,
    content,
    images,
    price,
    quantity,
    tags
  ) => {
    navigate(`/posts/${postId}`, {
      state: { postId, title, content, images, price, quantity, tags },
    });
  };

  const handleDelete = (postId) => {
    if (user) {
      deletePost(postId);
    }
  };

  const PostCard = ({ post }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleMenuOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
      setAnchorEl(null);
    };

    const handlePrevImage = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : post.images.length - 1
      );
    };

    const handleNextImage = () => {
      setCurrentIndex((prevIndex) =>
        prevIndex < post.images.length - 1 ? prevIndex + 1 : 0
      );
    };

    return (
      <div className="bg-white p-4 mb-4 rounded-md justify-center shadow-md max-w-md">
        <div className="flex justify-between  items-center mb-2">
          <div className="flex items-center">
            {/* <Avatar
              alt={post.user.username}
              // src={`https://custme.site/storage/app/public/${post.user.personal_information.profilepicture}}`}
              // sx={{ width: 40, height: 40 }}
            /> */}
            <div className="ml-3">
              <Typography variant="body1" className="font-bold">
                {post.user.username}
              </Typography>
              <Typography variant="body2" className="text-gray-500">
                {new Date(post.created_at).toLocaleDateString()}
              </Typography>
            </div>
          </div>
          <IconButton onClick={handleMenuOpen}>
            <MoreVertIcon />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem
              onClick={() =>
                handleEdit(
                  post.post_id,
                  post.title,
                  post.content,
                  post.images,
                  post.price,
                  post.quantity,
                  post.tags
                )
              }
            >
              Edit
            </MenuItem>
            <MenuItem onClick={() => handleDelete(post.post_id)}>
              Delete
            </MenuItem>
          </Menu>
        </div>

        <div className="mb-4">
          <Typography variant="body1">
            <SeeMoreText text={post.title} />
          </Typography>
          <Typography variant="body1">
            <SeeMoreText text={post.content} />
          </Typography>
          <Typography variant="body1">Price: {post.price}</Typography>
        </div>

        {post.images.length > 0 && (
          <div className="relative mb-4">
            <img
              src={`https://custme.site/storage/app/public/${post.images[currentIndex].image_path}`}
              alt={`Post Image ${post.images[currentIndex].image_id}`}
              className="w-full h-auto rounded-md"
            />
            {post.images.length > 1 && (
              <div className="absolute top-1/2 left-0 right-0 flex justify-between px-2 transform -translate-y-1/2">
                <IconButton onClick={handlePrevImage}>
                  <ArrowBackIcon />
                </IconButton>
                <IconButton onClick={handleNextImage}>
                  <ArrowForwardIcon />
                </IconButton>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="ml-5 mt-16 flex justify-center">
      <Header />
      <div className="mt-6">
        <Typography variant="h5" className="mb-6">
          My Posts
        </Typography>
        {userPosts.length > 0 ? (
          userPosts.map((post) => <PostCard key={post.post_id} post={post} />)
        ) : (
          <Typography variant="body1" className="text-center text-gray-600">
            You have not created any posts yet.
          </Typography>
        )}
      </div>
    </div>
  );
};

const SeeMoreText = ({ text }) => {
  const [isTruncated, setIsTruncated] = useState(true);
  const toggleTruncate = () => setIsTruncated(!isTruncated);

  return (
    <Typography variant="body2">
      {isTruncated ? text.substring(0, 50) : text}{" "}
      {text.length > 50 && (
        <span
          className="text-blue-500 cursor-pointer"
          onClick={toggleTruncate}
        >
          {isTruncated ? "... See More" : " See Less"}
        </span>
      )}
    </Typography>
  );
};

export default UserHomeForm;
