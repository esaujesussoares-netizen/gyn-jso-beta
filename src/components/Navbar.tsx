import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Home, Dumbbell, Apple, BarChart3, User, LogOut } from "lucide-react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Treinos", href: "/workouts", icon: Dumbbell },
  { name: "Nutrição", href: "/nutrition", icon: Apple },
  { name: "Progresso", href: "/progress", icon: BarChart3 },
  { name: "Perfil", href: "/profile", icon: User },
];

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logout realizado",
        description: "Até logo! Volte sempre.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Erro ao sair",
        description: "Ocorreu um erro ao fazer logout. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/20 md:top-0 md:bottom-auto md:border-b md:border-t-0 safe-area-bottom">
      <div className="flex justify-around items-center px-4 py-3 md:max-w-7xl md:mx-auto md:justify-start md:gap-8">
        <div className="hidden md:flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent whitespace-nowrap">
            GymJS
          </span>
        </div>
        
        <div className="flex justify-between items-center w-full md:justify-start md:gap-2 md:ml-8 overflow-x-auto">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link key={item.name} to={item.href}>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "flex flex-col items-center gap-1 h-auto p-2 min-w-[60px] md:flex-row md:gap-2 md:px-4",
                    isActive && "text-primary bg-gradient-fitness-subtle"
                  )}
                >
                  <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  <span className="text-xs md:text-sm">{item.name}</span>
                </Button>
              </Link>
            );
          })}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="flex flex-col items-center gap-1 h-auto p-2 min-w-[60px] md:flex-row md:gap-2 md:px-4 text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <LogOut className="w-4 h-4 md:w-5 md:h-5" />
            <span className="text-xs md:text-sm">Sair</span>
          </Button>
        </div>
      </div>
    </nav>
  );
}