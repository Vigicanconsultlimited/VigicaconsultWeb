import React from "react";
import admissionImage from "../../assets/images/admission.png";
import visaImage from "../../assets/images/visa.png";
import resourcesImage from "../../assets/images/resources.png";

const services = [
  {
    img: admissionImage,
    title: "Admissions",
  },
  {
    img: visaImage,
    title: "Apply Visa Online",
  },
  {
    img: resourcesImage,
    title: "Immigration Resources",
  },
];

const ServiceCategoriesSection = () => (
  <section
    style={{
      width: "100%",
      background: "#fff",
      padding: "1.5rem 0 0 0",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    }}
  >
    <div
      style={{
        display: "flex",
        gap: "1.2rem",
        justifyContent: "center",
        flexWrap: "wrap",
        width: "100%",
      }}
    >
      {services.map((srv, idx) => (
        <div
          key={srv.title}
          style={{
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            width: 200,
            minWidth: 150,
            margin: "0.5rem",
            marginBottom: "1rem",
            overflow: "hidden",
            position: "relative",
            zIndex: idx + 1,
          }}
        >
          <img
            src={srv.img}
            alt={srv.title}
            style={{
              width: "100%",
              height: 120,
              objectFit: "cover",
              borderTopLeftRadius: 12,
              borderTopRightRadius: 12,
            }}
          />
          <div
            style={{
              fontFamily: "Poppins, Arial, sans-serif",
              fontWeight: 600,
              fontSize: "1rem",
              color: "#1d1d1d",
              padding: "0.8rem 0",
              textAlign: "center",
            }}
          >
            {srv.title}
          </div>
        </div>
      ))}
    </div>
    <div
      style={{
        width: "100%",
        background: "#2135b0",
        marginTop: -55,
        textAlign: "center",
        padding: "2.5rem 1rem 1.6rem 1rem",
      }}
    >
      <h2
        style={{
          fontFamily: "Bricolage Grotesque, Arial, sans-serif",
          fontWeight: 800,
          color: "#fff",
          fontSize: "clamp(1.1rem, 5vw, 2rem)",
          margin: 0,
          marginBottom: 12,
        }}
      >
        Uparalleled Consultancy from Seasoned Experts
      </h2>
      <p
        style={{
          fontFamily: "Poppins, Arial, sans-serif",
          fontSize: "clamp(0.95rem, 2vw, 1.08rem)",
          color: "#fff",
          maxWidth: 690,
          margin: "0 auto",
          lineHeight: 1.6,
        }}
      >
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc faucibus
        diam ante, et lobortis nulla laoreet quis. Nunc tortor ex, volutpat eget
        ligula ac, placerat fringilla enim. Morbi vehicula tincidunt nisi ac
        eleifend.
      </p>
    </div>
  </section>
);

export default ServiceCategoriesSection;
