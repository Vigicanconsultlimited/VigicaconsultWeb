import React from "react";
import { motion } from "framer-motion";
import { Badge } from "../ui/badge";
import { Handshake } from "lucide-react";
import DMU from "../../assets/images/1499083809_Capture.avif";
import Leed_Bekett from "../../assets/images/2018_LBU01_PURPLE_jpg-1024x430.jpg";
import EBSG from "../../assets/images/ebonyiia.png";
//"C:\Users\User\Desktop\proj\VigicaconsultWeb\vigicanwebapp\src\assets\images\ebonyiia.png"
// Partners data - easily extendable
const partnersData = [
  {
    id: 1,
    name: "Leeds Beckett University",
    logo: Leed_Bekett,
    url: "https://www.leedsbeckett.ac.uk/",
    description: "UK University Partner",
  },
  {
    id: 2,
    name: "De Montfort University",
    logo: DMU,
    url: "https://www.dmu.ac.uk/home.aspx",
    description: "UK University Partner",
  },
  {
    id: 3,
    name: "Ebonyi State Government",
    logo: EBSG,
    url: "https://www.ebonyistate.gov.ng/",
    description: "Government Partner",
  },
  {
    id: 4,
    name: "Ebonyi State Scholarship Board",
    logo: null, // Will use placeholder
    url: "#",
    description: "Scholarship Partner",
  },
];

const Partners = () => {
  return (
    <section
      id="partners"
      className="py-20 bg-gradient-to-b from-white to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <Badge className="bg-blue-100 text-blue-700 mb-4 px-3 py-1">
            <Handshake className="w-4 h-4 inline-block mr-1" />
            Our Partners
          </Badge>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Trusted By Leading Institutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We collaborate with top universities, government bodies, and
            scholarship boards to provide you with the best opportunities for
            your educational journey.
          </p>
        </motion.div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
          {partnersData.map((partner, index) => (
            <motion.a
              key={partner.id}
              href={partner.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 h-full flex flex-col items-center justify-center min-h-[180px]">
                {partner.logo ? (
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-h-16 lg:max-h-20 w-auto object-contain mb-4 grayscale group-hover:grayscale-0 transition-all duration-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                {/* Fallback placeholder */}
                <div
                  className={`${partner.logo ? "hidden" : "flex"} w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl items-center justify-center mb-4`}
                >
                  <span className="text-white text-2xl lg:text-3xl font-bold">
                    {partner.name.charAt(0)}
                  </span>
                </div>
                <h3 className="text-sm lg:text-base font-semibold text-gray-800 text-center group-hover:text-blue-600 transition-colors">
                  {partner.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1 text-center">
                  {partner.description}
                </p>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-600">
            Interested in partnering with us?{" "}
            <a
              href="#contact"
              className="text-blue-600 font-semibold hover:text-blue-700 underline"
            >
              Get in touch
            </a>
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default Partners;
