import { Link } from "react-router-dom";

function PrivacyPolicy() {
  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#f9f9fb", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#2135b0", color: "#fff", padding: "48px 24px 40px", textAlign: "center" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontSize: "14px", opacity: 0.8 }}>
          ← Back to Home
        </Link>
        <h1 style={{ margin: "16px 0 8px", fontSize: "36px", fontWeight: 700, letterSpacing: "-0.5px" }}>
          Privacy Policy
        </h1>
        <p style={{ opacity: 0.85, fontSize: "15px", margin: 0 }}>
          Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 80px" }}>

        <Section title="1. Introduction">
          <p>
            VIGICA Consult Ltd ("we", "our", or "us") is committed to protecting your personal information
            and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use our website at{" "}
            <a href="https://vigicaconsult.com" style={{ color: "#2135b0" }}>vigicaconsult.com</a> and
            our application platform.
          </p>
          <p>
            We are a multidimensional consultancy firm headquartered at Okay Centre, Okay Water Federal
            Housing Authority, Lugbe, Abuja, Nigeria, offering services in international education
            recruitment, visa advisory, travel logistics, and accommodation solutions.
          </p>
          <p>
            If you have any questions or concerns about this policy, contact us at{" "}
            <a href="mailto:info@vigicaconsult.com" style={{ color: "#2135b0" }}>info@vigicaconsult.com</a>.
          </p>
        </Section>

        <Section title="2. Information We Collect">
          <p>We collect information you provide directly to us, including:</p>
          <ul>
            <li><strong>Account Information:</strong> Your name, email address, and profile picture when you register or sign in using Google OAuth.</li>
            <li><strong>Application Data:</strong> Academic records, qualifications, work experience, personal statements, and supporting documents submitted as part of a university or visa application.</li>
            <li><strong>Contact Information:</strong> Full name, phone number, country of nationality, country of residence, and study destination submitted via our enquiry or consultation forms.</li>
            <li><strong>Communication Data:</strong> Messages and correspondence you send us.</li>
            <li><strong>Usage Data:</strong> Information about how you interact with our platform, including browser type, IP address, pages visited, and timestamps.</li>
          </ul>
        </Section>

        <Section title="3. How We Use Your Information">
          <p>We use the information we collect to:</p>
          <ul>
            <li>Create and manage your account on our platform</li>
            <li>Process and support your university or visa application</li>
            <li>Provide personalised consultancy, advisory, and support services</li>
            <li>Communicate with you about your application status and enquiries</li>
            <li>Send service-related updates and notifications</li>
            <li>Improve our platform and services</li>
            <li>Comply with applicable legal obligations</li>
          </ul>
        </Section>

        <Section title="4. Google Sign-In">
          <p>
            Our platform offers sign-in via Google OAuth 2.0. When you choose to sign in with Google,
            we receive your name, email address, and profile picture from Google. We do not receive
            your Google password. The information received is used solely to create or access your
            VIGICA Consult account.
          </p>
          <p>
            Your use of Google Sign-In is also subject to{" "}
            <a href="https://policies.google.com/privacy" target="_blank" rel="noreferrer" style={{ color: "#2135b0" }}>
              Google's Privacy Policy
            </a>.
          </p>
        </Section>

        <Section title="5. Sharing Your Information">
          <p>We may share your information with:</p>
          <ul>
            <li><strong>Partner Universities and Institutions:</strong> Such as Leeds Beckett University, De Montfort University, and Robert Gordon University, as necessary to process your application.</li>
            <li><strong>Government Bodies:</strong> Including visa authorities and immigration services where required for your application.</li>
            <li><strong>Service Providers:</strong> Third-party vendors who assist us in operating our platform (e.g. cloud hosting, email delivery).</li>
            <li><strong>Legal Authorities:</strong> Where required by law or to protect our legal rights.</li>
          </ul>
          <p>We do not sell your personal information to any third party.</p>
        </Section>

        <Section title="6. Data Retention">
          <p>
            We retain your personal information for as long as your account is active or as needed to
            provide you with our services. If you wish to delete your account or request that we no
            longer use your information, contact us at{" "}
            <a href="mailto:info@vigicaconsult.com" style={{ color: "#2135b0" }}>info@vigicaconsult.com</a>.
            We will retain and use your information as necessary to comply with our legal obligations,
            resolve disputes, and enforce our agreements.
          </p>
        </Section>

        <Section title="7. Security">
          <p>
            We implement appropriate technical and organisational measures to protect your personal
            information against unauthorised access, alteration, disclosure, or destruction. Your
            account is protected by JWT-based authentication, and all data is transmitted over HTTPS.
            However, no method of transmission over the internet is 100% secure.
          </p>
        </Section>

        <Section title="8. Your Rights">
          <p>Depending on your location, you may have the right to:</p>
          <ul>
            <li>Access the personal information we hold about you</li>
            <li>Request correction of inaccurate data</li>
            <li>Request deletion of your personal data</li>
            <li>Object to or restrict our processing of your data</li>
            <li>Withdraw consent at any time where processing is based on consent</li>
          </ul>
          <p>
            To exercise any of these rights, contact us at{" "}
            <a href="mailto:info@vigicaconsult.com" style={{ color: "#2135b0" }}>info@vigicaconsult.com</a>.
          </p>
        </Section>

        <Section title="9. Cookies">
          <p>
            We use cookies and similar tracking technologies to maintain your session and improve your
            experience on our platform. These include authentication cookies that keep you logged in.
            You can instruct your browser to refuse all cookies, but some features of our platform may
            not function properly without them.
          </p>
        </Section>

        <Section title="10. Changes to This Policy">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any significant
            changes by posting the new policy on this page with an updated date. We encourage you to
            review this policy periodically.
          </p>
        </Section>

        <Section title="11. Contact Us">
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <div style={{ background: "#f0f3ff", borderLeft: "4px solid #2135b0", padding: "16px 20px", borderRadius: "4px", marginTop: "12px" }}>
            <p style={{ margin: "4px 0" }}><strong>VIGICA Consult Ltd</strong></p>
            <p style={{ margin: "4px 0" }}>Okay Centre, Okay Water Federal Housing Authority, Lugbe, Abuja, Nigeria</p>
            <p style={{ margin: "4px 0" }}>Email: <a href="mailto:info@vigicaconsult.com" style={{ color: "#2135b0" }}>info@vigicaconsult.com</a></p>
            <p style={{ margin: "4px 0" }}>Phone: +234 913 543 0319</p>
            <p style={{ margin: "4px 0" }}>Hours: Mon – Sat, 9:00am – 6:00pm</p>
          </div>
        </Section>

      </div>

      {/* Footer */}
      <div style={{ background: "#2135b0", color: "#fff", textAlign: "center", padding: "20px", fontSize: "14px" }}>
        © {new Date().getFullYear()} VIGICA Consult Ltd. All rights reserved. &nbsp;|&nbsp;{" "}
        <Link to="/terms" style={{ color: "#fff", opacity: 0.8 }}>Terms of Service</Link>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: "36px" }}>
      <h2 style={{ color: "#2135b0", fontSize: "20px", fontWeight: 700, marginBottom: "12px", borderBottom: "2px solid #e8ecf8", paddingBottom: "8px" }}>
        {title}
      </h2>
      <div style={{ color: "#444", lineHeight: "1.8", fontSize: "15px" }}>
        {children}
      </div>
    </div>
  );
}

export default PrivacyPolicy;
