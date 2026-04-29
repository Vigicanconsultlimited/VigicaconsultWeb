import React, { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import Swal from "sweetalert2";
import axios from "axios";

// ─── Options ─────────────────────────────────────────

const IELTS_STATUS_OPTIONS = [
  { value: "Yes", label: "Yes — I have IELTS" },
  { value: "No", label: "No — I don't have IELTS" },
  { value: "PreparingForIelts", label: "Preparing for IELTS" },
];

const QUALIFICATION_TYPE_OPTIONS = [
  { value: "IELTS", label: "IELTS" },
  { value: "WAEC", label: "WAEC" },
  { value: "NECO", label: "NECO" },
];

const STUDY_DESTINATION_OPTIONS = [
  { value: "UK", label: "United Kingdom" },
  { value: "USA", label: "United States" },
  { value: "Canada", label: "Canada" },
  { value: "Australia", label: "Australia" },
];

const COUNTRY_OPTIONS = [
  { value: "Afghanistan", label: "Afghanistan" },
  { value: "Albania", label: "Albania" },
  { value: "Algeria", label: "Algeria" },
  { value: "AmericanSamoa", label: "American Samoa" },
  { value: "Angola", label: "Angola" },
  { value: "Australia", label: "Australia" },
  { value: "Bangladesh", label: "Bangladesh" },
  { value: "Belgium", label: "Belgium" },
  { value: "Belize", label: "Belize" },
  { value: "Bhutan", label: "Bhutan" },
  { value: "Botswana", label: "Botswana" },
  { value: "Brazil", label: "Brazil" },
  { value: "Burundi", label: "Burundi" },
  { value: "Cameroon", label: "Cameroon" },
  { value: "China", label: "China" },
  { value: "CoteDIvoire", label: "Côte d'Ivoire" },
  { value: "Croatia", label: "Croatia" },
  { value: "Cyprus", label: "Cyprus" },
  { value: "CzechRepublic", label: "Czech Republic" },
  { value: "Denmark", label: "Denmark" },
  { value: "Eritrea", label: "Eritrea" },
  { value: "Estonia", label: "Estonia" },
  { value: "Ethiopia", label: "Ethiopia" },
  { value: "Gambia", label: "Gambia" },
  { value: "Georgia", label: "Georgia" },
  { value: "Germany", label: "Germany" },
  { value: "Ghana", label: "Ghana" },
  { value: "Greece", label: "Greece" },
  { value: "Guatemala", label: "Guatemala" },
  { value: "Guinea", label: "Guinea" },
  { value: "Guyana", label: "Guyana" },
  { value: "Haiti", label: "Haiti" },
  { value: "Holland", label: "Holland" },
  { value: "HongKong", label: "Hong Kong" },
  { value: "Hungary", label: "Hungary" },
  { value: "India", label: "India" },
  { value: "Indonesia", label: "Indonesia" },
  { value: "Iran", label: "Iran" },
  { value: "Iraq", label: "Iraq" },
  { value: "Italy", label: "Italy" },
  { value: "IvoryCoast", label: "Ivory Coast" },
  { value: "Japan", label: "Japan" },
  { value: "Jordan", label: "Jordan" },
  { value: "Kazakhstan", label: "Kazakhstan" },
  { value: "Kenya", label: "Kenya" },
  { value: "Kuwait", label: "Kuwait" },
  { value: "Lebanon", label: "Lebanon" },
  { value: "Lesotho", label: "Lesotho" },
  { value: "Liberia", label: "Liberia" },
  { value: "Libya", label: "Libya" },
  { value: "Lithuania", label: "Lithuania" },
  { value: "Luxembourg", label: "Luxembourg" },
  { value: "Malawi", label: "Malawi" },
  { value: "Malaysia", label: "Malaysia" },
  { value: "Mauritania", label: "Mauritania" },
  { value: "Melbourne", label: "Melbourne" },
  { value: "Mongolia", label: "Mongolia" },
  { value: "Nepal", label: "Nepal" },
  { value: "Netherlands", label: "Netherlands" },
  { value: "Nigeria", label: "Nigeria" },
  { value: "Oman", label: "Oman" },
  { value: "Pakistan", label: "Pakistan" },
  { value: "Palestine", label: "Palestine" },
  { value: "PapuaNewGuinea", label: "Papua New Guinea" },
  { value: "Paraguay", label: "Paraguay" },
  { value: "Philippines", label: "Philippines" },
  { value: "Poland", label: "Poland" },
  { value: "Portugal", label: "Portugal" },
  { value: "Qatar", label: "Qatar" },
  { value: "RepublicOfIreland", label: "Republic of Ireland" },
  { value: "Romania", label: "Romania" },
  { value: "Rwanda", label: "Rwanda" },
  { value: "SaudiArabia", label: "Saudi Arabia" },
  { value: "Senegal", label: "Senegal" },
  { value: "SierraLeone", label: "Sierra Leone" },
  { value: "Singapore", label: "Singapore" },
  { value: "Somalia", label: "Somalia" },
  { value: "SouthAfrica", label: "South Africa" },
  { value: "SouthKorea", label: "South Korea" },
  { value: "SriLanka", label: "Sri Lanka" },
  { value: "Sudan", label: "Sudan" },
  { value: "Switzerland", label: "Switzerland" },
  { value: "Syria", label: "Syria" },
  { value: "Taiwan", label: "Taiwan" },
  { value: "Tanzania", label: "Tanzania" },
  { value: "Thailand", label: "Thailand" },
  { value: "Tunisia", label: "Tunisia" },
  { value: "Turkey", label: "Turkey" },
  { value: "Turkmenistan", label: "Turkmenistan" },
  { value: "Ukraine", label: "Ukraine" },
  { value: "UnitedArabEmirates", label: "United Arab Emirates" },
  { value: "AnyOther", label: "Any Other" },
];

// ─── Toast ───────────────────────────────────────────

const Toast = Swal.mixin({
  toast: true,
  position: "top",
  showConfirmButton: false,
  timer: 3000,
});

// ─── Initial State ───────────────────────────────────

const EMPTY_FORM = {
  FullName: "",
  EmailAddress: "",
  MobileNumber: "",
  IeltsStatus: "",
  QualificationType: "",
  CountryCode: "",
  StudyDestination: "",
  CurrentCountryOfResidence: "",
  Message: "",
  AgreeToPrivacyPolicy: false,
};

// ─── Component ───────────────────────────────────────

export default function EnquiryForm() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const set = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.FullName || !formData.EmailAddress) {
      Toast.fire({ icon: "error", title: "Name and Email are required" });
      return;
    }

    if (!formData.AgreeToPrivacyPolicy) {
      Toast.fire({ icon: "error", title: "You must agree to the privacy policy" });
      return;
    }

    setIsSubmitting(true);

    try {
      const fd = new FormData();

      fd.append("FullName", formData.FullName);
      fd.append("EmailAddress", formData.EmailAddress);
      fd.append("MobileNumber", formData.MobileNumber);
      fd.append("IeltsStatus", formData.IeltsStatus);
      fd.append("QualificationType", formData.QualificationType); // ← fixed field name
      fd.append("CountryCode", formData.CountryCode);
      fd.append("StudyDestination", formData.StudyDestination);
      fd.append("CurrentCountryOfResidence", formData.CurrentCountryOfResidence);
      fd.append("Message", formData.Message);
      fd.append("AgreeToPrivacyPolicy", formData.AgreeToPrivacyPolicy);

      // Optional fields
      fd.append("DialCode", "");
      fd.append("FullMobileNumber", "");
      fd.append("CountryCodeDisplay", "");
      fd.append("StudyDestinationDisplay", "");
      fd.append("ResidenceCountryDisplay", "");
      fd.append("QualificationTypeDisplay", "");

      await axios.post(
        "https://vigica-001-site1.qtempurl.com/api/Enquiry/student",
        fd
      );

      Toast.fire({ icon: "success", title: "Enquiry submitted successfully!" });
      setFormData(EMPTY_FORM);

    } catch (error) {
      // ── ADD THESE LOGS ──────────────────────────────
      console.log("❌ Full error object:", error);
      console.log("❌ Response status:", error.response?.status);
      console.log("❌ Response data:", error.response?.data);
      console.log("❌ Response headers:", error.response?.headers);
      console.log("❌ Request that was sent:", error.config);
      // ────────────────────────────────────────────────

      const errors = error.response?.data?.errors;

      if (errors) {
        Object.entries(errors).forEach(([key, value]) => {
          Toast.fire({ icon: "error", title: `${key}: ${value.join(", ")}` });
        });
      } else {
        Toast.fire({ icon: "error", title: "Submission failed. Please try again." });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="max-w-lg mx-auto backdrop-blur-xl bg-white/70 border border-white/30 shadow-2xl rounded-2xl">
      <CardContent className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Title */}
          <div>
            <h2 className="text-2xl font-semibold">Make an Enquiry</h2>
            <p className="text-sm text-gray-500">We'll get back to you shortly</p>
          </div>

          {/* Name */}
          <Input
            placeholder="Full Name"
            className="rounded-lg"
            value={formData.FullName}
            onChange={(e) => set("FullName", e.target.value)}
          />

          {/* Email */}
          <Input
            type="email"
            placeholder="Email Address"
            className="rounded-lg"
            value={formData.EmailAddress}
            onChange={(e) => set("EmailAddress", e.target.value)}
          />

          {/* Mobile */}
          <Input
            placeholder="Mobile Number"
            className="rounded-lg"
            value={formData.MobileNumber}
            onChange={(e) => set("MobileNumber", e.target.value)}
          />

          {/* Dropdowns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/60 focus:outline-none focus:border-black"
              value={formData.IeltsStatus}
              onChange={(e) => set("IeltsStatus", e.target.value)}
            >
              <option value="">IELTS Status</option>
              {IELTS_STATUS_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/60 focus:outline-none focus:border-black"
              value={formData.QualificationType}
              onChange={(e) => set("QualificationType", e.target.value)}
            >
              <option value="">Qualification</option>
              {QUALIFICATION_TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/60 focus:outline-none focus:border-black"
              value={formData.CountryCode}
              onChange={(e) => set("CountryCode", e.target.value)}
            >
              <option value="">Country Code</option>
              {COUNTRY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/60 focus:outline-none focus:border-black"
              value={formData.StudyDestination}
              onChange={(e) => set("StudyDestination", e.target.value)}
            >
              <option value="">Study Destination</option>
              {STUDY_DESTINATION_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Full width */}
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/60 focus:outline-none focus:border-black md:col-span-2"
              value={formData.CurrentCountryOfResidence}
              onChange={(e) => set("CurrentCountryOfResidence", e.target.value)}
            >
              <option value="">Residence Country</option>
              {COUNTRY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

          </div>

          {/* Message */}
          <Textarea
            placeholder="Message"
            className="rounded-lg"
            value={formData.Message}
            onChange={(e) => set("Message", e.target.value)}
          />

          {/* Privacy Policy */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.AgreeToPrivacyPolicy}
              onChange={(e) => set("AgreeToPrivacyPolicy", e.target.checked)}
            />
            I agree to privacy policy
          </label>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg text-white py-3 hover:scale-[1.02] transition"
            style={{ background: "#3047da" }}
          >
            {isSubmitting ? "Submitting..." : "Submit Enquiry"}
          </Button>

        </form>
      </CardContent>
    </Card>
  );
}
