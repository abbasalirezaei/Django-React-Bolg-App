import React, { useEffect, useState } from 'react'

import { useContext } from 'react'
import jwt_decode from "jwt-decode"
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'
export default function Nav() {
    const { user, logoutUser } = useContext(AuthContext)
    const token = localStorage.getItem("authTokens")

    if (token) {
        const decoded = jwt_decode(token)
        var user_id = decoded.user_id
    }


    return (
        <nav class="flex items-center justify-between flex-wrap bg-gray-500 p-4 pl-16">
            <div class="flex items-center flex-shrink-0 text-white mr-6">
                <svg class="fill-current h-8 w-8 mr-2" width="54" height="54" viewBox="0 0 54 54" xmlns="http://www.w3.org/2000/svg"><path d="M13.5 22.1c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05zM0 38.3c1.8-7.2 6.3-10.8 13.5-10.8 10.8 0 12.15 8.1 17.55 9.45 3.6.9 6.75-.45 9.45-4.05-1.8 7.2-6.3 10.8-13.5 10.8-10.8 0-12.15-8.1-17.55-9.45-3.6-.9-6.75.45-9.45 4.05z" /></svg>
                <span class="font-semibold text-xl tracking-tight">Tailwind CSS</span>
            </div>
            <div class="block lg:hidden">
                <button class="flex items-center px-3 py-2 border rounded text-teal-200 border-teal-400 hover:text-white hover:border-white">
                    <svg class="fill-current h-3 w-3" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><title>Menu</title><path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" /></svg>
                </button>
            </div>
            <div class="w-full block flex-grow lg:flex lg:items-center lg:w-auto">
                <div class="text-sm lg:flex-grow">
                    <Link to="/" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                        Home
                    </Link>
                    <Link to="/about" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white mr-4">
                        About
                    </Link>
                    <Link to="/contact" class="block mt-4 lg:inline-block lg:mt-0 text-teal-200 hover:text-white">
                        Contact
                    </Link>

                </div>
                <div>


                    {token === null &&
                        <>
                            <Link to="/login" class="block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white">
                                Sign In
                            </Link>
                            <Link to="/register" class="pl-3  pr-16 block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white">
                                Sign Up
                            </Link>

                        </>
                    }
                    {token !== null &&
                        <>

                            <Link to="/dashboard" class="pl-3 pr-4 block mt-4 lg:inline-block lg:mt-0 text-white hover:text-white">
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
