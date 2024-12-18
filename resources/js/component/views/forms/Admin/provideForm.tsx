import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPaperPlane, FaComments } from "react-icons/fa";
import Header from "../components/header";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Rating,
} from "@mui/material";
import { useRequest } from "../../../context/RequestContext";
import RequestModal from "../../requestmore"; // Adjust the path as necessary
import { useDesignerProviderContext } from "../../../context/Desing&ProviderContext";
import { usePostContext } from "../../../context/PostContext";
import { useAuth } from "../../../context/AuthContext";
import PostsSearchBar from "../../../views/PostsSearchBar";
import { usePostSearch } from "../../../context/PostSearchContext";

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
};

interface Image {
  image_id: number;
  image_path: string;
}

const ProviderPostForm: React.FC = () => {
  const { fetchProviderPosts } = useDesignerProviderContext();
  const { handleRequest } = useRequest();
  const { user: authUser } = useAuth();
  const { deletePost, user } = usePostContext(); // Access user and deletePost from context
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [requestContent, setRequestContent] = useState("");
  const [durationDays, setDurationDays] = useState<number | undefined>(
    undefined
  );
  const [durationMinutes, setDurationMinutes] = useState<number | undefined>(
    undefined
  );
  const [targetUserId, setTargetUserId] = useState<number | null>(null);
  const [providerPosts, setProviderPosts] = useState<any[]>([]);
  const navigate = useNavigate();
  const { query, setQuery } = usePostSearch();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedProviderPosts = await fetchProviderPosts();
        setProviderPosts(fetchedProviderPosts);
      } catch (error) {
        console.error("Error fetching provider posts:", error);
        setProviderPosts([]);
      }
    };
    fetchPosts();
  }, [fetchProviderPosts]);

  const filterPosts = (posts: any[], query: string) => {
    return posts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) || 
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.name.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const handleEdit = (
    postId: number,
    title: string,
    content: string,
    images: Image[]
  ) => {
    navigate(`/posts/${postId}`, { state: { postId, title, content, images } });
  };

  const handleDelete = (postId: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(postId);
    }
  };

  const handleSendMessage = (userId: number) => {
    navigate("/chats", { state: { userId } });
  };

  const handleRequestButtonClick = (postId: number, postUserId: number) => {
    setSelectedPost(postId);
    setTargetUserId(postUserId);
    setModalOpen(true);
  };

  const handleRequestSubmit = async () => {
    if (selectedPost) {
      const selectedPostData = providerPosts.find(
        (post) => post.post_id === selectedPost
      );

      if (selectedPostData) {
        const userId = selectedPostData.user_id;

        await handleRequest(
          selectedPost,
          userId,
          requestContent,
          durationDays ?? 0,
          durationMinutes ?? 0
        );

        setModalOpen(false);
        setRequestContent("");
        setDurationDays(undefined);
        setDurationMinutes(undefined);
      } else {
        console.error("Selected post not found");
      }
    }
  };

  const filteredPosts = filterPosts(providerPosts, query);

  const renderPosts = (posts: any[], title: string) => (
    <div className="mb-8 mt-6">
      <Typography variant="h5" className="mb-4 font-bold">
        {title}
      </Typography>
      <div className="flex justify-start gap-4 flex-wrap ml-8 mt-3">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card
              key={post.post_id}
              className="shadow-lg"
              style={{ width: "300px", height: "auto" }}
            >
              {post.images.length > 0 ? (
                <ImageCarousel images={post.images} />
              ) : (
                <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                  <p className="text-gray-600">No Image Available</p>
                </div>
              )}
              <CardContent>
                {/* User Information */}
                <div className="flex items-center mb-4">
                  <img
                    src={ 
                      post.user.personal_information?.profilepicture
                        ? `https://custme.site/storage/app/public/${post.user.personal_information.profilepicture}`
                        : "https://via.placeholder.com/40"
                    }
                    alt="Profile"
                    className="w-8 h-8 rounded-full mr-3"
                  />
                  <div>
                  <Typography
          variant="subtitle1"
          className="font-bold cursor-pointer"
          onClick={() => navigate(`/clients/${post.user_id}/profile`)}
        >
          {post.user?.username || "Unknown"}
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {post.user?.role?.rolename || "N/A"}
        </Typography>

        <Rating
          name="average-rating"
          value={post.average_rating || 0} // Fallback to 0 if no rating
          precision={0.1} // Adjust precision as needed
          readOnly
        />
      </div>
      </div>
                  <div className="mt-2">
                  {post.tags && post.tags.length > 0 ? (
                    <Typography
                      variant="body2"
                      className="bg-gray-200 px-2 py-1 text-sm"
                    >
                      <SeeMoreText
                        text={post.tags.map((tag) => `#${tag.name}`).join(" ")} // Combine all tags into one sentence
                      />
                    </Typography>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No tags available
                    </Typography>
                  )}
                </div>

        
                <Typography variant="h6" component="h2" className="font-bold mb-2">
                  <strong>Title:</strong>{" "}
                  <SeeMoreText text={post.title} />
                </Typography>
                <Typography variant="body2" color="textSecondary" className="mb-3">
                  <strong>Content:</strong>
                  <SeeMoreText text={post.content} />
                </Typography>
                <div className="mb-3">
                  <Typography
                    variant="body2"
                    color="textPrimary"
                    className="mb-1"
                  >
                    <strong>Price:</strong>{" "}
                    {post.price ? `₱${post.price}` : "N/A"}
                  </Typography>
                  {/* <Typography variant="body2" color="textSecondary" className="mb-1">
                    <strong>Created:</strong> {post.created_at ? formatDate(post.created_at) : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    <strong>Updated:</strong> {post.updated_at ? formatDate(post.updated_at) : 'N/A'}
                  </Typography> */}
                </div>
              </CardContent>
              <CardActions className="flex flex-row justify-between items-center">
                <div className="flex flex-row space-x-2">
                  {post.user_id !== user.id && (
                    <Button
                      onClick={() =>
                        handleRequestButtonClick(post.post_id, post.user_id)
                      }
                      variant="outlined"
                      startIcon={<FaPaperPlane />}
                      size="small"
                      color="primary"
                    >
                      Apply
                    </Button>
                  )}
                  {post.user_id === user.id && (
                    <>
                      <Button
                        onClick={() =>
                          handleEdit(
                            post.post_id,
                            post.title,
                            post.content,
                            post.images
                          )
                        }
                        variant="outlined"
                        startIcon={<FaEdit />}
                        size="small"
                        color="success"
                        className="mt-2"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(post.post_id)}
                        variant="outlined"
                        startIcon={<FaTrash />}
                        size="small"
                        color="error"
                        className="mt-2"
                      >
                        Delete
                      </Button>
                    </>
                  )}
                  <Button
                    onClick={() => handleSendMessage(post.user_id)}
                    variant="outlined"
                    startIcon={<FaComments />}
                    color="primary"
                    size="small"
                  >
                    Chat
                  </Button>
                </div>
              </CardActions>
            </Card>
          ))
        ) : (
          <Typography variant="body1" color="textSecondary">
            No posts available.
          </Typography>
        )}
      </div>
    
    </div>
  );

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <div className="flex-1 flex flex-col">
      <Header />
      <div className="flex-grow p-4">
        <PostsSearchBar />
        {filteredPosts && renderPosts(filteredPosts, "Printing Provider Posts")}
      </div>

        {/* Request Modal */}
        <RequestModal
          open={modalOpen}
          handleClose={() => setModalOpen(false)}
          setRequestContent={setRequestContent}
          selectedPost={selectedPost}
          targetUserId={targetUserId ?? 0}
          role={authUser?.role?.rolename || "N/A"}
        />
      </div>
    </div>
  );
};const SeeMoreText = ({ text }: { text: string }) => {
  const [isTruncated, setIsTruncated] = useState(true);
  const toggleTruncate = () => setIsTruncated(!isTruncated);

  return (
    <div>
      <Typography variant="body2">
        {isTruncated ? text.substring(0, 20) : text}{" "}
        <span
          className="text-blue-500 cursor-pointer"
          onClick={toggleTruncate}
        >
          {isTruncated ? "... See More" : " See Less"}
        </span>
      </Typography>
    </div>
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
      className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-transparent text-black text-4xl px-2 py-3 rounded-full focus:outline-none hover:bg-gray-700 hover:bg-opacity-80 transition-all"
    >
      &#8249;
    </button>
    <img
      src={`https://custme.site/storage/${images[currentIndex].image_path}`}
      alt={`Post Image ${images[currentIndex].image_id}`}
      className="w-full h-full object-cover"
    />
    <button
      onClick={nextImage}
      className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-transparent text-black text-4xl px-2 py-3 rounded-full focus:outline-none hover:bg-gray-800 hover:bg-opacity-80 transition-all"
    >
      &#8250;
    </button>
  </div>
  );
};

export default ProviderPostForm;
