import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ClassificationBadge from "@/components/classification-badge";
import { Medal, CheckCircle, Download, Award, Target, TrendingUp } from "lucide-react";
import type { Partner, Enrollment, Course } from "@shared/schema";

export default function Journey() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: partner } = useQuery<Partner>({
    queryKey: ["/api/partner"],
    enabled: !!user,
    retry: false,
  });

  const { data: enrollments = [] } = useQuery<(Enrollment & { course: Course })[]>({
    queryKey: ["/api/enrollments"],
    enabled: !!partner,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!partner) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Perfil de Parceiro Necessário</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">
              Para acessar sua jornada, você precisa completar seu perfil de parceiro.
            </p>
            <Button onClick={() => window.location.href = "/partner/setup"}>
              Completar Perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const completedCourses = enrollments.filter(e => e.status === 'completed');
  const inProgressCourses = enrollments.filter(e => e.status === 'in_progress' || e.status === 'enrolled');
  const averageGrade = completedCourses.length > 0 
    ? completedCourses.reduce((sum, e) => sum + parseFloat(e.grade || "0"), 0) / completedCourses.length 
    : 0;

  const getClassificationProgress = (classification: string) => {
    switch (classification) {
      case 'bronze': return 33;
      case 'silver': return 66;
      case 'gold': return 100;
      default: return 0;
    }
  };

  const getClassificationBenefits = (classification: string) => {
    switch (classification) {
      case 'bronze':
        return [
          '5% desconto em cursos',
          'Acesso ao portal básico',
          'Suporte por email',
        ];
      case 'silver':
        return [
          '10% desconto em cursos',
          'Acesso a eventos exclusivos',
          'Suporte prioritário',
          'Material complementar',
        ];
      case 'gold':
        return [
          '15% desconto em cursos',
          'Acesso prioritário a eventos',
          'Suporte técnico especializado',
          'Early access a novos cursos',
          'Networking exclusivo',
        ];
      default:
        return [];
    }
  };

  const getNextLevel = (classification: string) => {
    switch (classification) {
      case 'bronze': return 'prata';
      case 'silver': return 'ouro';
      case 'gold': return null;
      default: return 'bronze';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Sidebar />
          
          <main className="md:col-span-3 space-y-8">
            {/* Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Target className="h-6 w-6 text-agro-primary" />
                  <span>Minha Jornada</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Acompanhe seu progresso, conquistas e classificação na AgroAcademy.
                </p>
              </CardContent>
            </Card>

            {/* Classification Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Classificação de Parceiro</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium text-gray-900">Status Atual</h4>
                    <ClassificationBadge classification={partner.classification} />
                  </div>
                  
                  <div className="relative">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 bg-orange-600 rounded-full flex items-center justify-center">
                          <Medal className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xs text-gray-600 mt-1">Bronze</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 ${partner.classification === 'silver' || partner.classification === 'gold' ? 'bg-gray-400' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                          <Medal className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xs text-gray-600 mt-1">Prata</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 ${partner.classification === 'gold' ? 'bg-yellow-500' : 'bg-gray-200'} rounded-full flex items-center justify-center`}>
                          <Medal className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-xs text-gray-600 mt-1">Ouro</span>
                      </div>
                    </div>
                    <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-600 via-gray-400 to-yellow-500" 
                        style={{ width: `${getClassificationProgress(partner.classification)}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Benefits and Next Level */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                      <Award className="h-4 w-4 mr-2 text-yellow-600" />
                      Benefícios Ativos
                    </h5>
                    <ul className="space-y-2 text-sm text-gray-600">
                      {getClassificationBenefits(partner.classification).map((benefit, index) => (
                        <li key={index} className="flex items-center">
                          <CheckCircle className="h-4 w-4 text-agro-primary mr-2" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <h5 className="font-medium text-gray-900 mb-3 flex items-center">
                      <TrendingUp className="h-4 w-4 mr-2 text-gray-600" />
                      Próximo Nível
                    </h5>
                    {getNextLevel(partner.classification) ? (
                      <div className="text-sm text-gray-600">
                        <p className="mb-2">Para alcançar o nível {getNextLevel(partner.classification)}:</p>
                        <ul className="space-y-1">
                          <li>• Complete mais 2 cursos</li>
                          <li>• Mantenha nota média acima de 8.0</li>
                          <li>• Participe de 3 eventos</li>
                        </ul>
                      </div>
                    ) : (
                      <div className="text-sm text-gray-600">
                        <p>Você atingiu o nível máximo!</p>
                        <p className="text-agro-primary font-medium">Continue se destacando para manter seus benefícios</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Performance Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{completedCourses.length}</div>
                  <p className="text-gray-600 text-sm">Cursos Concluídos</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{partner.totalScore}</div>
                  <p className="text-gray-600 text-sm">Pontuação Total</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6 text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">{averageGrade.toFixed(1)}</div>
                  <p className="text-gray-600 text-sm">Nota Média</p>
                </CardContent>
              </Card>
            </div>

            {/* Course History */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Cursos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrollments.length > 0 ? (
                    enrollments.map((enrollment) => (
                      <div key={enrollment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            enrollment.status === 'completed' ? 'bg-green-500' : 
                            enrollment.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                          }`}></div>
                          <div>
                            <p className="font-medium text-gray-900">{enrollment.course.name}</p>
                            <p className="text-sm text-gray-500">
                              {enrollment.status === 'completed' && enrollment.completionDate
                                ? `Concluído em ${new Date(enrollment.completionDate).toLocaleDateString('pt-BR')}`
                                : enrollment.status === 'in_progress'
                                ? `Em andamento - ${enrollment.progress}%`
                                : 'Inscrito'
                              }
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          {enrollment.status === 'completed' && enrollment.grade && (
                            <span className="text-sm font-medium text-gray-900">
                              Nota: {enrollment.grade}
                            </span>
                          )}
                          {enrollment.status === 'completed' && (
                            <Button size="sm" variant="outline">
                              <Download className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Nenhum curso encontrado em seu histórico.</p>
                      <Button className="mt-4 bg-agro-primary hover:bg-agro-primary-dark">
                        Explorar Cursos
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
