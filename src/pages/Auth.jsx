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
    <div className="auth-container" style={{marginTop:"30px"}}>
      <div className="auth-background">
        <div className="auth-particles">
          <div className="particle particle-1"></div>
          <div className="particle particle-2"></div>
          <div className="particle particle-3"></div>
          <div className="particle particle-4"></div>
          <div className="particle particle-5"></div>
          <div className="particle particle-6"></div>
        </div>
      </div>
      
      <div className="auth-content">
        <div className="container">
          <div className="row justify-content-center align-items-center min-vh-100">
            <div className="col-lg-10 col-xl-8">
              <div className="auth-card">
                <div className="row g-0">
                  {/* Left Side - Brand & Info */}
                  <div className="col-lg-6 auth-brand-side">
                    <div className="auth-brand-content">
                      <div className="brand-logo mb-4">
                        <div className="logo-icon">
                          <i className="fas fa-taxi"></i>
                        </div>
                        <h3 className="brand-name">TaxiBooking</h3>
                      </div>
                      
                      <div className="brand-welcome">
                        <h2 className="welcome-title">
                          {insideRegister ? 'Join Our Community' : 'Welcome Back'}
                        </h2>
                        <p className="welcome-subtitle">
                          {insideRegister 
                            ? 'Create your account and start booking rides with ease. Experience premium taxi services at your fingertips.'
                            : 'Sign in to your account and continue your journey with us. Your reliable taxi service awaits.'
                          }
                        </p>
                      </div>
                      
                      <div className="brand-features">
                        <div className="feature-item">
                          <div className="feature-icon">
                            <i className="fas fa-clock"></i>
                          </div>
                          <span>24/7 Service</span>
                        </div>
                        <div className="feature-item">
                          <div className="feature-icon">
                            <i className="fas fa-shield-alt"></i>
                          </div>
                          <span>Safe & Secure</span>
                        </div>
                        <div className="feature-item">
                          <div className="feature-icon">
                            <i className="fas fa-star"></i>
                          </div>
                          <span>Premium Quality</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right Side - Form */}
                  <div className="col-lg-6 auth-form-side">
                    <div className="auth-form-content">
                      <div className="form-header">
                        <h1 className="form-title">
                          {insideRegister ? 'Create Account' : 'Sign In'}
                        </h1>
                        <p className="form-subtitle">
                          {insideRegister 
                            ? 'Fill in your information to get started'
                            : 'Enter your credentials to access your account'
                          }
                        </p>
                      </div>
                      
                      <Form className="auth-form">
                        {insideRegister && (
                          <div className="form-group">
                            <div className="input-wrapper">
                              <div className="input-icon">
                                <i className="fas fa-user"></i>
                              </div>
                              <FloatingLabel controlId="floatingInputName" label="Username" className="floating-label">
                                <Form.Control 
                                  value={inputData.username} 
                                  onChange={e => setInputData({ ...inputData, username: e.target.value })} 
                                  type="text" 
                                  placeholder="Username"
                                  className="form-input"
                                />
                              </FloatingLabel>
                            </div>
                          </div>
                        )}
                        
                        <div className="form-group">
                          <div className="input-wrapper">
                            <div className="input-icon">
                              <i className="fas fa-envelope"></i>
                            </div>
                            <FloatingLabel controlId="floatingInput" label="Email address" className="floating-label">
                              <Form.Control 
                                value={inputData.email} 
                                onChange={e => setInputData({ ...inputData, email: e.target.value })} 
                                type="email" 
                                placeholder="name@example.com"
                                className="form-input"
                              />
                            </FloatingLabel>
                          </div>
                        </div>
                        
                        <div className="form-group">
                          <div className="input-wrapper">
                            <div className="input-icon">
                              <i className="fas fa-lock"></i>
                            </div>
                            <FloatingLabel controlId="floatingPassword" label="Password" className="floating-label">
                              <Form.Control 
                                value={inputData.password} 
                                onChange={e => setInputData({ ...inputData, password: e.target.value })} 
                                type="password" 
                                placeholder="Password"
                                className="form-input"
                              />
                            </FloatingLabel>
                          </div>
                        </div>
                        
                        {insideRegister ? (
                          <div className="form-actions">
                            <button 
                              onClick={handleRegister} 
                              className="auth-btn primary-btn"
                              disabled={isLogin}
                            >
                              <span className="btn-text">Create Account</span>
                              <div className="btn-icon">
                                <i className="fas fa-arrow-right"></i>
                              </div>
                            </button>
                            
                            <div className="auth-switch">
                              <p>Already have an account? 
                                <Link to="/login" className="switch-link"> Sign In</Link>
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="form-actions">
                            <button 
                              onClick={handleLogin} 
                              className="auth-btn primary-btn"
                              disabled={isLogin}
                            >
                              <span className="btn-text">
                                {isLogin ? 'Signing In...' : 'Sign In'}
                              </span>
                              <div className="btn-icon">
                                {isLogin ? (
                                  <Spinner animation="border" size="sm" />
                                ) : (
                                  <i className="fas fa-arrow-right"></i>
                                )}
                              </div>
                            </button>
                            
                            <div className="auth-switch">
                              <p>Don't have an account? 
                                <Link to="/register" className="switch-link"> Create Account</Link>
                              </p>
                            </div>
                          </div>
                        )}
                      </Form>
                      
                      <div className="form-footer">
                        <div className="security-badge">
                          <i className="fas fa-lock"></i>
                          <span>Your information is protected with 256-bit SSL encryption</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Auth