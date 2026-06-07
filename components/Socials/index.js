import React from "react";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import data from "../../data/portfolio.json";

const Socials = ({ className }) => {
  // Helper to map titles to specific icons
  const getIcon = (title) => {
    switch (title.toLowerCase()) {
      case "github":
        return <AiFillGithub />;
      case "linkedin":
        return <AiFillLinkedin />;
      default:
        return null;
    }
  };

  return (
    <div className={className}>
      {data.socials.map((social) => (
        <a
          key={social.id}
          href={social.link}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-lg text-white hover:text-[#518e96] transition-colors"
        >
          {getIcon(social.title)}
          {social.title}
        </a>
      ))}
    </div>
  );
};

export default Socials;