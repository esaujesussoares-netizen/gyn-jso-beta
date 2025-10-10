import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ExerciseList } from "@/components/ExerciseList";
import { RefreshCw, X, Edit, Copy, RotateCcw, Move, Plus, Minus } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import bodyFront from "@/assets/body-front-workout.png";
import bodyBack from "@/assets/body-back-workout.png";

type MuscleGroup =
  | "peitoral"
  | "ombros"
  | "biceps"
  | "triceps"
  | "abdomen"
  | "obliquos"
  | "antebracos"
  | "dorsais"
  | "trapezio"
  | "lombares"
  | "quadriceps"
  | "isquiotibiais"
  | "gluteos"
  | "panturrilhas"
  | "adutores"
  | "abdutores"
  | "cardio";

interface MuscleLabel {
  name: string;
  muscle: MuscleGroup;
  side: "left" | "right";
  top: string;
  left?: string;
  right?: string;
}

const frontLabels: MuscleLabel[] = [
  { name: "Ombros", muscle: "ombros", side: "left", left: "5%", top: "13%" },
  { name: "Bíceps", muscle: "biceps", side: "left", left: "5%", top: "31%" },
  { name: "Oblíquos", muscle: "obliquos", side: "left", left: "5%", top: "44%" },
  { name: "Abdutores", muscle: "abdutores", side: "left", left: "5%", top: "57%" },
  { name: "Quadríceps", muscle: "quadriceps", side: "left", left: "5%", top: "71%" },
  { name: "Peitoral", muscle: "peitoral", side: "right", right: "5%", top: "18%" },
  { name: "Abdômen", muscle: "abdomen", side: "right", right: "5%", top: "36%" },
  { name: "Antebraços", muscle: "antebracos", side: "right", right: "5%", top: "50%" },
  { name: "Adutores", muscle: "adutores", side: "right", right: "5%", top: "63%" },
  { name: "Cardio", muscle: "cardio", side: "right", right: "5%", top: "76%" },
];

const backLabels: MuscleLabel[] = [
  { name: "Trapézio", muscle: "trapezio", side: "right", right: "5%", top: "12%" },
  { name: "Tríceps", muscle: "triceps", side: "left", left: "5%", top: "28%" },
  { name: "Dorsais", muscle: "dorsais", side: "right", right: "5%", top: "31%" },
  { name: "Lombares", muscle: "lombares", side: "left", left: "5%", top: "44%" },
  { name: "Glúteos", muscle: "gluteos", side: "right", right: "5%", top: "52%" },
  { name: "Isquiotibiais", muscle: "isquiotibiais", side: "left", left: "5%", top: "65%" },
  { name: "Panturrilhas", muscle: "panturrilhas", side: "left", left: "5%", top: "80%" },
  { name: "Cardio", muscle: "cardio", side: "right", right: "5%", top: "69%" },
];

interface CustomPosition {
  top: string;
  left?: string;
  right?: string;
}

type CustomPositions = {
  front: Partial<Record<MuscleGroup, CustomPosition>>;
  back: Partial<Record<MuscleGroup, CustomPosition>>;
};

export function WorkoutMuscleSelector() {
  const [view, setView] = useState<"front" | "back">("front");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleGroup | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [customPositions, setCustomPositions] = useState<CustomPositions>({ front: {}, back: {} });
  const [draggedLabel, setDraggedLabel] = useState<MuscleGroup | null>(null);
  const [showCoordinates, setShowCoordinates] = useState(false);
  const [labelFontSize, setLabelFontSize] = useState(14); // Default 14px
  const containerRef = useRef<HTMLDivElement>(null);
  const dragStartPos = useRef({ x: 0, y: 0, labelTop: 0, labelLeft: 0 });

  const labels = view === "front" ? frontLabels : backLabels;

  const getEffectivePosition = (label: MuscleLabel): { top: string; left?: string; right?: string } => {
    const customPos = customPositions[view][label.muscle];
    if (customPos) {
      return customPos;
    }
    return { top: label.top, left: label.left, right: label.right };
  };

  const handleRotate = () => {
    setView(view === "front" ? "back" : "front");
    setSelectedMuscle(null);
  };

  const handleMuscleSelect = (muscle: MuscleGroup) => {
    if (isEditMode) return; // Disable click in edit mode
    setSelectedMuscle(muscle);
    setIsDialogOpen(true);
  };

  const handleMouseDown = (e: React.MouseEvent, label: MuscleLabel) => {
    if (!isEditMode || !containerRef.current) return;
    e.preventDefault();
    e.stopPropagation();
    
    setDraggedLabel(label.muscle);
    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Store initial mouse position and calculate current label position in pixels
    const currentPos = getEffectivePosition(label);
    const currentTopPercent = parseFloat(currentPos.top);
    const currentTopPx = (currentTopPercent / 100) * rect.height;
    
    dragStartPos.current = {
      x: e.clientX,
      y: e.clientY,
      labelTop: currentTopPx,
      labelLeft: 0 // Will be calculated based on mouse position
    };
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!draggedLabel || !containerRef.current || !isEditMode) return;

    const container = containerRef.current;
    const rect = container.getBoundingClientRect();
    
    // Calculate new position based on current mouse position
    const mouseY = e.clientY - rect.top;
    const deltaY = e.clientY - dragStartPos.current.y;
    const newTopPx = dragStartPos.current.labelTop + deltaY;
    
    // Convert to percentage and clamp
    const newTopPercent = Math.max(0, Math.min(100, (newTopPx / rect.height) * 100));
    
    // For horizontal position, keep it fixed (don't change left/right based on mouse movement)
    const label = labels.find(l => l.muscle === draggedLabel);
    if (!label) return;
    
    const currentPos = getEffectivePosition(label);
    
    const newPosition: CustomPosition = {
      top: `${newTopPercent.toFixed(1)}%`,
      ...(label.side === "left" 
        ? { left: currentPos.left } 
        : { right: currentPos.right })
    };

    setCustomPositions(prev => ({
      ...prev,
      [view]: {
        ...prev[view],
        [draggedLabel]: newPosition
      }
    }));
  };

  const handleMouseUp = () => {
    if (draggedLabel) {
      setDraggedLabel(null);
    }
  };

  const resetPositions = () => {
    if (confirm("Deseja resetar todas as posições customizadas?")) {
      setCustomPositions({ front: {}, back: {} });
      toast({
        title: "Posições resetadas!",
        description: "As posições dos labels foram restauradas para o padrão.",
      });
    }
  };

  const copyCoordinates = () => {
    const generateLabelsCode = (
      baseLabels: MuscleLabel[], 
      customPos: Partial<Record<MuscleGroup, CustomPosition>>
    ) => {
      return baseLabels.map(label => {
        const pos = customPos[label.muscle] || { 
          top: label.top, 
          left: label.left, 
          right: label.right 
        };
        return `  { name: "${label.name}", muscle: "${label.muscle}", side: "${label.side}", ${
          label.side === "left" ? `left: "${pos.left}"` : `right: "${pos.right}"`
        }, top: "${pos.top}" }`;
      }).join(',\n');
    };

    const frontCode = `const frontLabels: MuscleLabel[] = [\n${generateLabelsCode(frontLabels, customPositions.front)}\n];`;
    const backCode = `const backLabels: MuscleLabel[] = [\n${generateLabelsCode(backLabels, customPositions.back)}\n];`;
    
    const fullCode = `${frontCode}\n\n${backCode}`;
    
    navigator.clipboard.writeText(fullCode);
    toast({
      title: "Coordenadas copiadas!",
      description: "As coordenadas foram copiadas para a área de transferência.",
    });
    setShowCoordinates(true);
  };

  // Add/remove mouse listeners
  useEffect(() => {
    if (isEditMode) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isEditMode, draggedLabel]);

  const editedCount = Object.keys(customPositions.front).length + Object.keys(customPositions.back).length;

  return (
    <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-6 relative">
      {/* Toolbar */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-4 space-y-4">
        {/* Main Controls */}
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            onClick={() => setIsEditMode(!isEditMode)}
            variant={isEditMode ? "default" : "outline"}
            className={isEditMode ? "bg-blue-500 hover:bg-blue-600" : ""}
          >
            <Edit className="w-4 h-4 mr-2" />
            {isEditMode ? "Sair do Modo Edição" : "Modo Edição"}
          </Button>
          
          <Button onClick={copyCoordinates} variant="outline" disabled={editedCount === 0}>
            <Copy className="w-4 h-4 mr-2" />
            Copiar Coordenadas
          </Button>
          
          <Button onClick={resetPositions} variant="outline" disabled={editedCount === 0}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Resetar Posições
          </Button>

          {editedCount > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {editedCount} label{editedCount > 1 ? 's' : ''} editado{editedCount > 1 ? 's' : ''}
            </Badge>
          )}

          {isEditMode && (
            <Badge variant="default" className="bg-blue-500">
              Arraste os labels para reposicioná-los
            </Badge>
          )}
        </div>

        {/* Font Size Control */}
        <div className="flex items-center gap-3 pt-2 border-t">
          <span className="text-sm font-medium text-gray-700">Tamanho do Texto:</span>
          
          <Button
            size="icon"
            variant="outline"
            onClick={() => setLabelFontSize(prev => Math.max(10, prev - 1))}
            disabled={labelFontSize <= 10}
            className="h-8 w-8"
          >
            <Minus className="w-4 h-4" />
          </Button>
          
          <span className="text-sm font-semibold text-gray-900 min-w-[50px] text-center">
            {labelFontSize}px
          </span>
          
          <Button
            size="icon"
            variant="outline"
            onClick={() => setLabelFontSize(prev => Math.min(24, prev + 1))}
            disabled={labelFontSize >= 24}
            className="h-8 w-8"
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Muscle Map */}
      <div className="relative w-full flex items-center justify-center py-8">
        <div ref={containerRef} className="relative w-full max-w-[600px] flex items-center justify-center">
          {/* Body Image */}
          <div className="relative flex items-center justify-center transition-all duration-300 ease-in-out">
            <img
              src={view === "front" ? bodyFront : bodyBack}
              alt={view === "front" ? "Vista frontal do corpo" : "Vista traseira do corpo"}
              className="w-[280px] h-auto object-contain transition-opacity duration-300"
              style={{ maxHeight: "600px" }}
            />
          </div>

          {/* Muscle Labels */}
          <div className="absolute inset-0 pointer-events-none">
            {labels.map((label) => {
              const position = getEffectivePosition(label);
              const isDragging = draggedLabel === label.muscle;
              
              return (
                <div
                  key={label.muscle}
                  className={`absolute pointer-events-auto group ${
                    isEditMode ? 'cursor-move' : 'cursor-pointer'
                  } ${isDragging ? 'opacity-70 scale-105' : ''} transition-all duration-100`}
                  style={{ 
                    top: position.top,
                    left: position.left,
                    right: position.right
                  }}
                  onClick={() => handleMuscleSelect(label.muscle)}
                  onMouseDown={(e) => handleMouseDown(e, label)}
                >
                  <div className={`flex items-center ${label.side === "left" ? "flex-row" : "flex-row-reverse"} gap-1 ${
                    isEditMode ? 'border-2 border-dashed border-blue-400 rounded px-1' : ''
                  }`}>
                    {isEditMode && (
                      <Move className="w-3 h-3 text-blue-500" />
                    )}
                    
                    <div
                      className={`font-medium px-2 py-1 whitespace-nowrap ${
                        label.side === "left" ? "text-left" : "text-right"
                      } ${
                        selectedMuscle === label.muscle
                          ? "font-bold text-[#ff8c42]"
                          : "text-gray-800 group-hover:font-semibold group-hover:text-[#ff8c42]"
                      } transition-all duration-200`}
                      style={{ fontSize: `${labelFontSize}px` }}
                      title={isEditMode ? `${position.top} / ${position.left || position.right}` : undefined}
                    >
                      {label.name}
                    </div>

                    <div className="relative flex items-center">
                      <div
                        className={`h-px ${
                          selectedMuscle === label.muscle ? "bg-[#ff8c42]" : "bg-gray-600 group-hover:bg-[#ff8c42]"
                        } transition-colors duration-200`}
                        style={{ width: "32px" }}
                      />
                      <div
                        className={`w-2 h-2 rounded-full ${
                          selectedMuscle === label.muscle ? "bg-[#ff8c42]" : "bg-gray-600 group-hover:bg-[#ff8c42]"
                        } transition-colors duration-200`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rotate Button */}
      <Button
        onClick={handleRotate}
        className="fixed bottom-6 right-6 bg-[#ff8c42] hover:bg-[#ff7a29] text-white shadow-lg rounded-full px-6 py-6 flex items-center gap-2 transition-all duration-300 ease-in-out z-50"
      >
        <RefreshCw className="w-5 h-5" />
        <span className="font-semibold">Rotacionar</span>
      </Button>

      {/* Exercise Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold text-gray-900">
                Exercícios - {selectedMuscle && labels.find(l => l.muscle === selectedMuscle)?.name}
              </DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-500 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
          </DialogHeader>
          {selectedMuscle && <ExerciseList muscle={selectedMuscle} searchQuery="" />}
        </DialogContent>
      </Dialog>

      {/* Coordinates Modal */}
      <Dialog open={showCoordinates} onOpenChange={setShowCoordinates}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gray-900">
              Coordenadas Atualizadas
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p className="text-sm text-gray-600">
              As coordenadas foram copiadas para a área de transferência. Você pode colá-las no código ou me enviar.
            </p>
            <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
              <pre className="text-xs text-green-400 font-mono whitespace-pre">
{`const frontLabels: MuscleLabel[] = [
${frontLabels.map(label => {
  const pos = customPositions.front[label.muscle] || { 
    top: label.top, 
    left: label.left, 
    right: label.right 
  };
  return `  { name: "${label.name}", muscle: "${label.muscle}", side: "${label.side}", ${
    label.side === "left" ? `left: "${pos.left}"` : `right: "${pos.right}"`
  }, top: "${pos.top}" }`;
}).join(',\n')}
];

const backLabels: MuscleLabel[] = [
${backLabels.map(label => {
  const pos = customPositions.back[label.muscle] || { 
    top: label.top, 
    left: label.left, 
    right: label.right 
  };
  return `  { name: "${label.name}", muscle: "${label.muscle}", side: "${label.side}", ${
    label.side === "left" ? `left: "${pos.left}"` : `right: "${pos.right}"`
  }, top: "${pos.top}" }`;
}).join(',\n')}
];`}
              </pre>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => {
                const generateLabelsCode = (
                  baseLabels: MuscleLabel[], 
                  customPos: Partial<Record<MuscleGroup, CustomPosition>>
                ) => {
                  return baseLabels.map(label => {
                    const pos = customPos[label.muscle] || { 
                      top: label.top, 
                      left: label.left, 
                      right: label.right 
                    };
                    return `  { name: "${label.name}", muscle: "${label.muscle}", side: "${label.side}", ${
                      label.side === "left" ? `left: "${pos.left}"` : `right: "${pos.right}"`
                    }, top: "${pos.top}" }`;
                  }).join(',\n');
                };

                const frontCode = `const frontLabels: MuscleLabel[] = [\n${generateLabelsCode(frontLabels, customPositions.front)}\n];`;
                const backCode = `const backLabels: MuscleLabel[] = [\n${generateLabelsCode(backLabels, customPositions.back)}\n];`;
                
                const fullCode = `${frontCode}\n\n${backCode}`;
                
                navigator.clipboard.writeText(fullCode);
                toast({
                  title: "Copiado novamente!",
                  description: "As coordenadas foram copiadas para a área de transferência.",
                });
              }}>
                <Copy className="w-4 h-4 mr-2" />
                Copiar Novamente
              </Button>
              <Button variant="outline" onClick={() => setShowCoordinates(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
