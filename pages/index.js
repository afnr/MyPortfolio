import { useRef, useEffect, useState } from "react";
import Header from "../components/Header";
import Socials from "../components/Socials";
import WorkCard from "../components/WorkCard";
import { useIsomorphicLayoutEffect } from "../utils";
import { stagger } from "../animations";
import Footer from "../components/Footer";
import Head from "next/head";
import Button from "../components/Button";
import Link from "next/link";

// Local Data
import data from "../data/portfolio.json";

export default function Home() {
  // Refs
  const workRef = useRef();
  const aboutRef = useRef();
  const textOne = useRef();
  const textTwo = useRef();
  const textThreeCombined = useRef();
  
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

  // Handling Scroll
  const handleWorkScroll = () => {
    window.scrollTo({
      top: workRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  const handleAboutScroll = () => {
    window.scrollTo({
      top: aboutRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  useIsomorphicLayoutEffect(() => {
    stagger(
      [textOne.current, textTwo.current, textThreeCombined.current],
      { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
      { y: 0, x: 0, transform: "scale(1)" }
    );
  }, []);

  const groupedProjects = data.projects.reduce((acc, project) => {
    const year = project.year || project.date || "Other";
    if (!acc[year]) acc[year] = [];
    acc[year].push(project);
    return acc;
  }, {});

  const sortedYears = Object.keys(groupedProjects).sort((a, b) => b - a);

  return (
    <div className="w-full min-h-screen bg-white text-[#1a1a1a] font-['Poppins'] antialiased selection:bg-[#518e96]/30">
      <Head>
        <title>{data.name}</title>
      </Head>

      {/* GRADIENT HERO BLOCK */}
      <div 
        className="w-full pb-20"
        style={{
          background: "linear-gradient(to bottom, #7fa2a9 0%, #a4babc 40%, #cfe0e2 75%, #ffffff 100%)"
        }}
      >
        <div className="container mx-auto px-4 md:px-6 xl:px-12">
          <Header
            handleWorkScroll={handleWorkScroll}
            handleAboutScroll={handleAboutScroll}
          />
          
          <div className="pt-20 pb-10 flex flex-col justify-center items-center text-center px-4 w-full relative z-10">
            <div className="flex flex-col items-center justify-center max-w-[1250px]">
              <h1 ref={textOne} className="text-[44px] sm:text-[68px] md:text-[85px] lg:text-[96px] font-black text-[#518e96] uppercase tracking-wide leading-none select-none">
                {data.headerTaglineOne}
              </h1>
              <h2 ref={textTwo} className="text-[22px] sm:text-[34px] md:text-[42px] lg:text-[46px] font-extrabold text-[#518e96] uppercase tracking-normal leading-tight max-w-[1100px] mt-4 sm:mt-5">
                {data.headerTaglineTwo ? data.headerTaglineTwo.replace(/,$/, '') : ""}
              </h2>
              <p ref={textThreeCombined} className="text-base sm:text-lg lg:text-xl font-normal text-white tracking-wide max-w-[850px] mt-6 sm:mt-8 leading-relaxed opacity-95">
                {data.headerTaglineThree} {data.headerTaglineFour}
              </p>
            </div>

            <div className="mt-8 flex justify-center w-full">
              <Socials className="flex gap-6" />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-6 xl:px-12 pb-16 bg-white" ref={workRef}>
        <div className="mt-12 md:mt-20 border-t border-[#518e96]/20 pt-12 px-2" ref={aboutRef}>
          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-wide text-[#518e96]">About.</h2>
          <p className="mt-4 text-base sm:text-lg text-[#334144] font-normal opacity-90 max-w-full lg:max-w-4xl xl:max-w-5xl leading-relaxed tracking-wide">
            {data.aboutpara}
          </p>
        </div>

        <div className="mt-16 laptop:mt-24 p-2 laptop:p-0">
          <div className="text-center w-full mb-6 flex flex-col items-center">
            <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-widest text-[#518e96] leading-none">Work.</h1>
          </div>

          {sortedYears.map((year) => (
            <div key={year} className="mt-12 first:mt-6 border-t border-gray-100 pt-8">
              <h2 className="text-xl font-black text-[#518e96]/70 tracking-wider mb-6 uppercase">
                year {year}
              </h2>
              <div className="flex flex-wrap justify-center gap-6 xl:gap-8 items-stretch w-full">
                {groupedProjects[year].map((project) => (
                  <div key={project.id} className="w-full md:w-[calc(33.333%-1.5rem)] max-w-[400px] flex">
                    <WorkCard
                      img={project.imageSrc}
                      name={project.title}
                      description={project.description}
                      onClick={() => window.open(project.url)}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Scroll to Top Button */}
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

        {/* Development Mode Dynamic Editing Trigger */}
        {process.env.NODE_ENV === "development" && (
          <div className="fixed bottom-5 right-5 z-50">
            <Link href="/edit" passHref legacyBehavior>
              <a className="inline-block bg-[#518e96] hover:bg-[#3f7278] text-white font-semibold px-4 py-2 rounded-lg shadow-lg transition-colors">
                Edit Data
              </a>
            </Link>
          </div>
        )}

        <div className="mt-24 border-t border-gray-100 pt-8 text-gray-400">
          <Footer />
        </div>
      </div>
    </div>
  );
}