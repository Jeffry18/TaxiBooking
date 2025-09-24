import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import aboutus1 from "../assets/AboutUs(1).jpg";
import aboutus2 from "../assets/aboutUs(2).jpg";

export const AboutUs = () => {
  return (
    <div className="about-us-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-overlay"></div>
        <div className="hero-particles-bg">
          <div className="particle-float particle-1"></div>
          <div className="particle-float particle-2"></div>
          <div className="particle-float particle-3"></div>
          <div className="particle-float particle-4"></div>
          <div className="particle-float particle-5"></div>
          <div className="particle-float particle-6"></div>
        </div>
        <Container className="about-hero-content">
          <Row className="align-items-center justify-content-center text-center min-vh-100">
            <Col lg={10}>
              <div className="about-hero-text">
                <div className="hero-badge">
                  <span className="badge-text">Since 2009</span>
                </div>
                <h1 className="about-hero-title">
                  Welcome to <span className="text-gradient">Santos King</span>
                </h1>
                <p className="about-hero-subtitle">
                  Your trusted partner in creating unforgettable travel experiences across incredible India. 
                  We specialize in premium taxi services, adventure tours, and personalized holiday packages.
                </p>
                
                <div className="hero-features">
                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <span>Government Recognized</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-globe-americas"></i>
                    </div>
                    <span>International Clients</span>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <i className="fas fa-award"></i>
                    </div>
                    <span>Premium Service</span>
                  </div>
                </div>

                <div className="about-hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">14+</span>
                    <span className="stat-label">Years Experience</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">10K+</span>
                    <span className="stat-label">Happy Customers</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">100%</span>
                    <span className="stat-label">Satisfaction Rate</span>
                  </div>
                </div>

                <div className="hero-cta-buttons">
                  <button className="hero-cta-btn primary">
                    <span>Explore Our Services</span>
                    <i className="fas fa-arrow-right"></i>
                  </button>
                  <button className="hero-cta-btn secondary">
                    <span>Contact Us</span>
                  </button>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
        <div className="hero-scroll-indicator">
          <div className="scroll-mouse">
            <div className="scroll-wheel"></div>
          </div>
          <span>Scroll to explore</span>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="about-story">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} className="text-center mb-5">
              <h2 className="section-title">Our Story</h2>
              <p className="section-subtitle">
                Founded in 2009 by passionate tourism professionals with a vision to showcase incredible India
              </p>
            </Col>
          </Row>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <div className="story-content">
                <div className="story-timeline">
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>2009 - The Beginning</h4>
                      <p>Santos King was founded by a group of tourism professionals in Kochi, Kerala, with rich industry experience.</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>2014 - Innovation</h4>
                      <p>Organized National level Cyclothon "AICA Tour De Kerala" with 108 riders from across the country.</p>
                    </div>
                  </div>
                  <div className="timeline-item">
                    <div className="timeline-dot"></div>
                    <div className="timeline-content">
                      <h4>2018-2022 - Growth</h4>
                      <p>Expanded with unique events like Kochi Duskathon and South India's first River Swimathon.</p>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="story-image">
                <img src={aboutus2} alt="Our Journey" className="img-fluid rounded-4 shadow" />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Values Section */}
      <section className="about-values">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <h2 className="section-title text-white">Our Core Values</h2>
              <p className="section-subtitle text-white-50">
                The principles that guide everything we do
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={4} md={6} className="mb-4">
              <Card className="value-card h-100">
                <Card.Body className="text-center">
                  <div className="value-icon">
                    <i className="fas fa-award"></i>
                  </div>
                  <h4 className="value-title">Excellence</h4>
                  <p className="value-text">
                    We strive for perfection in every aspect of our service, ensuring 100% customer satisfaction.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <Card className="value-card h-100">
                <Card.Body className="text-center">
                  <div className="value-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <h4 className="value-title">Trust</h4>
                  <p className="value-text">
                    Building lasting relationships with our clients through transparency and reliability.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4} md={6} className="mb-4">
              <Card className="value-card h-100">
                <Card.Body className="text-center">
                  <div className="value-icon">
                    <i className="fas fa-globe"></i>
                  </div>
                  <h4 className="value-title">Innovation</h4>
                  <p className="value-text">
                    Constantly evolving to offer unique experiences and cutting-edge travel solutions.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Services Section */}
      <section className="about-services">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <h2 className="section-title">What We Offer</h2>
              <p className="section-subtitle">
                Comprehensive travel solutions for every type of traveler
              </p>
            </Col>
          </Row>
          <Row>
            <Col lg={3} md={6} className="mb-4">
              <div className="service-item">
                <div className="service-icon">
                  <i className="fas fa-route"></i>
                </div>
                <h5>Holiday Packages</h5>
                <p>Customized India tour packages for unforgettable experiences</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="service-item">
                <div className="service-icon">
                  <i className="fas fa-ship"></i>
                </div>
                <h5>Houseboat Cruises</h5>
                <p>Serene backwater experiences in Kerala's pristine waters</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="service-item">
                <div className="service-icon">
                  <i className="fas fa-mountain"></i>
                </div>
                <h5>Adventure Tours</h5>
                <p>Thrilling activities and adventure sports across India</p>
              </div>
            </Col>
            <Col lg={3} md={6} className="mb-4">
              <div className="service-item">
                <div className="service-icon">
                  <i className="fas fa-car"></i>
                </div>
                <h5>Transportation</h5>
                <p>Premium taxi services with professional chauffeurs</p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Recognition Section */}
      <section className="about-recognition">
        <Container>
          <Row className="justify-content-center mb-5">
            <Col lg={8} className="text-center">
              <h2 className="section-title">Recognized & Trusted</h2>
              <p className="section-subtitle">
                Proudly associated with leading tourism organizations
              </p>
            </Col>
          </Row>
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="recognition-grid">
                <div className="recognition-item">
                  <h5>Ministry of Tourism</h5>
                  <p>Government of India</p>
                </div>
                <div className="recognition-item">
                  <h5>Kerala Tourism</h5>
                  <p>Department of Tourism</p>
                </div>
                <div className="recognition-item">
                  <h5>IATO</h5>
                  <p>Indian Association of Tour Operators</p>
                </div>
                <div className="recognition-item">
                  <h5>PATA</h5>
                  <p>Pacific Asia Travel Association</p>
                </div>
                <div className="recognition-item">
                  <h5>ATOAI</h5>
                  <p>Adventure Tour Operators Association</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="about-cta">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="cta-title">Ready to Explore Incredible India?</h2>
              <p className="cta-subtitle">
                Let us create an unforgettable journey tailored just for you
              </p>
              <div className="cta-buttons">
                <Button className="cta-btn primary" size="lg">
                  Plan Your Trip
                </Button>
                <Button className="cta-btn secondary" size="lg" variant="outline-light">
                  Contact Us
                </Button>
              </div>
              <div className="cta-links">
                <a href="https://www.santos.travel" target="_blank" rel="noopener noreferrer">
                  Santos Travel
                </a>
                <a href="https://tdksports.in" target="_blank" rel="noopener noreferrer">
                  TDK Sports
                </a>
                <a href="https://darc.ngo/about-us.html" target="_blank" rel="noopener noreferrer">
                  DARC
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AboutUs;
