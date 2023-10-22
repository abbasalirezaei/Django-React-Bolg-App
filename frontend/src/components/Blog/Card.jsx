import React from 'react'
import { Link } from 'react-router-dom'

export default function Card(props) {
    const maxDescriptionLength = 50;
    const truncatedDescription =
        props.blog.body.length > maxDescriptionLength
        ? `${props.blog.body.substring(0, maxDescriptionLength)}...`
        : props.blog.body;
    return (
        <div className="max-w-lg mx-auto mb-36" style={{width: "300px", height: '400px'}} >
            <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5" >
                <a href="#">
                    <img className="rounded-t-lg " src={props.blog.img} alt="" />
                </a>
                <div className="p-5">
                    <a href="#">
                        <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">{props.blog.title}</h5>
                    </a>
                    <p className="font-normal text-gray-700 mb-3">
                    {truncatedDescription}
                    </p>
                    <Link className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
                    to={`/blog/${props.blog.title}/${props.blog.id}/`}>
                       
                        Read more
                    </Link>
                </div>
            </div>
        </div>

    )
}
