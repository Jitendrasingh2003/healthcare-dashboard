import React, { useState } from "react";
import { Plus, X, Activity, AlertCircle } from "lucide-react";

interface Symptom {
  part: string;
  symptom: string;
}

interface SymptomPanelProps {
  selectedPart: string | null;
  symptoms: Symptom[];
  onAddSymptom: (symptom: Symptom) => void;
  onRemoveSymptom: (index: number) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export default function SymptomPanel({
  selectedPart,
  symptoms,
  onAddSymptom,
  onRemoveSymptom,
  onAnalyze,
  isAnalyzing,
}: SymptomPanelProps) {
  const [symptomText, setSymptomText] = useState("");

  const handleAdd = () => {
    if (selectedPart && symptomText.trim() !== "") {
      onAddSymptom({ part: selectedPart, symptom: symptomText.trim() });
      setSymptomText("");
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl overflow-hidden shadow-sm">
      <div className="p-5 border-b dark:border-gray-800 bg-blue-50/50 dark:bg-blue-900/10">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="w-5 h-5 text-blue-500" />
          Symptom Tracker
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {selectedPart
            ? `Selected: ${selectedPart}. Enter symptoms below.`
            : "Click on a body part to add symptoms."}
        </p>
      </div>

      <div className="p-5 flex-1 overflow-y-auto">
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Add Symptom for {selectedPart || "..."}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={symptomText}
              onChange={(e) => setSymptomText(e.target.value)}
              placeholder="e.g. Sharp pain, swelling..."
              className="flex-1 rounded-lg border dark:border-gray-700 p-2 text-sm bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-blue-500"
              disabled={!selectedPart}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleAdd();
              }}
            />
            <button
              onClick={handleAdd}
              disabled={!selectedPart || !symptomText.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center justify-between">
            Logged Symptoms
            <span className="bg-blue-100 text-blue-700 py-0.5 px-2 rounded-full text-xs">
              {symptoms.length}
            </span>
          </h3>

          {symptoms.length === 0 ? (
            <div className="text-center py-8 text-gray-400 flex flex-col items-center">
              <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">No symptoms added yet.</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {symptoms.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg border dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50"
                >
                  <div>
                    <p className="text-sm font-medium">{item.symptom}</p>
                    <p className="text-xs text-gray-500">{item.part}</p>
                  </div>
                  <button
                    onClick={() => onRemoveSymptom(index)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="p-5 border-t dark:border-gray-800 bg-gray-50 dark:bg-gray-900">
        <button
          onClick={onAnalyze}
          disabled={symptoms.length === 0 || isAnalyzing}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm transition-all active:scale-95"
        >
          {isAnalyzing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
              Analyzing...
            </>
          ) : (
            <>
              <Activity className="w-5 h-5" />
              Analyze Symptoms with AI
            </>
          )}
        </button>
      </div>
    </div>
  );
}
