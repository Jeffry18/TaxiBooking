import React, { useState, useEffect } from 'react'
import { Carousel } from 'react-bootstrap'
import '../App.css'

const banners = [
  {
    id: 1,
    image: "/force-urbania.jpg",
    title: "Travel in Ultimate Comfort",
    subtitle: "Experience Premium Group Travel with Force Urbania",
    description: "Spacious, modern, and perfect for your group transportation needs",
  },
  {
    id: 2,
    image: "/glider.jpg", 
    title: "Luxury Fleet at Your Service",
    subtitle: "Premium Mercedes-Benz buses for your comfort",
    description: "Experience first-class travel with our luxury bus service",
  },
  {
    id: 3,
    image: "/Toyota.jpg",
    title: "Explore Kerala in Style", 
    subtitle: "Discover God's Own Country with our expert drivers",
    description: "Custom packages for sightseeing, business trips, and more",
  },
]

function HomeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex)
  }

  return (
    <div className="hero-slider-container">
      <Carousel 
        activeIndex={activeIndex}
        onSelect={handleSelect}
        interval={6000} 
        pause={false} 
        controls={true} 
        indicators={true}
        fade={false}
        className="hero-carousel"
      >
        {banners.map((banner, index) => (
          <Carousel.Item key={banner.id} className="hero-slide">
            <div className="hero-image-container">
              <img
                className="hero-image"
                src={banner.image}
                alt={`Hero slide ${banner.id}`}
              />
              <div className="hero-overlay" />
            </div>
            
            <div className="hero-content">
              <div className="container">
                <div className="hero-text-wrapper">
                  <h1 className={`hero-title ${activeIndex === index ? 'animate-in' : ''}`}>
                    {banner.title}
                  </h1>
                  <p className={`hero-subtitle ${activeIndex === index ? 'animate-in delay-1' : ''}`}>
                    {banner.subtitle}
                  </p>
                  <p className={`hero-description ${activeIndex === index ? 'animate-in delay-2' : ''}`}>
                    {banner.description}
                  </p>
                  {/* <div className={`hero-buttons ${activeIndex === index ? 'animate-in delay-3' : ''}`}>
                    <button className="hero-btn primary-btn">
                      <span>Book Now</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>
                    <button className="hero-btn secondary-btn">
                      <span>Learn More</span>
                    </button>
                  </div> */}
                </div>
              </div>
            </div>

            <div className="hero-particles">
              <div className="particle particle-1"></div>
              <div className="particle particle-2"></div>
              <div className="particle particle-3"></div>
              <div className="particle particle-4"></div>
              <div className="particle particle-5"></div>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>
      
      <div className="hero-scroll-indicator">
        <div className="scroll-arrow">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <p>Scroll Down</p>
      </div>
    </div>
  )
}

export default HomeCarousel
