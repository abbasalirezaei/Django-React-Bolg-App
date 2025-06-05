
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';

const Sidebar = () => {
  const { t } = useLanguage();

  const popularPosts = [
    { id: 1, title: "How to Build a Modern Blog with React", views: 1254 },
    { id: 2, title: "Advanced TypeScript Tips and Tricks", views: 987 },
    { id: 3, title: "CSS Grid vs Flexbox: When to Use Which", views: 756 },
    { id: 4, title: "Building Scalable APIs with Node.js", views: 623 },
  ];

  const categories = [
    { name: "Technology", count: 24 },
    { name: "Design", count: 18 },
    { name: "Programming", count: 32 },
    { name: "Business", count: 14 },
    { name: "Lifestyle", count: 8 },
  ];

  const tags = [
    "React", "TypeScript", "CSS", "JavaScript", "Node.js", 
    "Design", "UX", "Frontend", "Backend", "API"
  ];

  return (
    <aside className="space-y-8">
      {/* Newsletter Subscription */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-xl border">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{t('newsletter')}</h3>
        <p className="text-gray-600 mb-4 text-sm">
          {t('subscribeNewsletter')}
        </p>
        <div className="space-y-3">
          <input
            type="email"
            placeholder={t('emailPlaceholder')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Button className="w-full">
            {t('subscribe')}
          </Button>
        </div>
      </div>

      {/* Popular Posts */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('popularPosts')}</h3>
        <div className="space-y-4">
          {popularPosts.map((post) => (
            <div key={post.id} className="flex space-x-3">
              <div className="w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0">
                <img
                  src={`https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=100&q=80`}
                  alt=""
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                  {post.title}
                </h4>
                <p className="text-xs text-gray-500">{post.views} {t('views')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('categories')}</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.name} className="flex items-center justify-between py-2 hover:bg-gray-50 px-2 rounded cursor-pointer">
              <span className="text-gray-700">{category.name}</span>
              <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                {category.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div className="bg-white p-6 rounded-xl border border-gray-100">
        <h3 className="text-lg font-bold text-gray-900 mb-4">{t('tags')}</h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
