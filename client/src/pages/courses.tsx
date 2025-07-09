import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EnrollmentForm from "@/components/enrollment-form";
import CourseCard from "@/components/course-card";
import { GraduationCap, Clock, Users, Star, Filter } from "lucide-react";
import type { Partner, Course, Enrollment } from "@shared/schema";

export default function Courses() {
  const { toast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [filterLevel, setFilterLevel] = useState<string>("all");

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

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
    enabled: !!partner,
    retry: false,
  });

  const { data: enrollments = [] } = useQuery<(Enrollment & { course: Course })[]>({
    queryKey: ["/api/enrollments"],
    enabled: !!partner,
    retry: false,
  });

  const enrollmentMutation = useMutation({
    mutationFn: async (courseId: number) => {
      await apiRequest("POST", "/api/enrollments", { courseId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/enrollments"] });
      toast({
        title: "Inscrição realizada!",
        description: "Você foi inscrito no curso com sucesso.",
      });
      setShowEnrollmentForm(false);
      setSelectedCourse(null);
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
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
      toast({
        title: "Erro na inscrição",
        description: "Não foi possível realizar a inscrição. Tente novamente.",
        variant: "destructive",
      });
    },
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

  const enrolledCourseIds = enrollments.map(e => e.courseId);
  const availableCourses = courses.filter(course => !enrolledCourseIds.includes(course.id));
  const filteredCourses = filterLevel === "all" 
    ? availableCourses 
    : availableCourses.filter(course => course.level === filterLevel);

  const handleEnrollment = (course: Course) => {
    setSelectedCourse(course);
    setShowEnrollmentForm(true);
  };

  const confirmEnrollment = () => {
    if (selectedCourse) {
      enrollmentMutation.mutate(selectedCourse.id);
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
                  <GraduationCap className="h-6 w-6 text-agro-primary" />
                  <span>Cursos Disponíveis</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Explore nossa biblioteca completa de cursos especializados em drones agrícolas.
                  De certificações básicas a operações avançadas.
                </p>
              </CardContent>
            </Card>

            {/* Course Tabs */}
            <Tabs defaultValue="available" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="available">Cursos Disponíveis</TabsTrigger>
                <TabsTrigger value="enrolled">Meus Cursos</TabsTrigger>
              </TabsList>

              <TabsContent value="available" className="space-y-6">
                {/* Filters */}
                <div className="flex items-center space-x-4">
                  <Filter className="h-5 w-5 text-gray-500" />
                  <div className="flex space-x-2">
                    <Button 
                      variant={filterLevel === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterLevel("all")}
                      className={filterLevel === "all" ? "bg-agro-primary hover:bg-agro-primary-dark" : ""}
                    >
                      Todos
                    </Button>
                    <Button 
                      variant={filterLevel === "beginner" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterLevel("beginner")}
                      className={filterLevel === "beginner" ? "bg-agro-primary hover:bg-agro-primary-dark" : ""}
                    >
                      Iniciante
                    </Button>
                    <Button 
                      variant={filterLevel === "intermediate" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterLevel("intermediate")}
                      className={filterLevel === "intermediate" ? "bg-agro-primary hover:bg-agro-primary-dark" : ""}
                    >
                      Intermediário
                    </Button>
                    <Button 
                      variant={filterLevel === "advanced" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setFilterLevel("advanced")}
                      className={filterLevel === "advanced" ? "bg-agro-primary hover:bg-agro-primary-dark" : ""}
                    >
                      Avançado
                    </Button>
                  </div>
                </div>

                {/* Course Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{course.name}</h4>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Disponível
                          </Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-4">{course.description}</p>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                          <span className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {course.duration}h
                          </span>
                          <span className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            {course.enrolledStudents} alunos
                          </span>
                          <span className="flex items-center">
                            <Star className="h-4 w-4 mr-1" />
                            {course.rating}
                          </span>
                        </div>
                        
                        <div className="flex space-x-3">
                          <Button 
                            className="flex-1 bg-agro-primary text-white hover:bg-agro-primary-dark"
                            onClick={() => handleEnrollment(course)}
                          >
                            Inscrever-se
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => window.location.href = `/courses/${course.id}`}>
                            Detalhes
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredCourses.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500">Nenhum curso disponível com os filtros selecionados.</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="enrolled" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {enrollments.map((enrollment) => (
                    <CourseCard 
                      key={enrollment.id} 
                      course={enrollment.course} 
                      enrollment={enrollment}
                    />
                  ))}
                </div>

                {enrollments.length === 0 && (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <p className="text-gray-500">Você ainda não está inscrito em nenhum curso.</p>
                      <Button 
                        className="mt-4 bg-agro-primary hover:bg-agro-primary-dark"
                        onClick={() => setFilterLevel("all")}
                      >
                        Explorar Cursos
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>

      {/* Enrollment Form Dialog */}
      {showEnrollmentForm && selectedCourse && partner && (
        <EnrollmentForm
          course={selectedCourse}
          partner={partner}
          isOpen={showEnrollmentForm}
          onClose={() => setShowEnrollmentForm(false)}
          onConfirm={confirmEnrollment}
          isLoading={enrollmentMutation.isPending}
        />
      )}

      <Footer />
    </div>
  );
}
