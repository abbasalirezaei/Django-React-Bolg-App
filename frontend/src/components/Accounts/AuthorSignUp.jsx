import {useState, useContext} from 'react'
import { Link } from 'react-router-dom'
import AuthContext from '../../context/AuthContext'


export default function AuthorSignUp() {
    const [email, setEmail] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")

    const {registerAuthor} =useContext(AuthContext)

  const handelSubmit = async (e)=>{
    // if you dont and add this, your page after submit will be refreshed
      e.preventDefault()
      // we need email and password from the form.
      // this is like request.Post.get("email")

      registerAuthor(email ,username, password, password2)
  }
	// const buttonEnable =(formData.email!='') &&(formData.password!='')

    
    return (
        <div style={{ 'marginTop': '110px' }}
            className="container max-w-md mx-auto xl:max-w-3xl h-full flex bg-white rounded-lg shadow overflow-hidden">
            <div className="relative hidden xl:block xl:w-1/2 h-full">
                <img
                    className="absolute h-auto w-full object-cover"
                    src="https://images.unsplash.com/photo-1541233349642-6e425fe6190e"
                    alt="my zomato"
                />
            </div>
            
            <div className="w-full xl:w-1/2 p-8">
                <form method="post" action="#" onSubmit={handelSubmit}>
                    <h1 className=" text-2xl font-bold">Author Sign Up</h1>
                    <div>
                        <span className="text-gray-600 text-sm">You have an account?</span>
                        <span className="text-gray-700 text-sm font-semibold">
                            <Link to='/signin'>Sign In</Link>
                        </span>
                    </div>

                    <div className="">
                        <label
                            className="block text-gray-700 text-sm font-semibold mb-2"
                            htmlfor="email"
                        >
                            Email
                        </label>
                        <input
                            className="text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10"
                            id="email"
                            onChange={e => setEmail(e.target.value)}
                            type="text"
                            placeholder="Your email address"
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-gray-700 text-sm font-semibold mb-2"
                            htmlfor="username"
                        >
                            Username
                        </label>
                        <input
                            className="text-sm appearance-none rounded w-full py-2 px-3 text-gray-700 bg-gray-200 leading-tight focus:outline-none focus:shadow-outline h-10"
                            id="username"
                            name="username"
                            onChange={e => setUsername(e.target.value)} 
                            type="text"
                            placeholder="Your username address"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            className="block text-gray-700 text-sm font-semibold mb-2"
                            htmlfor="password"
                        >
                            Password
                        </label>
                        <input
                            className="text-sm bg-gray-200 appearance-none rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline h-10"
                            id="password"
                            autocomplete="new-password"
                            onChange={e => setPassword(e.target.value)} 
                            type="password"
                            placeholder="Your password"
                        />
                       
                    </div>
                    <div className="mb-6">
                        <label
                            className="block text-gray-700 text-sm font-semibold mb-2"
                            htmlfor="password2"
                        >
                            Confirm Password
                        </label>
                        <input
                            className="text-sm bg-gray-200 appearance-none rounded w-full py-2 px-3 text-gray-700 mb-1 leading-tight focus:outline-none focus:shadow-outline h-10"
                            id="password2"
                            name="password2"
                            autocomplete="new-password"
                            onChange={e => setPassword2(e.target.value)} 
                            type="password"
                            placeholder="Your Confirm password"
                        />
                        <a
                            className="inline-block align-baseline text-sm text-gray-600 hover:text-gray-800"
                            href="#"
                        >
                            Forgot Password?
                        </a>
                    </div>

                    <div className="flex w-full mt-8">
                        <button
                            className="w-full bg-gray-800 hover:bg-grey-900 text-white text-sm py-2 px-4 font-semibold rounded focus:outline-none focus:shadow-outline h-10"
                            type="submit"
                        >
                            Sign in
                        </button>
                    </div>
                </form>
            </div>
        </div>


    )
}
