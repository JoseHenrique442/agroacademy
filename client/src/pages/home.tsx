import { useAuth } from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import CourseCard from "@/components/course-card";
import ClassificationBadge from "@/components/classification-badge";
import { Play, Clock, TrendingUp, Plus, Tag, ChevronRight } from "lucide-react";
import type { Partner, Enrollment, Course, Event } from "@shared/schema";

export default function Home() {
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

  const { data: upcomingEvents = [] } = useQuery<Event[]>({
    queryKey: ["/api/events/upcoming"],
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
              Para acessar o portal, você precisa completar seu perfil de parceiro.
            </p>
            <Button onClick={() => window.location.href = "/partner/setup"}>
              Completar Perfil
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const coursesInProgress = enrollments.filter(e => e.status === 'in_progress' || e.status === 'enrolled');
  const completedCourses = enrollments.filter(e => e.status === 'completed');
  const totalProgress = enrollments.length > 0 
    ? enrollments.reduce((sum, e) => sum + parseFloat(e.progress || "0"), 0) / enrollments.length 
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <Sidebar />
          
          <main className="md:col-span-3 space-y-8">
            {/* Welcome Section */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Bem-vindo de volta, {user?.firstName || 'Parceiro'}! 👋
                    </h2>
                    <p className="text-gray-600">Continue sua jornada de formação em drones agrícolas</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <ClassificationBadge classification={partner.classification} />
                    <div className="flex space-x-3">
                      <Button className="bg-agro-primary hover:bg-agro-primary-dark">
                        <Plus className="h-4 w-4 mr-2" />
                        Novo Curso
                      </Button>
                      <Button variant="outline">
                        <Tag className="h-4 w-4 mr-2" />
                        Certificados
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Cursos em Andamento</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{coursesInProgress.length}</p>
                    </div>
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Play className="h-6 w-6 text-blue-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Próxima Avaliação</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">Em 5 dias</p>
                    </div>
                    <div className="bg-yellow-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-600 text-sm font-medium">Taxa de Conclusão</p>
                      <p className="text-2xl font-bold text-gray-900 mt-1">{Math.round(totalProgress)}%</p>
                    </div>
                    <div className="bg-green-100 p-3 rounded-full">
                      <TrendingUp className="h-6 w-6 text-green-600" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Courses in Progress */}
            <section>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Cursos em Andamento</h3>
                <Button variant="link" className="text-agro-primary hover:text-agro-primary-dark">
                  Ver todos <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
              
              {coursesInProgress.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {coursesInProgress.slice(0, 2).map((enrollment) => (
                    <CourseCard 
                      key={enrollment.id} 
                      course={enrollment.course} 
                      enrollment={enrollment}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-6 text-center">
                    <p className="text-gray-500">Nenhum curso em andamento</p>
                    <Button className="mt-4 bg-agro-primary hover:bg-agro-primary-dark">
                      Explorar Cursos
                    </Button>
                  </CardContent>
                </Card>
              )}
            </section>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Próximos Eventos</CardTitle>
                    <Button variant="link" className="text-agro-primary hover:text-agro-primary-dark">
                      Ver agenda <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingEvents.slice(0, 2).map((event) => (
                    <div key={event.id} className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="flex-shrink-0 text-center">
                        <div className="bg-agro-primary text-white rounded-lg p-2 w-12">
                          <div className="text-xs font-medium">
                            {new Date(event.eventDate).toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase()}
                          </div>
                          <div className="text-lg font-bold">
                            {new Date(event.eventDate).getDate()}
                          </div>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <p className="text-sm text-gray-600">{event.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(event.eventDate).toLocaleTimeString('pt-BR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} | {event.isOnline ? 'Online' : 'Presencial'}
                        </p>
                      </div>
                      <Button size="sm" className="bg-agro-primary hover:bg-agro-primary-dark">
                        Participar
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
