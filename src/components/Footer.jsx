import React from 'react'
import { Link } from 'react-router-dom'

export const Footer = () => {
  return (
    
        <div className='d-flex flex-column align-items-center justify-content-center mt-5 shadow' style={{width:'100%' , height:'350px'}}>
            <div style={{height:'300px'}} className='mt-5 container w-100'>
          <div className='d-flex justify-content-between'>
            {/* intro */}
            <div style={{width:'400px'}}>
              <h5><i className="fa-solid fa-taxi"></i>
              Taxi Booking</h5>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Necessitatibus perspiciatis consequatur doloribus dolores, quae recusandae quos ipsam repellat facere odio. Quod, placeat maxime qui laboriosam quisquam porro ducimus voluptas consequatur.</p>
              <p>Lorem ipsum dolor sit amet</p>
              <p>Lorem ipsum dolor sit amet.</p>
            </div>
            {/* links */}
            <div className='d-flex flex-column'>
              <h5>Links</h5>
              <Link to={'/'} style={{textDecoration:'none', color:'white'}}> Home Page</Link>
              <Link to={'/login'} style={{textDecoration:'none', color:'white'}}> Login Page</Link>
              <Link to={'/register'} style={{textDecoration:'none', color:'white'}}> Register Page</Link>
            </div>
            {/* guides */}
            <div className='d-flex flex-column'>
              <h5>Guides</h5>
              <a href="https://react.dev/" target='blank' style={{textDecoration:'none', color:'white'}}>React</a>
              <a href="https://react-bootstrap.netlify.app/" target='blank' style={{textDecoration:'none', color:'white'}}>React Bootstrap</a>
              <a href="https://www.npmjs.com/package/react-router-dom" target='blank' style={{textDecoration:'none', color:'white'}}>React Router</a>
            </div>
            {/* contact */}
            <div className='d-flex flex-column'>
              <h5>Contacts</h5>
              <div className='d-flex'>
                <input type="text" placeholder="Enter Your Email Here.." className='form-control me-2'/>
                <button className='btn btn-info'><i className="fa-solid fa-arrow-right"></i></button>
              </div>
              <div className='d-flex justify-content-between mt-3'>
                 <a href="https://x.com/?lang=en&mx=2" target='_blank' style={{textDecoration:'none', color:'white'}}><i class="fa-brands fa-twitter"></i></a>
                 <a href="https://www.instagram.com/" target='_blank' style={{textDecoration:'none', color:'white'}}><i class="fa-brands fa-instagram"></i></a>
                 <a href="https://www.facebook.com/" target='_blank' style={{textDecoration:'none', color:'white'}}><i class="fa-brands fa-facebook"></i></a>
                 <a href="https://www.linkedin.com/" target='_blank' style={{textDecoration:'none', color:'white'}}><i class="fa-brands fa-linkedin"></i></a>
                 <a href="https://github.com/login" target='_blank' style={{textDecoration:'none', color:'white'}}><i class="fa-brands fa-github"></i></a>
                 <a href="https://www.freeconferencecallhd.com/dialer" target='_blank' style={{textDecoration:'none', color:'white'}}><i class="fa-solid fa-phone"></i></a>
              </div>
            </div>
          </div>
          <p className='text-center mt-3'>Copyright &copy;  , Taxi Booking Built with React.</p>
        </div>
        </div>
    
  )
}

export default Footer
