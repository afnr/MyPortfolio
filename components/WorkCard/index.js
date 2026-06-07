import React from "react";

const WorkCard = ({ name, description, onClick }) => {
  return (
    <div
      className="cursor-pointer bg-[#f4fbfc] hover:bg-[#d5eff2] border border-[#e1f5f7] hover:border-[#bce3e7] rounded-2xl p-8 flex flex-col justify-center items-center text-center shadow-sm min-h-[260px] w-full transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
      onClick={onClick}
    >
      {/* Title with your preferred text sizing */}
      <h3 className="text-lg font-bold text-[#518e96] tracking-wide mb-3 px-2">
        {name ? name : "Project Name"}
      </h3>
      
      {/* Description with your preferred text sizing and width limits */}
      <p className="text-sm sm:text-base text-[#4d6669] font-medium leading-relaxed max-w-[280px]">
        {description ? description : "Description"}
      </p>
    </div>
  );
};

export default WorkCard;