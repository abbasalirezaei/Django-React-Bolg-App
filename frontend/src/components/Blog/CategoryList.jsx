import React, { useEffect, useState } from 'react'
import Card from './Card'
import { Link } from 'react-router-dom'
export default function CategoryList() {

    const baseurl="http://127.0.0.1:8000/api/posts/v1";
	const [categories,setCategories]=useState([]);
	const [totalResult,setTotalResult]=useState(0);

	

	useEffect(() => {
		fetchData(baseurl+'/categories/');

  	},[]);

  	function fetchData(url){
  		fetch(url)
		.then((response)=>response.json())
		.then((data)=>{
            console.log(data)
			setCategories(data)
			setTotalResult(data.count)
			});
  	}
  	// function changeUrl(baseUrl){
	// 	console.log(baseUrl)
  	// 	fetchData(baseUrl)
  	// }
  	// var links=[];
	// var limit=4;
	// let totalPages = totalResult / limit;
	
	// if (totalResult % limit !== 0) {
	//   totalPages = Math.floor(totalPages) + 1;
	// }
  	// for (let i = 1; i <=totalPages; i++) {
  	// 	links.push(<li className="page-item"><Link onClick={
  	// 		()=>changeUrl(baseurl+`/categories/?page=${i}`)} to={`/categories/?page=${i}`
  	// 	} className="page-link" href="#">{i}</Link></li>)

  	// }
  return (
    <main className='px-16 mx-5'>

    <div className=''>

        <div className='flex justify-between pt-3'>
            <h4 className='font-bold  pb-2 border-b border-gray-200 uppercase'>Category List</h4>
            {/* <Link to="/bloglist">View all Blog</Link> */}
        </div>
        {/* Cards go here */}

        <div className='mt-8 grid md:grid-cols-4 gap-2 '>
          
          
            {
                categories.map((cat,index)=>{
                    return(
                        <div className="max-w-lg mx-auto">
                        <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
                            <a href="#">
                                <img className="rounded-t-lg" src={cat.img} alt="" />
                            </a>
                            <div className="p-5">
                                <Link to={`/category/${cat.name}/${cat.id}`}>
                                    <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">
                                        {cat.name}
                                    </h5>
                                    
                                </Link>
                                <p className="font-normal text-gray-700 mb-3">
                                   {cat.body}
                                    
                                </p>
                                <Link className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
                                to="/blogdetail">
                                    Read more
                                </Link>
                            </div>
                        </div>
                    </div>
                    )
                })
            }
            
            
            

        </div>

    </div>
</main>

  )
}
