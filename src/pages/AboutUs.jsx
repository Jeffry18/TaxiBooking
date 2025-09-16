import React from "react";
import aboutus1 from "../assets/AboutUs(1).jpg";
import aboutus2 from "../assets/aboutUs(2).jpg";

export const AboutUs = () => {
  return (
    <div className="container text-center mb-3" style={{ marginTop: "100px" }}>
      <h1>About Us</h1>

      <div className="row text-start mt-4">
        {/* Left Column */}
        <div className="col-md-8">
          <p>
            Santos King is a Ministry of Tourism, Govt. of India recognized
            Inbound & Adventure Tour operator with offices in Kochi, Kerala
            specializing in Incredible India Holiday Packages, Adventure
            Activities, Houseboat Cruises and Outbound Tours. Founded in 2009 by
            a group of professionals with rich experience in the tourism
            industry, Santos King aims to provide excellent service to its
            clients. Santos King is proud to be associated with Ministry of
            Tourism, Govt. of India, Dept. of Tourism, Kerala, IATO (Indian
            Association of Tour Operators), PATA (Pacific Asia Travel
            Association) and ATOAI (Adventure Tour Operators Association of
            India).
          </p>
          <p>
            We have provided our service to a lot of international groups and
            independent travellers in the last 14 years with most of our
            customers from Germany, United Kingdom, USA, Canada, Middle East,
            Bulgaria, Italy and France. We have an experienced and dedicated
            team to manage the guests as per their requirements. We have a
            strong presence all over India which helps us with easy
            accessibility across all destinations at all times. We have a good
            collection of Houseboats, Geared Bikes, Kayaks, Support Vehicles and
            well experienced Tour Leaders and Guides. Also we use brand new cabs
            and coaches for every trip driven by English speaking professional
            chauffeurs. Team Santos sails by the motto of providing 100%
            customer satisfaction to its clients.
          </p>
          <p>
            In September 2014, Santos King organized a National level Cyclothon
            of 90 km in the unexplored virgin serenity of Sabarimala. The event
            "AICA Tour De Kerala" Mountain Challenge: Sabarimala, powered by
            FUJI bikes turned out to be a huge success story with the
            participation of 108 riders from across the country. In January
            2018, we organized a one-of-a-kind Sunset Beach Run - "Joanns Kochi
            Duskathon, Powered by Mahindra" in Kuzhuppilly Beach, Kerala which
            attracted 1200+ runners. The second edition of the event was
            organized in April 2019 - "Kochi Duskathon - World's Largest
            Barefoot Race" with a large number of barefoot runners participating
            in the event. In 2021, we continued with the trend and organized
            "Paddlers Meetup - River Periyar Cleanup" in Aluva on the occasion
            of World Tourism Day with the apt theme of "Unity - Lets Grow
            Together". Our latest event 'Kochi Swimathon 2022', South India's
            first River Swimathon held in River Periyar, Aluva Kochi was a huge
            success.
          </p>
          <p>Please explore our website to find more.</p>

          <div className="mt-3">
            <div><a href="https://www.santos.travel" target="_blank" rel="noopener noreferrer">Santos Travel</a></div>
            <div><a href="https://tdksports.in" target="_blank" rel="noopener noreferrer">TDK Sports</a></div>
            <div><a href="https://darc.ngo/about-us.html" target="_blank" rel="noopener noreferrer">DARC</a></div>
          </div>

        </div>

        {/* Right Column */}
        <div className="col-md-4">
          <img
            src={aboutus1}
            alt="About Us 1"
            className="img-fluid mb-3"
            style={{ height: "400px", width: "400px" }}
          />
          <img
            src={aboutus2}
            alt="About Us 2"
            className="img-fluid"
            style={{ height: "400px", width: "400px" }}
          />
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
