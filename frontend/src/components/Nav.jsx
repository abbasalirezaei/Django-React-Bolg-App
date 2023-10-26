import React, { useEffect, useState } from 'react'

import { useContext } from 'react'
import jwt_decode from "jwt-decode"
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'
export default function Nav() {
    const baseurl = "http://127.0.0.1:8000/api/v1";
    const { user, logoutUser } = useContext(AuthContext)
    const token = localStorage.getItem("authTokens")
    const [searchText, setSearchText] = useState("");
    if (token) {
        const decoded = jwt_decode(token)
        var user_id = decoded.user_id
    }
    // useEffect(() => {
    //     fetchData(baseurl + `/blogs?title=${searchText}`);

    // }, []);

    // function fetchData(url) {
    //     fetch(url)
    //         .then((response) => response.json())
    //         .then((data) => {

    //             setBlogs(data)
    //             setTotalResult(data.count)
    //         });
    // }

    return (
        <nav className="flex items-center justify-between flex-wrap bg-gray-500 p-4 pl-16">
            <div className="flex items-center flex-shrink-0 text-white mr-6">
                <svg className="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" /></svg>
                <span className="font-semibold text-xl tracking-tight">Tailwind CSS</span>
            </div>
            <div className="block lg:hidden">
                <button className="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
                    <svg className="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                </button>
            </div>
            <div className="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div className="text-sm lg:flex-grow">
                    <Link to="/" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                        Home
                    </Link>
                    <Link to="/about" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                        About
                    </Link>
                    <Link to="/contact" className="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
                        Contact
                    </Link>

                </div>
                <div className='max-w-md mx-auto text-sm h-10'>
                    <div className="relative flex items-center w-full h-12 rounded-lg focus-within:shadow-lg bg-white overflow-hidden" >

                        <input
                            className="peer h-full w-full outline-none text-sm text-gray-700 pr-2 pl-2"
                            type="text"
                            id="search"
                            value={searchText}
                            onChange={(event) => setSearchText(event.target.value)}
                            placeholder="Search something.." />
                        <div className="grid place-items-center h-full w-12 text-gray-500 text-sm">
                            <button>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </button>
                        </div>

                    </div>
                </div>
                <div>


                    {token === null &&
                        <>
                            <Link to="/login" className="block mt-4 ml-4 lg:inline-block lg:mt-0 text-white hover:text-white">
                                Login
                            </Link>
                            <Link to="/register" className="pl-3  pr-1 block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white">
                                Register
                            </Link>
                            <Link to="/author/register" className="pl-2  pr-16 block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white">
                                Author Register
                            </Link>

                        </>
                    }
                    {token !== null &&
                        <>

                            <Link to="/dashboard" className="pl-3 pr-4 block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white">
                                Dashboard
                            </Link>

                            <a className="pl-3  pr-16 block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white" onClick={logoutUser} style={{ cursor: "pointer" }}>Logout</a>

                        </>
                    }

                </div>
            </div>
        </nav>
    )
}
