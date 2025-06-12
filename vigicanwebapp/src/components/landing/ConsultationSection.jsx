import React from "react";
import "./ConsultationSection.css";

const ConsultationSection = () => (
  <section className="consultation-section">
    <div className="container">
      <div className="row">
        <div className="col-lg-6">
          <div className="consultation-content">
            <h2 className="consultation-title">
              Book a Free Consultation Today with Us
            </h2>
            <p className="consultation-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
              sodales pellentesque ullamcorper mollis velit porta ex et nisl
              condorm ullamcorper.
            </p>

            <div className="consultation-info">
              <div className="info-item">
                <i className="fas fa-phone consultation-icon"></i>
                <div>
                  <strong>Requesting A Call</strong>
                  <br />
                  <span>+234 814 254 9678</span>
                </div>
              </div>

              <div className="info-item">
                <i className="fas fa-clock consultation-icon"></i>
                <div>
                  <strong>Open Hours</strong>
                  <br />
                  <span>8 am - 9pm (Closed on Sunday)</span>
                </div>
              </div>

              <div className="info-item">
                <i className="fas fa-map-marker-alt consultation-icon"></i>
                <div>
                  <strong>Location</strong>
                  <br />
                  <span>6701 St Lorem Ipsum, Delaware 19930</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-6">
          <div className="consultation-form-wrapper">
            <form className="consultation-form">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label form-text">
                    Your Email
                  </label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter Email Address"
                  />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label form-text">
                    Your Phone
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    placeholder="Enter Phone No."
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="fullName" className="form-label form-text">
                  Your Full Name
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="fullName"
                  placeholder="Enter name"
                />
              </div>

              <div className="mb-3">
                <label htmlFor="message" className="form-label form-text">
                  Message
                </label>
                <textarea
                  className="form-control"
                  id="message"
                  rows="4"
                  placeholder="Write your message here..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="btn btn-primary consultation-btn"
              >
                Book Free Consultation
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="scroll-indicator">
        <span>Scroll</span>
        <i className="fas fa-chevron-up"></i>
      </div>
    </div>
  </section>
);

export default ConsultationSection;
