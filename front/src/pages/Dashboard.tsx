import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Eye, Heart, MessageCircle, Trash2, User, FileText } from 'lucide-react';
import PostEditor from '../components/PostEditor';
import CommentsManagement from '../components/CommentsManagement';
import ProfileManagement from '../components/ProfileManagement';

const Dashboard = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('posts');
  const [showPostEditor, setShowPostEditor] = useState(false);
  const [editingPost, setEditingPost] = useState(null);

  const [userPosts, setUserPosts] = useState([
    {
      id: 1,
      title: "Building Modern Web Applications with React and TypeScript",
      status: "Published",
      date: "March 15, 2024",
      views: 1254,
      likes: 89,
      comments: 12,
      excerpt: "Learn how to create scalable applications...",
      category: "Technology",
      content: "Full content here...",
      image: "photo-1649972904349-6e44c42644a7"
    },
    {
      id: 2,
      title: "Advanced CSS Techniques for Modern Developers",
      status: "Draft",
      date: "March 10, 2024",
      views: 0,
      likes: 0,
      comments: 0,
      excerpt: "Explore cutting-edge CSS features...",
      category: "Programming",
      content: "Full content here...",
      image: "photo-1581091226825-a6a2a5aee158"
    },
    {
      id: 3,
      title: "The Future of Web Development: Trends for 2024",
      status: "Published",
      date: "March 5, 2024",
      views: 1105,
      likes: 92,
      comments: 8,
      excerpt: "Stay ahead of the curve...",
      category: "Technology",
      content: "Full content here...",
      image: "photo-1487058792275-0ad4aaf24ca7"
    }
  ]);

  const stats = {
    totalPosts: userPosts.length,
    totalViews: userPosts.reduce((sum, post) => sum + post.views, 0),
    totalLikes: userPosts.reduce((sum, post) => sum + post.likes, 0),
    totalComments: userPosts.reduce((sum, post) => sum + post.comments, 0)
  };

  const handleCreatePost = () => {
    setEditingPost(null);
    setShowPostEditor(true);
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setShowPostEditor(true);
  };

  const handleSavePost = (postData: any) => {
    if (editingPost) {
      setUserPosts(userPosts.map(post => 
        post.id === editingPost.id ? { ...post, ...postData } : post
      ));
    } else {
      setUserPosts([...userPosts, postData]);
    }
    setShowPostEditor(false);
    setEditingPost(null);
  };

  const handleDeletePost = (postId: number) => {
    setUserPosts(userPosts.filter(post => post.id !== postId));
  };

  if (showPostEditor) {
    return (
      <PostEditor
        post={editingPost}
        onSave={handleSavePost}
        onCancel={() => {
          setShowPostEditor(false);
          setEditingPost(null);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
              <p className="text-gray-600 mt-1">Manage your blog posts and profile</p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Posts</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalPosts}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Edit className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Views</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Likes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalLikes}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Comments</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalComments}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-8">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'posts'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <FileText className="w-4 h-4 inline mr-2" />
                  My Posts
                </button>
                <button
                  onClick={() => setActiveTab('comments')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'comments'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <MessageCircle className="w-4 h-4 inline mr-2" />
                  Comments
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`py-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'profile'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <User className="w-4 h-4 inline mr-2" />
                  Profile
                </button>
              </nav>
            </div>

            <div className="p-6">
              {/* Posts Tab */}
              {activeTab === 'posts' && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">{t('myPosts')}</h2>
                    <Button onClick={handleCreatePost}>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('createPost')}
                    </Button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Title
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Stats
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {userPosts.map((post) => (
                          <tr key={post.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                {post.title}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                post.status === 'Published' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {post.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {post.date}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex space-x-4">
                                <span className="flex items-center">
                                  <Eye className="w-4 h-4 mr-1" />
                                  {post.views}
                                </span>
                                <span className="flex items-center">
                                  <Heart className="w-4 h-4 mr-1" />
                                  {post.likes}
                                </span>
                                <span className="flex items-center">
                                  <MessageCircle className="w-4 h-4 mr-1" />
                                  {post.comments}
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEditPost(post)}>
                                  <Edit className="w-4 h-4" />
                                </Button>
                                <Button variant="ghost" size="sm">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-red-600 hover:text-red-700"
                                  onClick={() => handleDeletePost(post.id)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Comments Tab */}
              {activeTab === 'comments' && <CommentsManagement />}

              {/* Profile Tab */}
              {activeTab === 'profile' && <ProfileManagement />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
