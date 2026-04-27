import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FaQuoteLeft, FaPlay, FaTrophy, FaMedal, FaAward, FaStar,
  FaChevronLeft, FaChevronRight, FaCheckCircle, FaGraduationCap,
  FaHandshake, FaUsers, FaGlobe, FaPlane,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Header from "../components/landing/Header";
import drGideon from "../assets/images/dr-gideon.jpg";
import emmanuel from "../assets/images/emmanuel-ceo.jpeg";
import UoGMAward from "../assets/images/UoGM-award.jpeg";
import UoGMAwardDrGideon from "../assets/images/UoGM-award-dr-gideon.jpeg";
import Isaiah from "../assets/images/Isaiah.jpg";
import DrSteve from "../assets/images/Dr_steve.jpeg";

// ─── Data ─────────────────────────────────────────────────────────────────────

const CONSULTANT = {
  name: "Dr. Gideon Okorie",
  title: "Ebonyi State Scholarship Liaison Officer / Chief Consultant",
  photo: drGideon,
  awardPhoto: UoGMAwardDrGideon,
  awardCaption: "Best Mentor of the Year – FON Scholars, University of Greater Manchester",
  topic: "Reflecting on the Mentorship Award and the Ebonyi State Scholarship Journey",
  speech: `While pursuing my MBA in Global Healthcare Management at the University of Greater Manchester, serving as both Class Representative and Student Ambassador strengthened my resolve to become a person of value rather than merely someone who is successful.

My six years' experience at the National Agency for the Control of AIDS (NACA), largely focused on coordination, proved instrumental in shaping the role that ultimately led to this award. During my time there, I worked within teams coordinating activities related to the Millennium Development Goals, the Sustainable Development Goals and Global Fund initiatives.

An opportunity to participate in coordinating the University of Greater Manchester Medical School Summer School Programme for visiting Chinese students was transformative. I witnessed first-hand how quickly young people, on average just 18 years old, could absorb knowledge when given the right exposure. It was a powerful moment of realisation: young people from Ebonyi State deserved similar exposure.

My vision evolved further when His Excellency Francis Ogbonna Nwifuru announced his intention to revive the abandoned Ebonyi State Scholarship Scheme — declaring his commitment to sponsoring at least 1,000 students from Master's to PhD level, with 300 to receive overseas scholarships.

I owe profound gratitude to my Programme Director, Ms Clare Swadrick, whose mentorship changed my life. She introduced me to the Provost of the University of Greater Manchester, Professor Hanzlot Zubair, who arranged and hosted a high-level delegation from the Ebonyi State Government, ultimately leading to Executive Council approval for 128 scholars.

Special appreciation goes to VIGICA Consult Limited (VCL) and the University's Admissions Unit for ensuring a seamless process and delivering comprehensive pre-departure briefings. Upon arrival in the UK, scholars were transported from London to prepared accommodation, with interim financial support provided.

Beyond academic pursuits, social and cultural integration formed an essential part of the agenda. Weekly training sessions on CV writing, interview techniques, and job search strategies equipped the Ebonyi scholars with practical skills. Shortly afterwards, many began securing part-time roles to supplement their income.

Most importantly, over 80% graduated with Distinction, while the remainder achieved Merit. This experience has reaffirmed that true leadership lies not in titles, but in service. The journey continues.`,
};

const MANAGER = {
  name: "Mr. Emmanuel Ajah",
  title: "CEO, VIGICA Consult Limited",
  photo: emmanuel,
  awardPhoto: UoGMAward,
  awardCaption: "Outstanding Scholar Support – FON Scholars, University of Greater Manchester",
  topic: "Message from the CEO",
  speech: `At VIGICA Consult Limited, we believe that strategic investment in education and human capital remains one of the most powerful drivers of sustainable national development. Our mission extends beyond facilitating international study opportunities; we are committed to designing and managing structured education programmes that deliver measurable, long-term value.

Through strong partnerships with public institutions, universities, and international stakeholders, we have developed a model built on strategic student placement, robust institutional relationships, rigorous academic monitoring, and disciplined financial oversight.

Our work supporting the Ebonyi State Government's international scholarship initiative demonstrates the impact that well-structured programmes can achieve. By guiding scholars from postgraduate study into advanced doctoral research at leading UK universities, the initiative illustrates how global academic exposure can cultivate highly skilled professionals.

A Chartered Accountant by training, I bring a strong foundation in financial stewardship, governance, and strategic leadership to the education sector. My professional background spans accounting, management consulting, and senior-level education advisory.

As we look ahead, our focus remains clear: to deepen international partnerships and expand opportunities that empower the next generation of scholars, researchers, and leaders. We remain committed to delivering programmes defined by academic excellence, sound governance, and measurable impact.`,
};

const CLIENT_TESTIMONIALS = [
  { id: 1, videoId: "cPDbFdOF248", isShort: true, quote: "Expert testimony from Partner organisation speaks on the collaboration with VIGICA Consult Ltd.", name: "Mistry Puspa", caption: "Leeds Beckett University, UK" },
  //{ id: 2, videoId: "gwZJCqX8SgI", isShort: false, quote: "Testimonials from the Ebonyi State Scholarship Board on Successful completion by their scholars.", name: "Ebonyi State Scholarship Board", caption: "Scholarship Board Testimonial" },
  { id: 3, videoId: "ZwTFTwiqiF8", isShort: true, quote: "VIGICA Consult made my study abroad dream a reality. Their guidance was exceptional from start to finish.", name: "Nwankwo Evaristus", caption: "MSc Data Analytics, University of Greater Manchester" },
  { id: 4, videoId: "oZ16_O34sFc", isShort: true, quote: "The support and mentorship I received through VIGICA was truly life-changing.", name: "Ugwoke Edward", caption: "MSc Software Engineering, University of Greater Manchester" },
  { id: 5, videoId: "7nzqUUFqH4M", isShort: true, quote: "VIGICA opened doors I never thought possible. I am proud to be studying AI at a top UK university.", name: "Cynthia Uduma", caption: "MSc Artificial Intelligence, University of Greater Manchester" },
];

const EXPERTS = [
  { id: 1, name: "Dr. Ikporo Stephen", title: "Secretary, Ebonyi State Scholarship Board", institution: "Ebonyi State Government", photo: DrSteve, remark: "VIGICA CONSULT LIMITED stands out in the Nigerian consulting space for its holistic approach. They don't just place students they prepare them for global success." },
];

const AWARDS = [
  { id: 1, title: "Outstanding Scholar Support", organization: "FON Scholars, University of Greater Manchester", year: "2025", description: "Recognised for excellence in student placement and support services.", icon: "trophy" },
  { id: 2, title: "Best Mentor Award", organization: "FON Scholars, University of Greater Manchester", year: "2025", description: "Recognised for exceptional mentorship and guidance provided to students.", icon: "medal" },
];

const SERVICES = [
  { num: "01", icon: <FaGlobe />, title: "International Student Recruitment", desc: "We connect students to reputable institutions across the globe, guiding them through every stage from application to enrolment with personalised support and strategic institutional relationships." },
  { num: "02", icon: <FaPlane />, title: "Travel & Accommodation Support", desc: "We provide seamless travel logistics and secure accommodation solutions, ensuring a smooth transition abroad from airport transfers to pre-arranged housing near universities." },
  { num: "03", icon: <FaUsers />, title: "Student Support Services", desc: "Our commitment extends beyond placement. We offer CV coaching, integration workshops, cultural guidance, and personal welfare assistance helping students adapt and succeed." },
  { num: "04", icon: <FaHandshake />, title: "Institutional Partnerships", desc: "We facilitate transnational collaborations between educational and corporate institutions, fostering innovation, knowledge exchange, and long-term partnerships." },
];

const WHY_US = [
  { num: "01", title: "Integrity", desc: "We uphold transparency and trust in all our engagements, ensuring every client receives honest, unbiased guidance." },
  { num: "02", title: "Efficiency", desc: "We deliver timely and reliable solutions every process is streamlined so students and partners experience no unnecessary delays." },
  { num: "03", title: "Excellence", desc: "We are committed to high standards in every dimension of service delivery from administrative precision to academic outcomes." },
  { num: "04", title: "Client-Focused", desc: "Every solution is tailored to meet specific needs. We listen, we adapt, and we measure our success by yours." },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function ReadMoreText({ text, limit = 200 }) {
  const [expanded, setExpanded] = useState(false);
  if (!text || text.length <= limit) return <span>{text}</span>;
  return (
    <span>
      {expanded ? text : text.slice(0, limit).trimEnd() + "…"}
      <button onClick={() => setExpanded(v => !v)} style={{ color: "#2135b0", background: "none", border: "none", cursor: "pointer", fontWeight: 600, marginLeft: 4, fontSize: 14 }}>
        {expanded ? " Read less" : " Read more"}
      </button>
    </span>
  );
}

function ReadMoreParagraphs({ text, visibleCount = 2, dark = false }) {
  const [expanded, setExpanded] = useState(false);
  const paras = text.split("\n\n").map(p => p.trim()).filter(Boolean);
  const shown = expanded ? paras : paras.slice(0, visibleCount);
  const hasMore = paras.length > visibleCount;
  return (
    <>
      {shown.map((para, i) => (
        <p key={i} style={{ marginBottom: 18, lineHeight: 1.85, color: dark ? "rgba(255,255,255,0.72)" : "#4A4440", fontWeight: 300, fontSize: 16 }}>{para}</p>
      ))}
      {hasMore && (
        <button onClick={() => setExpanded(v => !v)} style={{ color: dark ? "#fff" : "#2135b0", background: "none", border: `1.5px solid ${dark ? "rgba(255,255,255,0.3)" : "#2135b0"}`, borderRadius: 6, padding: "8px 20px", cursor: "pointer", fontWeight: 500, fontSize: 14, marginTop: 8 }}>
          {expanded ? "Read less ▲" : "Read more ▼"}
        </button>
      )}
    </>
  );
}

const getThumb = id => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
const getUrl = (id, isShort) => isShort ? `https://www.youtube.com/shorts/${id}` : `https://www.youtube.com/watch?v=${id}`;

const AwardIcon = ({ type }) => {
  if (type === "trophy") return <FaTrophy style={{ fontSize: 24, color: "#2135b0" }} />;
  if (type === "medal") return <FaMedal style={{ fontSize: 24, color: "#2135b0" }} />;
  return <FaAward style={{ fontSize: 24, color: "#2135b0" }} />;
};

const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: { opacity: 1, y: 0, transition: { duration: 0.65 } } };
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };

// ─── Styles (CSS-in-JS via style tags) ────────────────────────────────────────

const css = `
  .about-page-v2 * { box-sizing: border-box; }
  .about-page-v2 { font-family: 'Segoe UI', system-ui, sans-serif; background: #fff; color: #1C1714; }

  /* Hero */
  /* Hero */
  .ap-hero { position: relative; overflow: hidden; min-height: 560px; display: flex; align-items: center; padding: 80px 40px; padding-top: 160px; background: url('https://res.cloudinary.com/dd4bl9gwo/image/upload/v1777323366/ChatGPT_Image_Apr_27_2026_09_55_36_PM_ob2y8d.png') center center / cover no-repeat; }
  .ap-hero-pattern { position: absolute; inset: 0; background: rgba(18, 37, 60, 0.55); }
  .ap-hero-ring { position: absolute; right: -120px; bottom: -120px; width: 560px; height: 560px; border-radius: 50%; border: 64px solid rgba(33,53,176,0.15); pointer-events: none; }
  .ap-hero-ring2 { position: absolute; right: 80px; bottom: 80px; width: 240px; height: 240px; border-radius: 50%; border: 2px solid rgba(33,53,176,0.25); pointer-events: none; }
  .ap-hero-inner { position: relative; max-width: 1120px; margin: 0 auto; width: 100%; }
  .ap-eyebrow-line { display: inline-flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: #7B9CFF; margin-bottom: 28px; }
  .ap-eyebrow-line::before { content: ''; display: block; width: 32px; height: 1.5px; background: #2135b0; }

  /* Shared */
  .ap-section { padding: 96px 24px; }
  .ap-inner { max-width: 1120px; margin: 0 auto; }
  .ap-eyebrow { font-size: 11px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; color: #2135b0; margin-bottom: 12px; display: block; }
  .ap-title { font-size: clamp(28px,3.5vw,44px); font-weight: 700; line-height: 1.18; color: #1C1714; letter-spacing: -0.3px; }
  .ap-title em { font-style: italic; color: #2135b0; }
  .ap-sub { font-size: 17px; font-weight: 300; color: #807873; margin-top: 14px; max-width: 560px; line-height: 1.7; }

  /* About layout */
  .ap-about-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 72px; align-items: center; margin-top: 56px; }
  .ap-about-text p { font-size: 16px; color: #4A4440; line-height: 1.85; margin-bottom: 20px; font-weight: 300; }
  .ap-stats { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; border-radius: 20px; overflow: hidden; border: 1px solid #E8E4DF; }
  .ap-stat { padding: 32px 28px; background: #fff; border: 1px solid #E8E4DF; transition: background .2s; }
  .ap-stat:hover { background: #EEF1FF; }
  .ap-stat--accent { background: #2135b0; border-color: #2135b0; }
  .ap-stat--accent:hover { background: #1a2b99; }
  .ap-stat-num { font-size: 40px; font-weight: 700; line-height: 1; color: #2135b0; margin-bottom: 8px; }
  .ap-stat--accent .ap-stat-num { color: #fff; }
  .ap-stat-label { font-size: 13px; font-weight: 400; color: #807873; }
  .ap-stat--accent .ap-stat-label { color: rgba(255,255,255,.65); }

  /* Services */
  .ap-services-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 56px; gap: 32px; }
  .ap-services-grid { display: grid; grid-template-columns: repeat(2,1fr); gap: 2px; border-radius: 20px; overflow: hidden; border: 1px solid #E8E4DF; }
  .ap-service { background: #fff; padding: 44px 40px; position: relative; overflow: hidden; transition: background .25s; cursor: default; }
  .ap-service:hover { background: #EEF1FF; }
  .ap-service::before { content: attr(data-num); position: absolute; top: -8px; right: 24px; font-size: 96px; font-weight: 700; color: #EEF1FF; line-height: 1; pointer-events: none; transition: color .25s; font-style: italic; }
  .ap-service:hover::before { color: #dde3ff; }
  .ap-service-icon { width: 48px; height: 48px; border-radius: 6px; background: #EEF1FF; display: flex; align-items: center; justify-content: center; margin-bottom: 24px; transition: background .25s; color: #2135b0; font-size: 20px; }
  .ap-service:hover .ap-service-icon { background: #dde3ff; }
  .ap-service h3 { font-size: 20px; font-weight: 600; line-height: 1.3; color: #1C1714; margin-bottom: 14px; position: relative; }
  .ap-service p { font-size: 15px; font-weight: 300; color: #807873; line-height: 1.75; position: relative; }

  /* Why Us */
  .ap-why { background: #12253C; }
  .ap-why .ap-eyebrow { color: #7B9CFF; }
  .ap-why .ap-title { color: #fff; }
  .ap-why-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1px; background: rgba(255,255,255,.1); border-radius: 20px; overflow: hidden; margin-top: 56px; }
  .ap-why-card { background: #12253C; padding: 40px 32px; transition: background .2s; }
  .ap-why-card:hover { background: #1a3350; }
  .ap-why-num { font-size: 13px; font-weight: 500; color: #7B9CFF; margin-bottom: 20px; display: block; letter-spacing: 1px; }
  .ap-why-divider { width: 32px; height: 2px; background: #2135b0; margin-bottom: 20px; }
  .ap-why-card h4 { font-size: 20px; font-weight: 600; color: #fff; margin-bottom: 12px; }
  .ap-why-card p { font-size: 14px; font-weight: 300; color: rgba(255,255,255,.55); line-height: 1.75; }

  /* Vision Mission */
  .ap-vm-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-top: 64px; border-radius: 20px; overflow: hidden; }
  .ap-vm { padding: 56px 52px; position: relative; overflow: hidden; }
  .ap-vm--vision { background: #2135b0; }
  .ap-vm--mission { background: #EEF1FF; border: 1px solid #dde3ff; }
  .ap-vm-label { font-size: 11px; font-weight: 500; letter-spacing: 2.5px; text-transform: uppercase; margin-bottom: 24px; display: block; }
  .ap-vm--vision .ap-vm-label { color: #7B9CFF; }
  .ap-vm--mission .ap-vm-label { color: #2135b0; }
  .ap-vm h3 { font-size: clamp(20px,2.5vw,28px); font-weight: 600; line-height: 1.4; }
  .ap-vm--vision h3 { color: #fff; }
  .ap-vm--mission h3 { color: #1C1714; }
  .ap-vm-quote { position: absolute; bottom: 24px; right: 28px; font-size: 120px; line-height: 1; opacity: .1; font-weight: 700; pointer-events: none; color: #fff; }
  .ap-vm--mission .ap-vm-quote { color: #2135b0; }

  /* Speeches */
  .ap-speech-section { padding: 96px 24px; }
  .ap-speech-section--light { background: #fff; }
  .ap-speech-section--muted { background: #F9F7F4; }
  .ap-speech-block { display: grid; grid-template-columns: 1fr 2fr; gap: 60px; align-items: start; max-width: 1120px; margin: 0 auto; }
  .ap-speech-block--rev { grid-template-columns: 2fr 1fr; }
  .ap-speech-photo { border-radius: 20px; overflow: hidden; box-shadow: 0 8px 40px rgba(0,0,0,.12); margin-bottom: 20px; }
  .ap-speech-photo img { width: 100%; display: block; aspect-ratio: 4/5; object-fit: cover; }
  .ap-speech-award { border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,.08); }
  .ap-speech-award img { width: 100%; display: block; }
  .ap-speech-award-cap { padding: 12px 16px; background: #12253C; }
  .ap-speech-award-cap p { color: rgba(255,255,255,.8); font-size: 13px; margin: 0; line-height: 1.5; }
  .ap-speech-name { color: #12253C; font-size: 30px; font-weight: 700; margin-top: 8px; margin-bottom: 4px; letter-spacing: -0.3px; }
  .ap-speech-role { color: #2135b0; font-weight: 600; font-size: 15px; margin-bottom: 8px; }
  .ap-speech-topic { color: #4A4440; font-size: 17px; font-weight: 500; margin-bottom: 20px; padding-bottom: 16px; border-bottom: 2px solid #E8E4DF; }
  .ap-q-icon { color: #2135b0; font-size: 22px; margin-bottom: 16px; }

  /* Testimonials */
  .ap-testimonials { background: #12253C; padding: 96px 24px; }
  .ap-testimonials .ap-eyebrow { color: #7B9CFF; }
  .ap-testimonials .ap-title { color: #fff; }
  .ap-testimonials .ap-sub { color: rgba(255,255,255,.55); }
  .ap-test-header { display: flex; align-items: flex-end; justify-content: space-between; flex-wrap: wrap; gap: 20px; margin-bottom: 40px; }
  .ap-scroll-btn { width: 44px; height: 44px; border-radius: 50%; border: 1px solid rgba(255,255,255,.2); background: rgba(255,255,255,.08); color: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: background .2s; }
  .ap-scroll-btn:hover { background: rgba(255,255,255,.18); }
  .ap-test-scroll { display: flex; gap: 20px; overflow-x: auto; padding-bottom: 16px; scrollbar-width: none; }
  .ap-test-scroll::-webkit-scrollbar { display: none; }
  .ap-test-card { flex-shrink: 0; width: 300px; background: rgba(255,255,255,.06); border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,.1); }
  .ap-test-thumb { display: block; position: relative; overflow: hidden; aspect-ratio: 16/9; }
  .ap-test-thumb img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ap-test-play { position: absolute; inset: 0; background: rgba(0,0,0,.3); display: flex; align-items: center; justify-content: center; }
  .ap-test-play-btn { width: 44px; height: 44px; border-radius: 50%; background: #2135b0; display: flex; align-items: center; justify-content: center; color: #fff; font-size: 14px; }
  .ap-test-body { padding: 20px; }

  /* Experts */
  .ap-experts-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 24px; margin-top: 48px; }
  .ap-expert-card { background: #fff; border-radius: 20px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,.06); border-top: 4px solid #2135b0; }

  /* Awards */
  .ap-awards-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 24px; margin-top: 48px; }
  .ap-award-card { background: #F9F7F4; border-radius: 20px; padding: 32px; display: flex; gap: 20px; align-items: flex-start; }
  .ap-award-icon { width: 56px; height: 56px; border-radius: 16px; background: #EEF1FF; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .ap-award-year { background: #2135b0; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 10px; border-radius: 999px; display: inline-block; margin-bottom: 8px; }

  /* CTA */
  .ap-cta { background: #F9F7F4; padding: 96px 24px; }
  .ap-cta-inner { max-width: 760px; margin: 0 auto; text-align: center; }
  .ap-cta h2 { font-size: clamp(32px,4vw,52px); font-weight: 700; color: #1C1714; line-height: 1.18; letter-spacing: -0.3px; margin-bottom: 20px; }
  .ap-cta h2 em { font-style: italic; color: #2135b0; }
  .ap-cta p { font-size: 17px; font-weight: 300; color: #807873; margin-bottom: 40px; line-height: 1.7; }
  .ap-cta-btns { display: flex; gap: 14px; justify-content: center; flex-wrap: wrap; }
  .ap-btn-primary { display: inline-flex; align-items: center; gap: 8px; background: #2135b0; color: #fff; font-size: 15px; font-weight: 500; padding: 14px 28px; border-radius: 6px; text-decoration: none; transition: background .2s, transform .15s; }
  .ap-btn-primary:hover { background: #1a2b99; transform: translateY(-1px); }
  .ap-btn-secondary { display: inline-flex; align-items: center; gap: 8px; background: transparent; color: #2135b0; font-size: 15px; font-weight: 500; padding: 14px 28px; border-radius: 6px; border: 1.5px solid #2135b0; text-decoration: none; transition: background .2s; }
  .ap-btn-secondary:hover { background: #EEF1FF; }

  /* Responsive */
  @media (max-width: 900px) {
    .ap-about-layout { grid-template-columns: 1fr; gap: 48px; }
    .ap-services-grid { grid-template-columns: 1fr; }
    .ap-why-grid { grid-template-columns: repeat(2,1fr); }
    .ap-vm-grid { grid-template-columns: 1fr; }
    .ap-services-header { flex-direction: column; }
    .ap-speech-block, .ap-speech-block--rev { grid-template-columns: 1fr; }
  }
  @media (max-width: 600px) {
    .ap-section, .ap-speech-section, .ap-testimonials, .ap-cta { padding: 64px 20px; }
    .ap-hero { padding: 60px 20px; }
    .ap-why-grid { grid-template-columns: 1fr; }
    .ap-stats { grid-template-columns: 1fr; }
    .ap-vm { padding: 40px 28px; }
  }
`;

// ─── Component ────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const testimonialsRef = useRef(null);

  const scrollTestimonials = dir => {
    testimonialsRef.current?.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  return (
    <>
      <style>{css}</style>
      <div className="about-page-v2">
        <Header />

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="ap-hero">
          <div className="ap-hero-pattern" />
          <div className="ap-hero-ring" />
          <div className="ap-hero-ring2" />
          <div className="ap-hero-inner">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="ap-eyebrow-line">About VIGICA Consult</div>
              <h1 style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", fontSize: "clamp(40px,5vw,64px)", fontWeight: 700, lineHeight: 1.12, color: "#fff", maxWidth: 720, marginBottom: 24, letterSpacing: "-0.5px" }}>
                Bridging <em style={{ fontStyle: "italic", color: "#fed016" }}>People,</em><br />Institutions &amp; Opportunity
              </h1>
              <p style={{ fontSize: 18, fontWeight: 300, lineHeight: 1.7, color: "rgba(255,255,255,.72)", maxWidth: 520, marginBottom: 36 }}>
                Headquartered in Abuja, Nigeria delivering tailored, high-impact solutions to students, institutions, travellers, and corporate partners across the globe.
              </p>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "rgba(255,255,255,.9)" }} >
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#051ceb", display: "inline-block" }} />
                Abuja, Nigeria &nbsp;·&nbsp; Partnering with leading UK universities
              </div>
            </motion.div>
          </div>
        </section>

        {/* ── About + Stats ─────────────────────────────────────── */}
        <section className="ap-section" style={{ background: "#fff" }}>
          <div className="ap-inner">
            <div className="ap-about-layout">
              <motion.div className="ap-about-text" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <span className="ap-eyebrow">Who We Are</span>
                <h2 className="ap-title" style={{ marginBottom: 24 }}>
                  A forward-thinking<br /><em>education partner</em>
                </h2>
                <p>We are a forward-thinking organisation dedicated to delivering tailored, high-impact solutions to students, institutions, travellers, and corporate partners. Our approach is rooted in understanding unique needs and providing services that create real, measurable value.</p>
                <p>Through strong partnerships with public institutions, universities, and international stakeholders, we have built a model grounded in strategic placement, rigorous academic monitoring, and disciplined financial oversight.</p>
                <p>From guiding individuals through applications to managing large-scale government scholarship programmes, VIGICA CONSULT LIMITED delivers at every scale with integrity, efficiency, and excellence as our constant standards.</p>
              </motion.div>

              <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <div className="ap-stats">
                  {[
                    { num: "128", label: "Scholars placed at UK universities", accent: false },
                    { num: "98%", label: "Graduated with Distinction or Merit", accent: true },
                    { num: "£2.56M", label: "In tuition savings secured", accent: false },
                    { num: "100%", label: "Progressed to PhD programmes", accent: false },
                  ].map((s, i) => (
                    <motion.div key={i} variants={fadeUp} className={`ap-stat${s.accent ? " ap-stat--accent" : ""}`}>
                      <div className="ap-stat-num">{s.num}</div>
                      <div className="ap-stat-label">{s.label}</div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Services ──────────────────────────────────────────── */}
        <section className="ap-section" style={{ background: "#F9F7F4" }}>
          <div className="ap-inner">
            <div className="ap-services-header">
              <div>
                <span className="ap-eyebrow">Our Services</span>
                <h2 className="ap-title">What we do</h2>
              </div>
              <p className="ap-sub" style={{ marginTop: 0 }}>End-to-end solutions at every stage of the international education journey.</p>
            </div>
            <motion.div className="ap-services-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {SERVICES.map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="ap-service" data-num={s.num}>
                  <div className="ap-service-icon">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Why Choose Us ─────────────────────────────────────── */}
        <section className="ap-section ap-why">
          <div className="ap-inner">
            <span className="ap-eyebrow">Why Choose Us</span>
            <h2 className="ap-title">Built on principles that<br />last</h2>
            <motion.div className="ap-why-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {WHY_US.map((w, i) => (
                <motion.div key={i} variants={fadeUp} className="ap-why-card">
                  <span className="ap-why-num">— {w.num}</span>
                  <div className="ap-why-divider" />
                  <h4>{w.title}</h4>
                  <p>{w.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Vision & Mission ──────────────────────────────────── */}
        <section className="ap-section" style={{ background: "#fff" }}>
          <div className="ap-inner">
            <span className="ap-eyebrow">Our Direction</span>
            <h2 className="ap-title">Vision &amp; <em>Mission</em></h2>
            <motion.div className="ap-vm-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <motion.div variants={fadeUp} className="ap-vm ap-vm--vision">
                <span className="ap-vm-label">Our Vision</span>
                <h3>To be a leading global bridge connecting people, institutions, and opportunities across borders.</h3>
                <div className="ap-vm-quote">"</div>
              </motion.div>
              <motion.div variants={fadeUp} className="ap-vm ap-vm--mission">
                <span className="ap-vm-label">Our Mission</span>
                <h3>To provide efficient, reliable, and innovative services that empower students and organisations to thrive in a global environment.</h3>
                <div className="ap-vm-quote">"</div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* ── Consultant Speech ─────────────────────────────────── *}
        /*<section className="ap-speech-section ap-speech-section--light">
          <motion.div className="ap-speech-block" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div>
              <div className="ap-speech-photo">
                <img src={CONSULTANT.photo} alt={CONSULTANT.name} onError={e => e.target.src = "/default-profile.jpg"} />
              </div>
              {CONSULTANT.awardPhoto && (
                <div className="ap-speech-award">
                  <img src={CONSULTANT.awardPhoto} alt="Award" onError={e => e.target.src = "/default-profile.jpg"} />
                  <div className="ap-speech-award-cap"><p>{CONSULTANT.awardCaption}</p></div>
                </div>
              )}
            </div>
            <div>
              <span className="ap-eyebrow">Our Consultant</span>
              <h2 className="ap-speech-name">{CONSULTANT.name}</h2>
              <p className="ap-speech-role">{CONSULTANT.title}</p>
              {CONSULTANT.topic && <h3 className="ap-speech-topic">{CONSULTANT.topic}</h3>}
              <FaQuoteLeft className="ap-q-icon" />
              <ReadMoreParagraphs text={CONSULTANT.speech} visibleCount={3} />
            </div>
          </motion.div>
        </section>

        {/* ── CEO Speech ────────────────────────────────────────── *}
        <section className="ap-speech-section ap-speech-section--muted">
          <motion.div className="ap-speech-block ap-speech-block--rev" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <div>
              <span className="ap-eyebrow">Our CEO</span>
              <h2 className="ap-speech-name">{MANAGER.name}</h2>
              <p className="ap-speech-role">{MANAGER.title}</p>
              {MANAGER.topic && <h3 className="ap-speech-topic">{MANAGER.topic}</h3>}
              <FaQuoteLeft className="ap-q-icon" />
              <ReadMoreParagraphs text={MANAGER.speech} visibleCount={3} />
            </div>
            <div>
              <div className="ap-speech-photo">
                <img src={MANAGER.photo} alt={MANAGER.name} onError={e => e.target.src = "/default-profile.jpg"} />
              </div>
              {MANAGER.awardPhoto && (
                <div className="ap-speech-award">
                  <img src={MANAGER.awardPhoto} alt="Award" onError={e => e.target.src = "/default-profile.jpg"} />
                  <div className="ap-speech-award-cap"><p>{MANAGER.awardCaption}</p></div>
                </div>
              )}
            </div>
          </motion.div>
        </section>
        {/* ── Testimonials ──────────────────────────────────────── */}
        <section className="ap-testimonials">
          <div className="ap-inner">
            <div className="ap-test-header">
              <div>
                <span className="ap-eyebrow">Testimonials</span>
                <h2 className="ap-title">What Our students Say</h2>
                <p className="ap-sub">Real stories from students whose lives we have helped transform.</p>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                {[-1, 1].map((dir, i) => (
                  <button key={i} className="ap-scroll-btn" onClick={() => scrollTestimonials(dir)}>
                    {dir === -1 ? <FaChevronLeft /> : <FaChevronRight />}
                  </button>
                ))}
              </div>
            </div>
            <div className="ap-test-scroll" ref={testimonialsRef}>
              {CLIENT_TESTIMONIALS.map(t => (
                <div key={t.id} className="ap-test-card">
                  <a href={getUrl(t.videoId, t.isShort)} target="_blank" rel="noopener noreferrer" className="ap-test-thumb">
                    <img src={getThumb(t.videoId)} alt="Testimonial video" onError={e => e.target.src = "/default-profile.jpg"} />
                    <div className="ap-test-play">
                      <div className="ap-test-play-btn"><FaPlay style={{ marginLeft: 2 }} /></div>
                    </div>
                  </a>
                  <div className="ap-test-body">
                    <FaQuoteLeft style={{ color: "#7B9CFF", marginBottom: 10 }} />
                    <p style={{ color: "rgba(255,255,255,.8)", fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>{t.quote}</p>
                    <p style={{ color: "#fff", fontWeight: 700, fontSize: 14, margin: 0 }}>{t.name}</p>
                    <p style={{ color: "rgba(255,255,255,.45)", fontSize: 12, margin: "4px 0 0" }}>{t.caption}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Expert Voices ─────────────────────────────────────── */}
        <section className="ap-section" style={{ background: "#F9F7F4" }}>
          <div className="ap-inner">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: "center", marginBottom: 0 }}>
              <span className="ap-eyebrow" style={{ display: "block", textAlign: "center" }}>Expert Voices</span>
              <h2 className="ap-title" style={{ textAlign: "center" }}>What Experts Say</h2>
              <p className="ap-sub" style={{ margin: "14px auto 0", textAlign: "center" }}>Leading professionals share their perspective on VIGICA CONSULT LIMITED.</p>
            </motion.div>
            <motion.div className="ap-experts-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {EXPERTS.map(e => (
                <motion.div key={e.id} variants={fadeUp} className="ap-expert-card">
                  <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
                    <img src={e.photo} alt={e.name} onError={ev => ev.target.src = "/default-profile.jpg"} style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "3px solid #2135b0" }} />
                    <div>
                      <p style={{ fontWeight: 700, color: "#12253C", margin: 0, fontSize: 16 }}>{e.name}</p>
                      <p style={{ color: "#807873", fontSize: 13, margin: "2px 0 0" }}>{e.title}</p>
                      <p style={{ color: "#2135b0", fontSize: 12, margin: "2px 0 0", fontWeight: 600 }}>{e.institution}</p>
                    </div>
                  </div>
                  <FaQuoteLeft style={{ color: "#2135b0", marginBottom: 10 }} />
                  <p style={{ color: "#4A4440", lineHeight: 1.7, fontSize: 15 }}><ReadMoreText text={e.remark} limit={200} /></p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── Awards ────────────────────────────────────────────── */}
        <section className="ap-section" style={{ background: "#fff" }}>
          <div className="ap-inner">
            <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} style={{ textAlign: "center" }}>
              <span className="ap-eyebrow" style={{ display: "block", textAlign: "center" }}>Recognition</span>
              <h2 className="ap-title" style={{ textAlign: "center" }}>Awards &amp; Achievements</h2>
              <p className="ap-sub" style={{ margin: "14px auto 0", textAlign: "center" }}>Our commitment to excellence has been recognised by leading institutions.</p>
            </motion.div>
            <motion.div className="ap-awards-grid" variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              {AWARDS.map(a => (
                <motion.div key={a.id} variants={fadeUp} className="ap-award-card">
                  <div className="ap-award-icon"><AwardIcon type={a.icon} /></div>
                  <div>
                    <span className="ap-award-year">{a.year}</span>
                    <h4 style={{ color: "#12253C", fontWeight: 700, fontSize: 17, margin: "0 0 4px" }}>{a.title}</h4>
                    <p style={{ color: "#2135b0", fontSize: 13, fontWeight: 600, margin: "0 0 8px" }}>{a.organization}</p>
                    <p style={{ color: "#807873", fontSize: 14, lineHeight: 1.6, margin: 0 }}>{a.description}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────── */}
        <section className="ap-cta">
          <motion.div className="ap-cta-inner" variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <span className="ap-eyebrow" style={{ display: "block", textAlign: "center" }}>Get In Touch</span>
            <h2>Ready to unlock <em>global opportunities?</em></h2>
            <p>Partner with us to open doors to world-class education and international collaboration. We are ready to support your journey every step of the way.</p>
            <div className="ap-cta-btns">
              <Link to="/register" className="ap-btn-primary">
                Start Your Application
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </Link>
              <Link to="/#contact" className="ap-btn-secondary">Book Free Consultation</Link>
            </div>
          </motion.div>
        </section>

      </div>
    </>
  );
}
