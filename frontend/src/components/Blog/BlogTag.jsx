import React, { useEffect, useState } from 'react'
import Card from './Card'
import { Link } from 'react-router-dom'
import { useParams } from "react-router-dom";
export default function BlogTag() {
    const baseurl="http://127.0.0.1:8000/api/posts/v1";
	const [blogs,setBlogs]=useState([]);
	const [totalResult,setTotalResult]=useState(0);

	
	let { tag } = useParams();

	useEffect(() => {
		fetchData(baseurl+'/blogs/'+tag);

  	},[]);

  	function fetchData(url){
  		fetch(url)
		.then((response)=>response.json())
		.then((data)=>{
			console.log(data);
			setBlogs(data)
			// setTotalResult(data.count)
			
			});
  	}

  	// var links=[];
	// var limit=4;
	// let totalPages = totalResult / limit;

	// if (totalResult % limit !== 0) {
	//   totalPages = Math.floor(totalPages) + 1;
	// }
  	

  	// for (let i = 1; i <=totalPages; i++) {
  	// 	if(totalPages !=1){
  	// 		links.push(<li className="page-item"><Link onClick={()=>changeUrl(baseurl+`/products/?page=${i}`)} to={`/products/?page=${i}`} className="page-link" href="#">{i}</Link></li>)
 
  	// 	}}
	// function changeUrl(baseUrl){
	// 	// console.log(baseUrl)
  	// 	fetchData(baseUrl)
  	// }
  return (
    <main className='px-16 mx-5'>

            <div className=''>

                <div className='flex justify-between pt-3'>
                    <h4 className='font-bold  pb-2 border-b border-gray-200 uppercase'>Tag: {tag}</h4>
                    {/* <Link to="/BlogTag">View all Blog</Link> */}
                </div>
                {/* Cards go here */}

                <div className='mt-8 grid md:grid-cols-4 gap-3 '>
                  
                  
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
