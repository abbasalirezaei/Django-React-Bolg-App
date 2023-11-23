import React, { useEffect, useState } from 'react'
import Dashboard from './Dashboard'
import axios from 'axios';
import useAxios from '../../utils/useAxios';
import jwtDecode from 'jwt-decode'
import moment from 'jalali-moment';
import { Link } from 'react-router-dom/cjs/react-router-dom.min';
export default function AuthorBlogs() {
    const baseurl = "http://127.0.0.1:8000/api/posts/v1";
    const [blogs, setBlogs] = useState([]);
    const api = useAxios();
    const token = localStorage.getItem("authTokens")

    if (token) {
        const decode = jwtDecode(token)
        var user_id = decode.user_id
        var username = decode.username
        var full_name = decode.full_name
        var image = decode.image
        var is_author = decode.is_author

    }


    useEffect(() => {
        if (is_author) {
            fetchData(baseurl + '/blogs');
        } else {
            alert("this is user not an author ...");
        }

    }, []);


    function fetchData(url) {

        api.get(baseurl + '/authors-blogs/')
            .then(response => {
                setBlogs(response.data)
            })
            .catch(error => {
                // Handle errors
            });
    }

    const handleDelete = async (postId) => {
        try {
            // Send a DELETE request to the API to delete the task
            await api.delete(baseurl + `/author/post/${postId}`);

            // Filter out the task with the given postId
            const updatedPost = blogs.filter((item) => item.id !== postId);

            setBlogs(updatedPost);
        } catch (error) {
            // Handle the error, e.g., log it or show a user-friendly message
            console.error('An error occurred while deleting the task:', error);
        }
    };


    // const createdDatePersian = moment(blog.created_at).locale('fa').format('YYYY/MM/DD HH:mm:ss');
    return (
        <div className='grid grid-cols-3 bg-gray-300 '>

            <div className='col-span-1'
             style={{
                width: "250px",
                position: 'fixed',
                top: '50px', /* You can adjust the top position to place it where you want */
                bottom: '0', /* This keeps the sidebar fixed to the bottom of the viewport */
                maxHeight: 'calc(100% - 50px); ', /* Set a maximum height for the sidebar */
                overflowY: 'auto'
            }
            }
            >
                <Dashboard />
            </div>

            <div className='col-span-2 mt-20 ml-96'>
                <div className="antialiased font-sans bg-gray-200">
                    <div className="container mx-auto px-4 sm:px-8">
                        <div className="py-8">
                            <div>
                                <h2 className="text-2xl font-semibold leading-tight">Your Blogs</h2>
                            </div>

                            <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                                <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                                    <table className="min-w-full leading-normal">
                                        <thead>
                                            <tr>
                                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    id
                                                </th>
                                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    title
                                                </th>
                                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Image
                                                </th>

                                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    created time
                                                </th>
                                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Status
                                                </th>
                                                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {
                                                blogs.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                                <p className="text-gray-900 whitespace-no-wrap">{index + 1}</p>
                                                            </td>
                                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                                <p className="text-gray-900 whitespace-no-wrap">
                                                                    {
                                                                        item.status == true ?
                                                                            <Link to={`/blog/${item.title}/${item.id}/`}>
                                                                                {item.title}
                                                                            </Link>
                                                                            :
                                                                            item.title
                                                                    }

                                                                </p>

                                                            </td>
                                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                                <div className="flex items-center">
                                                                    <div className="flex-shrink-0 w-10 h-10">
                                                                        <img
                                                                            className="w-full h-full rounded-full"
                                                                            src={item.img}
                                                                            alt=""
                                                                        />
                                                                    </div>

                                                                </div>
                                                            </td>


                                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                                <p className="text-gray-900 whitespace-no-wrap">
                                                                    {moment(item).locale('fa').format('YYYY/MM/DD')}
                                                                </p>
                                                            </td>

                                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                                {
                                                                    item.status == true ?
                                                                        <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                                            <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>

                                                                            <span className="relative">
                                                                                Published
                                                                            </span>

                                                                        </span>
                                                                        :
                                                                        <span className="relative inline-block px-3 py-1 font-semibold text-orange-900 leading-tight">
                                                                            <span aria-hidden className="absolute inset-0 bg-orange-200 opacity-50 rounded-full"></span>
                                                                            <span className="relative">UnPublished</span>
                                                                        </span>
                                                                }

                                                            </td>
                                                            <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                                <p className="text-white whitespace-no-wrap inline-block pr-3">
                                                                    <button className="bg-red-400 rounded-md p-1"
                                                                        onClick={() => handleDelete(item.id)}
                                                                        type='submit'
                                                                    >Delete</button>
                                                                </p>
                                                                <p className="text-white whitespace-no-wrap inline-block">

                                                                    <Link
                                                                        className="bg-blue-500 rounded-md p-1"
                                                                        to={`/dashboard/author/edit-blog/${item.id}`}
                                                                    >Edit</Link>
                                                                </p>



                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                            {/* 
                                            <tr>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 w-10 h-10">
                                                            <img
                                                                className="w-full h-full rounded-full"
                                                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="text-gray-900 whitespace-no-wrap">
                                                                Blake Bowman
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">Editor</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">Jan 01, 2020</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                                                        <span aria-hidden className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
                                                        <span className="relative">Activo</span>
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 w-10 h-10">
                                                            <img
                                                                className="w-full h-full rounded-full"
                                                                src="https://images.unsplash.com/photo-1540845511934-7721dd7adec3?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="text-gray-900 whitespace-no-wrap">
                                                                Dana Moore
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">Editor</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">Jan 10, 2020</p>
                                                </td>
                                                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                                                    <span className="relative inline-block px-3 py-1 font-semibold text-orange-900 leading-tight">
                                                        <span aria-hidden className="absolute inset-0 bg-orange-200 opacity-50 rounded-full"></span>
                                                        <span className="relative">Suspended</span>
                                                    </span>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="px-5 py-5 bg-white text-sm">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 w-10 h-10">
                                                            <img
                                                                className="w-full h-full rounded-full"
                                                                src="https://images.unsplash.com/photo-1522609925277-66fea332c575?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&h=160&w=160&q=80"
                                                                alt=""
                                                            />
                                                        </div>
                                                        <div className="ml-3">
                                                            <p className="text-gray-900 whitespace-no-wrap">
                                                                Alonzo Cox
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-5 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">Admin</p>
                                                </td>
                                                <td className="px-5 py-5 bg-white text-sm">
                                                    <p className="text-gray-900 whitespace-no-wrap">Jan 18, 2020</p>
                                                </td>
                                                <td className="px-5 py-5 bg-white text-sm">
                                                    <span className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
                                                        <span aria-hidden className="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
                                                        <span className="relative">Inactive</span>
                                                    </span>
                                                </td>
                                            </tr>

                                             */}
                                        </tbody>
                                    </table>
                                    <div className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between">
                                        <span className="text-xs xs:text-sm text-gray-900">
                                            Showing 1 to 4 of 50 Entries
                                        </span>
                                        <div className="inline-flex mt-2 xs:mt-0">
                                            <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
                                                Prev
                                            </button>
                                            <button className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r">
                                                Next
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    )
}
