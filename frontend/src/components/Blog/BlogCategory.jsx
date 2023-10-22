
import {  Link } from 'react-router-dom';

import React, { useState,useEffect } from 'react';
import { useParams } from "react-router-dom";
import Card from './Card';

export default function BlogCategory() {
    const baseurl="http://127.0.0.1:8000/api/posts/v1";
	const [blogs,setBlogs]=useState([]);
	const [totalResult,setTotalResult]=useState(0);
	const [catTitle,setCatTitle]=useState("");

	let { category_slug,category_id } = useParams();
	

	useEffect(() => {
		fetchData(baseurl+'/blogs/?category='+category_id);

  	},[]);

  	function fetchData(url){
  		fetch(url)
		.then((response)=>response.json())
		.then((data)=>{
			console.log(data)
			setBlogs(data)
			setTotalResult(data.count)
			
			});
  	}

  	// var links=[];
  	// var limit=1;
  	// var totalLinks=totalResult/limit;
  	// for (let i = 1; i <=totalLinks; i++) {
  	// 	links.push(<li className="page-item"><Link onClick={
  	// 		()=>changeUrl(baseurl+`/products/?category=${category_id}&page=${i}`)} to={`/category/${category_slug}/${category_id}/?page=${i}`
  	// 	} className="page-link" href="#">{i}</Link></li>)
  	// }
	// function changeUrl(baseUrl){
		
  	// 	fetchData(baseUrl)
  	// }

  return (
    <main className='px-16 mx-5'>

    <div className=''>

        <div className='flex justify-between pt-3'>
            <h4 className='font-bold  pb-2 border-b border-gray-200 uppercase'>{category_slug}</h4>
            {/* <Link to="/bloglist">View all Blog</Link> */}
        </div>
        {/* Cards go here */}

		<div className='mt-8 grid md:grid-cols-4 gap-2 '>
          
          
        {
            blogs.map((blog,index)=>{
                return(
                    <Card key={index} blog={blog} />
                )
            })
        }

            
            

        </div>

    </div>
</main>
  )
}
