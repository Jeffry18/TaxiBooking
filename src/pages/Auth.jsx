import React, { useState } from 'react'
import { FloatingLabel, Form, Spinner } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { loginAPI, registerAPI } from '../services/allAPI'


const Auth = ({ insideRegister }) => {
  const [isLogin, setIsLogin] = useState(false)
  const navigate = useNavigate()
  const [inputData, setInputData] = useState({
    username: "", email: "", password: ""
  })
  console.log(inputData);

  const handleRegister = async (e) => {
    e.preventDefault()
    console.log("inside handleRegister");
    if (inputData.username && inputData.email && inputData.password) {
      // alert("make api call")
      try {
        const result = await registerAPI(inputData)
        console.log(result);
        if (result.status == 200) {
          alert(`Welcome ${result.data.username}, please login to explore our website!!!`)
          navigate('/login')
          setInputData({ username: "", email: "", password: "" })
        } else {
          if (result.response.status == 406) {
            alert(result.response.data)
            setInputData({ username: "", email: "", password: "" })

          }
        }

      } catch (err) {
        console.log(err);

      }

    } else {
      alert("please fill the form!!")
    }
  }

  const handleLogin = async (e)=>{
    e.preventDefault()
    if (inputData.email && inputData.password) {
      try {
        const result = await loginAPI(inputData)
        if (result.status==200) {
          sessionStorage.setItem("user",JSON.stringify(result.data.user))
          sessionStorage.setItem("token",result.data.token)
           sessionStorage.setItem("role", result.data.user.role);
          setIsLogin(true)
          setTimeout(()=>{
            if (result.data.user.role === "admin") {
              navigate('/dashboard')
            } else {
              navigate('/')
            }

          setInputData({username:"" , email:"" ,password:""})
          setIsLogin(false)
          },2000)

        } else {
          if (result.response.status==404) {
            alert(result.response.data)
          }
        }


      } catch (err) {
        console.log(err);
        
      }
    } else {
      alert("please fill the form!!")
    }
  }

  return (
    <div className='d-flex  ' style={{ minHeight: '70vh', width: '100%' }}>

      <div className='p-5 mt-5' style={{ width: '100%', height: '100%' }}>
        <div className='card shadow ' style={{ border: 'none', backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
          <div className='row align-items-center'>
            <div className='col-lg-4 text-dark fw-bolder'>
              <h2 className='ps-5 pb-3'>Let's Make It Better</h2>
              <h4 className='ps-5' style={{ fontSize: '1500' }}>Push harder than yesterday if you want a different tomorrow.</h4>
              <p className='ps-5'>Take care of your body. It's the only place you have to live.</p>
            </div>
            <div className='col-lg-4 text-dark fw-bolder'>
              <h1 className='mt-5'>Start Today</h1>
              <h4 className='mt-2'>Sign {insideRegister ? 'up' : 'in'} to your Account</h4>
              <Form>
                {
                  insideRegister &&
                  <FloatingLabel controlId="floatingInputName" label="Username" className="mb-3">
                    <Form.Control value={inputData.username} onChange={e => setInputData({ ...inputData, username: e.target.value })} type="text" placeholder="Username" />
                  </FloatingLabel>
                }
                <FloatingLabel controlId="floatingInput" label="Email address" className="mb-3">
                  <Form.Control value={inputData.email}  onChange={e => setInputData({ ...inputData, email: e.target.value })} type="email" placeholder="name@example.com" />
                </FloatingLabel>
                <FloatingLabel controlId="floatingPassword" label="Password">
                  <Form.Control value={inputData.password} onChange={e => setInputData({ ...inputData, password: e.target.value })} type="password" placeholder="Password" />
                </FloatingLabel>
                {
                  insideRegister ?
                    <div className='mt-3 mb-5'>
                      <button onClick={handleRegister} className='btn btn-primary md-2'>Register</button>
                      <p>Already a user ? Please click here to <Link to={'/login'}>Login</Link></p>
                    </div>
                    :
                    <div className='mt-3 mb-5'>
                      <button onClick={handleLogin} className='btn btn-primary md-2'>Login {isLogin && <Spinner animation="border" variant="light" />}</button>
                      <p>New user ? Please click here to <Link to={'/register'}>Register</Link></p>
                    </div>
                }

              </Form>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default Auth