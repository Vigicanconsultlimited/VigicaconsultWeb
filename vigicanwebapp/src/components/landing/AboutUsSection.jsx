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
              Vigica Consult Lorem Ipsum Dolor Sit Amet, Cons
            </h2>
            <p className="about-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              sodales pellentesque ullamcorper mollis velit porta ex et nisl
              condorm ullamcorper.
            </p>

            <div className="timeline">
              <div className="timeline-item">
                <div className="timeline-number">01</div>
                <div className="timeline-content">
                  <h4>Lorem Ipsum dolor ex et</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vivamus sodales pellentesque ullamcorper mollis velit porta
                    ex et nisl condorm ullamcorper.
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-number">02</div>
                <div className="timeline-content">
                  <h4>Lorem Ipsum dolor ex et</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vivamus sodales pellentesque ullamcorper mollis velit porta
                    ex et nisl condorm.
                  </p>
                </div>
              </div>

              <div className="timeline-item">
                <div className="timeline-number">03</div>
                <div className="timeline-content">
                  <h4>Lorem Ipsum dolor ex et</h4>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Vivamus sodales pellentesque ullamcorper mollis velit porta
                    ex et nisl condorm.
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
