import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import Header from '../components/header';
import { useAuth } from '../../../context/AuthContext';
import { usePostContext } from '../../../context/PostContext';
import apiService from '../../../services/apiService';
import { Autocomplete, TextField } from '@mui/material';

const EditPostForm: React.FC = () => {
  const { user } = useAuth();
  const { fetchTags, updatePost } = usePostContext();
  const { postId } = useParams<{ postId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const post = location.state || {};

  const [title, setTitle] = useState<string>(post?.title || '');
  const [content, setContent] = useState<string>(post?.content || '');
  const [price, setPrice] = useState<number>(post?.price ? Number(post.price) : 0);
  // const [quantity, setQuantity] = useState<number>(post?.quantity ? Number(post.quantity) : 0);
  const [images, setImages] = useState<File[]>([]);
  const [existingImages, setExistingImages] = useState(post?.images || []);
  const [tags, setTags] = useState<{ id: number; name: string }[]>(post?.tags || []);
  const [availableTags, setAvailableTags] = useState<{ id: number; name: string }[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  // Fetch tags when the component mounts
  useEffect(() => {
    const fetchAvailableTags = async () => {
      const tags = await fetchTags();
      setAvailableTags(tags);
    };

    fetchAvailableTags();
  }, [fetchTags]);

  const isAllowedRole = user && (user.role.rolename === 'Printing Shop' || user.role.rolename === 'Graphic Designer');

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value);
  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => setContent(e.target.value);
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => setPrice(parseFloat(e.target.value));
  // const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => setQuantity(parseInt(e.target.value) || 0);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const validImages = Array.from(files).filter((file): file is File =>
        ['image/jpeg', 'image/png', 'image/gif'].includes(file.type) && file.size <= 2048 * 1024
      );
      setImages(prevImages => [...prevImages, ...validImages]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(prevImages => prevImages.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (imageId: number) => {
    setExistingImages(prevImages => prevImages.filter(image => image.image_id !== imageId));
  };

  const handleTagChange = (event: any, value: any) => {
    // Update tags based on user input
    const updatedTags = value.map(tag => availableTags.find(t => t.name === tag.name)).filter(tag => tag);
    setTags(updatedTags); // Update state with selected tags
    setTagInput(''); // Clear the input after selection
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!title || !content || (isAllowedRole && quantity === '')) {
    //   setError('Title, content, and quantity (if applicable) are required');
    //   return;
    // }
    
    if (!title || !content) {
      setError('Title, content,  are required');
      return;
    }
    const hasEmptyTags = tags.some(tag => !tag.name.trim());
    if (hasEmptyTags) {
      setError('Tags cannot be empty');
      return;
    }
    if (price < 150) {
      setError('Price cannot be below 150');
      return; // Prevent submission if price is invalid
    }
    // Validation for tags and images
      if (tags.length === 0) {
        setError('At least one tag is required');
        return; // Prevent form submission if no tags
      }

      if (images.length === 0 && existingImages.length === 0) {
        setError('At least one image is required');
        return; // Prevent form submission if no images
      }

      if (typeof price === 'number') {
        const priceStr = price.toString();
        
        console.log("Price as string: ", priceStr);
        
        const priceLength = priceStr.length;  // Get the length of the price
      
        console.log("Price length: ", priceLength);
      
        // Check if the last digit of the price is 1 or 6
        const lastDigit = priceStr.charAt(priceStr.length - 1); // Get the last character (digit)
        console.log("Last digit of price: ", lastDigit);
      
        if (lastDigit === '1' || lastDigit === '6') {
          setError('Price cannot end in 1 or 6');
          console.log("Error: Price ends in 1 or 6.");
          return; // Prevent submission if the price ends in 1 or 6
        }
      }


    const formData = new FormData();  
    formData.append('_method', 'put');
    formData.append('title', title);
    formData.append('content', content);
    formData.append('price', price.toString());

    // if (isAllowedRole && quantity !== '') {
    //   formData.append('quantity', quantity.toString());
    // }

    images.forEach(image => {
      formData.append('images[]', image);
    });
    existingImages.forEach(image => {
      formData.append('existingImages[]', image.image_id.toString());
    });

    // Include tags in the form data
    tags.forEach(tag => {
      formData.append('tags[]', tag.name);
    });

    try {
      const response = await apiService.post(`/posts/${postId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.status === 200) {
        const updatedPost = {
          ...response.data,
          tags,
        };

        updatePost(updatedPost);
        setSuccess('Post updated successfully');
        setError('');
        navigate(`/posts/${postId}`);
      } else {
        setError('Failed to update post');
        setSuccess('');
      }
    } catch (error: any) {
      console.error('Error:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
      }
      setError('An error occurred while updating the post');
      setSuccess('');
    }
  };

  return (
    <div className="flex bg-white min-h-screen">
      <div className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 p-8 flex items-center justify-center">
          <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                  placeholder="Title"
                  value={title}
                  onChange={handleTitleChange}
                />
              </div>
              <div>
                <input
                  type="text"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                  placeholder={`What's on your mind, ${user ? user.username : 'User'}?`}
                  value={content}
                  onChange={handleContentChange}
                />
              </div>
              <div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                  placeholder="Price (e.g. 100.00)"
                  value={price}
                  onChange={handlePriceChange}
                />
              </div>
              {/* {isAllowedRole && (
                <div>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                    placeholder="Quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                  />
                </div>
              )} */}
              <div>
                <input
                  type="file"
                  className="hidden"
                  id="imageUpload"
                  multiple
                  onChange={handleImageChange}
                />
                <label htmlFor="imageUpload" className="cursor-pointer text-blue-500">Add images to your post</label>
                <div className="mt-2">
                  {existingImages.map((image) => (
                    <div key={image.image_id} className="relative inline-block mr-2 mb-2">
                      <img
                        src={`https://custme.site/storage/app/public/images/${image.image_path}`}
                        alt={`Existing Preview`}
                        className="w-32 h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveExistingImage(image.image_id)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                  {images.map((image, index) => (
                    <div key={index} className="relative inline-block mr-2 mb-2">
                      <img
                        src={URL.createObjectURL(image)}
                        alt={`Preview ${index}`}
                        className="w-32 h-32 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Autocomplete
                  multiple
                  options={availableTags}
                  getOptionLabel={(option) => option.name}
                  value={tags}
                  onChange={handleTagChange}
                  inputValue={tagInput}
                  onInputChange={(event, newInputValue) => {
                    setTagInput(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Tags" placeholder="Add tags" />
                  )}
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring"
              >
                Update Post
              </button>
              {success && <p className="text-green-500 mt-2">{success}</p>}
              {error && <p className="text-red-500 mt-2">{error}</p>}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPostForm;