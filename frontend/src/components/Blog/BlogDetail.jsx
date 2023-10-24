import { Link, useParams } from "react-router-dom";

import React, { useState, useEffect, useContext } from 'react';

import axios from 'axios';
import useAxios from "../../utils/useAxios";
import jwtDecode from "jwt-decode";
import Comment from "./Comments/Comment";
// import CommentArticle from "./Comments/CommentArticle";
import moment from 'jalali-moment';
const swal = require('sweetalert2')

export default function BlogDetail() {

	const api = useAxios();
	const token = localStorage.getItem("authTokens")

	if (token) {
		const decode = jwtDecode(token)
		var user_id = decode.user_id
		var username = decode.username
		var full_name = decode.full_name
		var image = decode.image

	}

	const baseurl = "http://127.0.0.1:8000/api/posts/v1";
	const [blog, setBlog] = useState([]);
	const [relatedproducts, setRelatedProducts] = useState([]);
	const [productImages, setProductImages] = useState([]);
	const [blogTags, setBlogTags] = useState([]);

	// likes state for saving the likes list and counting ...
	const [liked, setLiked] = useState(false);
	const [likesList, setlikesList] = useState([]);
	const [likeCount, setLikeCount] = useState(blog.likes);
	// cartdata

	let { product_id } = useParams();

	useEffect(() => {
		fetchData(baseurl + '/blog/' + product_id);
		// fetchReleatedData(baseurl + '/related-products/' + product_id);.
		fetchLikes(baseurl + '/likes/' + product_id)

	}, []);




	function fetchLikes(url) {
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setlikesList(data)
				setLikeCount(data.length)
				

			});
	}
	
	useEffect(() => {
		// Assuming likesList is an array of objects representing likes
		const isLiked = likesList.some(element => element.user === user_id && element.blog_item === blog.id);
		setLiked(isLiked);
	  }, [likesList, user_id, blog]);

	const handleLikeClickLike = async () => {
		setLiked(!liked);
		
		const form = {
			"blog_item": blog.id,
			"user_id": user_id,
		}
		axios({
			method: 'post',
			url: baseurl + '/likes/create/',
			data: form,
			headers: { "Content-Type": "multipart/form-data" },
		}).then(
			function (response) {
				swal.fire({
					title: "You liked this blog, Thank you !",
					icon: "success",
					toast: true,
					timer: 1000,
					position: 'top-right',
					timerProgressBar: true,
					showConfirmButton: false,
				})
			}
		);
		const newLikeCount = liked ? likeCount - 1 : likeCount + 1;
		setLikeCount(newLikeCount);

	};
	const handleLikeClickUnLike = async () => {
		setLiked(!liked);
		
		const form = {
			"blog_item": blog.id,
			"user_id": user_id,
		}
		axios({
			method: 'post',
			url: baseurl + '/likes/create/',
			data: form,
			headers: { "Content-Type": "multipart/form-data" },
		}).then(
			function (response) {
				swal.fire({
					title: "You Unliked this blog, Thank you for Response !",
					icon: "success",
					toast: true,
					timer: 500,
					position: 'top-right',
					timerProgressBar: true,
					showConfirmButton: false,
				})

			}
		);
		const newLikeCount = liked ? likeCount - 1 : likeCount + 1;
		setLikeCount(newLikeCount);

	};

	function fetchData(url) {
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setBlog(data)
				setProductImages(data.product_imaags)
				setBlogTags(data.get_tag_list)

			});
	}
	// console.log(blog.profile.image)
	
	function fetchReleatedData(url) {
		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setRelatedProducts(data.results)
			});
	}

	// const authorName = blog.author.user.username;
	const createdDatePersian = moment(blog.created_at).locale('fa').format('YYYY/MM/DD HH:mm:ss');
	return (
		<>
			<main className="mt-10">

				<div
					className="mb-4 md:mb-0 w-full max-w-screen-md mx-auto relative"
					style={{ height: "24em" }}>
					<div
						className="absolute left-0 bottom-0 w-full h-full z-10"
						style={{
							backgroundImage: "linear-gradient(180deg,transparent,rgba(0,0,0,.7))"
						}}
					/>
					<img
						src={blog.img}
						className="absolute left-0 top-0 w-full h-full z-0 object-cover"
					/>
					<div className="p-4 absolute bottom-0 left-0 z-20">
						
						<h2 className="text-4xl font-semibold text-gray-100 leading-tight">
							{blog.title}
						</h2>
						<div className="flex mt-3">
							{blog.author && blog.author.profile_image  &&
								<img
								src={blog.author.profile_image}
								className="h-10 w-10 rounded-full mr-2 object-cover"
								/>
							}
							<div>
								<p className="font-semibold text-gray-200 text-sm">
									{" "}
									{blog.author && blog.author.user_name }
									{" "}
								</p>
								<p className="font-semibold text-gray-400 text-xs"> 
								{createdDatePersian }
								</p>
							</div>
						</div>
					</div>
				</div>

				<div className="px-4 lg:px-0 mt-12 text-gray-700 max-w-screen-md mx-auto text-lg leading-relaxed">
					<p className="pb-6">
						{blog.body}


					</p>
					<h1 >
						<span className="text-gray-700 rounded text-2xl">Tags:</span>
					</h1>
					<div className="mb-2 mt-2">
						{

							blogTags.map((tag, index) => {
								return (
									<Link
										key={index}
										to={`/blogs/${tag}`}
										className="px-3 py-1 bg-gray-400 text-gray-200 inline-flex items-center justify-center mb-2 block rounded mx-1 text-sm"
									>

										{tag}
									</Link>
								)
							})
						}

					</div>
					<div>
						<div className="flex items-center space-x-4 justify-between mb-10">

							<div className="flex flex-row space-x-1">
								{
									liked ?
										<div className="bg-red-500 shadow-xl hover:shadow-lg tra shadow- shadow-red-600 text-white cursor-pointer px-3 py-1 text-center justify-center items-center rounded-xl flex space-x-2 flex-row">
											<button onClick={handleLikeClickUnLike} title="unlike this post" >
												<svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 1024 1024" className="text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M885.9 490.3c3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-28.3-9.3-55.5-26.1-77.7 3.6-12 5.4-24.4 5.4-37 0-51.6-30.7-98.1-78.3-118.4a66.1 66.1 0 0 0-26.5-5.4H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h129.3l85.8 310.8C372.9 889 418.9 924 470.9 924c29.7 0 57.4-11.8 77.9-33.4 20.5-21.5 31-49.7 29.5-79.4l-6-122.9h239.9c12.1 0 23.9-3.2 34.3-9.3 40.4-23.5 65.5-66.1 65.5-111 0-28.3-9.3-55.5-26.1-77.7zM184 456V172h81v284h-81zm627.2 160.4H496.8l9.6 198.4c.6 11.9-4.7 23.1-14.6 30.5-6.1 4.5-13.6 6.8-21.1 6.7a44.28 44.28 0 0 1-42.2-32.3L329 459.2V172h415.4a56.85 56.85 0 0 1 33.6 51.8c0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19a56.76 56.76 0 0 1 19.6 43c0 9.7-2.3 18.9-6.9 27.3l-13.9 25.4 21.9 19a56.76 56.76 0 0 1 19.6 43c0 9.7-2.3 18.9-6.9 27.3l-14 25.5 21.9 19a56.76 56.76 0 0 1 19.6 43c0 19.1-11 37.5-28.8 48.4z" /></svg>

											</button>
											<span>{likeCount}</span>
										</div>
										:
										<div className="bg-green-500 shadow-xl hover:shadow-lg shadow-green-600 text-white cursor-pointer px-3 text-center justify-center items-center py-1 rounded-xl flex space-x-2 flex-row">
											<button onClick={handleLikeClickLike} title="like this post" >
												<svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 1024 1024" className="text-xl" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 0 0-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 0 0 471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81zm636.4-353l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 0 1 6.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0 1 42.2-32.3c7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z" /></svg>
											</button>
											<span>{likeCount}</span>
										</div>
								}


							</div>

						</div>
						<Comment  blog_id={product_id}/>

						{/* <button onClick={handleLike}>Like</button> */}

					</div>

				</div>
			</main>
		</>

	)
}
