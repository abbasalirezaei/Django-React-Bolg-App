import React from 'react'
// import Card from './Card'
import { Link } from 'react-router-dom'

export default function Home() {
    return (
        <main className='px-16 mx-5'>

            <div>

                <div className='flex justify-between pt-3'>
                    <h4 className='font-bold  pb-2 border-b border-gray-200 uppercase'>Latest Blog</h4>
                    <Link to="/bloglist">View all Blog</Link>
                </div>
                {/* Cards go here */}
                
                <div className='mt-8 grid md:grid-cols-4 gap-3'>

                <div className="max-w-lg mx-auto">
                    <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
                        <a href="#">
                            <img className="rounded-t-lg" src="https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/hakka-noodles-recipe.jpg" alt="" />
                        </a>
                        <div className="p-5">
                            <a href="#">
                                <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">Noteworthy technology acquisitions 2021</h5>
                            </a>
                            <p className="font-normal text-gray-700 mb-3">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
                            <Link className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
                            to="/blogdetail">
                                Read more
                            </Link>
                        </div>
                    </div>
                </div><div className="max-w-lg mx-auto">
                    <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
                        <a href="#">
                            <img className="rounded-t-lg" src="https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/hakka-noodles-recipe.jpg" alt="" />
                        </a>
                        <div className="p-5">
                            <a href="#">
                                <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">Noteworthy technology acquisitions 2021</h5>
                            </a>
                            <p className="font-normal text-gray-700 mb-3">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
                            <Link className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
                            to="/blogdetail">
                                Read more
                            </Link>
                        </div>
                    </div>
                </div>



                </div>

                <div className='flex justify-between pt-3'>
                    <h4 className='font-bold  pb-2 border-b border-gray-200 uppercase'>Pupular Category</h4>
                    <Link to="/categories">View all Category</Link>
                </div>
                {/* Cards go here */}
                <div className='mt-8 grid md:grid-cols-4 gap-3'>
                <div className="max-w-lg mx-auto">
                    <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
                        <a href="#">
                            <img className="rounded-t-lg" src="https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/hakka-noodles-recipe.jpg" alt="" />
                        </a>
                        <div className="p-5">
                            <a href="#">
                                <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">Noteworthy technology acquisitions 2021</h5>
                            </a>
                            <p className="font-normal text-gray-700 mb-3">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
                            <Link className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
                            to="/blogdetail">
                                Read more
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="max-w-lg mx-auto">
                    <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
                        <a href="#">
                            <img className="rounded-t-lg" src="https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/hakka-noodles-recipe.jpg" alt="" />
                        </a>
                        <div className="p-5">
                            <a href="#">
                                <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">Noteworthy technology acquisitions 2021</h5>
                            </a>
                            <p className="font-normal text-gray-700 mb-3">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
                            <Link className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
                            to="/blogdetail">
                                Read more
                            </Link>
                        </div>
                    </div>
                </div><div className="max-w-lg mx-auto">
                    <div className="bg-white shadow-md border border-gray-200 rounded-lg max-w-sm mb-5">
                        <a href="#">
                            <img className="rounded-t-lg" src="https://www.indianhealthyrecipes.com/wp-content/uploads/2021/07/hakka-noodles-recipe.jpg" alt="" />
                        </a>
                        <div className="p-5">
                            <a href="#">
                                <h5 className="text-gray-900 font-bold text-2xl tracking-tight mb-2">Noteworthy technology acquisitions 2021</h5>
                            </a>
                            <p className="font-normal text-gray-700 mb-3">Here are the biggest enterprise technology acquisitions of 2021 so far, in reverse chronological order.</p>
                            <Link className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-3 py-2 text-center inline-flex items-center"
                            to="/blogdetail">
                                Read more
                            </Link>
                        </div>
                    </div>
                </div>
                </div>
                <div className='flex justify-center my-2'>
                    <div className='bg-secondary-100 text-secondary-200 btn hover:shadow-inner transform hover:scale-125 hover:bg-opacity-50'>Load More</div>


                </div>
            </div>
        </main>
    )
}
