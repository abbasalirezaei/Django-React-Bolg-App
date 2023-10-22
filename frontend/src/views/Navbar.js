import {useContext} from 'react'
import jwt_decode from "jwt-decode"
import AuthContext from '../context/AuthContext'
import { Link } from 'react-router-dom'

function Navbar() {

  const {user, logoutUser} = useContext(AuthContext)
  const token = localStorage.getItem("authTokens")

  if (token){
    const decoded = jwt_decode(token) 
    var user_id = decoded.user_id
  }

  return (
    <div>
       <nav className="navbar navbar-expand-lg navbar-dark fixed-top bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            <img
              style={{ width: 100, height: 40, objectFit: "contain" }}
              src="https://media.gettyimages.com/id/1297467660/vector/fast-play-button-moving-logo.jpg?s=612x612&w=0&k=20&c=3T-k_O5vNr_bhWNJ4yenT_-ncvH6iOawcJFflUDtu6s="
              alt=""
            />
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav">

              <li className="nav-item">
                
                <Link to="/" className="nav-link active" >Home</Link>
              </li>

				        {token === null && 
					       <>
  		              <li className="nav-item">
  		        			<Link to="/login" className="nav-link" >Login</Link>

  		              </li>
  		               <li className="nav-item">
  		        			<Link to="/register" className="nav-link" >Register</Link>

  		              </li>

	            	  </>  
  			       	}
               {token !== null &&
                 <>

                  <li className="nav-item">
                    <a className="nav-link" href="/dashboard">Dashboard</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" onClick={logoutUser} style={{cursor:"pointer"}}>Logout</a>
                  </li>
                    
                 </>
                }
              
            </ul>
          </div>
        </div>
      </nav>

    </div>
  )
}

export default Navbar