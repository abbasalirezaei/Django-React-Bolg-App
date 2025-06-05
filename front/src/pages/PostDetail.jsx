
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Eye, User, Book, Heart } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { postsAPI } from '../api/api';
import { showSuccess, showError, showWarning } from "../utils/alert";
import CommentSection from './comments/CommentSection';

const PostDetail = () => {
    const { slug } = useParams();
    const { t } = useLanguage();
    const tokenString = localStorage.getItem("authTokens");
    const token = tokenString ? JSON.parse(tokenString) : null;

    const [currentUserEmail, setCurrentUserEmail] = useState(token?.user_email || '');

    
    const [poost, setPost] = useState({
        id: "",
        title: "",
        content: "",
        author: {
            full_name: "",
            bio: "",
            image: "",
            id: "",
        },
        authorBio: "",
        readTime: "",
        categories: [],
        tags: [],
        views: "",
        likes: "",
        image: "",
        date: "",
    });


    // useEffect برای گرفتن دیتیل پست (بدون کامنت)
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await postsAPI.getPostDetail(slug);
                setPost({
                    id: response.data.id,
                    title: response.data.title,
                    content: response.data.description,
                    author: response.data.author,
                    authorBio: response.data.author.bio,
                    readTime: response.data.reading_time,
                    categories: response.data.categories.map((category) => category),
                    tags: response.data.tags.map((tag) => tag.name),
                    views: response.data.views,
                    likes: response.data.likes,
                    image: response.data.img,
                    date: new Date(response.data.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                    }),
                });
            } catch (error) {
                console.error("Error fetching post:", error);
            }
        };
        fetchPost();
    }, [slug]);

    // useEffect جداگانه برای گرفتن کامنت‌ها

    const [liked, setLiked] = React.useState(false);

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Hero Image */}
                    <div className="aspect-video mb-8 rounded-2xl overflow-hidden">
                        <img
                            src={`${poost.image}?auto=format&fit=crop&w=1200&q=80`}
                            alt={poost.title}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    {/* Article Header */}
                    <div className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-100">
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                            {poost.categories.map((category) => (
                                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-medium" key={category.id}>
                                    {category.name}
                                </span>
                            ))}
                            <div className="flex items-center space-x-1">
                                <Calendar className="w-4 h-4" />
                                <span>{poost.date}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <Book className="w-4 h-4" />
                                <span>{poost.readTime} minutes to read </span>
                            </div>
                        </div>

                        <h1 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                            {poost.title}
                        </h1>

                        {/* Author Info */}
                        <div className="flex items-center justify-between border-t border-gray-100 pt-6">
                            <div className="flex items-center space-x-4">
                                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                                    <img
                                        src={`${poost.author.image}?auto=format&fit=crop&w=100&q=80`}
                                        alt={poost.author.full_name || ''}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div>
                                    <Link to={`/author/${poost.author.id}`} className="font-semibold text-gray-900 hover:text-blue-600">
                                        {poost.author.full_name}
                                    </Link>
                                    <p className="text-sm text-gray-600">{poost.author.bio}</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{poost.views}</span>
                                </div>
                                <button
                                    onClick={() => setLiked(!liked)}
                                    className={`flex items-center space-x-1 transition-colors ${liked ? 'text-red-500' : 'hover:text-red-500'
                                        }`}
                                >
                                    <Heart className={`w-4 h-4 ${liked ? 'fill-current' : ''}`} />
                                    <span>{poost.likes + (liked ? 1 : 0)}</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <div className="bg-white rounded-xl p-8 mb-8 shadow-sm border border-gray-100">
                        <div
                            className="prose prose-lg max-w-none"
                            dangerouslySetInnerHTML={{ __html: poost.content }}
                        />

                        {/* Tags */}
                        <div className="mt-8 pt-8 border-t border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('tags')}</h3>
                            <div className="flex flex-wrap gap-2">
                                {poost.tags.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Comments Section */}
                    <CommentSection slug={slug} currentUserEmail={currentUserEmail} />
                </div>
            </div>
        </div>
    );
};

export default PostDetail;
