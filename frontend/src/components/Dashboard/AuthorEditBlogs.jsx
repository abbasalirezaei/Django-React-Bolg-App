import React, { useEffect, useState } from 'react';
import Dashboard from './Dashboard';
import useAxios from '../../utils/useAxios';
import jwtDecode from 'jwt-decode'
import { useParams } from 'react-router-dom';
function AuthorEditBlogs() {
    const { postId } = useParams();
    const baseurl = "http://127.0.0.1:8000/api/posts/v1";
    const api = useAxios();
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [categoriesData, setCategoriesData] = useState([]);
    const [blogStatus, setBlogStatus] = useState(false)
    const [IsImageSelected, setIsImageSelected] = useState(false)

    //  getting the token
    const token = localStorage.getItem("authTokens")

    const [blogData, setBlogData] = useState({
        "title": "",
        "slug": "",
        "body": "",
        "tags": "",
        "categories": [],
        "img": "",
    })


    if (token) {
        const decode = jwtDecode(token)
        var is_author = decode.is_author

    }

    useEffect(() => {
        if (is_author) {
            fetchData(baseurl + '/blogs');
        } else {
            alert("this is user not an author ...");
        }

    }, []);


    // fetch the default value and showing to user
    function fetchData(url) {

        api.get(baseurl + '/author/post/' + postId)
            .then(response => {
                console.log(response);
                // setBlogs(response.data)
                setBlogData({
                    "title": response.data.title,
                    "slug": response.data.slug,
                    "body": response.data.body,
                    "tags": response.data.tags,
                    "categories": [],
                    "img": response.data.img,
                })
                setCategoriesData(response.data.categories)
                setBlogStatus(response.data.status)
                // console.log(response.data.status);
            })
            .catch(error => {
                // Handle errors
            });
    }

    const handelInputChange = (event) => {
        const { name, value } = event.target;
        setBlogData((blogData) => ({
            ...blogData,
            [name]: value
        }));
    };
    const handleStatusChange = () => {
        setBlogStatus(!blogStatus); // Toggle the status
    };

    const handleFileChange = (event) => {
        setBlogData((blogData) => ({
            ...blogData,
            ['img']: event.target.files[0] // Match the key used in FormData
        }));
        setIsImageSelected(true)
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const form = {
            'title': blogData.title,
            'slug': blogData.slug,
            'body': blogData.body,
            'tags': blogData.tags,
            'categories': blogData.categories,
            'status': document.getElementById('status2').checked

        }
        if (IsImageSelected) {
            form.img= blogData.img;
        }

        api.patch(baseurl + '/author/post/' + postId + '/', form, {
            headers: { "Content-Type": "multipart/form-data" },
        })
            .then(response => {
                console.log('Post created:', response.data);
            })
            .catch(error => {
                console.error('Error creating post:', error);
            });

      
    };

    return (
        <div className='grid grid-cols-3 bg-gray-300'>
            <div className='col-span-1'>
                <Dashboard />
            </div>
            <div className='col-span-2 mr-24 mt-16'>
                <div className="lg:ms-auto mx-auto text-center">
                    <div className="py-16 px-7 rounded-md bg-white">
                        <form action="" onSubmit={handleSubmit}>
                            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">


                                <div className="md:col-span-2">
                                    <label htmlFor="fname" className="float-left inline font-normal text-gray-400 text-lg">
                                        Title:
                                    </label>
                                    <input
                                        type="text"
                                        id="fname"
                                        name="title"
                                        placeholder="Title"
                                        value={blogData.title}
                                        onChange={handelInputChange}
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="slug" className="float-left inline font-normal text-gray-400 text-lg">
                                        Slug:
                                    </label>
                                    <input
                                        type="text"
                                        id="slug"
                                        name="slug"
                                        placeholder="Slug"
                                        value={blogData.slug}
                                        onChange={handelInputChange}
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="categories" className="float-left block font-normal text-gray-400 text-lg">
                                        Categories:
                                    </label>
                                    <select
                                        id="subject"
                                        name="categories"
                                        onChange={handelInputChange}

                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"
                                    >
                                        <option value="" disabled selected>
                                            Choose category:
                                        </option>
                                        {categoriesData?.map((category) => {
                                            return (

                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>

                                            )
                                        })}
                                    </select>
                                </div>


                                <div className="md:col-span-2">
                                    <label htmlFor="file" className="float-left block font-normal text-gray-400 text-lg">
                                        Image:
                                    </label>
                                    <img src={blogData.img} alt="Blog imges" className='w-40 mt-10 border-solid border-2 border-gray-500 shadow-lg hover:shadow-3xl shadow-red-300' />
                                    <input
                                        type="file"
                                        name='img' // Match the key in FormData
                                        id="ProfileImage"
                                        aria-describedby="emailHelp"
                                        onChange={handleFileChange}
                                        className="peer block w-full appearance-none border-none bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0"
                                    />

                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="status2" className="float-left block font-normal text-gray-400 text-lg">
                                        Status:
                                    </label>
                                    <input
                                        type="checkbox"
                                        id="status2"
                                        name="file"
                                        checked={blogStatus}
                                        onChange={handleStatusChange}
                                        className='transform scale-150'
                                    />
                                </div>


                                <div className="md:col-span-2">
                                    <label htmlFor="subject" className="float-left block font-normal text-gray-400 text-lg">
                                        Body:
                                    </label>
                                    <textarea
                                        name="body"
                                        rows="5"
                                        cols=""
                                        value={blogData.body}
                                        onChange={handelInputChange}
                                        placeholder="Body..."
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"
                                    ></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <label htmlFor="tags" className="float-left block font-normal text-gray-400 text-lg">
                                        Tags:
                                    </label>
                                    <textarea
                                        id='tags'
                                        name="tags"
                                        rows="5"
                                        cols=""
                                        value={blogData.tags}
                                        onChange={handelInputChange}
                                        placeholder="Tags, please separate with ,"
                                        className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:border-blue-700"
                                    ></textarea>
                                </div>
                                <div className="md:col-span-2">
                                    <button className="py-3 text-base font-medium rounded text-white bg-blue-800 w-full hover:bg-blue-700 transition duration-300">
                                        Valider
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AuthorEditBlogs;
