import { Link } from "react-router-dom";

function TermsOfService() {
  return (
    <div style={{ fontFamily: "'Georgia', serif", background: "#f9f9fb", minHeight: "100vh" }}>
      {/* Header */}
      <div style={{ background: "#2135b0", color: "#fff", padding: "48px 24px 40px", textAlign: "center" }}>
        <Link to="/" style={{ color: "#fff", textDecoration: "none", fontSize: "14px", opacity: 0.8 }}>
          ← Back to Home
        </Link>
        <h1 style={{ margin: "16px 0 8px", fontSize: "36px", fontWeight: 700, letterSpacing: "-0.5px" }}>
          Terms of Service
        </h1>
        <p style={{ opacity: 0.85, fontSize: "15px", margin: 0 }}>
          Last updated: {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>

      {/* Content */}
      <div style={{ maxWidth: "760px", margin: "0 auto", padding: "48px 24px 80px" }}>

        <Section title="1. Acceptance of Terms">
          <p>
            By accessing or using the VIGICA Consult platform at{" "}
            <a href="https://vigicaconsult.com" style={{ color: "#2135b0" }}>vigicaconsult.com</a>, you
            agree to be bound by these Terms of Service and our{" "}
            <Link to="/privacy-policy" style={{ color: "#2135b0" }}>Privacy Policy</Link>. If you do not
            agree to these terms, please do not use our platform.
          </p>
          <p>
            These terms apply to all users of the platform, including students, applicants, and any
            other visitors.
          </p>
        </Section>

        <Section title="2. About VIGICA Consult">
          <p>
            VIGICA Consult Ltd is a multidimensional consultancy firm headquartered in Abuja, Nigeria,
            offering services in:
          </p>
          <ul>
            <li>International education recruitment and advisory</li>
            <li>University application support and document review</li>
            <li>Visa application assistance</li>
            <li>Flight booking and travel logistics</li>
            <li>Accommodation solutions</li>
            <li>Institutional partnership and collaboration</li>
          </ul>
        </Section>

        <Section title="3. User Accounts">
          <p>To access certain features of our platform, you must create an account. You agree to:</p>
          <ul>
            <li>Provide accurate, complete, and current information during registration</li>
            <li>Maintain the security of your account credentials</li>
            <li>Notify us immediately of any unauthorised use of your account</li>
            <li>Take responsibility for all activities that occur under your account</li>
          </ul>
          <p>
            You may register using your email address or via Google Sign-In. By using Google Sign-In,
            you also agree to Google's Terms of Service.
          </p>
        </Section>

        <Section title="4. Our Services">
          <p>
            VIGICA Consult provides consultancy and advisory services. We do not guarantee admission
            to any university, approval of any visa application, or any specific outcome from our
            services. Our role is to guide, advise, and support your application process.
          </p>
          <p>
            All service fees, timelines, and deliverables will be agreed upon separately between you
            and VIGICA Consult before services commence.
          </p>
        </Section>

        <Section title="5. User Responsibilities">
          <p>As a user of our platform, you agree to:</p>
          <ul>
            <li>Provide truthful and accurate information in all applications and documents</li>
            <li>Not submit fraudulent, misleading, or forged documents</li>
            <li>Not use our platform for any unlawful purpose</li>
            <li>Not attempt to gain unauthorised access to any part of our platform</li>
            <li>Cooperate with our consultants and respond to requests in a timely manner</li>
            <li>Notify us of any changes to your personal or academic circumstances</li>
          </ul>
          <p>
            VIGICA Consult reserves the right to suspend or terminate your account if you violate
            any of these responsibilities.
          </p>
        </Section>

        <Section title="6. Document Submission">
          <p>
            When you submit documents through our platform (including academic transcripts, passports,
            certificates, and personal statements), you confirm that:
          </p>
          <ul>
            <li>All documents are genuine and belong to you</li>
            <li>You have the right to share these documents with us and with partner institutions</li>
            <li>You grant us permission to use these documents solely for the purpose of processing your application</li>
          </ul>
        </Section>

        <Section title="7. Fees and Payments">
          <p>
            Certain services offered by VIGICA Consult may require payment of fees. All fees will be
            communicated to you clearly before any payment is required. Fees paid for completed
            services are generally non-refundable unless otherwise agreed in writing.
          </p>
          <p>
            For enquiries about fees or refunds, contact us at{" "}
            <a href="mailto:info@vigicaconsult.com" style={{ color: "#2135b0" }}>info@vigicaconsult.com</a>.
          </p>
        </Section>

        <Section title="8. Intellectual Property">
          <p>
            All content on the VIGICA Consult platform, including text, graphics, logos, and software,
            is the property of VIGICA Consult Ltd and is protected by applicable intellectual property
            laws. You may not reproduce, distribute, or create derivative works from our content
            without our written permission.
          </p>
        </Section>

        <Section title="9. Third-Party Links and Partners">
          <p>
            Our platform may contain links to third-party websites, including partner universities
            such as Leeds Beckett University, De Montfort University, Robert Gordon University, and
            others. We are not responsible for the content or privacy practices of these external sites.
            We encourage you to review the terms and privacy policies of any third-party sites you visit.
          </p>
        </Section>

        <Section title="10. Limitation of Liability">
          <p>
            To the fullest extent permitted by law, VIGICA Consult Ltd shall not be liable for any
            indirect, incidental, special, or consequential damages arising from your use of our
            platform or services, including but not limited to visa refusals, university rejections,
            or travel disruptions.
          </p>
          <p>
            Our total liability to you for any claim arising out of or relating to these terms shall
            not exceed the amount you paid to us for the specific service giving rise to the claim.
          </p>
        </Section>

        <Section title="11. Termination">
          <p>
            We reserve the right to suspend or terminate your account and access to our platform at
            our discretion, without notice, if you breach these Terms of Service or engage in conduct
            we determine to be harmful to other users or to VIGICA Consult.
          </p>
          <p>
            You may also close your account at any time by contacting us at{" "}
            <a href="mailto:info@vigicaconsult.com" style={{ color: "#2135b0" }}>info@vigicaconsult.com</a>.
          </p>
        </Section>

        <Section title="12. Governing Law">
          <p>
            These Terms of Service are governed by and construed in accordance with the laws of the
            Federal Republic of Nigeria. Any disputes arising under these terms shall be subject to
            the exclusive jurisdiction of the courts of Nigeria.
          </p>
        </Section>

        <Section title="13. Changes to These Terms">
          <p>
            We may update these Terms of Service from time to time. We will notify you of significant
            changes by posting the updated terms on this page with a revised date. Your continued use
            of our platform after any changes constitutes your acceptance of the new terms.
          </p>
        </Section>

        <Section title="14. Contact Us">
          <p>If you have any questions about these Terms of Service, please contact us:</p>
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
        <Link to="/privacy-policy" style={{ color: "#fff", opacity: 0.8 }}>Privacy Policy</Link>
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

export default TermsOfService;
