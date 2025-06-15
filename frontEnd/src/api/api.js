import axios from 'axios';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const tokens = localStorage.getItem('authTokens');
    if (tokens) {
      const parsedTokens = JSON.parse(tokens);
      config.headers.Authorization = `Bearer ${parsedTokens.access}`;  // فقط access token
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  login: (credentials) => api.post('/accounts/api/v1/jwt/token/create/', credentials),
  register: (userData) => api.post('/accounts/api/v1/registration/', userData),

};

// Profile API calls
export const profileAPI = {
  getProfile: () => api.get('/accounts/api/v1/profile/'),
};

// Posts API calls
export const postsAPI = {
  getPosts: () => api.get('/posts/api/v2/'),
  getTopViewedPosts: () => api.get('/posts/api/v2/top-viewed/'),
  getTopCommentedPosts: () => api.get('/posts/api/v2/top-commented/'),
  getPostDetail: (storeSlug) => api.get(`/posts/api/v2/post/${storeSlug}/`),
  getComments: (postSlug) => api.get(`/posts/api/v2/post/${postSlug}/comments/`),
  createComment: (postSlug, commentData) => api.post(`/posts/api/v2/post/${postSlug}/comments/`, commentData),

  deleteComment: (postSlug, commentId) =>
    api.delete(`/posts/api/v2/post/${postSlug}/comment/${commentId}/`),

  updateComment: (postSlug, commentId, commentData) =>
    api.put(`/posts/api/v2/post/${postSlug}/comment/${commentId}/`, commentData),

  partialUpdateComment: (postSlug, commentId, partialData) =>
    api.patch(`/posts/api/v2/post/${postSlug}/comment/${commentId}/`, partialData),

};


// Products API calls
export const productsAPI = {
  getProducts: () => api.get('/store/products/'),
  addProduct: (productData) => api.post('/store/products/', productData),
  updateProduct: (productId, productData) =>
    api.put(`/store/products/${productId}/`, productData),
  deleteProduct: (productId) => api.delete(`/store/products/${productId}/`),
  getPublicProduct: (storeSlug, productId) =>
    api.get(`/store/${storeSlug}/products/${productId}/`),
};

export default api; 