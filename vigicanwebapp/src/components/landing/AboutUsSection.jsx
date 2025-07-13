import React from "react";
import studentImage from "../../assets/images/student.png";
import studentsImage from "../../assets/images/students.png";

import "./AboutUsSection.css";

const AboutUsSection = () => (
  <section className="about-us-section">
    <div className="container">
      <div className="row align-items-center">
        <div className="col-lg-6">
          <div className="about-images">
            <img
              src={studentsImage}
              alt="Group of students"
              className="about-img-main"
            />
            <img
              src={studentImage}
              alt="Student"
              className="about-img-overlay"
            />
          </div>
        </div>

        <div className="col-lg-6">
          <div className="about-content">
            <span className="about-subtitle">— Why Choose Us</span>
            <h2 className="about-title">
              Vigica Consult is your trusted partner for study abroad, travel,
              and hotel bookings
            </h2>
            <p className="about-description">
              We provide personalized visa application guidance, scholarship
              support, and pre-departure orientation. Our team is dedicated to
              making your study abroad journey smooth and successful.
            </p>

            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-number">01</div>
                <div className="timeline-content">
                  <h4>Student Visa</h4>
                  <p>
                    We assist with student visa applications, ensuring you have
                    the right documentation and support for your study abroad
                    journey.
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-number">02</div>
                <div className="timeline-content">
                  <h4>Visa Application</h4>
                  <p>
                    Our experts guide you through the visa application process,
                    helping you understand requirements and prepare necessary
                    documents.
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-number">03</div>
                <div className="timeline-content">
                  <h4>Accomodation</h4>
                  <p>
                    We assist in finding suitable accommodation options that
                    meet your needs and budget, ensuring a comfortable stay
                    during your studies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default AboutUsSection;
