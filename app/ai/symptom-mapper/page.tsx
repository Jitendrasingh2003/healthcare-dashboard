"use client";

import React, { useState } from "react";
import HumanBodySVG from "@/components/HumanBodySVG";
import SymptomPanel from "@/components/SymptomPanel";
import { AlertTriangle, Info, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Symptom {
  part: string;
  symptom: string;
}

interface AnalysisResult {
  possibleConditions: string[];
  triageLevel: "Emergency" | "Urgent" | "Routine";
  recommendations: string[];
}

export default function SymptomMapperPage() {
  const [selectedPart, setSelectedPart] = useState<string | null>(null);
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAddSymptom = (symptom: Symptom) => {
    setSymptoms([...symptoms, symptom]);
    // Clear result if we are modifying symptoms
    setResult(null);
  };

  const handleRemoveSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (symptoms.length === 0) return;
    
    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/ai/symptom-checker", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms }),
      });

      if (!response.ok) {
        throw new Error("Failed to analyze symptoms");
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getTriageColor = (level: string) => {
    switch (level) {
      case "Emergency": return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
      case "Urgent": return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800";
      case "Routine": return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTriageIcon = (level: string) => {
    switch (level) {
      case "Emergency": return <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case "Urgent": return <AlertTriangle className="w-5 h-5 text-orange-600 dark:text-orange-400" />;
      case "Routine": return <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />;
      default: return <Info className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-gray-950 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-2 rounded-lg bg-white dark:bg-gray-900 border dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Interactive Symptom Mapper</h1>
            <p className="text-gray-500">Select a body part to add symptoms and get an AI preliminary assessment.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: SVG Map */}
          <div className="lg:col-span-1 bg-white dark:bg-gray-900 p-6 rounded-2xl border dark:border-gray-800 shadow-sm flex flex-col">
            <h2 className="font-semibold mb-4 text-center">Body Map</h2>
            <div className="flex-1 flex items-center justify-center min-h-[400px]">
              <HumanBodySVG 
                selectedPart={selectedPart} 
                onSelectPart={(part) => setSelectedPart(part)}
                symptoms={symptoms}
              />
            </div>
          </div>

          {/* Middle: Symptom Panel */}
          <div className="lg:col-span-1">
            <SymptomPanel 
              selectedPart={selectedPart}
              symptoms={symptoms}
              onAddSymptom={handleAddSymptom}
              onRemoveSymptom={handleRemoveSymptom}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
          </div>

          {/* Right: AI Results */}
          <div className="lg:col-span-1 flex flex-col gap-4">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800/30 flex gap-3">
                <AlertTriangle className="w-5 h-5 shrink-0" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            {!result && !isAnalyzing && !error && (
              <div className="h-full bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center text-gray-400">
                <Info className="w-12 h-12 mb-3 opacity-20" />
                <p>Add symptoms and click Analyze to see AI preliminary assessment here.</p>
              </div>
            )}

            {isAnalyzing && (
              <div className="h-full bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                <p className="font-medium text-gray-700 dark:text-gray-300">Consulting AI Knowledge Base...</p>
                <p className="text-sm text-gray-500 mt-2">Analyzing your symptoms securely.</p>
              </div>
            )}

            {result && !isAnalyzing && (
              <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className={`p-4 border-b flex items-center gap-3 ${getTriageColor(result.triageLevel)}`}>
                  {getTriageIcon(result.triageLevel)}
                  <div>
                    <h3 className="font-bold">Triage: {result.triageLevel}</h3>
                  </div>
                </div>

                <div className="p-5 flex-1 overflow-y-auto space-y-6">
                  
                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Possible Conditions</h4>
                    <ul className="space-y-2">
                      {result.possibleConditions.map((cond, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm bg-gray-50 dark:bg-gray-800/50 p-2 rounded-lg border dark:border-gray-700/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0"></span>
                          {cond}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">Recommendations</h4>
                    <ul className="space-y-3">
                      {result.recommendations.map((rec, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                          <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border-t border-yellow-100 dark:border-yellow-900/30 text-xs text-yellow-800 dark:text-yellow-500 flex gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <p><strong>Disclaimer:</strong> This is an AI-generated assessment for informational purposes only and does not constitute medical advice. Please consult a qualified healthcare provider for proper diagnosis.</p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
