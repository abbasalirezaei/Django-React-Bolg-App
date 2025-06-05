
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { MessageCircle, Eye, Reply, Trash2 } from 'lucide-react';

const CommentsManagement = () => {
  const { t } = useLanguage();
  const [comments, setComments] = useState([
    {
      id: 1,
      postTitle: "Building Modern Web Applications with React and TypeScript",
      author: "John Doe",
      content: "Great article! Very helpful for understanding React with TypeScript.",
      date: "March 16, 2024",
      status: "approved"
    },
    {
      id: 2,
      postTitle: "Advanced CSS Techniques for Modern Developers",
      author: "Jane Smith",
      content: "I love the CSS Grid examples. Could you add more about Flexbox?",
      date: "March 14, 2024",
      status: "pending"
    },
    {
      id: 3,
      postTitle: "The Future of Web Development: Trends for 2024",
      author: "Mike Johnson",
      content: "Interesting predictions! I'm curious about the AI integration part.",
      date: "March 12, 2024",
      status: "approved"
    }
  ]);

  const handleDelete = (commentId) => {
    setComments(comments.filter(comment => comment.id !== commentId));
  };

  const handleApprove = (commentId) => {
    setComments(comments.map(comment =>
      comment.id === commentId
        ? { ...comment, status: 'approved' }
        : comment
    ));
  };

  const pendingComments = comments.filter(comment => comment.status === 'pending');
  const approvedComments = comments.filter(comment => comment.status === 'approved');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Comments Management</h2>

        {/* Pending Comments */}
        {pendingComments.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2 text-yellow-600" />
              Pending Approval ({pendingComments.length})
            </h3>
            <div className="space-y-4">
              {pendingComments.map((comment) => (
                <div key={comment.id} className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium text-gray-900">{comment.author}</span>
                        <span className="text-sm text-gray-500">•</span>
                        <span className="text-sm text-gray-500">{comment.date}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        On: <span className="font-medium">{comment.postTitle}</span>
                      </p>
                      <p className="text-gray-800">{comment.content}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 mt-4">
                    <Button size="sm" onClick={() => handleApprove(comment.id)}>
                      Approve
                    </Button>
                    <Button size="sm" variant="ghost">
                      <Reply className="w-4 h-4 mr-1" />
                      Reply
                    </Button>
                    <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(comment.id)}>
                      <Trash2 className="w-4 h-4 mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Approved Comments */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <MessageCircle className="w-5 h-5 mr-2 text-green-600" />
            Approved Comments ({approvedComments.length})
          </h3>
          <div className="space-y-4">
            {approvedComments.map((comment) => (
              <div key={comment.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="font-medium text-gray-900">{comment.author}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{comment.date}</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      On: <span className="font-medium">{comment.postTitle}</span>
                    </p>
                    <p className="text-gray-800">{comment.content}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 mt-4">
                  <Button size="sm" variant="ghost">
                    <Reply className="w-4 h-4 mr-1" />
                    Reply
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-600 hover:text-red-700" onClick={() => handleDelete(comment.id)}>
                    <Trash2 className="w-4 h-4 mr-1" />
                    Delete
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentsManagement;
