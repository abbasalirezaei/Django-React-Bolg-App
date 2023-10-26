import React, { useEffect, useState } from 'react'
import CommentArticle from './CommentArticle';
import CommentReply from './CommentReply';
import axios from "axios";
import useAxios from '../../../utils/useAxios';
import jwtDecode from "jwt-decode";
export default function Comment(props) {
    const baseurl = "http://127.0.0.1:8000/api/posts/v1";
    const [comments, setComments] = useState([]);
    const [commentText, setcommentText] = useState("")

    const api = useAxios();
    const token = localStorage.getItem("authTokens")

    if (token) {
        const decode = jwtDecode(token)
        var user_id = decode.user_id
        var username = decode.username
        var full_name = decode.full_name
        var image = decode.image

    }
    useEffect(() => {
        fetchComments(baseurl + "/" + props.blog_id + '/comments/');


    }, []);

    function fetchComments(url) {
        fetch(url)
            .then((response) => response.json())
            .then((data) => {
                // console.log(data);
                setComments(data)

            });
    }
    // console.log(commentText);

    const handleSubmit = (event) => {
        event.preventDefault();
        const form = {
            "blog_item": props.blog_id,
            'blog_body': commentText,
            'parent': null,
            "user_id": user_id,
        }
        // console.log(form);

        axios({
            method: 'post',
            url: baseurl + '/comment/create/',
            data: form,
            headers: { "Content-Type": "multipart/form-data" },
        }).then(
            function (response) {
                setComments(
                    [...comments, response.data]
                )
            }
        );
        setcommentText("")
        // window.location.reload();

        // Reset form fields
    };
    var sum=0;
    for (let index = 0; index < comments.length  ; index++) {
        const element = comments[index];
        sum +=element.children_comments.length;
        
    }
    return (
        <div>
            <section className="bg-gray-200 dark:bg-gray-200 rounded-sm py-8 lg:py-16 antialiased">
                <div className="max-w-2xl mx-auto px-4">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg lg:text-2xl font-bold text-gray-900 dark:text-dark">Discussion ({comments.length + sum })</h2>
                    </div>

                    <form className="mb-6" onSubmit={handleSubmit}>
                        <div className="py-2 px-4 mb-4 bg-white rounded-lg rounded-t-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                            <label for="comment" className="sr-only">Your comment</label>
                            <textarea id="comment" rows="6"
                                className="px-0 w-full text-sm text-gray-300 border-0 focus:ring-0 focus:outline-none dark:text-white dark:placeholder-gray-400 dark:bg-gray-800"
                                placeholder="Write a comment..." required
                                onChange={(e) => setcommentText(e.target.value)}
                                value={commentText}
                            ></textarea>
                        </div>
                        <button type="submit"
                            className="inline-flex items-center py-2.5 px-4 text-xs font-medium text-center text-white bg-red-400 rounded-lg focus:ring-4 focus:ring-primary-200 dark:focus:ring-primary-900 hover:bg-gray-500">
                            Post comment
                        </button>
                    </form>


                    {
                        comments.map((item, index) => {
                            return <CommentArticle comment={item} key={index} blog_id={props.blog_id}
                                comments={comments}
                                setComments={setComments}
                            />
                        })
                    }


                </div>
            </section>

        </div>
    )
}

