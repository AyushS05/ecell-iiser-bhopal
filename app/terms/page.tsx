import Footer from "@/components/sections/Footer";

export default function TermsPage() {
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
          TERMS OF USE
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
            This is a placeholder for the Terms of Use for the E-Cell IISER Bhopal website and Pitch Portal. 
            By accessing this platform, submitting a pitch, or utilizing our incubation resources, you agree 
            to the terms and conditions outlined by the Entrepreneurship Cell.
          </p>
          <p>
            Full terms are currently being drafted by our team. Check back later.
          </p>
        </div>
      </div>
      <Footer />
    </>
  );
}