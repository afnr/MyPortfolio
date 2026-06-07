import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Head from "next/head";

// Local Data
import data from "../data/portfolio.json";

export default function ResumePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleWindowScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-[#7fa2a9] via-[#9cb9be] to-[#eef3f4] text-[#1a1a1a] font-['Poppins'] antialiased">
      <Head>
        <title>Resume - {data.name}</title>
      </Head>

      <div className="container mx-auto px-4 md:px-6 xl:px-12 pb-16">
        <Header isBlog={true} />

        <div className="mt-12 max-w-4xl mx-auto bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl p-6 md:p-10 shadow-xl">
          <h1 className="text-4xl font-black text-[#518e96] uppercase tracking-wide border-b border-[#518e96]/20 pb-4">
            Resume.
          </h1>
          
          <div className="mt-6">
            <h3 className="text-xl font-bold text-[#518e96]">{data.resume.tagline}</h3>
            <p className="mt-2 text-base text-[#334144] opacity-90 leading-relaxed">{data.resume.description}</p>
          </div>

          {/* EXPERIENCE */}
          <div className="mt-10">
            <h4 className="text-lg font-extrabold uppercase tracking-wider text-[#518e96] mb-4 border-l-4 border-[#518e96] pl-3">
              Experience
            </h4>
            {data.resume.experiences.map((exp) => (
              <div key={exp.id} className="mb-6 bg-white/50 border border-white/40 p-5 rounded-xl shadow-sm">
                <span className="text-sm font-bold text-[#518e96]/80">{exp.dates}</span>
                <div className="flex flex-wrap justify-between items-baseline gap-2 mt-1">
                  <h5 className="text-lg font-bold text-[#518e96]">{exp.position}</h5>
                  <span className="text-xs font-semibold uppercase bg-[#518e96]/10 text-[#518e96] px-2.5 py-1 rounded-md">{exp.type}</span>
                </div>
                <ul className="list-disc list-inside mt-3 space-y-2 text-sm text-[#334144]">
                  {exp.bullets.map((bullet, idx) => (
                    <li key={idx} className="leading-relaxed">{bullet}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* EDUCATION & SKILLS */}
          <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-extrabold uppercase tracking-wider text-[#518e96] mb-4 border-l-4 border-[#518e96] pl-3">
                Education
              </h4>
              <div className="space-y-4">
                {data.resume.education.map((edu) => (
                  <div key={edu.id} className="bg-white/50 border border-white/40 p-4 rounded-xl shadow-sm">
                    <div className="flex justify-between items-center">
                      <h5 className="font-bold text-[#518e96]">{edu.universityName}</h5>
                      <span className="text-xs font-semibold text-[#518e96]/80">{edu.universityDate}</span>
                    </div>
                    <p className="text-sm text-[#334144] mt-1">{edu.universityPara}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-lg font-extrabold uppercase tracking-wider text-[#518e96] mb-4 border-l-4 border-[#518e96] pl-3">
                Skills & Frameworks
              </h4>
              <div className="space-y-3 bg-white/50 border border-white/40 p-5 rounded-xl shadow-sm">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#518e96]">Languages:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {data.resume.languages.map((lang, idx) => (
                      <span key={idx} className="text-xs font-medium bg-white/80 border border-[#518e96]/20 px-2.5 py-1 rounded-md text-[#2c3e41]">{lang}</span>
                    ))}
                  </div>
                </div>
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#518e96]">Frameworks:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {data.resume.frameworks.map((fw, idx) => (
                      <span key={idx} className="text-xs font-medium bg-white/80 border border-[#518e96]/20 px-2.5 py-1 rounded-md text-[#2c3e41]">{fw}</span>
                    ))}
                  </div>
                </div>
                <div className="pt-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#518e96]">Tools:</span>
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {data.resume.others.map((tool, idx) => (
                      <span key={idx} className="text-xs font-medium bg-white/80 border border-[#518e96]/20 px-2.5 py-1 rounded-md text-[#2c3e41]">{tool}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SCROLL TO TOP BUTTON */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-20 right-5 z-50 p-3 bg-[#518e96] text-white rounded-full shadow-lg hover:bg-[#3f7278] transition-all"
            aria-label="Scroll to top"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
          </button>
        )}

        <div className="mt-16 border-t border-[#518e96]/10 pt-8 text-[#518e96]/80">
          <Footer />
        </div>
      </div>
    </div>
  );
}