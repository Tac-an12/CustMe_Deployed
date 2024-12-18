import React, { useState, useEffect } from 'react';
import Header from '../components/header';
import { useAuth } from '../../../context/AuthContext';
import { usePostContext } from '../../../context/PostContext';
import apiService from '../../../services/apiService';
import { Autocomplete } from '@mui/material';
import TextField from '@mui/material/TextField';

interface Tag {
  id: number;
  name: string;
}

const CreatePostForm: React.FC = () => {
  const { user } = useAuth();
  const { addPost, fetchTags } = usePostContext();
  const [title, setTitle] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [price, setPrice] = useState<number | ''>('');
  // const [quantity, setQuantity] = useState<number | ''>('');
  const [images, setImages] = useState<File[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  useEffect(() => {
    const loadTags = async () => {
      const fetchedTags = await fetchTags();
      setTags(fetchedTags);
    };
    loadTags();
  }, [fetchTags]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setContent(e.target.value);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrice(parseFloat(e.target.value));
  };

  // const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   setQuantity(parseInt(e.target.value) || '');
  // };

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

  const isAllowedRole = () => {
    return user && (user.role.rolename === 'Printing Shop' || user.role.rolename === 'Graphic Designer');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // if (!title || !content || price === '' || (isAllowedRole() && quantity === '')) {
    //   setError('Title, content, price, and quantity (if applicable) are required');
    //   return;
    // }
    if (!title || !content || price === '' ) {
      setError('Title, content, price, are required');
      return;
    }

    if (price < 150) {
      setError('asPrice cannot be below 150gg');
      return; // Prevent submission if price is invalid
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
    if (selectedTags.length === 0) {
      setError('At least one tag is required');
      return;
    }
  
    if (images.length === 0) {
      setError('At least one image is required');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    formData.append('price', price.toString());
    // if (isAllowedRole()) {
    //   formData.append('quantity', quantity.toString());
    // }
    selectedTags.forEach(tag => {
      formData.append('tags[]', tag.id.toString());
    });
    images.forEach(image => {
      formData.append('images[]', image);
    });

    try {
      const response = await apiService.post('/posts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setSuccess('Post created successfully');
        setTitle('');
        setContent('');
        setPrice('');
        // setQuantity('');
        setImages([]);
        setSelectedTags([]);
        setError('');
        addPost(response.data);
      } else {
        setError('Failed to create post');
        setSuccess('');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('An error occurred while creating the post');
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
                  placeholder="Price (e.g. 150.00)"
                  value={price}
                  onChange={handlePriceChange}
                />
              </div>
              {/* {isAllowedRole() && (
                <div>
                  <input
                    type="number"
                    min="0"
                    className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring"
                    placeholder="Quantity (required for Graphic Designer / Printing Shop)"
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
              <Autocomplete
                multiple
                options={tags}
                getOptionLabel={(option) => option.name}
                onChange={(event, newValue) => {
                  setSelectedTags(newValue);
                }}
                renderInput={(params) => (
                  <TextField {...params} variant="outlined" label="Select Tags" placeholder="Tags" />
                )}
              />
              <button
                type="submit"
                className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring"
              >
                Post
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

export default CreatePostForm;