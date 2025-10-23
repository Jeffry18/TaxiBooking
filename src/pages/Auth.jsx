import React, { useState } from 'react'
import { FloatingLabel, Form, Spinner, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { loginAPI, registerAPI } from '../services/allAPI'

const Auth = ({ insideRegister }) => {
  const [isLogin, setIsLogin] = useState(false)
  const navigate = useNavigate()
  const [inputData, setInputData] = useState({
    username: "", email: "", password: ""
  })
  const [errorMessage, setErrorMessage] = useState(null)

  // Validation helper functions
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const validateUsername = (username) => /^[a-zA-Z0-9]{5,}$/.test(username)
  const validatePassword = (password) =>
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/.test(password);

  // Register
  const handleRegister = async (e) => {
    e.preventDefault()
    const { username, email, password } = inputData

    // Validations
    if (!username || !email || !password) {
      setErrorMessage("❌ All fields are required.")
      return
    }
    if (!validateUsername(username)) {
      setErrorMessage("❌ Username must be at least 5 characters and only contain letters/numbers.")
      return
    }
    if (!validateEmail(email)) {
      setErrorMessage("❌ Please enter a valid email address.")
      return
    }
    if (!validatePassword(password)) {
      setErrorMessage("❌ Password must be at least 6 characters, include uppercase, lowercase, number, and special character.")
      return
    }

    try {
      const result = await registerAPI(inputData)
      if (result.status === 200) {
        setErrorMessage(null)
        navigate('/login')
        setInputData({ username: "", email: "", password: "" })
      } else if (result.response?.status === 406) {
        setErrorMessage(result.response.data)
      }
    } catch (err) {
      console.error(err)
      setErrorMessage("❌ Something went wrong. Please try again.")
    }
  }

  // Login
  const handleLogin = async (e) => {
    e.preventDefault()
    if (inputData.email && inputData.password) {
      try {
        const result = await loginAPI(inputData)
        if (result.status === 200) {
          sessionStorage.setItem("user", JSON.stringify(result.data.user))
          sessionStorage.setItem("token", result.data.token)
          sessionStorage.setItem("role", result.data.user.role)
          setIsLogin(true)

          setTimeout(() => {
            if (result.data.user.role === "admin") {
              navigate('/dashboard')
            } else {
              navigate('/')
            }
            setInputData({ username: "", email: "", password: "" })
            setIsLogin(false)
          }, 2000)
        } else if (result.response?.status === 404) {
          setErrorMessage(result.response.data)
        }
      } catch (err) {
        console.error(err)
        setErrorMessage("❌ Login failed. Please try again.")
      }
    } else {
      setErrorMessage("❌ Please fill the form.")
    }
  }

  return (
    <div className="auth-container" style={{ marginTop: "30px" }}>
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

                  {/* Left Side */}
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
                      </div>

                      {/* Show error message */}
                      {errorMessage && (
                        <Alert
                          variant="danger"
                          dismissible
                          onClose={() => setErrorMessage(null)}
                          className="mb-3"
                        >
                          {errorMessage}
                        </Alert>
                      )}

                      <Form className="auth-form">
                        {insideRegister && (
                          <FloatingLabel controlId="floatingInputName" label="Username" className="mb-3">
                            <Form.Control
                              value={inputData.username}
                              onChange={e => setInputData({ ...inputData, username: e.target.value })}
                              type="text"
                              placeholder="Username"
                            />
                          </FloatingLabel>
                        )}

                        <FloatingLabel controlId="floatingInputEmail" label="Email" className="mb-3">
                          <Form.Control
                            value={inputData.email}
                            onChange={e => setInputData({ ...inputData, email: e.target.value })}
                            type="email"
                            placeholder="name@example.com"
                          />
                        </FloatingLabel>

                        <FloatingLabel controlId="floatingPassword" label="Password" className="mb-3">
                          <Form.Control
                            value={inputData.password}
                            onChange={e => setInputData({ ...inputData, password: e.target.value })}
                            type="password"
                            placeholder="Password"
                          />
                        </FloatingLabel>




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
