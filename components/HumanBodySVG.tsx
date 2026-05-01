import React from "react";
import Model from "react-body-highlighter";

interface HumanBodySVGProps {
  onSelectPart: (partName: string) => void;
  selectedPart: string | null;
  symptoms: any[]; // We can optionally highlight parts that have symptoms
}

export default function HumanBodySVG({ onSelectPart, selectedPart, symptoms }: HumanBodySVGProps) {
  
  // Format the data for react-body-highlighter to show which muscles have symptoms
  // The 'data' prop expects an array of exercises, we will use it to highlight parts
  const activeMuscles = symptoms.map(s => s.part.toLowerCase().replace(" ", "-"));
  
  // If a part is selected, we want it highly visible.
  const data = selectedPart ? [{
    name: "Selected",
    muscles: [selectedPart.toLowerCase().replace(" ", "-")],
    frequency: 1
  }] : [];

  // Add symptoms parts as well if we want them highlighted (optional, we'll keep it simple and just highlight selected part)

  const handleClick = (muscleData: any) => {
    // The library returns { muscle: 'chest', data: {...} }
    if (muscleData && muscleData.muscle) {
      // capitalize and format
      const formattedName = muscleData.muscle
        .split("-")
        .map((w: string) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
      onSelectPart(formattedName);
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-center items-center p-4 bg-gray-50 dark:bg-gray-900 rounded-xl border dark:border-gray-800">
      <div className="w-full max-w-[250px]">
        <Model
          type="anterior"
          data={data}
          style={{ width: "100%", padding: "10px" }}
          onClick={handleClick}
          highlightedColors={["#3b82f6"]} // Tailwind blue-500
          bodyColor="#e2e8f0" // Tailwind slate-200
        />
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">
        Interactive human body model. Click on any specific body part.
      </p>
    </div>
  );
}
