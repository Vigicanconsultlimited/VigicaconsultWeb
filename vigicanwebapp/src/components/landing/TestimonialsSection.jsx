import React from "react";
import studentImage from "../../assets/images/student-image.webp";
import studentImage2 from "../../assets/images/student-image2.jpg";
import studentImage3 from "../../assets/images/student-image3.webp";
import studentImage4 from "../../assets/images/student-image4.webp";
import "./TestimonialsSection.css";

const TestimonialsSection = () => (
  <div className="testimonials-section py-5">
    <div className="container">
      <h2 className="testimonials-title mb-2">
        Trusted by Hundreds of Students
      </h2>
      <div className="position-relative testimonials-row bg-blue rounded-4 px-4 py-5">
        <i className="fa-solid fa-plane testimonial-plane plane-top"></i>
        <div className="d-flex align-items-center justify-content-between flex-wrap">
          {/* Main Testimonial Image */}
          <div className="testimonial-img-main me-4 flex-shrink-0">
            <img
              src={studentImage}
              alt="Student"
              className="rounded-3 img-fluid"
              style={{ width: "140px", height: "140px", objectFit: "cover" }}
            />
          </div>
          {/* Testimonial Content */}
          <div className="testimonial-content-main flex-grow-1 me-4 ms-4">
            <h4 className="testimonial-uni mb-2">
              {" "}
              University of Greater Manchester{" "}
            </h4>
            <p className="testimonial-text">
              "Vigica Consult made my study abroad journey seamless. From visa
              application to accommodation, their support was invaluable. I
              highly recommend their services to anyone looking to study
              abroad."
            </p>
            <strong className="testimonial-author">Mercy Oji Ojii</strong>
          </div>
          {/* Other Testimonial Images */}
          <div className="testimonial-img-list d-flex gap-3 ms-4">
            <img
              src={studentImage2}
              alt="Student"
              className="rounded-3 img-fluid"
              style={{ width: "90px", height: "90px", objectFit: "cover" }}
            />
            <img
              src={studentImage3}
              alt="Student"
              className="rounded-3 img-fluid"
              style={{ width: "90px", height: "90px", objectFit: "cover" }}
            />
            <img
              src={studentImage4}
              alt="Student"
              className="rounded-3 img-fluid"
              style={{ width: "90px", height: "90px", objectFit: "cover" }}
            />
          </div>
        </div>
        <i className="fa-solid fa-plane testimonial-plane plane-bottom"></i>
        {/* Carousel Controls */}
        <div className="testimonial-carousel-controls">
          <button className="carousel-btn me-2" aria-label="Previous">
            <i className="fa-solid fa-arrow-left"></i>
          </button>
          <button className="carousel-btn" aria-label="Next">
            <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default TestimonialsSection;
