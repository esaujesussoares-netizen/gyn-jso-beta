import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface OnboardingDialogProps {
  open: boolean;
  onComplete: () => void;
}

export function OnboardingDialog({ open, onComplete }: OnboardingDialogProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    height: "",
    weight: "",
    goalWeight: "",
    activityLevel: "",
    fitnessGoal: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.age || !formData.height || !formData.weight) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast.error("Usuário não autenticado");
        return;
      }

      const userData = {
        name: formData.name,
        email: user.email,
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseFloat(formData.weight),
        goalWeight: formData.goalWeight ? parseFloat(formData.goalWeight) : null,
        activityLevel: formData.activityLevel || null,
        fitness_goal: formData.fitnessGoal || null,
        hasCompletedOnboarding: true
      };

      // Salvar no metadata do usuário
      const { error } = await supabase.auth.updateUser({
        data: userData
      });

      if (error) {
        toast.error("Erro ao salvar dados");
        console.error(error);
        return;
      }

      // Salvar também no localStorage para acesso rápido
      localStorage.setItem('userData', JSON.stringify(userData));

      toast.success("Perfil configurado com sucesso!");
      onComplete();
    } catch (error) {
      toast.error("Erro ao processar dados");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-2xl border-border/20 glass-card max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            Complete seu Perfil
          </DialogTitle>
          <DialogDescription className="text-center">
            Precisamos de algumas informações para personalizar sua experiência
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nome - Obrigatório */}
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Nome completo *</Label>
              <Input
                id="name"
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                disabled={loading}
                required
              />
            </div>

            {/* Idade - Obrigatório */}
            <div className="space-y-2">
              <Label htmlFor="age">Idade *</Label>
              <Input
                id="age"
                type="number"
                placeholder="Ex: 25"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                disabled={loading}
                required
                min="13"
                max="120"
              />
            </div>

            {/* Altura - Obrigatório */}
            <div className="space-y-2">
              <Label htmlFor="height">Altura (cm) *</Label>
              <Input
                id="height"
                type="number"
                placeholder="Ex: 175"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                disabled={loading}
                required
                min="100"
                max="250"
              />
            </div>

            {/* Peso Atual - Obrigatório */}
            <div className="space-y-2">
              <Label htmlFor="weight">Peso atual (kg) *</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                placeholder="Ex: 70.5"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                disabled={loading}
                required
                min="30"
                max="300"
              />
            </div>

            {/* Peso Objetivo - Opcional */}
            <div className="space-y-2">
              <Label htmlFor="goalWeight">Peso objetivo (kg)</Label>
              <Input
                id="goalWeight"
                type="number"
                step="0.1"
                placeholder="Ex: 68.0"
                value={formData.goalWeight}
                onChange={(e) => setFormData({ ...formData, goalWeight: e.target.value })}
                disabled={loading}
                min="30"
                max="300"
              />
            </div>

            {/* Nível de Atividade - Opcional */}
            <div className="space-y-2">
              <Label htmlFor="activityLevel">Nível de atividade</Label>
              <Select 
                value={formData.activityLevel}
                onValueChange={(value) => setFormData({ ...formData, activityLevel: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentário</SelectItem>
                  <SelectItem value="light">Leve (1-3x/semana)</SelectItem>
                  <SelectItem value="moderate">Moderado (3-5x/semana)</SelectItem>
                  <SelectItem value="active">Ativo (6-7x/semana)</SelectItem>
                  <SelectItem value="very-active">Muito Ativo (2x/dia)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Objetivo - Opcional */}
            <div className="space-y-2">
              <Label htmlFor="fitnessGoal">Objetivo principal</Label>
              <Select 
                value={formData.fitnessGoal}
                onValueChange={(value) => setFormData({ ...formData, fitnessGoal: value })}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weight_loss">Perda de Peso</SelectItem>
                  <SelectItem value="muscle_gain">Ganho de Massa Muscular</SelectItem>
                  <SelectItem value="maintenance">Manutenção</SelectItem>
                  <SelectItem value="endurance">Resistência</SelectItem>
                  <SelectItem value="flexibility">Flexibilidade</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full gradient-hero hover:opacity-90 transition-smooth"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              "Concluir Cadastro"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            * Campos obrigatórios
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
}
