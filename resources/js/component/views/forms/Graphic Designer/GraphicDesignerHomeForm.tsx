import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Typography,
} from "@mui/material";
import { FaEdit, FaTrash } from "react-icons/fa";
import { usePostContext } from "../../../context/PostContext";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import CustomAlert from "../../../alert/CustomeAlert";

interface Image {
  image_id: number;
  image_path: string;
}

const GraphicDesignerHomeForm = () => {
  const { posts, fetchMyPosts, deletePost } = usePostContext();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [alertOpen, setAlertOpen] = useState(false);
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);

  useEffect(() => {
    const fetchAndFilterPosts = async () => {
      await fetchMyPosts();
      if (user) {
        // Filter posts based on the user's role or user-specific logic
        const filteredPosts = posts.filter(
          (post) => post.user_id === user?.id // Example: filter by user_id
        );
        // You can also apply more filters here based on other user properties
        // For example: if user.role === 'PrintingShop', filter posts accordingly
      }
    };
    fetchAndFilterPosts();
  }, [fetchMyPosts, posts, user]);

  const handleEdit = (
    postId: number,
    title: string,
    content: string,
    images: Image[],
    price: number | null,
    quantity: number | null,
    tags: { id: number; name: string }[] // Add tags parameter
  ) => {
    navigate(`/posts/${postId}`, {
      state: { postId, title, content, images, price, quantity, tags }, // Pass tags in state
    });
  };

  const handleDeleteConfirmation = (postId: number) => {
    setSelectedPostId(postId);
    setAlertOpen(true);
  };

  const handleDelete = () => {
    if (user && selectedPostId !== null) {
      deletePost(selectedPostId);
      setAlertOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setAlertOpen(false);
  };

  return (
    <div className="flex flex-col p-4">
      <Header />
      <Typography variant="h4" className="mb-6 font-bold text-center">
        My Printing Provider Posts
      </Typography>

      <Box display="flex" flexWrap="wrap" justifyContent="center" gap={4} mt={10}>
      {posts.length > 0 ? (
  posts.map((post) => (
    <Box key={post.post_id} width={{ xs: "100%", sm: "45%", md: "23%" }} mb={6}>
      <Card className="shadow-lg">
        {post.images.length > 0 ? (
          <ImageCarousel images={post.images} />
        ) : (
          <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
            <p className="text-gray-600">No Image Available</p>
          </div>
        )}
        <CardContent>
          <Box mb={2}>
          <div className="mt-2">
                    {post.tags && post.tags.length > 0 ? (
                      <Typography variant="body2" className="bg-gray-200 px-2 py-1 text-sm">
                        <SeeMoreText
                          text={post.tags.map((tag) => `#${tag.name}`).join(" ")}
                        />
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        No tags available
                      </Typography>
                    )}
                       </div>
            <Typography variant="h6" className="font-bold">
              Title:
            </Typography>
            <SeeMoreText text={post.title} />
          </Box>
          <Box mb={2}>
            <Typography variant="body2" color="textSecondary">
              Content:
            </Typography>
            <SeeMoreText text={post.content} />
          </Box>
          <Typography variant="body2" color="textSecondary" className="mb-2">
            Price: {post.price}
          </Typography>
        </CardContent>
        <CardActions className="flex justify-between items-center">
          <div className="flex space-x-2">
            <Button
              onClick={() =>
                handleEdit(
                  post.post_id,
                  post.title,
                  post.content,
                  post.images,
                  post.price,
                  post.quantity,
                  post.tags,
                )
              }
              variant="outlined"
              startIcon={<FaEdit />}
              size="small"
              color="primary"
            >
              Edit
            </Button>
            <Button
              onClick={() => handleDeleteConfirmation(post.post_id)}
              variant="outlined"
              startIcon={<FaTrash />}
              size="small"
              color="error"
            >
              Delete
            </Button>
          </div>
        </CardActions>
      </Card>
    </Box>
  ))
) : (
  <Typography variant="body1" color="textSecondary">
    No posts available.
  </Typography>
)}

      </Box>

      <CustomAlert
        open={alertOpen}
        title="Confirm Deletion"
        message="Are you sure you want to delete this post?"
        type="warning"
        confirmText="Yes, Delete"
        cancelText="Cancel"
        onConfirm={handleDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
};

const SeeMoreText = ({ text }: { text: string | undefined | null }) => {
  const [isTruncated, setIsTruncated] = useState(true);

  // Ensure text is a valid string before applying substring
  const truncatedText = text ? (isTruncated ? text.substring(0, 20) : text) : '';

  const toggleTruncate = () => setIsTruncated(!isTruncated);

  return (
    <>
      {truncatedText}{" "}
      <Typography
        component="span"
        className="text-blue-500 cursor-pointer"
        onClick={toggleTruncate}
        variant="body2"
      >
        {isTruncated ? "... See More" : " See Less"}
      </Typography>
    </>
  );
};

const ImageCarousel: React.FC<{ images: Image[] }> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="relative w-full h-48">
      <button
        onClick={prevImage}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-transparent text-white px-2 py-1 rounded-full focus:outline-none hover:bg-gray-700 hover:bg-opacity-70 transition"
      >
        &#8249;
      </button>
      <img
        src={`https://custme.site/storage/app/public/${images[currentIndex].image_path}`}
        alt={`Post Image ${images[currentIndex].image_id}`}
        className="w-full h-full object-cover"
      />
      <button
        onClick={nextImage}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent text-white px-2 py-1 rounded-full focus:outline-none hover:bg-gray-800"
      >
        &#8250;
      </button>
    </div>
  );
};

export default GraphicDesignerHomeForm;
