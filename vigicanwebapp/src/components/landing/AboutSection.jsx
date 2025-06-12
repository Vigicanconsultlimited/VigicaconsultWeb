import React from "react";
import aboutImage1 from "../../assets/images/about1.jpg";
import aboutImage2 from "../../assets/images/about2.jpg";

const AboutSection = () => (
  <section
    style={{
      width: "100%",
      background: "#f7f8fa",
      padding: "5.5rem 0 2.5rem 0",
      display: "flex",
      flexDirection: "row",
      gap: "2rem",
      justifyContent: "center",
      alignItems: "center",
      flexWrap: "wrap",
      fontFamily: "Poppins, Arial, sans-serif",
    }}
  >
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        gap: "1.2rem",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <img
        src={aboutImage1}
        alt="Air ticket, passport, globe"
        style={{
          width: 200,
          height: 300,
          objectFit: "cover",
          borderRadius: 10,
          background: "#e6e9f0",
        }}
      />
      <img
        src={aboutImage2}
        alt="Student holding file"
        style={{
          width: 300,
          height: 500,
          objectFit: "cover",
          borderRadius: 10,
          marginLeft: 8,
          background: "#e6e9f0",
        }}
      />
    </div>
    <div
      style={{
        flex: 1,
        minWidth: 260,
        maxWidth: 430,
        marginLeft: "4vw",
        marginRight: "4vw",
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <div
        style={{
          fontFamily: "Poppins, Arial, sans-serif",
          fontSize: "0.92rem",
          fontWeight: 500,
          color: "#2135b0",
          marginBottom: 5,
        }}
      >
        — About Us
      </div>
      <h2
        style={{
          fontFamily: "Bricolage Grotesque, Arial, sans-serif",
          fontWeight: 800,
          fontSize: "clamp(1.3rem, 5vw, 2.1rem)",
          color: "#2135b0",
          margin: "0 0 0.8rem 0",
        }}
      >
        A Multi-dimensional Consultancy Firm
      </h2>
      <p
        style={{
          fontFamily: "Poppins, Arial, sans-serif",
          fontSize: "clamp(0.98rem, 2vw, 1.08rem)",
          color: "#2c2c2c",
          lineHeight: "1.7",
          marginBottom: 14,
        }}
      >
        Lorem ipsum dolor sit amet, Nunc faucibus diam ante, et lobortis nulla
        laoreet quis. Nunc tortor ex, volutpat eget ligula ac, placerat
        fringilla enim. consectetur adipiscing elit. Nunc faucibus diam ante, et
        lobortis nulla laoreet quis. Nunc tortor ex, volutpat eget ligula ac,
        placerat fringilla enim. Morbi vehicula tincidunt nisi ac eleifend.
        Suspendisse bibendum sapien faucibus mauris euismod, non consequat diam
        posuere.
      </p>
      <button
        style={{
          fontFamily: "Poppins, Arial, sans-serif",
          fontWeight: 600,
          backgroundColor: "#2135b0",
          color: "#fff",
          padding: "0.7rem 1.4rem",
          border: "none",
          borderRadius: 8,
          fontSize: "1rem",
          cursor: "pointer",
          alignSelf: "flex-start",
        }}
      >
        <span
          style={{ marginRight: 8, fontSize: "1.2em", verticalAlign: "middle" }}
        >
          📄
        </span>
        Start Your Application
      </button>
    </div>
    <style>{`
      @media (max-width: 900px) {
        section {
          flex-direction: column !important;
          align-items: flex-start !important;
          padding: 3.5rem 0 1.5rem 0;
        }
        section img {
          margin-left: auto !important;
          margin-right: auto !important;
          justifyContent: "center",
          alignItems: "center",
        }
      }
    `}</style>
  </section>
);

export default AboutSection;
