import Footer from "@/components/sections/Footer";

export default function PrivacyPage() {
  return (
    <>
      <div className="pt-32 pb-24 max-w-3xl mx-auto px-6 md:px-12 min-h-[75vh]">
        <h1 
          style={{ 
            fontFamily: "var(--font-display)", 
            fontSize: "clamp(2.5rem, 6vw, 4rem)", 
            color: "#f0ede6", 
            marginBottom: "1.5rem" 
          }}
        >
          PRIVACY POLICY
        </h1>
        <div 
          style={{ 
            fontFamily: "'DM Mono', monospace", 
            color: "rgba(240,237,230,0.6)", 
            fontSize: "0.85rem", 
            lineHeight: 1.8 
          }}
        >
          <p className="mb-6">Last updated: June 2026</p>
          <p className="mb-6">
            This is a placeholder for the official Privacy Policy of E-Cell IISER Bhopal. 
            Once drafted, this section will detail how student data, pitch submissions, and 
            contact information are collected, stored, and utilized by the incubator.
          </p>
          <p>
            For urgent inquiries regarding data privacy, please contact us at <a href="mailto:ecell@iiserb.ac.in" style={{ color: "#E8A020" }}>ecell@iiserb.ac.in</a>.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}