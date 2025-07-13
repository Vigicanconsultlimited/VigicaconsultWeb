import React from "react";
import aboutImage1 from "../../assets/images/about1.jpg";
import aboutImage2 from "../../assets/images/img/vigica-img1.jpg";
//import aboutImage3 from "../../assets/images/about2.jpg";

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
        A Multi-dimensional Consultancy Firm,
      </h2>
      <p
        style={{
          fontFamily: "Poppins, Arial, sans-serif",
          fontSize: "clamp(0.98rem, 2vw, 1.08rem)",
          color: "#2c2c2c",
          lineHeight: "1.7",
          marginBottom: 14,
          textAlign: "justify",
        }}
      >
        specialized services in international education recruitment, advisory,
        programme coordination, travel logistics, and accommodation solutions.
        <br />
        We also facilitate transnational partnership and collaboration between
        institutions. Strategically headquartered in Abuja, Nigeria, we pride
        ourselves on delivering tailored, high-impact services that meet the
        dynamic needs of students, institutions, travelers, and corporate
        partners.
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
        className="btn hero-button text-white py-2 px-4 py-md-3 px-md-3 border-0 d-inline-flex align-items-center mb-5"
      >
        <span
          className="hero-button-icon me-2 d-inline-flex align-items-center justify-content-center"
          style={{
            background: "none",
            borderRadius: 8,
            width: 30,
            height: 30,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Calendar (blue) */}
          <svg
            width="30"
            height="17"
            viewBox="0 0 29 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              display: "block",
              width: "85%",
              height: "85%",

              left: 0,
              top: 0,
            }}
          >
            <path
              d="M26.9476 0H22.261V3.5H19.9178V0H15.2312V3.5H12.888V0H8.20144V3.5H5.85817V0H1.17163C0.860897 0 0.562888 0.122916 0.343164 0.341709C0.12344 0.560501 0 0.857247 0 1.16667L0 22.1667C0 22.4761 0.12344 22.7728 0.343164 22.9916C0.562888 23.2104 0.860897 23.3333 1.17163 23.3333H26.9476C27.2583 23.3333 27.5563 23.2104 27.7761 22.9916C27.9958 22.7728 28.1192 22.4761 28.1192 22.1667V1.16667C28.1192 0.857247 27.9958 0.560501 27.7761 0.341709C27.5563 0.122916 27.2583 0 26.9476 0Z"
              fill="#FEFEFE"
            />
          </svg>
          {/* House (white) */}
          <svg
            width="15"
            height="12"
            viewBox="0 0 10 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              position: "absolute",
              display: "block",
              width: "100%",
              left: "54%",
              top: "50%",
              transform: "translate(-50%,-50%)",
              zIndex: 1,
            }}
          >
            <path
              d="M11.041 7.9494L9.379 6.7667V9.6667C9.379 9.9761 9.2556 10.2728 9.0358 10.4916C8.8161 10.7104 8.5181 10.8333 8.2074 10.8333H5.2784V6.1667C5.2784 5.8572 5.1549 5.5605 4.9352 5.3417C4.7155 5.1229 4.4175 5 4.1067 5H2.9351C2.6244 5 2.3263 5.1229 2.1066 5.3417C1.8869 5.5605 1.7635 5.8572 1.7635 6.1667V10.8333H-1.1657C-1.4764 10.8333 -1.7744 10.7104 -1.9941 10.4916C-2.2138 10.2728 -2.3372 9.9761 -2.3372 9.6667V6.7667L-3.9995 7.9494L-5.3615 6.0506L2.8399 0.21729C3.0394 0.07799 3.2772 0.00325 3.5209 0.00325C3.7646 0.00325 4.0024 0.07799 4.2019 0.21729L12.4034 6.0506L11.041 7.9494Z"
              fill="#2135b0"
            />
          </svg>
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
