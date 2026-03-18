import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  FaQuoteLeft,
  FaPlay,
  FaTrophy,
  FaMedal,
  FaAward,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
  FaCheckCircle,
} from "react-icons/fa";
import Header from "../components/landing/Header";
import "../styles/AboutPage.css";
import drGideon from "../assets/images/dr-gideon.jpg";
import emmanuel from "../assets/images/emmanuel-ceo.jpeg";
import UoGMAward from "../assets/images/UoGM-award.jpeg";
import UoGMAwardDrGideon from "../assets/images/UoGM-award-dr-gideon.jpeg";
import Isaiah from "../assets/images/Isaiah.jpg";

const CONSULTANT = {
  name: "Dr. Gideon Okorie",
  title: "Ebonyi State Scholarship Liaison Officer/Chief Consultant",
  photo: drGideon,
  awardPhoto: UoGMAwardDrGideon,
  awardCaption:
    "Best Mentor of the Year – FON Scholars, University of Greater Manchester",
  topic:
    "Reflecting on the Mentorship Award and the Ebonyi State Scholarship Journey",
  speech: `While pursuing my MBA in Global Healthcare Management at the University of Greater Manchester, serving as both Class Representative and Student Ambassador strengthened my resolve to become a person of value rather than merely someone who is successful.

My six years' experience at the National Agency for the Control of AIDS (NACA), largely focused on coordination, proved instrumental in shaping the role that ultimately led to this award. During my time there, I worked within teams coordinating activities related to the Millennium Development Goals, the Sustainable Development Goals and Global Fund initiatives. Although I will not dwell on my work at NACA in this piece, it laid a strong foundation for what was to come.

An opportunity to participate in coordinating the University of Greater Manchester Medical School Summer School Programme for visiting Chinese students was transformative. I witnessed first-hand how quickly young people, on average just 18 years old, could absorb knowledge when given the right exposure. In only three weeks, they developed clarity about their futures, demonstrated technological and medical awareness, and grew into confident public speakers. It was a powerful moment of realisation: young people from Ebonyi State deserved similar exposure.

I began developing a plan to replicate this experience for Ebonyians one that I still hold and which remains relevant. My vision evolved further when His Excellency Francis Ogbonna Nwifuru announced his intention to revive the abandoned Ebonyi State Scholarship Scheme. He declared his commitment to sponsoring at least 1,000 students from Master's to PhD level, with 300 to receive overseas scholarships. Hearing the selection criteria intensified my determination to contribute to the implementation of this noble initiative. I resolved to act selflessly, with the singular aim of ensuring that this investment in human capacity would yield maximum returns for Ebonyi State.

I owe profound gratitude to my Programme Director, Ms Clare Swadrick, whose mentorship changed my life. Upon hearing my vision, she immediately gave it life and introduced me to the Provost of the University of Greater Manchester, Professor Hanzlot Zubair. His work ethic and commitment are unparalleled. After internalising the vision, he arranged and hosted a high-level delegation from the Ebonyi State Government. By the end of their visit, the delegates were convinced that the University, under his leadership, would deliver on its promises. Consequently, the institution was highly recommended to the Governor.

Professor Zubair remained steadfast, handling negotiations including discussions with His Excellency and creating the enabling environment required to actualise this human capacity-building initiative. Following Executive Council approval for 128 scholars to proceed to the University of Greater Manchester, our work intensified.

We refined the selected courses to reflect future-focused priorities, incorporating programmes such as Artificial Intelligence and Engineering Management, which had not been part of the original list. Special appreciation goes to VIGICA Consult Limited (VCL) and the University's Admissions Unit for ensuring a seamless process and delivering comprehensive pre-departure briefings.

Upon arrival in the UK, the scholars were transported from London to prepared accommodation, with interim financial support provided pending the opening of bank accounts. Their arrival was warmly publicised by the Provost, and staff across the University treated them with exceptional care, recognising their potential contribution to landmark research and institutional advancement. In addition to the standard orientation programme, a special welcome dinner was organised in their honour. The Vice-Chancellor, Professor Holmes, alongside other senior staff, attended to share in this significant moment.

Beyond academic pursuits, social and cultural integration formed an essential part of the agenda. Working closely with the University's Careers Department, we organised activities to support the scholars' integration into life in the UK. Weekly training sessions on CV writing, interview techniques, job search strategies and application processes equipped the Ebonyi scholars with practical skills. Shortly afterwards, many began securing part-time roles to supplement their income and support family responsibilities back home.

I must also acknowledge my dear friend, Dr Walter Ugwuocha, who dedicated the last Saturday of every month to mentoring the scholars on adapting to life in the UK. These monthly gatherings, which I facilitated, became platforms for personal development, practical guidance, birthday celebrations and community building. Professor Zubair's presence at one of these sessions further motivated the scholars.

In the early months of scholars' arrival, my daily routine included approving references, resolving accommodation challenges, addressing personal concerns and delivering lectures on cross-cutting topics such as academic referencing. I extended my working hours to ensure their needs were met. At various times, I became adviser, mediator and problem-solver; roles that demanded resilience, fairness, truth and patience.

Just as stability seemed within reach, unforeseen challenges arose, significantly disrupting our plans. Yet, as the saying goes, when life gives you lemons, make lemonade. While there were moments of dissent, the majority of the scholars remained supportive and focused. Their resilience ensured that progress continued, albeit with certain limitations.

Undeterred, the scholars rose to the occasion. VIGICA Consult Limited demonstrated remarkable innovation in mobilising resources and engaging resource personnel who trained scholars in writing PhD proposals, an intervention that proved instrumental in their securing admissions to various universities. The organisation also supported initiatives such as the Christmas White Party and the development of the Year Book. Acting under the instruction of the Scholarship Board, VCL worked diligently to secure reputable institutions for the continuation of PhD scholarships, as directed by His Excellency. This was an arduous task, yet the universities offered reasonable discounts on tuition and bench fees compared with standard published rates, thereby saving Ebonyi State thousands of pounds similar to that enjoyed during their Master's programme.

When I reflect and ask myself whether I truly deserve the Best Mentor of the Year Award from these 128 brilliant minds, I struggle to answer. These scholars have interacted with distinguished individuals across diverse fields. I consider it a privilege that they allowed me to be part of their journey. Their achievements at the University of Greater Manchester are extraordinary. Through structured guidance and collective effort, the scholars developed into leaders. Two representatives served on an executive committee for their course cohort, strengthening their leadership capacity. The African Caribbean Society and the Nigerian Students in Manchester association were formed, both led by scholars from Ebonyi State. One spring a great surprise, serving on the Board of Student Governor of the University of Greater Manchester. Most importantly, over 80% graduated with Distinction, while the remainder achieved Merit. Their heartfelt messages on social media and via personal correspondence, acknowledging the impact of my mentorship, remain among my most cherished rewards. The moment their names will be called at graduation will be transformative, for leadership is ultimately about outcomes, not merely about being ahead.

I am deeply grateful to everyone who contributed to this journey and for the invaluable lessons I have learnt. I must especially appreciate Isaiah Nweze, Ezekiel Nwibo, Ikeogu James, Ndubuisi Augustine and Edward Ugwoke, among others, who have provided unwavering support from the outset. I am equally grateful to the CEO of VIGICA Consult Limited, Mr Ajah Emmanuel Anyata, and to the entire Scholarship Board led by Hon. Chaka Nweze. This experience has reaffirmed that true leadership lies not in titles, but in service.

And so, I invite everyone to celebrate the vision of His Excellency and the triumph of these scholars. Three cheers for the Governor and perhaps one for the Best Mentor of the Year.

The journey continues. Watch this space for an activity-packed PhD programme ahead.
`,
};

const MANAGER = {
  name: "Mr. Emmanuel Ajah",
  title: "CEO",
  photo: emmanuel,
  topic: "Message from the CEO",
  speech: `At VIGICA Consult Limited, we believe that strategic investment in education and human capital remains one of the most powerful drivers of sustainable national development. Our mission extends beyond facilitating international study opportunities; we are committed to designing and managing structured education programmes that deliver measurable, long-term value for individuals, institutions, governments, and society.

Through strong partnerships with public institutions, universities, and international stakeholders, we have developed a model built on strategic student placement, robust institutional relationships, rigorous academic monitoring, and disciplined financial oversight. This framework ensures that scholarship programmes and individual placements are administered with the highest standards of transparency, efficiency, and accountability.

Our work supporting the Ebonyi State Government’s international scholarship initiative demonstrates the impact that well-structured programmes can achieve. By guiding scholars from postgraduate study into advanced doctoral research at leading UK universities, the initiative illustrates how global academic exposure can cultivate highly skilled professionals capable of contributing meaningfully to national growth and innovation.

A Chartered Accountant by training, I bring a strong foundation in financial stewardship, governance, and strategic leadership to the education sector. My professional background spans accounting, management consulting, and senior-level education advisory, enabling me to lead complex, multi-stakeholder engagements with clarity, compliance, and institutional alignment. This governance-driven approach underpins how we design, manage, and deliver programmes at VIGICA Consult Limited.

As we look ahead, our focus remains clear: to deepen international partnerships and expand opportunities that empower the next generation of scholars, researchers, and leaders. We remain committed to delivering programmes defined by academic excellence, sound governance, and measurable impact for the individuals, institutions, and communities we serve.`,
};

const CLIENT_TESTIMONIALS = [
  {
    id: 1,
    type: "video",
    videoId: "SB56MgkscJA",
    quote:
      "VIGICA Consult made my study abroad dream a reality. Their guidance was exceptional from start to finish.",
    name: "Ndubuisi Augustine",
    caption:
      "Studying Software Engineering at University of Greater Manchester",
    avatar: Isaiah,
  },
  // {
  //   id: 2,
  //   type: "quote",
  //   videoId: null,
  //   quote:
  //     "I was initially overwhelmed by the application process, but VIGICA Consult made everything crystal clear. I am now studying Medicine at a top Canadian university thanks to their unwavering support.",
  //   name: "Fatima Al-Hassan",
  //   caption: "Medical Student, University of Toronto, Canada",
  //   avatar: "/default-profile.jpg",
  // },
  // {
  //   id: 3,
  //   type: "video",
  //   videoId: "SB56MgkscJA", // ← Replace with real YouTube video ID
  //   quote:
  //     "The scholarship support I received was incredible. I never believed I could study in the UK debt-free, but VIGICA made it happen!",
  //   name: "Chisom Eze",
  //   caption: "Scholarship Recipient, University of Manchester, UK",
  //   avatar: "/default-profile.jpg",
  // },
  // {
  //   id: 4,
  //   type: "quote",
  //   videoId: null,
  //   quote:
  //     "Professional, prompt, and truly caring. VIGICA Consult feels like family. They celebrated every milestone with me.",
  //   name: "Musa Ibrahim",
  //   caption: "Business Administration, Concordia University, Canada",
  //   avatar: "/default-profile.jpg",
  // },
];

const EVENTS = [
  {
    id: 1,
    videoId: "SB56MgkscJA",
    title: "International Education Fair 2024",
    date: "March 15, 2024",
    description:
      "Annual fair connecting Nigerian students with top universities worldwide.",
  },
  // {
  //   id: 2,
  //   videoId: "SB56MgkscJA", // ← Replace with real YouTube video ID
  //   title: "Scholarship Workshop Series",
  //   date: "May 20, 2024",
  //   description:
  //     "Intensive training on scholarship applications and personal statements.",
  // },
  // {
  //   id: 3,
  //   videoId: "SB56MgkscJA", // ← Replace with real YouTube video ID
  //   title: "Study Abroad Info Night",
  //   date: "July 8, 2024",
  //   description:
  //     "Evening session covering top destinations and admission requirements.",
  // },
  // {
  //   id: 4,
  //   videoId: "SB56MgkscJA", // ← Replace with real YouTube video ID
  //   title: "Alumni Success Summit",
  //   date: "September 12, 2024",
  //   description: "Our alumni share experiences and mentor upcoming students.",
  // },
  // {
  //   id: 5,
  //   videoId: "SB56MgkscJA", // ← Replace with real YouTube video ID
  //   title: "Visa Application Bootcamp",
  //   date: "November 3, 2024",
  //   description: "Practical visa application training with real case studies.",
  // },
  // {
  //   id: 6,
  //   videoId: "SB56MgkscJA", // ← Replace with real YouTube video ID
  //   title: "University Partners Open Day",
  //   date: "December 10, 2024",
  //   description:
  //     "Meet representatives from our partner universities in one place.",
  // },
];

const PHOTOS = [
  {
    id: 1,
    src: UoGMAward,
    caption: "Outstanding Scholar Support - FON Scholars",
  },
  {
    id: 2,
    src: UoGMAwardDrGideon,
    caption:
      "Best Mentor Award - FON Scholars University of Greater Manchester",
  },
  // { id: 3, src: "/default-profile.jpg", caption: "Team Building Session" },
  // { id: 4, src: "/default-profile.jpg", caption: "Student Success Celebration" },
  // { id: 4, src: "/default-profile.jpg", caption: "University Partnership MOU Signing" },
  // { id: 5, src: "/default-profile.jpg", caption: "Workshop with International Reps" },
  // { id: 6, src: "/default-profile.jpg", caption: "Cultural Exchange Program" },
  // { id: 7, src: "/default-profile.jpg", caption: "Abuja Career Expo" },
  // { id: 8, src: "/default-profile.jpg", caption: "Office Open House" },
];

const EXPERTS = [
  {
    id: 1,
    name: "Dr. Ikporo Stephen",
    title: "Secretary, Ebonyi State Scholarship Board",
    institution: "Ebonyi State Government",
    photo: "/default-profile.jpg",
    remark:
      "VIGICA Consult stands out in the Nigerian consulting space for its holistic approach. They don't just place students — they prepare them for global success.",
  },
  // {
  //   id: 2,
  //   name: "Dr. James Adewale",
  //   title: "International Relations Expert",
  //   institution: "Lagos Business School",
  //   photo: "/default-profile.jpg",
  //   remark:
  //     "I have witnessed firsthand how VIGICA's structured guidance has transformed young Nigerians into globally competitive professionals.",
  // },
  // {
  //   id: 3,
  //   name: "Ms. Ngozi Okonkwo",
  //   title: "Career Development Consultant",
  //   institution: "British Council Nigeria",
  //   photo: "/default-profile.jpg",
  //   remark:
  //     "The level of professionalism and genuine commitment to student welfare at VIGICA Consult is a benchmark for the entire industry.",
  // },
  // {
  //   id: 4,
  //   name: "Mr. Chukwuemeka Eze",
  //   title: "Higher Education Advisor",
  //   institution: "Chevening Alumni Network",
  //   photo: "/default-profile.jpg",
  //   remark:
  //     "As a Chevening Scholar, I see how important proper guidance is. VIGICA provides exactly that — informed, personalised support that makes all the difference.",
  // },
];

const AWARDS = [
  {
    id: 1,
    title: "Outstanding Scholar Support",
    organization: "FON Scholars, University of Greater Manchester",
    year: "2025",
    description:
      "Recognised for excellence in student placement and support services.",
    icon: "trophy",
  },
  {
    id: 2,
    title: "Best Mentor Award",
    organization: "FON Scholars, University of Greater Manchester",
    year: "2025",
    description:
      "Recognised for exceptional mentorship and guidance provided to students.",
    icon: "medal",
  },

  // {
  //   id: 2,
  //   title: "Top 10 Education Consultants",
  //   organization: "West Africa Business Review",
  //   year: "2023",
  //   description:
  //     "Listed among the top 10 most impactful education consultants in West Africa.",
  //   icon: "medal",
  // },
  // {
  //   id: 3,
  //   title: "Customer Excellence Award",
  //   organization: "Abuja Business Summit",
  //   year: "2023",
  //   description:
  //     "Awarded for outstanding client satisfaction and service delivery standards.",
  //   icon: "star",
  // },
  // {
  //   id: 4,
  //   title: "Innovation in Education Award",
  //   organization: "AfriEd Conference",
  //   year: "2022",
  //   description:
  //     "Honoured for pioneering digital-first student application processes in Nigeria.",
  //   icon: "award",
  // },
];

const EXPERIENCE_TEXT = `Through a strategic partnership with the Ebonyi State Scholarship Board, VIGICA Consult Limited has successfully designed, implemented, and managed a comprehensive international scholarship programme from inception to its current advanced stage. The programme has supported scholars through postgraduate studies and has now progressed to the stage where beneficiaries are advancing into doctoral programmes across leading universities in the United Kingdom.

Our management approach integrates strategic university placement, cost optimisation, academic monitoring, financial accountability, and student welfare support, ensuring that the objectives of the Ebonyi State Government's investment in human capital development are fully realised.

Key outcomes of the programme include:

• Successful placement of 128 scholars in reputable universities across the United Kingdom in high-impact academic disciplines.

• Tuition fee savings exceeding £2,560,000 secured for the Ebonyi State Government through negotiated institutional discounts and strategic partnerships with universities.

• Seamless academic progression, with all scholars who expressed interest successfully transitioning from Master's programmes to PhD studies in the United Kingdom.

• Exceptional academic performance, with over 98% of scholars graduating with Distinction, while the remaining scholars achieved Merit, reflecting the strength of the academic support systems provided.

• Efficient financial management, including the structured disbursement of stipends and other approved sundry expenses in line with sponsor agreements and programme guidelines.

• Continuous academic monitoring and student welfare support, ensuring scholars remain on track academically while maintaining their well-being throughout the duration of their studies.

Beyond academic supervision, the programme actively promotes cultural engagement, leadership development, and community interaction, enabling scholars to maintain a strong connection to Nigeria while studying abroad. This approach strengthens their commitment to applying the knowledge, skills, and global exposure acquired during their studies toward national development upon completion.

The demonstrated success of this programme reflects VIGICA Consult Limited's proven capacity to manage large-scale international scholarship initiatives efficiently, transparently, and with measurable outcomes, delivering significant value for government investment in education and human capital development.`;

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * ReadMoreText — for plain character-limited text (quotes, remarks).
 * Shows `limit` chars then "Read more / Read less".
 */
function ReadMoreText({ text, limit = 200 }) {
  const [expanded, setExpanded] = useState(false);
  if (!text || text.length <= limit) return <span>{text}</span>;
  return (
    <span>
      {expanded ? text : text.slice(0, limit).trimEnd() + "…"}
      <button className="read-more-btn" onClick={() => setExpanded((v) => !v)}>
        {expanded ? " Read less" : " Read more"}
      </button>
    </span>
  );
}

/**
 * ReadMoreParagraphs — for multi-paragraph speeches.
 * Shows `visibleCount` paragraphs, then "Read more / Read less".
 */
function ReadMoreParagraphs({ text, visibleCount = 2 }) {
  const [expanded, setExpanded] = useState(false);
  const paras = text
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);
  const shown = expanded ? paras : paras.slice(0, visibleCount);
  const hasMore = paras.length > visibleCount;
  return (
    <>
      {shown.map((para, i) => (
        <p key={i} className="speech-para">
          {para}
        </p>
      ))}
      {hasMore && (
        <button
          className="read-more-btn read-more-btn--block"
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? "Read less ▲" : "Read more ▼"}
        </button>
      )}
    </>
  );
}

const getYoutubeThumbnail = (videoId) =>
  `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

const getYoutubeUrl = (videoId) => `https://www.youtube.com/watch?v=${videoId}`;

const AwardIcon = ({ type }) => {
  switch (type) {
    case "trophy":
      return <FaTrophy className="award-icon-svg" />;
    case "medal":
      return <FaMedal className="award-icon-svg" />;
    case "star":
      return <FaStar className="award-icon-svg" />;
    default:
      return <FaAward className="award-icon-svg" />;
  }
};

// ─── Animation variants ──────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

// ─── Component ───────────────────────────────────────────────────────────────

function AboutPage() {
  const eventsScrollRef = useRef(null);

  const scrollEvents = (dir) => {
    const container = eventsScrollRef.current;
    if (!container) return;
    container.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <div className="about-page">
      <Header />

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="about-hero">
        <div className="about-hero-overlay" />
        <motion.div
          className="about-hero-content"
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <p className="about-hero-tag">Who We Are</p>
          <h1>About VIGICA Consult</h1>
          <p className="about-hero-sub">
            Connecting Nigerian talent to global opportunity through honest
            guidance, proven expertise, and genuine care.
          </p>
        </motion.div>
      </section>

      {/* ── Experience & Proven Results ─────────────────────────────── */}
      <section className="about-section experience-section">
        <div className="about-container">
          <motion.div
            className="about-section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="about-section-label experience-label">
              Achievement
            </span>
            <h2 className="about-section-title experience-title">
              Our Experience and Proven Results
            </h2>
          </motion.div>

          <motion.div
            className="experience-content"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <ReadMoreParagraphs text={EXPERIENCE_TEXT} visibleCount={2} />
          </motion.div>
        </div>
      </section>

      {/* ── Consultant's Speech ─────────────────────────────────────── */}
      <section className="speech-section speech-section--light">
        <div className="about-container">
          <motion.div
            className="speech-block"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="speech-photo-col">
              <div className="speech-photo-wrap">
                <img
                  src={CONSULTANT.photo}
                  alt={CONSULTANT.name}
                  className="speech-photo"
                  onError={(e) => {
                    e.target.src = "/default-profile.jpg";
                  }}
                />
              </div>
              {CONSULTANT.awardPhoto && (
                <div className="speech-award-wrap">
                  <img
                    src={CONSULTANT.awardPhoto}
                    alt="Award"
                    className="speech-award-photo"
                    onError={(e) => {
                      e.target.src = "/default-profile.jpg";
                    }}
                  />
                  <p className="speech-award-caption">
                    {CONSULTANT.awardCaption}
                  </p>
                </div>
              )}
            </div>

            <div className="speech-text-col">
              <span className="about-section-label">Our Consultant</span>
              <h2 className="speech-name">{CONSULTANT.name}</h2>
              <p className="speech-role">{CONSULTANT.title}</p>
              {CONSULTANT.topic && (
                <h3 className="speech-topic">{CONSULTANT.topic}</h3>
              )}
              <FaQuoteLeft className="speech-quote-icon" />
              <ReadMoreParagraphs text={CONSULTANT.speech} visibleCount={2} />
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Manager's Speech ────────────────────────────────────────── */}
      <section className="speech-section speech-section--muted">
        <div className="about-container">
          <motion.div
            className="speech-block speech-block--reversed"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="speech-text-col">
              <span className="about-section-label">Our Manager</span>
              <h2 className="speech-name">{MANAGER.name}</h2>
              <p className="speech-role">{MANAGER.title}</p>
              {MANAGER.topic && (
                <h3 className="speech-topic">{MANAGER.topic}</h3>
              )}
              <FaQuoteLeft className="speech-quote-icon" />
              <ReadMoreParagraphs text={MANAGER.speech} visibleCount={2} />
            </div>

            <div className="speech-photo-col">
              <div className="speech-photo-wrap">
                <img
                  src={MANAGER.photo}
                  alt={MANAGER.name}
                  className="speech-photo"
                  onError={(e) => {
                    e.target.src = "/default-profile.jpg";
                  }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Client Testimonials ─────────────────────────────────────── */}
      <section className="about-section testimonials-section">
        <div className="about-container">
          <motion.div
            className="about-section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="about-section-label">Testimonials</span>
            <h2 className="about-section-title">What Our Clients Say</h2>
            <p className="about-section-sub">
              Real stories from students whose lives we have helped transform.
            </p>
          </motion.div>

          <motion.div
            className="testimonials-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {CLIENT_TESTIMONIALS.map((t) => (
              <motion.div
                key={t.id}
                className="testimonial-card"
                variants={fadeUp}
              >
                {/* Video thumbnail (when type = "video") */}
                {t.type === "video" && t.videoId && (
                  <a
                    href={getYoutubeUrl(t.videoId)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="testimonial-video-thumb"
                    aria-label="Watch video testimony"
                  >
                    <img
                      src={getYoutubeThumbnail(t.videoId)}
                      alt="Video remark thumbnail"
                      onError={(e) => {
                        e.target.src = "/default-profile.jpg";
                      }}
                    />
                    <div className="testimonial-play-overlay">
                      <span className="testimonial-play-btn">
                        <FaPlay />
                      </span>
                    </div>
                  </a>
                )}

                {/* Quote body */}
                <div className="testimonial-body">
                  <FaQuoteLeft className="testimonial-q-icon" />
                  <p className="testimonial-quote">
                    <ReadMoreText text={t.quote} limit={180} />
                  </p>
                </div>

                {/* Caption / Attribution */}
                <div className="testimonial-footer">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="testimonial-avatar"
                    onError={(e) => {
                      e.target.src = "/default-profile.jpg";
                    }}
                  />
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-caption">{t.caption}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Activities ──────────────────────────────────────────────── */}
      <section className="about-section activities-section">
        <div className="about-container">
          <motion.div
            className="about-section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="about-section-label">Activities</span>
            <h2 className="about-section-title">Our Events & Activities</h2>
            <p className="about-section-sub">
              From education fairs to workshops — see us in action.
            </p>
          </motion.div>

          {/* ── Events (horizontal scroll) ── */}
          <div className="sub-section-header">
            <h3 className="sub-section-title">Events</h3>
            <div className="scroll-controls">
              <button
                className="scroll-btn"
                onClick={() => scrollEvents(-1)}
                aria-label="Scroll left"
              >
                <FaChevronLeft />
              </button>
              <button
                className="scroll-btn"
                onClick={() => scrollEvents(1)}
                aria-label="Scroll right"
              >
                <FaChevronRight />
              </button>
            </div>
          </div>

          <div className="events-scroll" ref={eventsScrollRef}>
            {EVENTS.map((event) => (
              <a
                key={event.id}
                href={getYoutubeUrl(event.videoId)}
                target="_blank"
                rel="noopener noreferrer"
                className="event-card"
              >
                <div className="event-thumb-wrap">
                  <img
                    src={getYoutubeThumbnail(event.videoId)}
                    alt={event.title}
                    className="event-thumb"
                    onError={(e) => {
                      e.target.src = "/default-profile.jpg";
                    }}
                  />
                  <div className="event-play-overlay">
                    <FaPlay className="event-play-icon" />
                  </div>
                  <span className="event-date-badge">{event.date}</span>
                </div>
                <div className="event-info">
                  <h4 className="event-title">{event.title}</h4>
                  <p className="event-desc">{event.description}</p>
                </div>
              </a>
            ))}
          </div>

          {/* ── Photo Shoots ── */}
          <div className="sub-section-header" style={{ marginTop: "3.5rem" }}>
            <h3 className="sub-section-title">Photo Highlights</h3>
          </div>

          <motion.div
            className="photos-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {PHOTOS.map((photo) => (
              <motion.div
                key={photo.id}
                className="photo-card"
                variants={fadeUp}
              >
                <img
                  src={photo.src}
                  alt={photo.caption}
                  className="photo-img"
                  onError={(e) => {
                    e.target.src = "/default-profile.jpg";
                  }}
                />
                <div className="photo-caption">
                  <p>{photo.caption}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── What Experts Say ────────────────────────────────────────── */}
      <section className="about-section experts-section">
        <div className="about-container">
          <motion.div
            className="about-section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="about-section-label">Expert Voices</span>
            <h2 className="about-section-title">What Experts Say</h2>
            <p className="about-section-sub">
              Leading professionals across academia and industry share their
              perspective on VIGICA Consult.
            </p>
          </motion.div>

          <motion.div
            className="experts-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {EXPERTS.map((expert) => (
              <motion.div
                key={expert.id}
                className="expert-card"
                variants={fadeUp}
              >
                <img
                  src={expert.photo}
                  alt={expert.name}
                  className="expert-photo"
                  onError={(e) => {
                    e.target.src = "/default-profile.jpg";
                  }}
                />
                <h4 className="expert-name">{expert.name}</h4>
                <p className="expert-title">{expert.title}</p>
                <p className="expert-institution">{expert.institution}</p>
                <FaQuoteLeft className="expert-q-icon" />
                <p className="expert-remark">
                  <ReadMoreText text={expert.remark} limit={180} />
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Achievements & Awards ───────────────────────────────────── */}
      <section className="awards-section">
        <div className="about-container">
          <motion.div
            className="about-section-header"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <span className="about-section-label awards-label">
              Recognition
            </span>
            <h2 className="about-section-title awards-title">Awards</h2>
            <p className="about-section-sub awards-sub">
              Our commitment to excellence has been recognised by industry
              leaders and awarding bodies.
            </p>
          </motion.div>

          <motion.div
            className="awards-grid"
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {AWARDS.map((award) => (
              <motion.div
                key={award.id}
                className="award-card"
                variants={fadeUp}
              >
                <div className="award-icon-wrap">
                  <AwardIcon type={award.icon} />
                </div>
                <div className="award-body">
                  <span className="award-year">{award.year}</span>
                  <h4 className="award-title">{award.title}</h4>
                  <p className="award-org">{award.organization}</p>
                  <p className="award-desc">{award.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}

export default AboutPage;
