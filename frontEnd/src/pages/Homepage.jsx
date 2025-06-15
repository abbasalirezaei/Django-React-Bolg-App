
import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import { ArrowRight, BookOpen, Users, Star, MessageCircle, Eye, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Homepage = () => {
  const { t } = useLanguage();

  const mostCommentedPosts = [
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
      comments: 45,
      image: "photo-1649972904349-6e44c42644a7"
    },
    {
      id: 2,
      title: "The Art of Minimalist Design: Less is More",
      excerpt: "Discover the principles of minimalist design and how to apply them to create beautiful, functional user interfaces.",
      author: "Michael Chen",
      date: "March 12, 2024",
      category: "Design",
      readTime: "6 min read",
      views: 987,
      likes: 67,
      comments: 38,
      image: "photo-1488590528505-98d2b5aba04b"
    },
    {
      id: 3,
      title: "The Future of Web Development: Trends for 2024",
      excerpt: "Stay ahead of the curve with the latest trends and technologies shaping the future of web development.",
      author: "Alex Thompson",
      date: "March 5, 2024",
      category: "Technology",
      readTime: "7 min read",
      views: 1105,
      likes: 92,
      comments: 29,
      image: "photo-1487058792275-0ad4aaf24ca7"
    }
  ];

  const mostViewedPosts = [
    {
      id: 4,
      title: "Complete Guide to CSS Grid Layout",
      excerpt: "Master CSS Grid with this comprehensive guide covering everything from basics to advanced techniques.",
      author: "Emma Davis",
      date: "March 10, 2024",
      category: "Web Development",
      readTime: "12 min read",
      views: 2340,
      likes: 156,
      comments: 23,
      image: "photo-1507003211169-0a1dd7228f2d"
    },
    {
      id: 5,
      title: "JavaScript ES2024: New Features You Should Know",
      excerpt: "Explore the latest JavaScript features and how they can improve your development workflow.",
      author: "David Wilson",
      date: "March 8, 2024",
      category: "JavaScript",
      readTime: "9 min read",
      views: 1980,
      likes: 134,
      comments: 31,
      image: "photo-1555066931-4365d14bab8c"
    },
    {
      id: 6,
      title: "Building Responsive Layouts with Tailwind CSS",
      excerpt: "Learn how to create beautiful, responsive designs using Tailwind CSS utility classes.",
      author: "Lisa Rodriguez",
      date: "March 3, 2024",
      category: "CSS",
      readTime: "10 min read",
      views: 1756,
      likes: 98,
      comments: 19,
      image: "photo-1581291518857-4e27b48ff24e"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Hero Section */}
      
            {/* Statistics Section */}

            {/* Most Commented Posts */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <MessageCircle className="w-8 h-8 text-orange-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">Most Commented Posts</h2>
                </div>
                <Link 
                  to="/posts"
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Articles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mostCommentedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>

            {/* Most Viewed Posts */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center">
                  <Eye className="w-8 h-8 text-green-600 mr-3" />
                  <h2 className="text-3xl font-bold text-gray-900">Most Viewed Posts</h2>
                </div>
                <Link 
                  to="/posts"
                  className="flex items-center text-blue-600 hover:text-blue-700 font-medium"
                >
                  View All Articles
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mostViewedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            </section>

            {/* Call to Action */}
            <section className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm mb-12">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  Ready to Share Your Story?
                </h2>
                <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                  Join our community of writers and share your knowledge with readers around the world.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/signup">
                    <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Start Writing
                    </button>
                  </Link>
                  <Link to="/about">
                    <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                      Learn More
                    </button>
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <span className="text-xl font-bold">BlogSpace</span>
              </div>
              <p className="text-gray-400 mb-4">
                Empowering writers and readers to share knowledge and inspiration.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Mail className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/posts" className="text-gray-400 hover:text-white transition-colors">All Posts</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact</Link></li>
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Technology</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Design</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Development</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Business</a></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 BlogSpace. All rights reserved. Made with ❤️ for the writing community.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
