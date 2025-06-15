import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Eye, User, MessageCircle } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

const PostCard = ({ post }) => {
  const { t } = useLanguage();

  return (
    <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden border border-gray-100">
      <Link to={`/post/${post.slug}`}>
        <div className="aspect-video overflow-hidden">
          <img
            src={`${post.img}?auto=format&fit=crop&w=800&q=80`}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      </Link>

      <div className="p-6">
        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium">
            {post.categories && post.categories.map((c) => c.name).join(', ')}
          </span>


          <div className="flex items-center space-x-1">
            <Calendar className="w-4 h-4" />
            <span>{new Date(post.created_at).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}</span>
          </div>
        </div>

        <Link to={`/post/${post.slug}`}>
          <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-gray-600 mb-4 line-clamp-3">
          {post.short_description}
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
            {post.comments_count !== undefined && (
              <div className="flex items-center space-x-1">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments_count}</span>
              </div>
            )}
            <span>{post.reading_time}</span>
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
