
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import PostCard from '../components/PostCard';
import Sidebar from '../components/Sidebar';
import { ArrowRight, BookOpen, Users, Star, MessageCircle, Eye, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { postsAPI } from '../api/api';
const Homepage = () => {
    const { t } = useLanguage();
    const [topViewedPosts, setTopViewedPosts] = useState([]);
    const [topCommentedPosts, setTopCommentedPosts] = useState([]);

    const fetchTopViewedPosts = async () => {
        try {

            const response = await postsAPI.getTopViewedPosts();

            console.log(response.data);

            setTopViewedPosts(response.data);

        } catch (err) {
            setError(err.message || 'Error fetching posts');

        }
    };
    const fetchCommentedPosts = async () => {
        try {

            const response = await postsAPI.getTopCommentedPosts();

            console.log(response.data);

            setTopCommentedPosts(response.data);

        } catch (err) {
            setError(err.message || 'Error fetching posts');

        }
    };


    useEffect(() => {
        fetchTopViewedPosts();
        fetchCommentedPosts();

    }, []);



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
                                {topCommentedPosts.map((post) => (
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
                                {topViewedPosts.map((post) => (
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
