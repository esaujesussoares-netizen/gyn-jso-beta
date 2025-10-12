import { useState } from "react";
import { Search, RefreshCcw } from "lucide-react";

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
          className={`relative mx-auto max-w-md transition-transform duration-700 ${
            isRotating ? 'scale-95 opacity-50' : 'scale-100 opacity-100'
          }`}
          style={{
            transformStyle: 'preserve-3d',
            transform: isRotating 
              ? `rotateY(${isBackView ? -90 : 90}deg)` 
              : 'rotateY(0deg)'
          }}
        >
          {/* SVG Body Silhouette */}
          <svg
            viewBox="0 0 400 700"
            className="w-full h-auto"
            style={{ filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.5))' }}
          >
            {/* Base silhouette - simplified anatomical shape */}
            <g fill="#7A7A7A" stroke="none">
              {/* Head */}
              <ellipse cx="200" cy="60" rx="40" ry="50" />
              <rect x="195" y="100" width="10" height="20" />
              
              {/* Torso */}
              <path d="M 160 120 Q 150 150 150 200 L 150 280 Q 150 320 170 340 L 230 340 Q 250 320 250 280 L 250 200 Q 250 150 240 120 Z" />
              
              {/* Arms */}
              <path d="M 150 140 Q 130 160 120 200 L 110 260 Q 105 280 100 300 L 90 340 Q 85 360 80 380 L 70 420 L 60 450 Q 55 470 60 480 L 70 490 L 85 485 L 95 470 L 105 440 L 115 400 L 125 350 L 135 300 Q 140 270 145 240 L 150 200 Z" />
              <path d="M 250 140 Q 270 160 280 200 L 290 260 Q 295 280 300 300 L 310 340 Q 315 360 320 380 L 330 420 L 340 450 Q 345 470 340 480 L 330 490 L 315 485 L 305 470 L 295 440 L 285 400 L 275 350 L 265 300 Q 260 270 255 240 L 250 200 Z" />
              
              {/* Legs */}
              <path d="M 170 340 L 165 420 L 160 500 L 155 580 L 152 640 Q 150 660 155 670 L 165 680 L 180 675 L 185 660 L 188 640 L 192 580 L 197 500 L 200 420 L 200 340 Z" />
              <path d="M 230 340 L 235 420 L 240 500 L 245 580 L 248 640 Q 250 660 245 670 L 235 680 L 220 675 L 215 660 L 212 640 L 208 580 L 203 500 L 200 420 L 200 340 Z" />
            </g>

            {/* Highlighted muscle regions */}
            {!isBackView && (
              <>
                {/* Ombros */}
                <ellipse 
                  cx="165" cy="135" rx="22" ry="15" 
                  fill="#575757" 
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('ombros') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('ombros')}
                />
                <ellipse 
                  cx="235" cy="135" rx="22" ry="15" 
                  fill="#575757" 
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('ombros') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('ombros')}
                />
                
                {/* Peitoral */}
                <path 
                  d="M 175 145 Q 170 160 170 180 L 175 200 L 195 210 L 200 200 L 200 145 Z" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('peitoral') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('peitoral')}
                />
                <path 
                  d="M 225 145 Q 230 160 230 180 L 225 200 L 205 210 L 200 200 L 200 145 Z" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('peitoral') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('peitoral')}
                />
                
                {/* Bíceps */}
                <ellipse 
                  cx="135" cy="210" rx="18" ry="25" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('biceps') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('biceps')}
                />
                <ellipse 
                  cx="265" cy="210" rx="18" ry="25" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('biceps') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('biceps')}
                />
                
                {/* Abdômen */}
                <rect 
                  x="180" y="220" width="40" height="60" rx="8"
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('abdomen') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('abdomen')}
                />
                
                {/* Oblíquos */}
                <path 
                  d="M 160 240 Q 155 250 155 270 L 160 290 L 175 295 L 180 280 L 180 240 Z" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('obliquos') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('obliquos')}
                />
                <path 
                  d="M 240 240 Q 245 250 245 270 L 240 290 L 225 295 L 220 280 L 220 240 Z" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('obliquos') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('obliquos')}
                />
                
                {/* Antebraços */}
                <ellipse 
                  cx="105" cy="320" rx="12" ry="30" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('antebracos') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('antebracos')}
                />
                <ellipse 
                  cx="295" cy="320" rx="12" ry="30" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('antebracos') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('antebracos')}
                />
                
                {/* Abdutores */}
                <ellipse 
                  cx="160" cy="365" rx="15" ry="20" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('abdutores') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('abdutores')}
                />
                
                {/* Adutores */}
                <ellipse 
                  cx="240" cy="365" rx="15" ry="20" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('adutores') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('adutores')}
                />
                
                {/* Quadríceps */}
                <ellipse 
                  cx="177" cy="450" rx="20" ry="50" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('quadriceps') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('quadriceps')}
                />
                <ellipse 
                  cx="223" cy="450" rx="20" ry="50" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('quadriceps') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('quadriceps')}
                />
              </>
            )}

            {isBackView && (
              <>
                {/* Trapézio */}
                <path 
                  d="M 170 125 L 160 145 L 175 160 L 200 155 L 225 160 L 240 145 L 230 125 L 200 120 Z" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('trapezio') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('trapezio')}
                />
                
                {/* Dorsais */}
                <path 
                  d="M 170 180 Q 160 200 160 230 L 165 260 L 185 270 L 200 265 L 200 180 Z" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('dorsais') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('dorsais')}
                />
                <path 
                  d="M 230 180 Q 240 200 240 230 L 235 260 L 215 270 L 200 265 L 200 180 Z" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('dorsais') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('dorsais')}
                />
                
                {/* Tríceps */}
                <ellipse 
                  cx="135" cy="200" rx="15" ry="28" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('triceps') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('triceps')}
                />
                <ellipse 
                  cx="265" cy="200" rx="15" ry="28" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('triceps') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('triceps')}
                />
                
                {/* Lombares */}
                <rect 
                  x="175" y="270" width="50" height="40" rx="8"
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('lombares') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('lombares')}
                />
                
                {/* Glúteos */}
                <ellipse 
                  cx="178" cy="355" rx="22" ry="30" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('gluteos') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('gluteos')}
                />
                <ellipse 
                  cx="222" cy="355" rx="22" ry="30" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('gluteos') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('gluteos')}
                />
                
                {/* Isquiotibiais */}
                <ellipse 
                  cx="175" cy="455" rx="18" ry="45" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('isquiotibiais') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('isquiotibiais')}
                />
                <ellipse 
                  cx="225" cy="455" rx="18" ry="45" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('isquiotibiais') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('isquiotibiais')}
                />
                
                {/* Panturrilhas */}
                <ellipse 
                  cx="173" cy="580" rx="16" ry="35" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('panturrilhas') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('panturrilhas')}
                />
                <ellipse 
                  cx="227" cy="580" rx="16" ry="35" 
                  fill="#575757"
                  className={`cursor-pointer transition-all hover:fill-[#4A4A4A] ${
                    isMuscleSelected('panturrilhas') ? 'stroke-[#F97316] stroke-2' : ''
                  }`}
                  onClick={() => toggleMuscle('panturrilhas')}
                />
              </>
            )}
          </svg>

          {/* Labels with checkboxes and connector lines */}
          {currentMuscles.map((label) => {
            const isSelected = isMuscleSelected(label.muscle);
            
            return (
              <div key={label.muscle}>
                {/* Connector Line */}
                <svg
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 1 }}
                >
                  <line
                    x1={label.side === "left" ? label.checkboxLeft : `calc(100% - ${label.checkboxRight})`}
                    y1={label.checkboxTop}
                    x2={label.side === "left" ? label.left : `calc(100% - ${label.right})`}
                    y2={label.top}
                    stroke="#9CA3AF"
                    strokeWidth="1.5"
                    opacity="0.7"
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
