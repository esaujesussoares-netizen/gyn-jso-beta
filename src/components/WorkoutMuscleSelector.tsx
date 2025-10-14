import { useState, useRef, useEffect } from 'react';
import { X, Edit2, Save, RotateCw } from 'lucide-react';
import bodyFrontImg from '@/assets/body-front.png';
import bodyBackImg from '@/assets/body-back.png';

interface MuscleLabel {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  view: 'front' | 'back';
}

export function WorkoutMuscleSelector() {
  const [editorMode, setEditorMode] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
  const [currentView, setCurrentView] = useState<'front' | 'back'>('front');
  const [muscleLabels, setMuscleLabels] = useState<MuscleLabel[]>([
    // Vista Frontal
    { id: 1, name: "Ombros", x: 45, y: 15, width: 80, height: 30, rotation: 0, view: 'front' },
    { id: 2, name: "Peitoral", x: 40, y: 25, width: 100, height: 25, rotation: 0, view: 'front' },
    { id: 3, name: "Bíceps", x: 20, y: 35, width: 70, height: 25, rotation: 0, view: 'front' },
    { id: 4, name: "Abdômen", x: 45, y: 45, width: 80, height: 25, rotation: 0, view: 'front' },
    { id: 5, name: "Oblíquos", x: 35, y: 50, width: 90, height: 25, rotation: -5, view: 'front' },
    { id: 6, name: "Quadríceps", x: 45, y: 65, width: 90, height: 25, rotation: 0, view: 'front' },
    { id: 7, name: "Panturrilhas", x: 45, y: 85, width: 90, height: 25, rotation: 0, view: 'front' },
    // Vista Traseira
    { id: 8, name: "Trapézio", x: 45, y: 10, width: 80, height: 25, rotation: 0, view: 'back' },
    { id: 9, name: "Dorsais", x: 45, y: 30, width: 80, height: 25, rotation: 0, view: 'back' },
    { id: 10, name: "Tríceps", x: 70, y: 35, width: 70, height: 25, rotation: 0, view: 'back' },
    { id: 11, name: "Lombares", x: 45, y: 40, width: 90, height: 25, rotation: 0, view: 'back' },
    { id: 12, name: "Glúteos", x: 45, y: 55, width: 80, height: 25, rotation: 0, view: 'back' },
    { id: 13, name: "Isquiotibiais", x: 45, y: 75, width: 100, height: 25, rotation: 0, view: 'back' },
    { id: 14, name: "Cardio", x: 80, y: 90, width: 60, height: 25, rotation: 0, view: 'back' }
  ]);

  const [draggingLabel, setDraggingLabel] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Função para selecionar/deselecionar área muscular
  const toggleMuscleSelection = (muscleId: number) => {
    if (editorMode) return;
    
    setSelectedAreas(prev => 
      prev.includes(muscleId) 
        ? prev.filter(id => id !== muscleId)
        : [...prev, muscleId]
    );
  };

  // Função para iniciar arrasto no modo editor
  const startDrag = (e: React.MouseEvent, label: MuscleLabel) => {
    if (!editorMode) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setDraggingLabel(label.id);
    setDragOffset({
      x: x - label.x,
      y: y - label.y
    });
    
    e.preventDefault();
    e.stopPropagation();
  };

  // Função durante arrasto
  const handleDrag = (e: React.MouseEvent) => {
    if (!draggingLabel || !editorMode) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;
    
    setMuscleLabels(prev => 
      prev.map(label => 
        label.id === draggingLabel 
          ? { ...label, x: Math.max(0, Math.min(95, x)), y: Math.max(0, Math.min(95, y)) }
          : label
      )
    );
  };

  // Função para finalizar arrasto
  const endDrag = () => {
    setDraggingLabel(null);
  };

  // Rotacionar label
  const rotateLabel = (muscleId: number) => {
    setMuscleLabels(prev =>
      prev.map(label =>
        label.id === muscleId
          ? { ...label, rotation: (label.rotation + 15) % 360 }
          : label
      )
    );
  };

  // Salvar posições
  const savePositions = () => {
    localStorage.setItem('muscleLabelsPositions', JSON.stringify(muscleLabels));
    setEditorMode(false);
  };

  // Carregar posições salvas
  useEffect(() => {
    const saved = localStorage.getItem('muscleLabelsPositions');
    if (saved) {
      setMuscleLabels(JSON.parse(saved));
    }
  }, []);

  const currentLabels = muscleLabels.filter(label => label.view === currentView);
  const currentImage = currentView === 'front' ? bodyFrontImg : bodyBackImg;

  return (
    <div className="bg-gradient-to-br from-background to-muted rounded-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Selecionar Grupos Musculares</h2>
        <div className="flex gap-2">
          {editorMode && (
            <button 
              onClick={savePositions}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Save size={18} />
              Salvar Posições
            </button>
          )}
          <button 
            onClick={() => setEditorMode(!editorMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              editorMode 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Edit2 size={18} />
            {editorMode ? 'Sair do Editor' : 'Modo Editor'}
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Imagem Anatômica com Labels */}
        <div className="relative">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">
              {editorMode ? 'Editor de Posições' : 'Selecione as Áreas'}
            </h3>
            <button
              onClick={() => setCurrentView(currentView === 'front' ? 'back' : 'front')}
              className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors"
            >
              <RotateCw size={18} />
              {currentView === 'front' ? 'Ver Costas' : 'Ver Frente'}
            </button>
          </div>
          
          <div 
            ref={containerRef}
            className="relative bg-muted rounded-lg aspect-[3/4] max-h-[600px] border-2 border-border overflow-hidden"
            onMouseMove={handleDrag}
            onMouseUp={endDrag}
            onMouseLeave={endDrag}
          >
            {/* Imagem do corpo humano */}
            <img 
              src={currentImage} 
              alt={`Vista ${currentView === 'front' ? 'frontal' : 'traseira'}`}
              className="absolute inset-0 w-full h-full object-contain"
            />

            {/* Labels dos músculos */}
            {currentLabels.map((label) => (
              <div
                key={label.id}
                className={`absolute cursor-${editorMode ? 'move' : 'pointer'} transition-all ${
                  selectedAreas.includes(label.id) 
                    ? 'bg-primary text-primary-foreground shadow-lg' 
                    : 'bg-background/90 text-foreground border-2 border-primary/30 hover:border-primary'
                } ${editorMode ? 'z-10' : ''} ${
                  draggingLabel === label.id ? 'opacity-80 scale-105' : ''
                } rounded-md`}
                style={{
                  left: `${label.x}%`,
                  top: `${label.y}%`,
                  transform: `rotate(${label.rotation}deg)`,
                  width: `${label.width}px`,
                  height: `${label.height}px`,
                }}
                onClick={() => toggleMuscleSelection(label.id)}
                onMouseDown={(e) => startDrag(e, label)}
              >
                <div className="flex items-center justify-center h-full text-center text-sm font-medium p-1">
                  {label.name}
                </div>
                
                {/* Controles do editor */}
                {editorMode && (
                  <div className="absolute -top-6 -right-2 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        rotateLabel(label.id);
                      }}
                      className="bg-secondary text-secondary-foreground p-1 rounded hover:bg-secondary/90"
                    >
                      <RotateCw size={12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {editorMode && (
            <p className="text-sm text-muted-foreground mt-2">
              💡 Arraste para mover, clique no ícone para rotacionar
            </p>
          )}
        </div>

        {/* Painel de Seleção */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">Áreas Selecionadas</h3>
          
          <div className="space-y-3 mb-6 max-h-[400px] overflow-y-auto">
            {selectedAreas.length === 0 ? (
              <p className="text-muted-foreground">Nenhuma área selecionada</p>
            ) : (
              selectedAreas.map(muscleId => {
                const muscle = muscleLabels.find(m => m.id === muscleId);
                return (
                  <div key={muscleId} className="flex items-center justify-between bg-accent/50 p-3 rounded-lg">
                    <span className="font-medium text-foreground">{muscle?.name}</span>
                    <button 
                      onClick={() => toggleMuscleSelection(muscleId)}
                      className="text-destructive hover:text-destructive/80 transition-colors"
                    >
                      <X size={18} />
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setSelectedAreas([])}
              disabled={selectedAreas.length === 0}
              className="w-full bg-muted text-muted-foreground py-2 rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Limpar Seleção
            </button>
            
            <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-muted-foreground mb-2">Músculos selecionados:</p>
              <p className="text-2xl font-bold text-primary">{selectedAreas.length}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
