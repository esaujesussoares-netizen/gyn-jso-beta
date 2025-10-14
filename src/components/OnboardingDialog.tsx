import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

interface OnboardingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OnboardingDialog({ open, onOpenChange }: OnboardingDialogProps) {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [sexo, setSexo] = useState("");
  const [birthDate, setBirthDate] = useState<Date>();
  const [peso, setPeso] = useState("");
  const [altura, setAltura] = useState("");
  const [metaPeso, setMetaPeso] = useState("");

  const handleNext = () => {
    if (step === 1) {
      if (!email || !password || !name) {
        toast.error("Preencha todos os campos");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!sexo || !birthDate || !peso || !altura || !metaPeso) {
        toast.error("Preencha todos os campos");
        return;
      }
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`,
          data: {
            name,
            sexo,
            birthDate: birthDate?.toISOString(),
            peso,
            altura,
            metaPeso,
          },
        },
      });

      if (error) {
        if (error.message.includes("User already registered")) {
          toast.error("Este email já está cadastrado");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Conta criada com sucesso! Você já está logado.");
        onOpenChange(false);
        resetForm();
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Erro ao processar cadastro");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setEmail("");
    setPassword("");
    setName("");
    setSexo("");
    setBirthDate(undefined);
    setPeso("");
    setAltura("");
    setMetaPeso("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border/20 glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {step === 1 ? "Vamos começar" : "Meu perfil"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {step === 1 
              ? "Primeiro, precisamos saber algumas informações sobre você. Essas informações serão utilizadas para criar uma experiência personalizada para seu objetivo."
              : "Preencha as informações abaixo:"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {step === 1 ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="João Silva"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="bg-background/50 border-border/50"
                />
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo</Label>
                <Select value={sexo} onValueChange={setSexo} disabled={loading}>
                  <SelectTrigger className="bg-background/50 border-border/50">
                    <SelectValue placeholder="Selecione seu sexo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="masculino">Masculino</SelectItem>
                    <SelectItem value="feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data de nascimento</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal bg-background/50 border-border/50",
                        !birthDate && "text-muted-foreground"
                      )}
                      disabled={loading}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {birthDate ? format(birthDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Insira sua data de nascimento"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={birthDate}
                      onSelect={setBirthDate}
                      disabled={(date) => date > new Date() || date < new Date("1900-01-01")}
                      initialFocus
                      locale={ptBR}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="peso">Peso</Label>
                <div className="relative">
                  <Input
                    id="peso"
                    type="number"
                    placeholder="Insira seu peso"
                    value={peso}
                    onChange={(e) => setPeso(e.target.value)}
                    disabled={loading}
                    className="bg-background/50 border-border/50 pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">kg</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="altura">Altura</Label>
                <div className="relative">
                  <Input
                    id="altura"
                    type="number"
                    placeholder="Insira sua altura"
                    value={altura}
                    onChange={(e) => setAltura(e.target.value)}
                    disabled={loading}
                    className="bg-background/50 border-border/50 pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">cm</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaPeso">Qual sua meta de peso?</Label>
                <div className="relative">
                  <Input
                    id="metaPeso"
                    type="number"
                    placeholder="Insira sua meta de peso"
                    value={metaPeso}
                    onChange={(e) => setMetaPeso(e.target.value)}
                    disabled={loading}
                    className="bg-background/50 border-border/50 pr-12"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">kg</span>
                </div>
              </div>
            </>
          )}

          <Button 
            type="button"
            className="w-full gradient-hero hover:opacity-90 transition-smooth"
            disabled={loading}
            onClick={handleNext}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              "Continuar"
            )}
          </Button>

          {step === 1 && (
            <div className="text-center text-sm">
              <button
                type="button"
                onClick={() => {
                  onOpenChange(false);
                  // Open login dialog instead
                  const event = new CustomEvent('openAuthDialog');
                  window.dispatchEvent(event);
                }}
                className="text-muted-foreground hover:text-foreground transition-smooth underline"
                disabled={loading}
              >
                Já tem conta? Fazer login
              </button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
