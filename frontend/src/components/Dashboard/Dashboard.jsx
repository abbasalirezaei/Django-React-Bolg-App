import { useState, useEffect } from 'react'
import jwtDecode from 'jwt-decode'
import useAxios from '../../utils/useAxios';
import { Link } from 'react-router-dom/cjs/react-router-dom';
export default function Dashboard() {
    const [sidenav, setSidenav] = useState(true);

    const toggleSidenav = () => {
        setSidenav(!sidenav);
    };


    const [res, setRes] = useState("")
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
        const fetchData = async () => {
            try {
                const response = await api.get("/test/")
                setRes(response.data.response_data)
            } catch (error) {
                console.log(error);
                setRes("Something went wrong")
            }
        }
        fetchData()
    }, [])


    useEffect(() => {
        const fetchPostData = async () => {
            try {
                const response = await api.post("/test/")
                setRes(response.data.response_data)
            } catch (error) {
                console.log(error);
                setRes("Something went wrong")
            }
        }
        fetchPostData()
    }, [])


    // const userUsername = localStorage.getItem('user_username');
    return (
        <body className="font-poppins antialiased"
           
        >
            <div id="view" className="" data-sidenav={sidenav}>
                <button
                    onClick={toggleSidenav}
                    className="p-2 border-2 bg-white rounded-md border-gray-200 shadow-lg text-gray-500 focus:bg-teal-500 focus:outline-none focus:text-white absolute top-0 left-0 sm:hidden"
                >
                    <svg
                        className="w-5 h-5 fill-current"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            fillRule="evenodd"
                            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </button>
                <div
                    id="sidebar"
                    className="bg-white h-screen md:block shadow-xl px-3 w-30 md:w-60 lg:w-60 overflow-x-hidden transition-transform duration-300 ease-in-out"
                    data-show={sidenav}
                    onClick={() => setSidenav(false)}
                >
                    <div className="space-y-4 md:space-y-10 mt-10">

                        <div id="profile" className="space-y-3">
                            <img
                                src="https://images.unsplash.com/photo-1628157588553-5eeea00af15c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"

                                alt="Avatar user"
                                className="w-10 md:w-16 rounded-full mx-auto"
                            />
                            <div>
                                <h2 className="font-medium text-xs md:text-sm text-center text-teal-500">
                                    {username}
                                </h2>
                                <p className="text-xs text-gray-500 text-center">
                                    {
                                        is_author ? "Author" : ""
                                    }
                                </p>

                            </div>
                        </div>

                        <div className="flex border-2 border-gray-200 rounded-md focus-within:ring-2 ring-teal-500">

                            <input
                                type="text"
                                className="w-full rounded-tl-md rounded-bl-md px-2 py-3 text-sm text-gray-600 focus:outline-none"
                                placeholder="Search"
                            />

                            <button className="rounded-tr-md rounded-br-md px-2 py-3 hidden md:block">
                                <svg
                                    className="w-4 h-4 fill-current"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                        clipRule="evenodd"
                                    ></path>
                                </svg>
                            </button>
                        </div>

                        <div id="menu" className="flex flex-col space-y-2">
                            <Link
                                to="/dashboard"
                                className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out"
                            >
                                <svg
                                    className="w-6 h-6 fill-current inline-block"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                                    ></path>
                                </svg>
                                <span className="">Dashboard</span>
                            </Link>
                            {
                                is_author &&
                                <>
                                    <Link
                                        to="/dashboard/author/blog"
                                        className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out"
                                    >
                                        <svg
                                            className="w-6 h-6 fill-current inline-block"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span className="">Blogs</span>
                                    </Link>
                                    <Link
                                        to="/dashboard/author/blog/create"
                                        className="text-sm font-medium text-gray-700 py-2 px-2 hover:bg-teal-500 hover:text-white hover:text-base rounded-md transition duration-150 ease-in-out"
                                    >
                                        <svg
                                            className="w-6 h-6 fill-current inline-block"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                fillRule="evenodd"
                                                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                                clipRule="evenodd"
                                            ></path>
                                        </svg>
                                        <span className="">Create Blogs</span>
                                    </Link>
                                </>
                            }
                           
                           


                            
                        </div>
                    </div>
                </div>
            </div>
        </body >
    )
}
