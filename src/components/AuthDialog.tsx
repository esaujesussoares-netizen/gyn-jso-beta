import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (!isLogin && (!name || !age || !height)) {
      toast.error("Preencha todos os campos do cadastro");
      return;
    }

    setLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Email ou senha incorretos");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Login realizado com sucesso!");
          onOpenChange(false);
          setEmail("");
          setPassword("");
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              name,
              age,
              altura: height, // [auth-metadata-consistency]
              height, // [auth-metadata-consistency] backward compatibility
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
          setEmail("");
          setPassword("");
          setName("");
          setAge("");
          setHeight("");
        }
      }
    } catch (error) {
      toast.error("Erro ao processar autenticação");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-border/20 glass-card">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {isLogin ? "Entrar" : "Criar Conta"}
          </DialogTitle>
          <DialogDescription className="text-center">
            {isLogin 
              ? "Entre para continuar sua jornada fitness" 
              : "Crie sua conta e comece a transformação"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleAuth} className="space-y-4 mt-4">
          {!isLogin && (
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
          )}

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

          {!isLogin && (
            <>
              <div className="space-y-2">
                <Label htmlFor="age">Idade</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="28"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  disabled={loading}
                  className="bg-background/50 border-border/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="height">Altura (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="178"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  disabled={loading}
                  className="bg-background/50 border-border/50"
                />
              </div>
            </>
          )}

          <Button 
            type="submit" 
            className="w-full gradient-hero hover:opacity-90 transition-smooth"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              isLogin ? "Entrar" : "Criar Conta"
            )}
          </Button>

          <div className="text-center text-sm">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-muted-foreground hover:text-foreground transition-smooth underline"
              disabled={loading}
            >
              {isLogin 
                ? "Não tem conta? Criar nova conta" 
                : "Já tem conta? Fazer login"}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
