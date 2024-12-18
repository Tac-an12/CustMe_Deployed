import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaPaperPlane, FaComments } from "react-icons/fa";
import Header from "../components/header";
import PostsSearchBar from "../../../views/PostsSearchBar";
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Rating,
} from "@mui/material";
import { usePostContext } from "../../../context/PostContext";
import { useRequest } from "../../../context/RequestContext";
import { useAuth } from "../../../context/AuthContext";
import RequestModal from "../../requestmore"; // Adjust the path as necessary
import { useDesignerProviderContext } from "../../../context/Desing&ProviderContext";
import { usePostSearch } from "../../../context/PostSearchContext"; // Import the context

interface Image {
  image_id: number;
  image_path: string;
}

const DisplayForm: React.FC = () => {
  const { user } = useAuth();
  const { posts, deletePost } = usePostContext();
  const { fetchDesignerPosts, fetchProviderPosts } = useDesignerProviderContext();
  const { handleRequest } = useRequest();
  
  const [designerPosts, setDesignerPosts] = useState<any[]>([]); 
  const [providerPosts, setProviderPosts] = useState<any[]>([]); 
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<number | null>(null);
  const [requestContent, setRequestContent] = useState("");
  const [targetUserId, setTargetUserId] = useState<number | null>(null);
  const { query, setQuery } = usePostSearch();
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedDesignerPosts = await fetchDesignerPosts();
        setDesignerPosts(fetchedDesignerPosts);
      } catch (error) {
        console.error("Error fetching designer posts:", error);
        setDesignerPosts([]);
      }
  
      try {
        const fetchedProviderPosts = await fetchProviderPosts();
        setProviderPosts(fetchedProviderPosts);
      } catch (error) {
        console.error("Error fetching provider posts:", error);
        setProviderPosts([]);
      }
    };
  
    fetchPosts();
  }, [fetchDesignerPosts, fetchProviderPosts]);

  const filterPosts = (posts: any[], query: string) => {
    return posts.filter(post => 
      post.title.toLowerCase().includes(query.toLowerCase()) || 
      post.content.toLowerCase().includes(query.toLowerCase()) ||
      post.tags.some(tag => tag.name.toLowerCase().includes(query.toLowerCase()))
    );
  };

  const renderPosts = (posts: any[], title: string, link: string) => {
    const filteredPosts = filterPosts(posts, query); // Use the search query from context
    const postsToDisplay = filteredPosts.slice(0, 4); // Display only the first 4 filtered posts
    return (
      <div className="mt-6 mb-10">
        
        <Typography variant="h5" className="mb-4 font-bold">{title}</Typography>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6 mb-8 justify-center">
          {postsToDisplay.length > 0 ? (
            postsToDisplay.map((post) => (
              <Card key={post.post_id} className="shadow-lg w-full">
                {post.images.length > 0 ? (
                  <ImageCarousel images={post.images} />
                ) : (
                  <div className="w-full h-48 bg-gray-300 flex items-center justify-center">
                    <p className="text-gray-600">No Image Available</p>
                  </div>
                )}
                <CardContent>
                  <div className="flex items-center mb-4">
                    <img
                      src={
                        post.user.personal_information?.profilepicture
                          ? `http://127.0.0.1:8000/storage/${post.user.personal_information.profilepicture}`
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
                        value={post.average_rating || 0}
                        precision={0.1}
                        readOnly
                      />
                    </div>
                  </div>
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
                    <Typography variant="h6" component="h2" className="font-bold mb-2">
                      <strong>Title:</strong> <SeeMoreText text={post.title} />
                    </Typography>
                    <Typography variant="body2" color="textSecondary" className="mb-3">
                      <strong>Content:</strong>
                      <SeeMoreText text={post.content} />
                    </Typography>
                    <div className="mb-3">
                      <Typography variant="body2" color="textPrimary" className="mb-1">
                        <strong>Price:</strong> {post.price ? `₱${post.price}` : "N/A"}
                      </Typography>
                    </div>
                  </div>
                </CardContent>
                <CardActions className="flex flex-row justify-between items-center">
                  {user && (
                    <div className="flex flex-row space-x-2">
                      {post.user_id !== user.id && (
                        <Button
                          onClick={() => handleRequestButtonClick(post.post_id, post.user_id)}
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
                            onClick={() => handleEdit(post)}
                            variant="outlined"
                            startIcon={<FaEdit />}
                            size="small"
                            color="success"
                          >
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleDelete(post.post_id)}
                            variant="outlined"
                            startIcon={<FaTrash />}
                            size="small"
                            color="error"
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
                  )}
                </CardActions>
              </Card>
            ))
          ) : (
            <Typography variant="body1" color="textSecondary">
              No posts available.
            </Typography>
            
          )}
        
        </div>
        <div className="flex justify-end mt-4">
          <Button variant="contained" color="primary" onClick={() => navigate(link)}>
            See More
          </Button>
        </div>
      </div>
      
    );
  };

  const handleEdit = (post: any) => {
    navigate(`/posts/${post.post_id}`, {
      state: { 
        postId: post.post_id,
        title: post.title,
        content: post.content,
        images: post.images,
        price: post.price,
        quantity: post.quantity,
      },
    });
  };

  const handleDelete = (postId: number) => {
    if (user) {
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
      const selectedPostData = posts.find(
        (post) => post.post_id === selectedPost
      );

      if (selectedPostData) {
        const userId = selectedPostData.user_id; 
        await handleRequest(selectedPost, userId, requestContent);
        setModalOpen(false); 
        setRequestContent("");
      } else {
        console.error("Selected post not found");
      }
    }
  };
  // <div className="flex bg-gray-100 min-h-screen">
  // <div className="flex-1 flex flex-col">
  // <Header />
  // <div className="flex-grow p-4">
  //   <PostsSearchBar />
  //   {filteredPosts && renderPosts(filteredPosts, "Designer Posts")}
  // </div>
  return (
    <div className="flex-grow flex flex-col">
       <PostsSearchBar/> {/* Updated to use onSearch */}
     <Header />
    <div className="flex-grow p-4">
      {renderPosts(designerPosts, "Designer Posts", "/designerpost")}
      {renderPosts(providerPosts, "Printing Provider Posts", "/providerpost")}
    </div>
      <RequestModal
        open={modalOpen}
        handleClose={() => setModalOpen(false)}
        setRequestContent={setRequestContent}
        selectedPost={selectedPost}
        targetUserId={targetUserId ?? 0}
        role={user?.role?.rolename || "N/A"}
      />
    </div>
  );
};

const SeeMoreText = ({ text }: { text: string }) => {
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
      src={`http://127.0.0.1:8000/storage/${images[currentIndex].image_path}`}
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

export default DisplayForm;