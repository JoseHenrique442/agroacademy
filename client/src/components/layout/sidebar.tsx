import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Home, GraduationCap, Target, Info, TrendingUp } from "lucide-react";
import type { Partner } from "@shared/schema";

export default function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const { data: partner } = useQuery<Partner>({
    queryKey: ["/api/partner"],
    enabled: !!user,
    retry: false,
  });

  const navigationItems = [
    { 
      href: "/", 
      icon: Home, 
      label: "Página Inicial",
      isActive: location === "/"
    },
    { 
      href: "/courses", 
      icon: GraduationCap, 
      label: "Cursos",
      isActive: location === "/courses"
    },
    { 
      href: "/journey", 
      icon: Target, 
      label: "Minha Jornada",
      isActive: location === "/journey"
    },
    { 
      href: "/about", 
      icon: Info, 
      label: "Sobre",
      isActive: location === "/about"
    },
  ];

  return (
    <aside className="hidden md:block">
      <div className="space-y-6">
        {/* Navigation Menu */}
        <Card className="sticky top-24">
          <CardContent className="p-6">
            <nav className="space-y-2">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                  >
                    <a className={cn(
                      "flex items-center space-x-3 p-3 rounded-lg font-medium transition-colors",
                      item.isActive
                        ? "text-agro-primary bg-green-50"
                        : "text-gray-600 hover:bg-gray-50"
                    )}>
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </a>
                  </Link>
                );
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Partner Performance Summary */}
        {partner && (
          <Card>
            <CardContent className="p-4 bg-gradient-to-br from-agro-primary to-green-700 text-white rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="h-4 w-4" />
                <h3 className="font-semibold text-sm">Seu Desempenho</h3>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Cursos Concluídos</span>
                  <span className="font-medium">{partner.completedCourses}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Pontuação Total</span>
                  <span className="font-medium">{partner.totalScore}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Taxa de Conclusão</span>
                  <span className="font-medium">{partner.completionRate}%</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </aside>
  );
}
