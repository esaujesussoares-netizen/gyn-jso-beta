import { Layout } from "@/components/Layout";
import { GymCard } from "@/components/GymCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Settings, Target, Bell, Crown, Smartphone, Globe, Shield } from "lucide-react";

const Profile = () => {
  return (
    <Layout>
      <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <div className="w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center mx-auto mb-4">
            <User className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-3xl font-bold">João Silva</h1>
          <p className="text-muted-foreground">Membro desde Janeiro 2024</p>
          <Badge className="mt-2 bg-gradient-fitness text-white">
            <Crown className="w-3 h-3 mr-1" />
            Premium
          </Badge>
        </div>

        {/* Profile Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          <div className="text-center p-3 sm:p-4 rounded-lg glass-card">
            <div className="text-xl sm:text-2xl font-bold text-primary">89</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Treinos</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-lg glass-card">
            <div className="text-xl sm:text-2xl font-bold text-secondary">156</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Refeições</div>
          </div>
          <div className="text-center p-3 sm:p-4 rounded-lg glass-card">
            <div className="text-xl sm:text-2xl font-bold">47</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Dias ativos</div>
          </div>
        </div>

        {/* Personal Information */}
        <GymCard
          title="Informações Pessoais"
          description="Seus dados básicos e objetivos"
        >
          <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Nome completo</Label>
                <Input id="name" defaultValue="João Silva" className="w-full" />
              </div>
              
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue="joao@email.com" className="w-full" />
              </div>
              
              <div>
                <Label htmlFor="age">Idade</Label>
                <Input id="age" defaultValue="28" className="w-full" />
              </div>
              
              <div>
                <Label htmlFor="height">Altura (cm)</Label>
                <Input id="height" defaultValue="178" className="w-full" />
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="weight">Peso atual (kg)</Label>
                <Input id="weight" defaultValue="75.2" className="w-full" />
              </div>
              
              <div>
                <Label htmlFor="goal-weight">Peso objetivo (kg)</Label>
                <Input id="goal-weight" defaultValue="73.0" className="w-full" />
              </div>
              
              <div>
                <Label htmlFor="activity-level">Nível de atividade</Label>
                <Select defaultValue="moderate">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentário</SelectItem>
                    <SelectItem value="light">Atividade leve</SelectItem>
                    <SelectItem value="moderate">Atividade moderada</SelectItem>
                    <SelectItem value="high">Atividade alta</SelectItem>
                    <SelectItem value="very-high">Muito ativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="goal">Objetivo principal</Label>
                <Select defaultValue="weight-loss">
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight-loss">Perda de peso</SelectItem>
                    <SelectItem value="muscle-gain">Ganho de massa</SelectItem>
                    <SelectItem value="maintenance">Manutenção</SelectItem>
                    <SelectItem value="strength">Ganho de força</SelectItem>
                    <SelectItem value="endurance">Resistência</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 mt-6">
            <Button variant="fitness" className="flex-1">
              <Settings className="w-4 h-4 mr-2" />
              Salvar Alterações
            </Button>
            <Button variant="outline" className="flex-1">
              <Target className="w-4 h-4 mr-2" />
              Recalcular Metas
            </Button>
          </div>
        </GymCard>

        {/* Preferences */}
        <GymCard
          title="Preferências do App"
          description="Personalize sua experiência"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Notificações de treino</div>
                  <div className="text-sm text-muted-foreground">Lembretes diários para se exercitar</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Target className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Metas automáticas</div>
                  <div className="text-sm text-muted-foreground">Ajuste automático baseado no progresso</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Smartphone className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Análise por IA</div>
                  <div className="text-sm text-muted-foreground">Análise automática de refeições por foto</div>
                </div>
              </div>
              <Switch defaultChecked />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Compartilhamento de dados</div>
                  <div className="text-sm text-muted-foreground">Me permite compartilhar progresso com a comunidade</div>
                </div>
              </div>
              <Switch />
            </div>
          </div>
        </GymCard>

        {/* Subscription */}
        <GymCard
          variant="nutrition"
          title="Plano Premium"
          description="Aproveite todos os recursos do Gym JS"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-lg bg-gradient-hero">
              <div className="text-white">
                <div className="text-lg font-semibold">Plano Premium Ativo</div>
                <div className="text-sm opacity-90">Renovação automática em 23 dias</div>
              </div>
              <Crown className="w-8 h-8 text-yellow-300" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Análise IA ilimitada</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Treinos personalizados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Relatórios avançados</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full" />
                <span>Suporte prioritário</span>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button variant="outline" className="flex-1">
                Gerenciar Assinatura
              </Button>
              <Button variant="nutrition-outline" className="flex-1">
                Cancelar Plano
              </Button>
            </div>
          </div>
        </GymCard>

        {/* Privacy & Security */}
        <GymCard
          title="Privacidade e Segurança"
          description="Controle seus dados e privacidade"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-muted-foreground" />
                <div>
                  <div className="font-medium">Autenticação biométrica</div>
                  <div className="text-sm text-muted-foreground">Use impressão digital ou Face ID</div>
                </div>
              </div>
              <Switch />
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 pt-4">
              <Button variant="outline" className="flex-1">
                Baixar Meus Dados
              </Button>
              <Button variant="outline" className="flex-1">
                Alterar Senha
              </Button>
              <Button variant="destructive" className="flex-1">
                Excluir Conta
              </Button>
            </div>
          </div>
        </GymCard>

        {/* App Info */}
        <div className="text-center text-sm text-muted-foreground space-y-2">
          <p>Gym JS v2.1.0</p>
          <div className="flex justify-center gap-4">
            <Button variant="link" size="sm">Política de Privacidade</Button>
            <Button variant="link" size="sm">Termos de Uso</Button>
            <Button variant="link" size="sm">Suporte</Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;