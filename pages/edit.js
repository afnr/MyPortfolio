import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Button from "../components/Button";
import Header from "../components/Header";
import { v4 as uuidv4 } from "uuid";
import { useTheme } from "next-themes";

// Data
import yourData from "../data/portfolio.json";

const Edit = () => {
  // states
  const [data, setData] = useState(yourData);
  const [currentTabs, setCurrentTabs] = useState("HEADER");
  const [showScrollTop, setShowScrollTop] = useState(false); // Floating button visibility tracker
  const { theme } = useTheme();
  const router = useRouter();

  // Monitor scrolling to dynamically toggle visibility of the "Scroll to Top" button
  useEffect(() => {
    const handleWindowScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener("scroll", handleWindowScroll);
    return () => window.removeEventListener("scroll", handleWindowScroll);
  }, []);

  // Handler to smoothly slide the page back to the very top header
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Helper to smoothly scroll down to focus on a newly appended list card block
  const scrollToNewElement = (id) => {
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        
        // Auto-focus convenience: highlight the first text input inside the new element
        const firstInput = element.querySelector("input");
        if (firstInput) firstInput.focus();
      }
    }, 60);
  };

  const saveData = async () => {
    console.log("1. Save button clicked! Current state data looks like this:", data);

    try {
      console.log("2. Sending fetch request to /api/portfolio...");
      const response = await fetch("/api/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      console.log("3. Server response received. Status code:", response.status);

      if (response.ok) {
        console.log("4. Save successful! Initiating redirect delay...");
        setTimeout(() => {
          window.location.replace("/");
        }, 150);
      } else {
        const errorText = await response.text();
        console.error("4. Server rejected the save. Error details:", errorText);
        alert("The server encountered an error saving the file. Check your terminal logs!");
      }
    } catch (error) {
      console.error("4. Network/Fetch error occurred:", error);
      alert("Failed to reach the API endpoint.");
    }
  };

  const handleCancel = () => {
    window.location.replace("/");
  };

  // Project Handlers
  const editProjects = (projectIndex, editProject) => {
    const updatedProjects = data.projects.map((proj, idx) =>
      idx === projectIndex ? { ...editProject } : proj
    );
    setData({ ...data, projects: updatedProjects });
  };

  const addProject = () => {
    const newId = uuidv4();
    setData({
      ...data,
      projects: [
        ...data.projects,
        {
          id: newId,
          title: "New Project",
          description: "Web Design & Development",
          imageSrc:
            "https://images.unsplash.com/photo-1517479149777-5f3b1511d5ad?auto=format&fit=crop&w=400&q=60",
          url: "http://github.com/afnr/",
          year: "2026",
          date: "2026",
        },
      ],
    });
    
    // Smoothly track viewport to the new project row
    scrollToNewElement(`project-block-${newId}`);
  };

  const deleteProject = (id) => {
    const filteredProjects = data.projects.filter((project) => project.id !== id);
    setData({ ...data, projects: filteredProjects });
  };

  // Resume Handlers
  const handleAddExperiences = () => {
    const newId = uuidv4();
    setData({
      ...data,
      resume: {
        ...data.resume,
        experiences: [
          ...data.resume.experiences,
          {
            id: newId,
            dates: "Enter Dates",
            type: "Full Time",
            position: "Frontend Engineer at X",
            bullets: ["Worked on the frontend of a React application"],
          },
        ],
      },
    });

    // Smoothly track viewport to the new experience row
    scrollToNewElement(`experience-block-${newId}`);
  };

  const handleEditExperiences = (index, editExperience) => {
    const updatedExperiences = data.resume.experiences.map((exp, idx) =>
      idx === index ? { ...editExperience } : exp
    );
    setData({
      ...data,
      resume: { ...data.resume, experiences: updatedExperiences },
    });
  };

  const handleDeleteExperience = (id) => {
    const filteredExperiences = data.resume.experiences.filter((exp) => exp.id !== id);
    setData({
      ...data,
      resume: { ...data.resume, experiences: filteredExperiences },
    });
  };

  // Education Handlers
  const handleAddEducation = () => {
    const newId = uuidv4();
    const originalEducationArray = Array.isArray(data.resume.education)
      ? data.resume.education
      : [
          {
            id: uuidv4(),
            universityName: data.resume.education?.universityName || "",
            universityDate: data.resume.education?.universityDate || "",
            universityPara: data.resume.education?.universityPara || "",
          },
        ];

    setData({
      ...data,
      resume: {
        ...data.resume,
        education: [
          ...originalEducationArray,
          {
            id: newId,
            universityName: "University Name",
            universityDate: "Dates",
            universityPara: "Details/Degree description",
          },
        ],
      },
    });

    // Smoothly track viewport to the new education row
    scrollToNewElement(`education-block-${newId}`);
  };

  const handleEditEducation = (index, editedEdu) => {
    const originalEducationArray = Array.isArray(data.resume.education)
      ? data.resume.education
      : [data.resume.education];

    const updatedEducation = originalEducationArray.map((edu, idx) =>
      idx === index ? { ...editedEdu } : edu
    );

    setData({
      ...data,
      resume: { ...data.resume, education: updatedEducation },
    });
  };

  const handleDeleteEducation = (index) => {
    const originalEducationArray = Array.isArray(data.resume.education)
      ? data.resume.education
      : [data.resume.education];

    const filteredEducation = originalEducationArray.filter((_, idx) => idx !== index);

    setData({
      ...data,
      resume: { ...data.resume, education: filteredEducation },
    });
  };

  const getEducationArray = () => {
    if (!data.resume.education) return [];
    return Array.isArray(data.resume.education) ? data.resume.education : [data.resume.education];
  };

  // Reusable text input utility styling to guarantee correct theme background colors
  const inputThemeStyles = "bg-white dark:bg-stone-900 text-black dark:text-white border-2 border-stone-200 dark:border-stone-800 focus:outline-none focus:border-stone-500 transition-colors";
  
  // Tab Layouts (FIXED: Added solid backgrounds for visibility)
  const activeTabBoxStyles = "bg-stone-100 dark:bg-stone-800 text-black dark:text-white font-bold border border-stone-200 dark:border-stone-700 shadow-sm rounded-lg px-4 py-2";
  const inactiveTabStyles = "bg-stone-50 hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 shadow-none rounded-lg px-4 py-2 font-normal transition-all";
  // Action Buttons (Remove, Delete, Add) — Plain text by default, turns into a light grey box on hover/active state
  const interactiveActionBtnStyles = "bg-stone-50 hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700 shadow-none rounded-lg px-4 py-2 font-normal transition-all";

  return (
    <div className={`container mx-auto pb-20 ${data.showCursor ? "cursor-none" : ""}`}>
      <div className="mt-10">
        <div className={`${theme === "dark" ? "bg-transparent" : "bg-white"} p-4 rounded-md shadow-sm`}>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex flex-col gap-1">
              <button 
                onClick={handleCancel} 
                className="text-sm opacity-50 hover:opacity-100 transition-all flex items-center gap-1 text-left bg-transparent border-none cursor-pointer p-0 mb-1"
              >
                &larr; 
              </button>
              <h1 className="text-4xl font-bold">Dashboard</h1>
            </div>
            <Button onClick={saveData} type="primary">
              Save
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <Button 
              onClick={() => setCurrentTabs("HEADER")} 
              classes={currentTabs === "HEADER" ? activeTabBoxStyles : inactiveTabStyles}
            >
              Header
            </Button>
            <Button 
              onClick={() => setCurrentTabs("PROJECTS")} 
              classes={currentTabs === "PROJECTS" ? activeTabBoxStyles : inactiveTabStyles}
            >
              Projects
            </Button>
            <Button 
              onClick={() => setCurrentTabs("ABOUT")} 
              classes={currentTabs === "ABOUT" ? activeTabBoxStyles : inactiveTabStyles}
            >
              About
            </Button>
            <Button 
              onClick={() => setCurrentTabs("RESUME")} 
              classes={currentTabs === "RESUME" ? activeTabBoxStyles : inactiveTabStyles}
            >
              Resume
            </Button>
          </div>
        </div>

        {/* HEADER TAB */}
        {currentTabs === "HEADER" && (
          <div className="mt-10 space-y-5">
            <div className="flex items-center">
              <label className="w-1/5 text-lg opacity-50">Name</label>
              <input
                value={data.name || ""}
                onChange={(e) => setData({ ...data, name: e.target.value })}
                className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                type="text"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/5 text-sm opacity-50">Header Tagline One</label>
              <input
                value={data.headerTaglineOne || ""}
                onChange={(e) => setData({ ...data, headerTaglineOne: e.target.value })}
                className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                type="text"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/5 text-lg opacity-50">Header Tagline Two</label>
              <input
                value={data.headerTaglineTwo || ""}
                onChange={(e) => setData({ ...data, headerTaglineTwo: e.target.value })}
                className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                type="text"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/5 text-lg opacity-50">Header Tagline Three</label>
              <input
                value={data.headerTaglineThree || ""}
                onChange={(e) => setData({ ...data, headerTaglineThree: e.target.value })}
                className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                type="text"
              />
            </div>
            <div className="flex items-center">
              <label className="w-1/5 text-lg opacity-50">Header Tagline Four</label>
              <input
                value={data.headerTaglineFour || ""}
                onChange={(e) => setData({ ...data, headerTaglineFour: e.target.value })}
                className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                type="text"
              />
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {currentTabs === "PROJECTS" && (
          <>
            <div className="mt-10">
              {data.projects.map((project, index) => (
                <div className="mt-10 border-t pt-6 first:border-0 first:pt-0" key={project.id || index} id={`project-block-${project.id}`}>
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{project.title}</h1>
                    <Button onClick={() => deleteProject(project.id)} classes={interactiveActionBtnStyles}>
                      Delete
                    </Button>
                  </div>
                  <div className="flex items-center mt-5">
                    <label className="w-1/5 text-lg opacity-50">Title</label>
                    <input
                      value={project.title}
                      onChange={(e) => editProjects(index, { ...project, title: e.target.value })}
                      className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                      type="text"
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-1/5 text-lg opacity-50">Description</label>
                    <input
                      value={project.description}
                      onChange={(e) => editProjects(index, { ...project, description: e.target.value })}
                      className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                      type="text"
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-1/5 text-lg opacity-50">Image Source</label>
                    <input
                      value={project.imageSrc}
                      onChange={(e) => editProjects(index, { ...project, imageSrc: e.target.value })}
                      className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                      type="text"
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-1/5 text-lg opacity-50">URL</label>
                    <input
                      value={project.url}
                      onChange={(e) => editProjects(index, { ...project, url: e.target.value })}
                      className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                      type="text"
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-1/5 text-lg opacity-50">Year</label>
                    <input
                      value={project.year || project.date || ""}
                      onChange={(e) => editProjects(index, { ...project, year: e.target.value, date: e.target.value })}
                      placeholder="e.g., 2026"
                      className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                      type="text"
                    />
                  </div>
                  <hr className="my-10" />
                </div>
              ))}
            </div>
            <div className="my-10">
              <Button onClick={addProject} classes={interactiveActionBtnStyles}>
                Add Project +
              </Button>
            </div>
          </>
        )}

        {/* ABOUT TAB */}
        {currentTabs === "ABOUT" && (
          <div className="mt-10">
            <h1 className="text-2xl font-semibold">About</h1>
            <textarea
              className={`w-full h-96 mt-10 p-2 rounded-md shadow-md ${inputThemeStyles}`}
              value={data.aboutpara || ""}
              onChange={(e) => setData({ ...data, aboutpara: e.target.value })}
            />
          </div>
        )}

        {/* RESUME TAB */}
        {currentTabs === "RESUME" && (
          <div className="mt-10">
            <h1 className="text-2xl font-bold mb-4">Main</h1>
            <div className="flex items-center">
              <label className="w-1/5 text-sm opacity-50">Tagline</label>
              <input
                value={data.resume.tagline || ""}
                onChange={(e) => setData({ ...data, resume: { ...data.resume, tagline: e.target.value } })}
                className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                type="text"
              />
            </div>
            <div className="flex items-center mt-5">
              <label className="w-1/5 text-lg opacity-50">Description</label>
              <textarea
                value={data.resume.description || ""}
                onChange={(e) => setData({ ...data, resume: { ...data.resume, description: e.target.value } })}
                className={`w-4/5 ml-10 p-2 rounded-md shadow-lg h-24 ${inputThemeStyles}`}
              />
            </div>
            <hr className="my-10" />

            <h1 className="text-2xl font-bold mb-4">Experiences</h1>
            <div className="mt-10">
              {data.resume.experiences.map((experience, index) => (
                <div className="mt-10 border p-4 rounded-md shadow-sm" key={experience.id || index} id={`experience-block-${experience.id}`}>
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">{experience.position}</h1>
                    <Button onClick={() => handleDeleteExperience(experience.id)} classes={interactiveActionBtnStyles}>
                      Delete
                    </Button>
                  </div>
                  <div className="flex items-center mt-5">
                    <label className="w-1/5 text-lg opacity-50">Dates</label>
                    <input
                      value={experience.dates}
                      onChange={(e) => handleEditExperiences(index, { ...experience, dates: e.target.value })}
                      className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                      type="text"
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-1/5 text-lg opacity-50">Type</label>
                    <input
                      value={experience.type}
                      onChange={(e) => handleEditExperiences(index, { ...experience, type: e.target.value })}
                      className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                      type="text"
                    />
                  </div>
                  <div className="flex items-center mt-2">
                    <label className="w-1/5 text-lg opacity-50">Position</label>
                    <input
                      value={experience.position}
                      onChange={(e) => handleEditExperiences(index, { ...experience, position: e.target.value })}
                      className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                      type="text"
                    />
                  </div>
                  <div className="mt-2 flex">
                    <label className="w-1/5 text-lg opacity-50">Bullets (Comma Separated)</label>
                    <div className="w-4/5 ml-10 flex flex-col">
                      <input
                        value={Array.isArray(experience.bullets) ? experience.bullets.join(", ") : experience.bullets}
                        onChange={(e) =>
                          handleEditExperiences(index, {
                            ...experience,
                            bullets: e.target.value.split(", ").map((b) => b.trim()),
                          })
                        }
                        placeholder="Bullet One, Bullet Two, Bullet Three"
                        className={`p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                        type="text"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Add Experience Button */}
            <div className="my-10">
              <Button onClick={handleAddExperiences} classes={interactiveActionBtnStyles}>
                Add Experience +
              </Button>
            </div>
            <hr className="my-10" />

            <h1 className="text-2xl font-bold mb-4">Education</h1>
            <div className="space-y-10">
              {getEducationArray().map((edu, index) => (
                <div key={edu.id || index} id={`education-block-${edu.id}`} className="space-y-5 border-b pb-8 last:border-0">
                  <div className="flex justify-between items-center mb-2">
                    <h2 className="text-lg font-medium opacity-70">Institution {index + 1}</h2>
                    {getEducationArray().length > 1 && (
                      <Button onClick={() => handleDeleteEducation(index)} classes={interactiveActionBtnStyles}>
                        Remove
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center">
                    <label className="w-1/5 text-lg opacity-50">Name</label>
                    <input
                      value={edu.universityName || ""}
                      onChange={(e) =>
                        handleEditEducation(index, { ...edu, universityName: e.target.value })
                      }
                      className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                      type="text"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="w-1/5 text-lg opacity-50">Dates</label>
                    <input
                      value={edu.universityDate || ""}
                      onChange={(e) =>
                        handleEditEducation(index, { ...edu, universityDate: e.target.value })
                      }
                      className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                      type="text"
                    />
                  </div>
                  <div className="flex items-center">
                    <label className="w-1/5 text-lg opacity-50">Detail</label>
                    <input
                      value={edu.universityPara || ""}
                      onChange={(e) =>
                        handleEditEducation(index, { ...edu, universityPara: e.target.value })
                      }
                      className={`w-4/5 ml-10 p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                      type="text"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="my-10">
              <Button onClick={handleAddEducation} classes={interactiveActionBtnStyles}>
                Add Education +
              </Button>
            </div>
            <hr className="my-10" />

            <div className="space-y-10">
              {/* Languages */}
              <div className="flex">
                <label className="w-1/5 text-lg opacity-50">Languages</label>
                <div className="w-4/5 ml-10 flex flex-col gap-2">
                  {data.resume.languages?.map((language, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        value={language}
                        onChange={(e) => {
                          const updatedLanguages = [...data.resume.languages];
                          updatedLanguages[index] = e.target.value;
                          setData({
                            ...data,
                            resume: { ...data.resume, languages: updatedLanguages },
                          });
                        }}
                        className={`w-full p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                        type="text"
                      />
                      <Button
                        onClick={() =>
                          setData({
                            ...data,
                            resume: {
                              ...data.resume,
                              languages: data.resume.languages.filter((_, i) => index !== i),
                            },
                          })
                        }
                        classes={interactiveActionBtnStyles}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    classes={interactiveActionBtnStyles}
                    onClick={() =>
                      setData({
                        ...data,
                        resume: { ...data.resume, languages: [...data.resume.languages, ""] },
                      })
                    }
                  >
                    Add +
                  </Button>
                </div>
              </div>
              <hr />

              {/* Frameworks */}
              <div className="flex">
                <label className="w-1/5 text-lg opacity-50">Frameworks</label>
                <div className="w-4/5 ml-10 flex flex-col gap-2">
                  {data.resume.frameworks?.map((framework, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        value={framework}
                        onChange={(e) => {
                          const updatedFrameworks = [...data.resume.frameworks];
                          updatedFrameworks[index] = e.target.value;
                          setData({
                            ...data,
                            resume: { ...data.resume, frameworks: updatedFrameworks },
                          });
                        }}
                        className={`w-full p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                        type="text"
                      />
                      <Button
                        onClick={() =>
                          setData({
                            ...data,
                            resume: {
                              ...data.resume,
                              frameworks: data.resume.frameworks.filter((_, i) => index !== i),
                            },
                          })
                        }
                        classes={interactiveActionBtnStyles}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    classes={interactiveActionBtnStyles}
                    onClick={() =>
                      setData({
                        ...data,
                        resume: { ...data.resume, frameworks: [...data.resume.frameworks, ""] },
                      })
                    }
                  >
                    Add +
                  </Button>
                </div>
              </div>
              <hr />

              {/* Others */}
              <div className="flex">
                <label className="w-1/5 text-lg opacity-50">Others</label>
                <div className="w-4/5 ml-10 flex flex-col gap-2">
                  {data.resume.others?.map((other, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        value={other}
                        onChange={(e) => {
                          const updatedOthers = [...data.resume.others];
                          updatedOthers[index] = e.target.value;
                          setData({
                            ...data,
                            resume: { ...data.resume, others: updatedOthers },
                          });
                        }}
                        className={`w-full p-2 rounded-md shadow-lg ${inputThemeStyles}`}
                        type="text"
                      />
                      <Button
                        onClick={() =>
                          setData({
                            ...data,
                            resume: {
                              ...data.resume,
                              others: data.resume.others.filter((_, i) => index !== i),
                            },
                          })
                        }
                        classes={interactiveActionBtnStyles}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                  <Button
                    classes={interactiveActionBtnStyles}
                    onClick={() =>
                      setData({
                        ...data,
                        resume: { ...data.resume, others: [...data.resume.others, ""] },
                      })
                    }
                  >
                    Add +
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* FLOATING SCROLL TO TOP BUTTON CONTAINER */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 z-50 p-3 rounded-full shadow-2xl border transition-all duration-300 ease-out flex items-center justify-center cursor-pointer ${
          showScrollTop 
            ? "opacity-100 scale-100 translate-y-0" 
            : "opacity-0 scale-75 translate-y-10 pointer-events-none"
        } ${
          theme === "dark"
            ? "bg-white text-black border-stone-200 hover:bg-stone-200"
            : "bg-black text-white border-stone-800 hover:bg-stone-800"
        } hover:scale-110 active:scale-95`}
        title="Scroll to top"
        type="button"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
          stroke="currentColor"
          className="w-6 h-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4.5 10.5 12 3m0 0 7.5 7.5M12 3v18"
          />
        </svg>
      </button>
    </div>
  );
};

export default Edit;