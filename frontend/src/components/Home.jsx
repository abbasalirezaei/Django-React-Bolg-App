import React, { useEffect, useState } from 'react'
// import Card from './Card'
import { Link } from 'react-router-dom'
import axios from 'axios';
import Card from './Blog/Card';
export default function Home() {
    const baseurl = "http://127.0.0.1:8000/api/posts/v1";
    const [mostViewPosts, setmostViewPosts] = useState([]);
    const [mostLikedPosts, setmostLikedPosts] = useState([]);
    useEffect(() => {
        fetchMostViewPost(baseurl + '/most-viewed-posts');
        fetchPopularPost(baseurl + '/most-liked-posts');

    }, []);
    function fetchMostViewPost(url) {
        // Fetch popular posts
        axios.get(url)
            .then(response => {
                console.log(response.data);
                setmostViewPosts(response.data)
                // Handle the response and update your component's state with the popular posts data.
            })
            .catch(error => {
                // Handle errors
            });
    }

    function fetchPopularPost(url) {
        // Fetch popular posts
        axios.get(url)
            .then(response => {
                console.log(response.data);
                setmostLikedPosts(response.data)
                // Handle the response and update your component's state with the popular posts data.
            })
            .catch(error => {
                // Handle errors
            });
    }


    // function fetchData(url) {
    //     fetch(url)
    //         .then((response) => response.json())
    //         .then((data) => {

    //             setBlogs(data)
    //             setTotalResult(data.count)
    //         });
    // }
    return (
        <main className='px-16 mx-5'>

            <div>

                <div className='flex justify-between pt-3'>
                    <h4 className='font-bold  pb-2 border-b border-gray-200 uppercase'>Latest Blog</h4>
                    <Link to="/bloglist">View all Blog</Link>
                </div>
                {/* Cards go here */}

                <div className='mt-8 grid md:grid-cols-4 gap-3'>
                    {
                        mostViewPosts.map((blog, index) => {
                            return (
                                <Card key={index} blog={blog} />
                            )
                        })
                    }


                </div>

                <div className='flex justify-between pt-3'>
                    <h4 className='font-bold  pb-2 border-b border-gray-200 uppercase'>Pupular Category</h4>
                    <Link to="/categories">View all Category</Link>
                </div>
                {/* Cards go here */}
                <div className='mt-8 grid md:grid-cols-4 gap-3'>
                    
                {
                        mostLikedPosts.map((blog, index) => {
                            return (
                                <Card key={index} blog={blog} />
                            )
                        })
                    }

                </div>
                <div className='flex justify-center my-2'>
                    <div className='bg-secondary-100 text-secondary-200 btn hover:shadow-inner transform hover:scale-125 hover:bg-opacity-50'>Load More</div>


                </div>
            </div>
        </main>
    )
}
