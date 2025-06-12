import React from "react";
import happyClient from "../../assets/images/happy-client.png";
import bookHotel1 from "../../assets/images/book-hotel1.png";
import bookHotel2 from "../../assets/images/book-hotel2.jpg";
import resortImage1 from "../../assets/images/resort1.jpg";
import resortImage2 from "../../assets/images/resort2.jpg";
import resortImage3 from "../../assets/images/resort3.jpg";

import "./HotelBookingSection.css";

const HotelBookingSection = () => (
  <section className="hotel-booking-section">
    <div className="hero-section ">
      <div className="container">
        <div className="hero-content">
          <h1 className="hero-title">BOOK THE BEST HOTELS THROUGH US</h1>
        </div>
      </div>
    </div>

    <div className="hotel-cta-section">
      <div className="container">
        <h2>
          Lorem Ipsum Dolor Si Elium Vigica Consult Ipsum onsectecnct conit
        </h2>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus
          sodales pellentesque ullamcorper mollis velit porta ex et nisl condorm
          ullamcorper.
        </p>
        <button className="btn btn-outline-light hotel-cta-btn">
          <i className="fas fa-search"></i> Find a Hotel
        </button>
      </div>
    </div>

    <div className="hotel-grid-section">
      <div className="container">
        <div className="row">
          <div className="hotel-onboard-section">
            <div className="row g-0">
              <div className="col-md-6 hotel-text-box">
                <h2 className="onboard-title">GET ONBOARD!</h2>
                <p className="onboard-desc">
                  Our hotels offer more than just a bed – they offer a
                  community.
                </p>
                <button className="btn btn-primary book-btn">
                  <i className="fas fa-bed me-2"></i> Book a Hotel
                </button>
              </div>
              <div className="col-md-6 position-relative">
                <img
                  src={bookHotel1}
                  alt="Hotel"
                  className="img-fluid onboard-image"
                />
                <div className="hotel-overlay-text">Lorem Ipsum keive</div>
              </div>
            </div>
          </div>

          <div className="where-to-section">
            <div className="row align-items-center">
              <div className="col-md-6 text-section">
                <h2 className="where-title">WHERE TO?</h2>
                <p className="where-subtitle">Lorem Ipsum keive</p>
                <p className="where-desc">
                  Lorem Ipsum keive <br />
                  confrentVivamussdes sgue <br />
                  ullamcorper mollis velit
                </p>
              </div>

              <div className="col-md-6 image-section position-relative">
                <img
                  src={resortImage1}
                  alt="Resort"
                  className="img-fluid where-image"
                />
                <div className="image-overlay-text">Lorem Ipsum keive</div>
              </div>
            </div>
          </div>

          <div className="container my-4">
            <div className="row gx-3 gy-3">
              <div className="col-lg-8">
                <div className="hotel-img-card position-relative h-100">
                  <img
                    src={bookHotel2}
                    className="img-fluid w-100 rounded hotel-img-short"
                    alt="Hotel Main"
                  />
                  <div className="hotel-img-title position-absolute top-0 start-0 w-100 px-4 py-3">
                    Lorem Ipsum keive
                  </div>
                </div>
              </div>
              <div className="col-lg-4 d-flex flex-column gap-3">
                <div className="hotel-img-card position-relative flex-grow-1">
                  <img
                    src={resortImage3}
                    className="img-fluid w-100 h-100 object-fit-cover rounded"
                    alt="Hotel Pool"
                  />
                  <div className="hotel-img-title position-absolute top-0 start-0 w-100 px-4 py-3">
                    Lorem Ipsum keive
                  </div>
                </div>
                <div className="hotel-img-card position-relative flex-grow-1">
                  <img
                    src={resortImage2}
                    className="img-fluid w-100 h-100 object-fit-cover rounded"
                    alt="Hotel Poolside"
                  />
                  <div className="hotel-img-title position-absolute top-0 start-0 w-100 px-4 py-3">
                    Lorem Ipsum keive
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default HotelBookingSection;
