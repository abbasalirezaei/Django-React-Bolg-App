import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useLanguage } from '../../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { postsAPI } from '../../api/api';
import { showSuccess, showError, showWarning } from "../../utils/alert";
import CommentItem from './CommentItem';
import AuthContext from '../../contexts/authContext';

const CommentSection = () => {
    const tokenString = localStorage.getItem("authTokens");
    const token = tokenString ? JSON.parse(tokenString) : null;
    const [currentUserEmail, setCurrentUserEmail] = useState(token?.user_email || ''); 
    const { t } = useLanguage();

    const topCommentRef = useRef(null);
    const [newComment, setNewComment] = useState('');
    const { slug } = useParams();
    const [comments, setComments] = useState([]);

    // Fetch comments
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await postsAPI.getComments(slug);
                setComments(response.data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [slug]);

    // Handle posting new comment (parent = null)
    const handleSubmitComment = async (e) => {
        e.preventDefault();

        if (newComment.trim()) {
            const commentData = {
                content: newComment,
                parent: null,
            };

            try {
                const response = await postsAPI.createComment(slug, commentData);
                if (response.status === 201) {
                    setComments(prev => [response.data, ...prev]);
                    showSuccess('Thanks!', "Comment posted successfully!");
                    setNewComment('');
                    setTimeout(() => {
                        topCommentRef.current?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                }
            } catch (error) {
                if (error.response?.data?.content) {
                    showWarning("Sorry!", error.response.data.content);
                } else {
                    showError("Oops!", "Network or server error.");
                }
            }
        }
    };

    // Build comment tree (restored from original code)
    const buildCommentTree = (flatComments) => {
        const map = {};
        const roots = [];

        flatComments.forEach(c => {
            map[c.id] = { ...c, replies: [] };
        });

        flatComments.forEach(c => {
            if (c.parent) {
                map[c.parent]?.replies.push(map[c.id]);
            } else {
                roots.push(map[c.id]);
            }
        });

        return roots;
    };

    // Handle new reply
    const handleNewReply = (reply) => {
        setComments(prev => [reply, ...prev]);
    };

    // Handle edit comment
    const handleEdit = (commentId, updatedComment) => {
        setComments(prev => prev.map(c => c.id === commentId ? updatedComment : c)); // Question: Does this correctly update the comment in the flat array, and will buildCommentTree handle the rest?
    };

    // Handle delete comment
    const handleDelete = async (slug, id) => {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;

        try {
            await postsAPI.deleteComment(slug, id);
            setComments(prev => prev.filter(c => c.id !== id));
            showSuccess("Comment deleted successfully");
        } catch (error) {
            showError("Error deleting comment", error.message);
        }
    };

    const commentTree = buildCommentTree(comments);

    return (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                {t('comments')} ({comments.length})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmitComment} className="mb-8">
                <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment..."
                    className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    rows={4}
                />
                <div className="flex justify-end mt-4">
                    <Button type="submit" disabled={!newComment.trim()}>
                        Post Comment
                    </Button>
                </div>
            </form>

            {/* Comments Tree */}
            <div ref={topCommentRef} className="space-y-6">
                {commentTree.map(comment => (
                    <CommentItem
                        key={comment.id}
                        comment={comment}
                        slug={slug}
                        currentUserEmail={currentUserEmail}
                        onNewReply={handleNewReply}
                        onDelete={handleDelete}
                        onEdit={handleEdit}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentSection;