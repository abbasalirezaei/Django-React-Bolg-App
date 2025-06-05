
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, User, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface PostCardProps {
  post: {
    id: number;
    slug: string;
    title: string;
    excerpt: string;
    author: string;
    date: string;
    category: string;
    readTime: string;
    views: number;
    likes: number;
    comments?: number;
    image: string;
  };
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { t } = useLanguage();

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
      <Link to={`/post/${post.slug}`}>
        <div className="aspect-video overflow-hidden">
          <img
            src={`${post.image}?auto=format&fit=crop&w=800&q=80`}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>
      
      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            {post.category}
          </span>
          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{post.date}</span>
          </div>
        </div>

        <Link to={`/post/${post.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-600">{post.author}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Eye className="w-4 h-4" />
              <span>{post.views}</span>
            </div>
            {post.comments !== undefined && (
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments}</span>
              </div>
            )}
            <span>{post.readTime}</span>
            <Link 
              to={`/post/${post.slug}`}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('readMore')}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};

export default PostCard;
