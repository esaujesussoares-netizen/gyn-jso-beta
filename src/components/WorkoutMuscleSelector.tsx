import { useState } from "react";
import { Search, RefreshCcw } from "lucide-react";
import bodyFront from "@/assets/body-selector-front.jpeg";
import bodyBack from "@/assets/body-selector-back.jpeg";

type MuscleGroup =
  | "ombros"
  | "peitoral"
  | "biceps"
  | "abdomen"
  | "obliquos"
  | "antebracos"
  | "abdutores"
  | "adutores"
  | "quadriceps"
  | "trapezio"
  | "dorsais"
  | "triceps"
  | "lombares"
  | "gluteos"
  | "isquiotibiais"
  | "panturrilhas"
  | "cardio";

interface MuscleLabel {
  name: string;
  muscle: MuscleGroup;
  side: "left" | "right";
  top: string;
  left?: string;
  right?: string;
  checkboxTop: string;
  checkboxLeft?: string;
  checkboxRight?: string;
}

const frontMuscles: MuscleLabel[] = [
  { 
    name: "Ombros", 
    muscle: "ombros", 
    side: "left", 
    left: "2%", 
    top: "32%",
    checkboxTop: "36%",
    checkboxLeft: "33%"
  },
  { 
    name: "Bíceps", 
    muscle: "biceps", 
    side: "left", 
    left: "2%", 
    top: "42%",
    checkboxTop: "47%",
    checkboxLeft: "29%"
  },
  { 
    name: "Oblíquos", 
    muscle: "obliquos", 
    side: "left", 
    left: "0%", 
    top: "52%",
    checkboxTop: "54%",
    checkboxLeft: "38%"
  },
  { 
    name: "Abdutores", 
    muscle: "abdutores", 
    side: "left", 
    left: "0%", 
    top: "62%",
    checkboxTop: "64%",
    checkboxLeft: "35%"
  },
  { 
    name: "Quadríceps", 
    muscle: "quadriceps", 
    side: "left", 
    left: "0%", 
    top: "74%",
    checkboxTop: "76%",
    checkboxLeft: "38%"
  },
  { 
    name: "Peitoral", 
    muscle: "peitoral", 
    side: "right", 
    right: "0%", 
    top: "33%",
    checkboxTop: "37%",
    checkboxRight: "54%"
  },
  { 
    name: "Abdômen", 
    muscle: "abdomen", 
    side: "right", 
    right: "0%", 
    top: "44%",
    checkboxTop: "49%",
    checkboxRight: "48%"
  },
  { 
    name: "Antebraço", 
    muscle: "antebracos", 
    side: "right", 
    right: "0%", 
    top: "56%",
    checkboxTop: "60%",
    checkboxRight: "69%"
  },
  { 
    name: "Adutores", 
    muscle: "adutores", 
    side: "right", 
    right: "0%", 
    top: "68%",
    checkboxTop: "71%",
    checkboxRight: "53%"
  },
  { 
    name: "Cardio", 
    muscle: "cardio", 
    side: "right", 
    right: "6%", 
    top: "78%",
    checkboxTop: "82%",
    checkboxRight: "48%"
  }
];

const backMuscles: MuscleLabel[] = [
  { 
    name: "Trapézio", 
    muscle: "trapezio", 
    side: "right", 
    right: "0%", 
    top: "34%",
    checkboxTop: "37%",
    checkboxRight: "54%"
  },
  { 
    name: "Tríceps", 
    muscle: "triceps", 
    side: "left", 
    left: "0%", 
    top: "40%",
    checkboxTop: "44%",
    checkboxLeft: "30%"
  },
  { 
    name: "Dorsais", 
    muscle: "dorsais", 
    side: "right", 
    right: "6%", 
    top: "46%",
    checkboxTop: "49%",
    checkboxRight: "56%"
  },
  { 
    name: "Lombares", 
    muscle: "lombares", 
    side: "left", 
    left: "0%", 
    top: "52%",
    checkboxTop: "55%",
    checkboxLeft: "48%"
  },
  { 
    name: "Glúteos", 
    muscle: "gluteos", 
    side: "right", 
    right: "6%", 
    top: "62%",
    checkboxTop: "65%",
    checkboxRight: "54%"
  },
  { 
    name: "Isquiotibiais", 
    muscle: "isquiotibiais", 
    side: "left", 
    left: "0%", 
    top: "72%",
    checkboxTop: "75%",
    checkboxLeft: "38%"
  },
  { 
    name: "Panturrilhas", 
    muscle: "panturrilhas", 
    side: "left", 
    left: "0%", 
    top: "84%",
    checkboxTop: "88%",
    checkboxLeft: "38%"
  },
  { 
    name: "Cardio", 
    muscle: "cardio", 
    side: "right", 
    right: "6%", 
    top: "74%",
    checkboxTop: "78%",
    checkboxRight: "48%"
  }
];

export function WorkoutMuscleSelector() {
  const [isBackView, setIsBackView] = useState(false);
  const [selectedMuscles, setSelectedMuscles] = useState<MuscleGroup[]>([]);
  const [isRotating, setIsRotating] = useState(false);

  const currentMuscles = isBackView ? backMuscles : frontMuscles;
  const currentImage = isBackView ? bodyBack : bodyFront;

  const toggleRotation = () => {
    setIsRotating(true);
    setTimeout(() => {
      setIsBackView(!isBackView);
      setIsRotating(false);
    }, 350);
  };

  const toggleMuscle = (muscle: MuscleGroup) => {
    if (selectedMuscles.includes(muscle)) {
      setSelectedMuscles(selectedMuscles.filter(m => m !== muscle));
    } else {
      setSelectedMuscles([...selectedMuscles, muscle]);
    }
  };

  const isMuscleSelected = (muscle: MuscleGroup) => selectedMuscles.includes(muscle);

  return (
    <div className="min-h-screen bg-[#1A1A1A] text-white relative pb-20">
      {/* Header */}
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Exercícios</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Pesquisar"
            className="w-full bg-[#2D2D2D] text-white placeholder-gray-400 rounded-full py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
          />
        </div>

        {/* Selected Counter */}
        {selectedMuscles.length > 0 && (
          <div className="mt-4 text-center">
            <span className="inline-block bg-orange-500/20 text-orange-400 px-4 py-2 rounded-full text-sm font-medium">
              {selectedMuscles.length} músculo{selectedMuscles.length > 1 ? 's' : ''} selecionado{selectedMuscles.length > 1 ? 's' : ''}
            </span>
          </div>
        )}
      </div>

      {/* Body Silhouette Container */}
      <div className="relative px-6 py-8">
        <div 
          className={`relative mx-auto max-w-md transition-all duration-700 ${
            isRotating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isRotating 
              ? `rotateY(${isBackView ? -90 : 90}deg)` 
              : 'rotateY(0deg)'
          }}
        >
          {/* Body Image */}
          <img 
            src={currentImage} 
            alt={isBackView ? "Vista das costas" : "Vista da frente"}
            className="w-full h-auto"
          />

          {/* Labels with checkboxes and connector lines - Positioned absolutely over the image */}
          {currentMuscles.map((label) => {
            const isSelected = isMuscleSelected(label.muscle);
            
            return (
              <div key={label.muscle}>
                {/* Connector Line */}
                <svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 1 }}
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                >
                  <line
                    x1={label.side === "left" ? label.checkboxLeft : `${100 - parseFloat(label.checkboxRight || "0")}`}
                    y1={label.checkboxTop}
                    x2={label.side === "left" ? label.left : `${100 - parseFloat(label.right || "0")}`}
                    y2={label.top}
                    stroke="#9CA3AF"
                    strokeWidth="0.3"
                    opacity="0.7"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                {/* Checkbox */}
                <div
                  className="absolute cursor-pointer hover:scale-110 transition-transform"
                  style={{
                    top: label.checkboxTop,
                    [label.side === "left" ? "left" : "right"]: label.side === "left" ? label.checkboxLeft : label.checkboxRight,
                    zIndex: 2
                  }}
                  onClick={() => toggleMuscle(label.muscle)}
                >
                  <div className={`w-4 h-4 border-2 border-white rounded-sm flex items-center justify-center transition-all ${
                    isSelected ? 'bg-orange-500 border-orange-500' : 'bg-transparent'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Label Text */}
                <div
                  className="absolute cursor-pointer hover:scale-105 transition-transform"
                  style={{
                    top: label.top,
                    [label.side === "left" ? "left" : "right"]: label.side === "left" ? label.left : label.right,
                    zIndex: 2
                  }}
                  onClick={() => toggleMuscle(label.muscle)}
                >
                  <span className="text-white text-sm font-medium underline whitespace-nowrap">
                    {label.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Rotate Button */}
        <button
          onClick={toggleRotation}
          disabled={isRotating}
          className="fixed bottom-24 right-6 bg-[#FFD4A3] text-black px-6 py-3 rounded-full flex items-center gap-2 font-medium shadow-lg hover:bg-[#FFC68A] transition-all disabled:opacity-50 disabled:cursor-not-allowed z-10"
        >
          <RefreshCcw className={`w-5 h-5 ${isRotating ? 'animate-spin' : ''}`} />
          Rotacionar
        </button>
      </div>
    </div>
  );
}
