import './App.css'
import { Route, Routes } from 'react-router-dom'
import Home  from './pages/Home.jsx'
import Dashboard from './pages/Dashboard.jsx'
import VehicleOnboarding from './pages/VehicleOnboarding.jsx'
import Packages from './pages/Package.jsx'
import Auth from './pages/Auth.jsx'
import Footer from './components/Footer.jsx'
import Header from './components/Header.jsx'
import Driver from './pages/DriverOnboarding.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import  AboutUs from './pages/AboutUs.jsx'


function App() {


  return (
    <>
      <Header/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/dashboard' element={
          <ProtectedRoute allowedRoles={['admin']}>
          <Dashboard/> 
          </ProtectedRoute>
        }/>
        <Route path='/vehicle-onboarding' element={<VehicleOnboarding/>}/>
        <Route path='/packages' element={<Packages/>}/>
        <Route path='/driver-onboarding' element={<Driver/>}/>
        <Route path='/login' element={<Auth/>}/>
        <Route path='/register' element={<Auth insideRegister={true}/>}/>
        <Route path='/aboutus' element={<AboutUs/>}/>
      </Routes>
      <Footer/>
    </>
  )
}

export default App
