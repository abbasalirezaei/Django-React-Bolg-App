
import React from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import PostCard from '../components/PostCard';
import { Calendar, MapPin, Link as LinkIcon, Eye, Heart } from 'lucide-react';

const AuthorProfile = () => {
  const { authorName } = useParams();
  const { t } = useLanguage();

  const author = {
    name: "Sarah Johnson",
    bio: "Full-stack developer with 8+ years of experience in modern web technologies. Passionate about creating scalable applications and sharing knowledge with the developer community.",
    avatar: "photo-1466442929976-97f336a657be",
    joinDate: "January 2022",
    location: "San Francisco, CA",
    website: "https://sarahjohnson.dev",
    stats: {
      posts: 24,
      totalViews: 45678,
      totalLikes: 1234,
      followers: 856
    }
  };

  const authorPosts = [
    {
      id: 1,
      title: "Building Modern Web Applications with React and TypeScript",
      excerpt: "Learn how to create scalable and maintainable web applications using the latest React features and TypeScript's powerful type system.",
      author: "Sarah Johnson",
      date: "March 15, 2024",
      category: "Technology",
      readTime: "8 min read",
      views: 1254,
      likes: 89,
      image: "photo-1649972904349-6e44c42644a7"
    },
    {
      id: 2,
      title: "Advanced CSS Techniques for Modern Developers",
      excerpt: "Explore cutting-edge CSS features including Grid, Flexbox, custom properties, and container queries.",
      author: "Sarah Johnson",
      date: "March 10, 2024",
      category: "Programming",
      readTime: "10 min read",
      views: 756,
      likes: 45,
      image: "photo-1581091226825-a6a2a5aee158"
    },
    {
      id: 3,
      title: "The Future of Web Development: Trends for 2024",
      excerpt: "Stay ahead of the curve with the latest trends and technologies shaping the future of web development.",
      author: "Sarah Johnson",
      date: "March 5, 2024",
      category: "Technology",
      readTime: "7 min read",
      views: 1105,
      likes: 92,
      image: "photo-1487058792275-0ad4aaf24ca7"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Author Header */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                  src={`https://images.unsplash.com/${author.avatar}?auto=format&fit=crop&w=300&q=80`}
                  alt={author.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{author.name}</h1>
                <p className="text-gray-600 mb-4 leading-relaxed">{author.bio}</p>
                
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>Joined {author.joinDate}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4" />
                    <span>{author.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <LinkIcon className="w-4 h-4" />
                    <a 
                      href={author.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {author.website}
                    </a>
                  </div>
                </div>

                {/* Author Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{author.stats.posts}</div>
                    <div className="text-sm text-gray-500">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{author.stats.totalViews.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Views</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{author.stats.totalLikes}</div>
                    <div className="text-sm text-gray-500">Likes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{author.stats.followers}</div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Author's Posts */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              Posts by {author.name}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {authorPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          </div>

          {/* Load More Button */}
          <div className="text-center">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Load More Posts
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorProfile;
