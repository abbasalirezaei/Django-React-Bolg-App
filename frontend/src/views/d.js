import {useState, useEffect} from 'react'
import useAxios from "../utils/useAxios"
import jwtDecode from 'jwt-decode'

const swal = require('sweetalert2')
function Dashboard() {

    const [res, setRes] = useState("")
    const api = useAxios();
    const token = localStorage.getItem("authTokens")

    if (token){
      const decode = jwtDecode(token)
      var user_id = decode.user_id
      var username = decode.username
      var full_name = decode.full_name
      var image = decode.image

    }

    useEffect(() => {
      const fetchData = async () => {
        try{
          const response = await api.get("/test/")
          setRes(response.data.response_data)
        } catch (error) {
          console.log(error);
          setRes("Something went wrong")
        }
      }
      fetchData()
    }, [])

    
    useEffect(() => {
      const fetchPostData = async () => {
        try{
          const response = await api.post("/test/")
          setRes(response.data.response_data)
        } catch (error) {
          console.log(error);
          setRes("Something went wrong")
        }
      }
      fetchPostData()
    }, [])


  return (
    <div>
      <>
  <div className="container-fluid" style={{ paddingTop: "100px" }}>
    <div className="row">
      <nav className="col-md-2 d-none d-md-block bg-light sidebar mt-4">
        <div className="sidebar-sticky">
          <ul className="nav flex-column">

            <li className="nav-item">
              <a className="nav-link active" href="#">
                <span data-feather="home" />
                Dashboard <span className="sr-only">(current)</span>
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                <span data-feather="file" />
                Orders
              </a>
            </li>

            <li className="nav-item">
              <a className="nav-link" href="#">
                <span data-feather="shopping-cart" />
                Products
              </a>
            </li>


          </ul>
          <h6 className="sidebar-heading d-flex justify-content-between align-items-center px-3 mt-4 mb-1 text-muted">
            <span>Saved reports</span>
            <a className="d-flex align-items-center text-muted" href="#">
              <span data-feather="plus-circle" />
            </a>
          </h6>
          <ul className="nav flex-column mb-2">

            <li className="nav-item">
              <a className="nav-link" href="#">
                <span data-feather="file-text" />
                Current month
              </a>
            </li>

            
          </ul>
        </div>
      </nav>
      <main role="main" className="col-md-9 ml-sm-auto col-lg-10 pt-3 px-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
          <h1 className="h2">My Dashboard</h1>
          <span>Hello {username}!</span>
          <div className="btn-toolbar mb-2 mb-md-0">
            <div className="btn-group mr-2">
              <button className="btn btn-sm btn-outline-secondary">
                Share
              </button>
              <button className="btn btn-sm btn-outline-secondary">
                Export
              </button>
            </div>
            <button className="btn btn-sm btn-outline-secondary dropdown-toggle">
              <span data-feather="calendar" />
              This week
            </button>
          </div>
        </div>
        <div className='alert alert-success'>
          <strong>{res}</strong>

        </div>


        <h2>Section title</h2>
        <div className="table-responsive">
          <table className="table table-striped table-sm">
            <thead>
              <tr>
                <th>#</th>
                <th>Header</th>
                <th>Header</th>
                <th>Header</th>
                <th>Header</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>1,001</td>
                <td>Lorem</td>
                <td>ipsum</td>
                <td>dolor</td>
                <td>sit</td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  </div>
  {/* Bootstrap core JavaScript
    ================================================== */}
  {/* Placed at the end of the document so the pages load faster */}
  {/* Icons */}
  {/* Graphs */}
</>

    </div>
  )
}

export default Dashboard