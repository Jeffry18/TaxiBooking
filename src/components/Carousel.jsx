import React from 'react'
import { Carousel } from 'react-bootstrap'
import '../App.css'

const banners = [
  {
    id: 1,
    image: "/banner1.jpg",
    title: "Fast & Reliable Taxi Service",
    subtitle: "Anywhere. Anytime. Just a tap away.",
  },
  {
    id: 2,
    image: "/banner2.png",
    title: "Book Your Ride in Seconds",
    subtitle: "Comfortable vehicles at transparent prices.",
  },
]

function HomeCarousel() {
  return (
    <Carousel fade interval={5000} pause={false} controls indicators>
      {banners.map((b) => (
        <Carousel.Item key={b.id} className="hero-slide">
          <img
            className="d-block w-100 hero-image"
            src={b.image}
            alt={`Slide ${b.id}`}
          />
          <div className="hero-overlay" />
          <Carousel.Caption className="hero-caption mb-5">
            <h1 className="hero-heading">{b.title}</h1>
            <p className="hero-subtitle">{b.subtitle}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  )
}

export default HomeCarousel
