import React from "react";
import admissionImage from "../../assets/images/studyabroad1.jpg";
import visaImage from "../../assets/images/studyabroad2.jpg";
import resourcesImage from "../../assets/images/studyabroad3.jpg";
import "./StudyAbroadSection.css"; // Import the CSS file

const features = [
  {
    title: "University Finder",
    img: admissionImage,
    points: ["F1 student Visa", "Non Academic visa", "Exchange visitor visa"],
  },
  {
    title: "Student Application",
    img: visaImage,
    points: ["F1 student Visa", "Non Academic visa", "Exchange visitor visa"],
  },
  {
    title: "Document Review",
    img: resourcesImage,
    points: ["F1 student Visa", "Non Academic visa", "Exchange visitor visa"],
  },
  {
    title: "Visa Assistance",
    img: admissionImage, // Replace with actual image
    points: ["F1 student Visa", "Non Academic visa", "Exchange visitor visa"],
  },
];

const StudyAbroadSection = () => (
  <section className="study-abroad-section">
    <div className="container">
      <div className="row align-items-start">
        <div className="container">
          {/* First Div - Study Abroad Content */}
          <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8 mb-5 mb-md-6">
              {" "}
              <div className="study-abroad-header">
                <div className="study-abroad-subtitle">— Study Abroad</div>
                <h2 className="study-abroad-title">
                  Lorem Ipsum Dolor Sit Amet,
                  <br />
                  Consectetur Adipisc Dolor Sit Amet,
                </h2>
                <p className="study-abroad-description">
                  Lorem ipsum porta ex et nisl condorm posuere. Vivamussodales
                  pellentesque ullamcorper mollis velit porta ex et nisl condorm
                  ullamcorper.
                </p>
                <button className="btn btn-primary study-abroad-button">
                  <span className="me-2">📄</span>
                  Start Your Application
                </button>
              </div>
            </div>
          </div>

          {/* Second Div - Features Cards */}
          <div className="row justify-content-center">
            <div className="col-12 col-md-12">
              <div className="row row-cols-1 row-cols-md-2 g-4 study-abroad-features">
                {features.map((f, idx) => (
                  <div key={f.title} className="col">
                    <div className="card h-100 d-flex flex-row border border-primary">
                      <img
                        src={f.img}
                        className="card-img-left img-fluid m-2 pt-2"
                        alt={f.title}
                        style={{
                          width: "40%",
                          objectFit: "cover",
                        }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{f.title}</h5>
                        {/* <p className="card-text">
                          Student Immigration Lorem ipsum dolor sit amet, Lorem
                          ips
                        </p> */}
                        <ul className="list-unstyled">
                          {f.points.map((p) => (
                            <li key={p} className="mb-1 fs-6">
                              <span className="checkmark">&#10003;</span>
                              {p}
                            </li>
                          ))}
                        </ul>
                        <button className="btn btn-outline-primary card-button">
                          Click Here
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default StudyAbroadSection;
