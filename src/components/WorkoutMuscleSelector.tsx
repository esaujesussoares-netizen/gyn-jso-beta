import { useState, useRef, useEffect } from 'react';
import { 
  X, Edit2, Save, RotateCw, 
  ZoomIn, ZoomOut, Palette 
} from 'lucide-react';
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
  color: string;
}

export function WorkoutMuscleSelector() {
  const [editorMode, setEditorMode] = useState(false);
  const [selectedAreas, setSelectedAreas] = useState<number[]>([]);
  const [currentView, setCurrentView] = useState<'front' | 'back'>('front');
  const [zoom, setZoom] = useState(1);
  const [editingLabel, setEditingLabel] = useState<number | null>(null);
  
  const [muscleLabels, setMuscleLabels] = useState<{
    front: MuscleLabel[];
    back: MuscleLabel[];
  }>({
    front: [
      { id: 1, name: "Ombros", x: 45, y: 15, width: 80, height: 30, rotation: 0, color: "hsl(var(--primary))" },
      { id: 2, name: "Peitoral", x: 40, y: 25, width: 100, height: 25, rotation: 0, color: "hsl(var(--primary))" },
      { id: 3, name: "Bíceps", x: 20, y: 35, width: 70, height: 25, rotation: 0, color: "hsl(var(--primary))" },
      { id: 4, name: "Abdômen", x: 45, y: 45, width: 80, height: 25, rotation: 0, color: "hsl(var(--primary))" },
      { id: 5, name: "Oblíquos", x: 35, y: 50, width: 90, height: 25, rotation: -5, color: "hsl(var(--primary))" },
      { id: 6, name: "Quadríceps", x: 45, y: 65, width: 90, height: 25, rotation: 0, color: "hsl(var(--primary))" },
      { id: 7, name: "Panturrilhas", x: 45, y: 85, width: 90, height: 25, rotation: 0, color: "hsl(var(--primary))" }
    ],
    back: [
      { id: 8, name: "Trapézio", x: 45, y: 10, width: 80, height: 25, rotation: 0, color: "hsl(var(--accent))" },
      { id: 9, name: "Dorsais", x: 45, y: 25, width: 80, height: 25, rotation: 0, color: "hsl(var(--accent))" },
      { id: 10, name: "Tríceps", x: 70, y: 35, width: 70, height: 25, rotation: 0, color: "hsl(var(--accent))" },
      { id: 11, name: "Lombares", x: 45, y: 40, width: 90, height: 25, rotation: 0, color: "hsl(var(--accent))" },
      { id: 12, name: "Glúteos", x: 45, y: 55, width: 80, height: 25, rotation: 0, color: "hsl(var(--accent))" },
      { id: 13, name: "Isquiotibiais", x: 45, y: 70, width: 100, height: 25, rotation: 0, color: "hsl(var(--accent))" },
      { id: 14, name: "Cardio", x: 80, y: 90, width: 60, height: 25, rotation: 0, color: "hsl(var(--accent))" }
    ]
  });

  const [draggingLabel, setDraggingLabel] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const currentLabels = muscleLabels[currentView];

  const toggleMuscleSelection = (muscleId: number) => {
    if (editorMode) return;
    
    setSelectedAreas(prev => 
      prev.includes(muscleId) 
        ? prev.filter(id => id !== muscleId)
        : [...prev, muscleId]
    );
  };

  const startDrag = (e: React.MouseEvent, label: MuscleLabel) => {
    if (!editorMode) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    setDraggingLabel(label.id);
    setDragOffset({
      x: x - label.x,
      y: y - label.y
    });
    
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrag = (e: React.MouseEvent) => {
    if (!draggingLabel || !editorMode) return;
    
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = ((e.clientX - rect.left) / zoom) - dragOffset.x;
    const y = ((e.clientY - rect.top) / zoom) - dragOffset.y;
    
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

  const resizeLabel = (labelId: number, widthChange: number, heightChange: number) => {
    setMuscleLabels(prev => ({
      ...prev,
      [currentView]: prev[currentView].map(label =>
        label.id === labelId
          ? { 
              ...label, 
              width: Math.max(40, label.width + widthChange),
              height: Math.max(20, label.height + heightChange)
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

  return (
    <div className="bg-gradient-to-br from-background to-muted rounded-xl p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-foreground">Selecionar Grupos Musculares</h2>
        <div className="flex gap-2">
          {/* Controles de Zoom */}
          <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
            <button 
              onClick={() => setZoom(prev => Math.max(0.5, prev - 0.1))}
              className="p-2 hover:bg-muted/80 rounded transition-colors"
            >
              <ZoomOut size={18} />
            </button>
            <span className="text-sm px-2">{(zoom * 100).toFixed(0)}%</span>
            <button 
              onClick={() => setZoom(prev => Math.min(2, prev + 0.1))}
              className="p-2 hover:bg-muted/80 rounded transition-colors"
            >
              <ZoomIn size={18} />
            </button>
          </div>

          {editorMode && (
            <button 
              onClick={savePositions}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Save size={18} />
              Salvar
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
            {editorMode ? 'Sair Editor' : 'Modo Editor'}
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
              className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:bg-accent/90 transition-colors shadow-md"
            >
              <RotateCw size={18} />
              Rotacionar
            </button>
          </div>
          
          <div className="flex justify-center items-center bg-muted/50 rounded-xl p-4 border-2 border-dashed border-border">
            <div 
              ref={containerRef}
              className="relative bg-background rounded-lg shadow-lg overflow-hidden"
              style={{ 
                width: '400px', 
                height: '600px',
                transform: `scale(${zoom})`,
                transition: 'all 0.3s ease-in-out'
              }}
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
                        resizeLabel(label.id, 10, 5);
                      }}
                      className="bg-secondary text-secondary-foreground p-1 rounded hover:bg-secondary/90"
                      title="Aumentar Tamanho"
                    >
                      <ZoomIn size={12} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        resizeLabel(label.id, -10, -5);
                      }}
                      className="bg-secondary text-secondary-foreground p-1 rounded hover:bg-secondary/90"
                      title="Diminuir Tamanho"
                    >
                      <ZoomOut size={12} />
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
    </div>
  );
}
