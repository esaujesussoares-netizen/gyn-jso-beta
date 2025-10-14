import { useState, useRef, useEffect } from 'react';
import { 
  X, Edit2, Save, RotateCw, 
  ZoomIn, ZoomOut, Palette,
  Menu, Smartphone, Monitor, Dumbbell
} from 'lucide-react';
import bodyFrontImg from '@/assets/body-front.png';
import bodyBackImg from '@/assets/body-back.png';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface MuscleLabel {
  id: number;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
}

export function WorkoutMuscleSelector() {
  const [editorMode, setEditorMode] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
  const [currentView, setCurrentView] = useState<'front' | 'back'>('front');
  const [zoom, setZoom] = useState(1);
  const [editingLabel, setEditingLabel] = useState<number | null>(null);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  // **NOVO: Estado para modal de exercícios**
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedMuscleForExercises, setSelectedMuscleForExercises] = useState<MuscleLabel | null>(null);
  
  const [muscleLabels, setMuscleLabels] = useState<{
    front: MuscleLabel[];
    back: MuscleLabel[];
  }>({
    front: [
      { id: 1, name: "Ombros", x: 45, y: 15, width: 60, height: 24, rotation: 0, color: "hsl(var(--primary))" },
      { id: 2, name: "Peitoral", x: 40, y: 25, width: 70, height: 22, rotation: 0, color: "hsl(var(--primary))" },
      { id: 3, name: "Bíceps", x: 20, y: 35, width: 55, height: 22, rotation: 0, color: "hsl(var(--primary))" },
      { id: 4, name: "Abdômen", x: 45, y: 45, width: 65, height: 22, rotation: 0, color: "hsl(var(--primary))" },
      { id: 5, name: "Oblíquos", x: 35, y: 50, width: 70, height: 22, rotation: -5, color: "hsl(var(--primary))" },
      { id: 6, name: "Quadríceps", x: 45, y: 65, width: 75, height: 22, rotation: 0, color: "hsl(var(--primary))" },
      { id: 7, name: "Panturrilhas", x: 45, y: 85, width: 75, height: 22, rotation: 0, color: "hsl(var(--primary))" }
    ],
    back: [
      { id: 8, name: "Trapézio", x: 45, y: 10, width: 65, height: 22, rotation: 0, color: "hsl(var(--accent))" },
      { id: 9, name: "Dorsais", x: 45, y: 25, width: 65, height: 22, rotation: 0, color: "hsl(var(--accent))" },
      { id: 10, name: "Tríceps", x: 70, y: 35, width: 55, height: 22, rotation: 0, color: "hsl(var(--accent))" },
      { id: 11, name: "Lombares", x: 45, y: 40, width: 70, height: 22, rotation: 0, color: "hsl(var(--accent))" },
      { id: 12, name: "Glúteos", x: 45, y: 55, width: 65, height: 22, rotation: 0, color: "hsl(var(--accent))" },
      { id: 13, name: "Isquiotibiais", x: 45, y: 70, width: 80, height: 22, rotation: 0, color: "hsl(var(--accent))" },
      { id: 14, name: "Cardio", x: 80, y: 90, width: 50, height: 22, rotation: 0, color: "hsl(var(--accent))" }
    ]
  });

  const [draggingLabel, setDraggingLabel] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Detectar tamanho da tela
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentLabels = muscleLabels[currentView];

  // Tamanhos responsivos
  const getContainerSize = () => {
    if (isMobileView) {
      return { width: 280, height: 420 };
    }
    return { width: 400, height: 600 };
  };

  // **MODIFICADO: Exibe modal de exercícios ao clicar no músculo**
  const toggleMuscleSelection = (muscleId: number) => {
    if (editorMode) return;
    
    setSelectedAreas(prev => 
      prev.includes(muscleId) 
        ? prev.filter(id => id !== muscleId)
        : [...prev, muscleId]
    );
    
    // Exibir modal de exercícios
    const allLabels = [...muscleLabels.front, ...muscleLabels.back];
    const muscle = allLabels.find(m => m.id === muscleId);
    if (muscle) {
      setSelectedMuscleForExercises(muscle);
      setShowExerciseModal(true);
    }
  };
  
  // **NOVO: Dados de exercícios por grupo muscular**
  const exercisesByMuscle: Record<string, string[]> = {
    "Ombros": ["Desenvolvimento com Halteres", "Elevação Lateral", "Desenvolvimento Arnold", "Remada Alta"],
    "Peitoral": ["Supino Reto", "Supino Inclinado", "Crucifixo", "Flexão de Braços"],
    "Bíceps": ["Rosca Direta", "Rosca Martelo", "Rosca Concentrada", "Rosca Scott"],
    "Abdômen": ["Abdominal Supra", "Prancha", "Abdominal Canivete", "Elevação de Pernas"],
    "Oblíquos": ["Abdominal Oblíquo", "Prancha Lateral", "Russian Twist", "Mountain Climbers"],
    "Quadríceps": ["Agachamento", "Leg Press", "Cadeira Extensora", "Afundo"],
    "Panturrilhas": ["Panturrilha em Pé", "Panturrilha Sentado", "Panturrilha no Leg Press"],
    "Trapézio": ["Encolhimento com Halteres", "Remada Alta", "Face Pull"],
    "Dorsais": ["Puxada Frontal", "Remada Curvada", "Barra Fixa", "Remada Unilateral"],
    "Tríceps": ["Tríceps Pulley", "Tríceps Testa", "Mergulho", "Tríceps Coice"],
    "Lombares": ["Levantamento Terra", "Hiperextensão", "Good Morning"],
    "Glúteos": ["Agachamento", "Hip Thrust", "Stiff", "Cadeira Abdutora"],
    "Isquiotibiais": ["Stiff", "Mesa Flexora", "Levantamento Terra", "Afundo Reverso"],
    "Cardio": ["Corrida", "Bicicleta", "Elíptico", "Pular Corda", "HIIT"]
  };

  const startDrag = (e: React.MouseEvent | React.TouchEvent, label: MuscleLabel) => {
    if (!editorMode) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const scale = isMobileView ? 0.7 : 1;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = (clientX - rect.left) / (zoom * scale);
    const y = (clientY - rect.top) / (zoom * scale);
    
    setDraggingLabel(label.id);
    setDragOffset({
      x: x - label.x,
      y: y - label.y
    });
    
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrag = (e: React.MouseEvent | React.TouchEvent) => {
    if (!draggingLabel || !editorMode) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const scale = isMobileView ? 0.7 : 1;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    const x = ((clientX - rect.left) / (zoom * scale)) - dragOffset.x;
    const y = ((clientY - rect.top) / (zoom * scale)) - dragOffset.y;
    
    setMuscleLabels(prev => ({
      ...prev,
      [currentView]: prev[currentView].map(label => 
        label.id === draggingLabel 
          ? { 
              ...label, 
              x: Math.max(0, Math.min(95, x)), 
              y: Math.max(0, Math.min(95, y)) 
            }
          : label
      )
    }));
  };

  const endDrag = () => {
    setDraggingLabel(null);
  };

  const rotateLabel = (labelId: number) => {
    setMuscleLabels(prev => ({
      ...prev,
      [currentView]: prev[currentView].map(label =>
        label.id === labelId
          ? { ...label, rotation: (label.rotation + 15) % 360 }
          : label
      )
    }));
  };

  const resizeLabel = (labelId: number, sizeChange: number) => {
    setMuscleLabels(prev => ({
      ...prev,
      [currentView]: prev[currentView].map(label =>
        label.id === labelId
          ? { 
              ...label, 
              width: Math.max(30, label.width + sizeChange),
              height: Math.max(18, label.height + (sizeChange * 0.4))
            }
          : label
      )
    }));
  };

  const changeLabelColor = (labelId: number, color: string) => {
    setMuscleLabels(prev => ({
      ...prev,
      [currentView]: prev[currentView].map(label =>
        label.id === labelId
          ? { ...label, color }
          : label
      )
    }));
  };

  const savePositions = () => {
    localStorage.setItem('muscleLabelsConfig', JSON.stringify(muscleLabels));
    setEditorMode(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem('muscleLabelsConfig');
    if (saved) {
      setMuscleLabels(JSON.parse(saved));
    }
  }, []);

  const currentImage = currentView === 'front' ? bodyFrontImg : bodyBackImg;
  const containerSize = getContainerSize();

  return (
    <div className="bg-gradient-to-br from-background to-muted rounded-xl p-2 sm:p-4 lg:p-6">
      {/* Header - Responsivo */}
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Menu Mobile */}
          {isMobileView && (
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 hover:bg-muted/80 rounded-lg transition-colors"
            >
              <Menu size={20} />
            </button>
          )}
          
          <h2 className="text-lg sm:text-2xl font-bold text-foreground truncate">
            {isMobileView ? 'Grupos Musculares' : 'Selecionar Grupos Musculares'}
          </h2>
        </div>
        
        <div className="flex gap-1 sm:gap-2">
          {/* Toggle Mobile/Desktop View */}
          <button 
            onClick={() => setIsMobileView(!isMobileView)}
            className="p-2 hover:bg-muted/80 rounded-lg transition-colors hidden sm:flex"
            title={isMobileView ? "Modo Desktop" : "Modo Mobile"}
          >
            {isMobileView ? <Monitor size={18} /> : <Smartphone size={18} />}
          </button>

          {/* Controles de Zoom */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button 
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
              className="p-1 sm:p-2 hover:bg-muted/80 rounded transition-colors"
            >
              <ZoomOut size={16} />
            </button>
            <span className="text-xs sm:text-sm px-1 sm:px-2">{(zoom * 100).toFixed(0)}%</span>
            <button 
              onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
              className="p-1 sm:p-2 hover:bg-muted/80 rounded transition-colors"
            >
              <ZoomIn size={16} />
            </button>
          </div>

          {editorMode && (
            <button 
              onClick={savePositions}
              className="flex items-center gap-1 sm:gap-2 bg-primary text-primary-foreground px-2 sm:px-4 py-1 sm:py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              <Save size={16} />
              <span className="hidden sm:inline">Salvar</span>
            </button>
          )}
          <button 
            onClick={() => setEditorMode(!editorMode)}
            className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1 sm:py-2 rounded-lg transition-colors text-sm ${
              editorMode 
                ? 'bg-primary text-primary-foreground hover:bg-primary/90' 
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            <Edit2 size={16} />
            <span className="hidden sm:inline">
              {editorMode ? 'Sair Editor' : 'Editor'}
            </span>
          </button>
        </div>
      </div>

      {/* Menu Mobile Expandível */}
      {isMobileView && showMobileMenu && (
        <div className="bg-muted/50 border border-border rounded-lg p-3 mb-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <button className="p-2 bg-background rounded-lg border border-border text-center hover:bg-muted/50 transition-colors">
              Dashboard
            </button>
            <button className="p-2 bg-background rounded-lg border border-border text-center hover:bg-muted/50 transition-colors">
              Treinos
            </button>
            <button className="p-2 bg-background rounded-lg border border-border text-center hover:bg-muted/50 transition-colors">
              Nutrição
            </button>
            <button className="p-2 bg-background rounded-lg border border-border text-center hover:bg-muted/50 transition-colors">
              Progresso
            </button>
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
        {/* Imagem Anatômica com Labels - Responsivo */}
        <div className="relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-foreground">
              {editorMode ? 'Editor' : 'Selecione as Áreas'}
            </h3>
            
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => setCurrentView(currentView === 'front' ? 'back' : 'front')}
                className="flex-1 sm:flex-none flex items-center justify-center gap-1 sm:gap-2 bg-accent text-accent-foreground px-3 sm:px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors shadow-md text-sm sm:text-base"
              >
                <RotateCw size={16} />
                <span>Rotacionar</span>
              </button>
            </div>
          </div>
          
          <div className="flex justify-center items-center bg-muted/50 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-dashed border-border">
            <div 
              ref={containerRef}
              className="relative bg-background rounded-lg shadow-lg overflow-hidden"
              style={{ 
                width: `${containerSize.width}px`,
                height: `${containerSize.height}px`,
                transform: `scale(${zoom})`,
                transition: 'all 0.3s ease-in-out'
              }}
              onMouseMove={handleDrag}
              onMouseUp={endDrag}
              onMouseLeave={endDrag}
              onTouchMove={handleDrag as any}
              onTouchEnd={endDrag}
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
                  <div className="absolute -top-8 -right-2 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        rotateLabel(label.id);
                      }}
                      className="bg-secondary text-secondary-foreground p-1 rounded hover:bg-secondary/90"
                      title="Rotacionar"
                    >
                      <RotateCw size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingLabel(label.id);
                      }}
                      className="bg-secondary text-secondary-foreground p-1 rounded hover:bg-secondary/90"
                      title="Alterar Cor"
                    >
                      <Palette size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resizeLabel(label.id, 8);
                      }}
                      className="bg-secondary text-secondary-foreground p-1 rounded hover:bg-secondary/90"
                      title="Aumentar Tamanho"
                    >
                      <ZoomIn size={isMobileView ? 10 : 12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resizeLabel(label.id, -8);
                      }}
                      className="bg-secondary text-secondary-foreground p-1 rounded hover:bg-secondary/90"
                      title="Diminuir Tamanho"
                    >
                      <ZoomOut size={isMobileView ? 10 : 12} />
                    </button>
                  </div>
                )}
              </div>
            ))}
            </div>
          </div>

          {editorMode && (
            <p className="text-sm text-muted-foreground mt-3 text-center">
              💡 <strong>Editor Ativo:</strong> Arraste para mover • Clique nos ícones para editar
            </p>
          )}
        </div>

        {/* Painel de Seleção */}
        <div className="space-y-6">
          <div className="bg-muted/50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-foreground mb-3">Áreas Selecionadas</h3>
            
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedAreas.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">Nenhuma área selecionada</p>
              ) : (
                selectedAreas.map(muscleId => {
                  const allLabels = [...muscleLabels.front, ...muscleLabels.back];
                  const muscle = allLabels.find(m => m.id === muscleId);
                  return (
                    <div key={muscleId} className="flex items-center justify-between bg-background p-3 rounded-lg border border-border">
                      <span className="font-medium text-foreground">{muscle?.name}</span>
                      <button 
                        onClick={() => toggleMuscleSelection(muscleId)}
                        className="text-destructive hover:text-destructive/80 transition-colors text-sm"
                      >
                        Remover
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Seletor de Cores */}
          {editorMode && editingLabel && (
            <div className="bg-muted/50 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-foreground mb-3">Alterar Cor</h3>
              <div className="grid grid-cols-4 gap-2">
                {[
                  'hsl(var(--primary))',
                  'hsl(var(--accent))',
                  'hsl(var(--destructive))',
                  'hsl(var(--chart-1))',
                  'hsl(var(--chart-2))',
                  'hsl(var(--chart-3))',
                  'hsl(var(--chart-4))',
                  'hsl(var(--chart-5))'
                ].map((color, index) => (
                  <button
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-border shadow-md hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => {
                      changeLabelColor(editingLabel, color);
                      setEditingLabel(null);
                    }}
                  />
                ))}
              </div>
              <button 
                onClick={() => setEditingLabel(null)}
                className="w-full mt-3 bg-muted text-muted-foreground py-2 rounded-lg hover:bg-muted/80 transition-colors"
              >
                Cancelar
              </button>
            </div>
          )}

          <div className="space-y-3">
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

      {/* **NOVO: Modal de Exercícios** */}
      <Dialog open={showExerciseModal} onOpenChange={setShowExerciseModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-primary" />
              Exercícios - {selectedMuscleForExercises?.name}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-3 mt-4">
            {selectedMuscleForExercises && exercisesByMuscle[selectedMuscleForExercises.name] ? (
              exercisesByMuscle[selectedMuscleForExercises.name].map((exercise, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg border border-border hover:bg-muted transition-colors"
                >
                  <div className="flex-shrink-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-semibold text-sm">
                    {index + 1}
                  </div>
                  <span className="text-foreground font-medium">{exercise}</span>
                </div>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                Nenhum exercício disponível para este grupo muscular.
              </p>
            )}
          </div>
          
          <div className="mt-6 flex gap-2">
            <button
              onClick={() => setShowExerciseModal(false)}
              className="flex-1 bg-muted text-muted-foreground py-2 rounded-lg hover:bg-muted/80 transition-colors font-medium"
            >
              Fechar
            </button>
            <button
              className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Adicionar ao Treino
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
