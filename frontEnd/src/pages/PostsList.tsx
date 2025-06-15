import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import PostCard from '../components/PostCard';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { postsAPI } from '../api/api';


const authorsMap = {
    1: 'Alex Thompson',
    2: 'Sarah Johnson',
    3: 'Michael Chen',
    4: 'Emily Rodriguez',
    5: 'David Kim',
    6: 'Lisa Park',
    7: 'John Smith',
    8: 'Maria Garcia',
};

const categoriesMap = {
    1: 'Technology',
    2: 'Design',
    3: 'Programming',
    4: 'Backend',
};

const PostsList = () => {
    const { t } = useLanguage();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('latest');
    const postsPerPage = 3;
    // Transform API data into desired format and retain only necessary fields

    const mapPostData = (post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.short_description,
        author: authorsMap[post.author] || 'Unknown',
        date: new Date(post.created_at).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }),
        category:
            post.categories.length > 0
                ? categoriesMap[post.categories[0]] || 'Uncategorized'
                : 'Uncategorized',
        readTime: post.reading_time ? `${post.reading_time} min read` : '',
        views: post.views,
        likes: post.likes,
        image: post.img || null,
    });

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await postsAPI.getPosts();
        
            const mappedPosts = response.data.map(mapPostData);
            setPosts(mappedPosts);
            setLoading(false);
        } catch (err) {
            setError(err.message || 'Error fetching posts');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

  
    const filteredPosts = posts.filter(
        (post) => selectedCategory === 'all' || post.category === selectedCategory
    );


    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (sortBy === 'popular') {
            return b.views - a.views;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const totalPages = Math.ceil(sortedPosts.length / postsPerPage);
    const startIndex = (currentPage - 1) * postsPerPage;
    const currentPosts = sortedPosts.slice(startIndex, startIndex + postsPerPage);

    const categories = ['all', 'Technology', 'Design', 'Programming', 'Backend'];

    if (loading) return <div>Loading posts...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('allPosts')}</h1>
                        <p className="text-lg text-gray-600">
                            Discover amazing stories, insights, and knowledge from our community
                        </p>
                    </div>

                    {/* Filters */}
{/*                 
                    <div className="flex flex-col sm:flex-row gap-4 mb-8">
                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-gray-700">Category:</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                {categories.map((category) => (
                                    <option key={category} value={category}>
                                        {category === 'all' ? t('all') : category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center space-x-4">
                            <label className="text-sm font-medium text-gray-700">Sort by:</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="latest">{t('latestPosts')}</option>
                                <option value="popular">{t('popularPosts')}</option>
                            </select>
                        </div>
                    </div> */}

                    {/* Posts Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                        {currentPosts.map((post) => (
                            <PostCard key={post.id} post={post} />
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <Pagination className="mb-8">
                            <PaginationContent>
                                <PaginationItem>
                                    <PaginationPrevious
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage > 1) setCurrentPage(currentPage - 1);
                                        }}
                                        className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>

                                {[...Array(totalPages)].map((_, i) => (
                                    <PaginationItem key={i + 1}>
                                        <PaginationLink
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setCurrentPage(i + 1);
                                            }}
                                            isActive={currentPage === i + 1}
                                        >
                                            {i + 1}
                                        </PaginationLink>
                                    </PaginationItem>
                                ))}

                                <PaginationItem>
                                    <PaginationNext
                                        href="#"
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                                        }}
                                        className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                                    />
                                </PaginationItem>
                            </PaginationContent>
                        </Pagination>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PostsList;
