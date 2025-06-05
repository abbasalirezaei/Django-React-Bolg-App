import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '../../contexts/LanguageContext';
import { postsAPI } from '../../api/api';
import { showSuccess, showError } from '../../utils/alert';
import { MessageCircle, Eye, Reply, Trash2, Edit2 } from 'lucide-react';

const CommentItem = ({ comment, slug, currentUserEmail, onNewReply, onDelete, onEdit }) => {
    const { t } = useLanguage();
    const [replying, setReplying] = useState(false);
    const [replyText, setReplyText] = useState('');
    const [editing, setEditing] = useState(false); // Question: Is a boolean state sufficient to toggle edit mode, similar to replying?
    const [editText, setEditText] = useState(comment.content); // Question: Should the initial editText be set to comment.content?

    const handleReplySubmit = async () => {
        if (!replyText.trim()) return;

        const replyData = {
            content: replyText,
            parent: comment.id
        };

        try {
            const response = await postsAPI.createComment(slug, replyData);
            if (response.status === 201) {
                onNewReply(response.data);
                showSuccess('Reply posted successfully!');
                setReplying(false);
                setReplyText('');
            }
        } catch (err) {
            if (err.response?.data?.content) {
                showError("Sorry!", err.response.data.content);
            } else {
                showError("Oops!", "Network or server error.");
            }
        }
    };

    const handleEditSubmit = async () => {
        if (!editText.trim()) return; // Question: Should we prevent empty edits, similar to replies?

        const commentData = {
            content: editText
        };

        try {
            const response = await postsAPI.updateComment(slug, comment.id, commentData);
            if (response.status === 200) { // Question: Does the updateComment API return a 200 status, or something else?
                onEdit(comment.id, response.data); // Question: Is passing the updated comment via a callback like onEdit appropriate?
                showSuccess('Comment updated successfully!');
                setEditing(false);
            }
        } catch (err) {
            if (err.response?.data?.content) {
                showError("Sorry!", err.response.data.content);
            } else {
                showError("Oops!", "Network or server error.");
            }
        }
    };

    return (
        <div className="flex space-x-4 mb-4">
            <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                <img
                    src={comment.user.image || '/default-avatar.png'}
                    alt={comment.user.full_name}
                />
            </div>
            <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-semibold">{comment.user.full_name}</h4>
                    <span className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleString()}</span>
                </div>
                {editing ? (
                    <div className="mt-4">
                        <textarea
                            className="w-full border rounded p-2"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            rows={2}
                            placeholder="Edit your comment..."
                        />
                        <div className="flex justify-end mt-2 space-x-2">
                            <Button size="sm" onClick={handleEditSubmit}>Save</Button>
                            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>Cancel</Button>
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-700">{comment.content}</p>
                )}

                <div className="flex space-x-4 mt-2 text-sm text-blue-600">
                    <Button size="sm" variant="ghost" onClick={() => setReplying(!replying)}>
                        <Reply className="w-4 h-4 mr-1" />
                        Reply
                    </Button>
                    {comment.user.email === currentUserEmail && (
                        <>
                            <Button size="sm" variant="ghost" onClick={() => setEditing(true)}>
                                <Edit2 className="w-4 h-4 mr-1" />
                                Edit
                            </Button>
                            <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700"
                                onClick={() => onDelete(slug, comment.id)}>
                                <Trash2 className="w-4 h-4 mr-1" />
                                Delete
                            </Button>
                        </>
                    )}
                </div>

                {replying && (
                    <div className="mt-4">
                        <textarea
                            className="w-full border rounded p-2"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            rows={2}
                            placeholder="Write a reply..."
                        />
                        <div className="flex justify-end mt-2">
                            <Button size="sm" onClick={handleReplySubmit}>Send</Button>
                        </div>
                    </div>
                )}

                {/* Nested Replies */}
                {comment.replies?.length > 0 && (
                    <div className="pl-6 mt-4 border-l border-gray-200">
                        {comment.replies.map(reply => (
                            <CommentItem
                                key={reply.id}
                                comment={reply}
                                slug={slug}
                                currentUserEmail={currentUserEmail}
                                onNewReply={onNewReply}
                                onDelete={onDelete}
                                onEdit={onEdit}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CommentItem;