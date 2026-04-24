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
  { value: "Nigeria", label: "Nigeria" },
  { value: "Ghana", label: "Ghana" },
  { value: "Kenya", label: "Kenya" },
  { value: "UnitedKingdom", label: "United Kingdom" },
  { value: "UnitedStates", label: "United States" },
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
  EnglishQualificationType: "",
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
      Toast.fire({ icon: "error", title: "You must agree to privacy policy" });
      return;
    }

    setIsSubmitting(true);

    try {
      const fd = new FormData();

      fd.append("FullName", formData.FullName);
      fd.append("EmailAddress", formData.EmailAddress);
      fd.append("MobileNumber", formData.MobileNumber);
      fd.append("IeltsStatus", formData.IeltsStatus);
      fd.append("EnglishQualificationType", formData.EnglishQualificationType);
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
        "https://vigica-001-site1.qtempurl.com/api/Enquiry",
        fd
      );

      Toast.fire({ icon: "success", title: "Enquiry submitted!" });
      setFormData(EMPTY_FORM);

    } catch (error) {
      const errors = error.response?.data?.errors;

      if (errors) {
        Object.entries(errors).forEach(([key, value]) => {
          Toast.fire({
            icon: "error",
            title: `${key}: ${value.join(", ")}`,
          });
        });
      } else {
        Toast.fire({ icon: "error", title: "Submission failed" });
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
            <p className="text-sm text-gray-500">We’ll get back to you shortly</p>
          </div>

          {/* Inputs */}
          <Input
            placeholder="Full Name"
            className="rounded-lg"
            value={formData.FullName}
            onChange={(e) => set("FullName", e.target.value)}
          />

          <Input
            type="email"
            placeholder="Email Address"
            className="rounded-lg"
            value={formData.EmailAddress}
            onChange={(e) => set("EmailAddress", e.target.value)}
          />

          <Input
            placeholder="Mobile Number"
            className="rounded-lg"
            value={formData.MobileNumber}
            onChange={(e) => set("MobileNumber", e.target.value)}
          />

          {/* 🔥 UNIFORM DROPDOWNS (FIXED HERE) */}
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
              value={formData.EnglishQualificationType}
              onChange={(e) => set("EnglishQualificationType", e.target.value)}
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
              <option value="">Country</option>
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

            {/* Full width row */}
            <select
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white/60 focus:outline-none focus:border-black md:col-span-2"
              value={formData.CurrentCountryOfResidence}
              onChange={(e) => set("CurrentCountryOfResidence", e.target.value)}
            >
              <option value="">Residence</option>
              {COUNTRY_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

          </div>

          <Textarea
            placeholder="Message"
            className="rounded-lg"
            value={formData.Message}
            onChange={(e) => set("Message", e.target.value)}
          />

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={formData.AgreeToPrivacyPolicy}
              onChange={(e) => set("AgreeToPrivacyPolicy", e.target.checked)}
            />
            I agree to privacy policy
          </label>

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