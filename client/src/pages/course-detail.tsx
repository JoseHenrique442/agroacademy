import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoute } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { insertStudentSchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  Users, 
  Trophy, 
  Clock, 
  BookOpen, 
  Award, 
  CheckCircle, 
  XCircle,
  Download,
  Plus,
  BarChart3,
  TrendingUp,
  Star
} from "lucide-react";
import type { Course, Student, Enrollment, Partner } from "@shared/schema";

const studentFormSchema = insertStudentSchema.extend({
  courseId: z.number(),
});

export default function CourseDetail() {
  const [, params] = useRoute("/courses/:id");
  const courseId = parseInt(params?.id || "0");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isEnrollDialogOpen, setIsEnrollDialogOpen] = useState(false);

  const { data: course, isLoading: courseLoading } = useQuery<Course>({
    queryKey: [`/api/courses/${courseId}`],
    enabled: !!courseId,
  });

  const { data: enrollments = [], isLoading: enrollmentsLoading } = useQuery<(Enrollment & { student: Student; partner: Partner })[]>({
    queryKey: [`/api/courses/${courseId}/enrollments`],
    enabled: !!courseId,
  });

  const { data: students = [] } = useQuery<Student[]>({
    queryKey: ["/api/students"],
  });

  const form = useForm<z.infer<typeof studentFormSchema>>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      cpf: "",
      address: "",
      courseId: courseId,
    },
  });

  const createStudentMutation = useMutation({
    mutationFn: async (data: z.infer<typeof studentFormSchema>) => {
      const student = await apiRequest("/api/students", {
        method: "POST",
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          phone: data.phone,
          cpf: data.cpf,
          address: data.address,
        }),
      });

      // Enroll student in course
      await apiRequest("/api/enrollments", {
        method: "POST",
        body: JSON.stringify({
          studentId: student.id,
          courseId: data.courseId,
        }),
      });

      return student;
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Aluno inscrito com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${courseId}/enrollments`] });
      queryClient.invalidateQueries({ queryKey: ["/api/students"] });
      setIsEnrollDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao inscrever aluno: " + error.message,
        variant: "destructive",
      });
    },
  });

  const enrollExistingStudentMutation = useMutation({
    mutationFn: async (studentId: number) => {
      return await apiRequest("/api/enrollments", {
        method: "POST",
        body: JSON.stringify({
          studentId: studentId,
          courseId: courseId,
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Aluno inscrito com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${courseId}/enrollments`] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao inscrever aluno: " + error.message,
        variant: "destructive",
      });
    },
  });

  const requestCertificateMutation = useMutation({
    mutationFn: async (enrollmentId: number) => {
      return await apiRequest(`/api/enrollments/${enrollmentId}`, {
        method: "PATCH",
        body: JSON.stringify({
          certificateRequested: true,
        }),
      });
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Certificado solicitado com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: [`/api/courses/${courseId}/enrollments`] });
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao solicitar certificado: " + error.message,
        variant: "destructive",
      });
    },
  });

  if (courseLoading || enrollmentsLoading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  if (!course) {
    return <div className="text-center py-8">Curso não encontrado</div>;
  }

  // Calculate metrics
  const totalEnrollments = enrollments.length;
  const completedEnrollments = enrollments.filter(e => e.status === 'completed').length;
  const inProgressEnrollments = enrollments.filter(e => e.status === 'in_progress').length;
  const averageProgress = enrollments.reduce((sum, e) => sum + parseFloat(e.progress || '0'), 0) / totalEnrollments || 0;
  const completionRate = totalEnrollments > 0 ? (completedEnrollments / totalEnrollments) * 100 : 0;
  const averageGrade = enrollments
    .filter(e => e.grade)
    .reduce((sum, e) => sum + parseFloat(e.grade || '0'), 0) / enrollments.filter(e => e.grade).length || 0;

  // Available students for enrollment (not already enrolled)
  const enrolledStudentIds = enrollments.map(e => e.student.id);
  const availableStudents = students.filter(s => !enrolledStudentIds.includes(s.id));

  const onSubmit = (data: z.infer<typeof studentFormSchema>) => {
    createStudentMutation.mutate(data);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Course Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold mb-2">{course.name}</h1>
          <p className="text-muted-foreground mb-4">{course.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{course.level}</Badge>
            <Badge variant="outline">{course.duration}h</Badge>
            <Badge variant="outline">
              <Star className="w-3 h-3 mr-1" />
              {course.rating}
            </Badge>
          </div>
        </div>
        <Dialog open={isEnrollDialogOpen} onOpenChange={setIsEnrollDialogOpen}>
          <DialogTrigger asChild>
            <Button size="lg">
              <Plus className="w-4 h-4 mr-2" />
              Inscrever Aluno
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Inscrever Aluno no Curso</DialogTitle>
            </DialogHeader>
            <Tabs defaultValue="new" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="new">Novo Aluno</TabsTrigger>
                <TabsTrigger value="existing">Aluno Existente</TabsTrigger>
              </TabsList>
              <TabsContent value="new" className="space-y-4">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                              <Input placeholder="Nome do aluno" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="email@exemplo.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input placeholder="(11) 99999-9999" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="cpf"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>CPF</FormLabel>
                            <FormControl>
                              <Input placeholder="000.000.000-00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Endereço completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={createStudentMutation.isPending}>
                      {createStudentMutation.isPending ? "Inscrevendo..." : "Inscrever Aluno"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
              <TabsContent value="existing" className="space-y-4">
                {availableStudents.length > 0 ? (
                  <div className="grid gap-2">
                    {availableStudents.map((student) => (
                      <div key={student.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{student.name}</p>
                          <p className="text-sm text-muted-foreground">{student.email}</p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => enrollExistingStudentMutation.mutate(student.id)}
                          disabled={enrollExistingStudentMutation.isPending}
                        >
                          Inscrever
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    Todos os seus alunos já estão inscritos neste curso.
                  </p>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Inscritos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEnrollments}</div>
            <p className="text-xs text-muted-foreground">
              {inProgressEnrollments} em progresso
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Conclusão</CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completionRate.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">
              {completedEnrollments} concluídos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progresso Médio</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageProgress.toFixed(1)}%</div>
            <Progress value={averageProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Nota Média</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageGrade > 0 ? averageGrade.toFixed(1) : '--'}
            </div>
            <p className="text-xs text-muted-foreground">
              {enrollments.filter(e => e.grade).length} notas registradas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Content */}
      <Tabs defaultValue="students" className="w-full">
        <TabsList>
          <TabsTrigger value="students">Alunos</TabsTrigger>
          <TabsTrigger value="info">Informações</TabsTrigger>
          <TabsTrigger value="certificates">Certificados</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Alunos Inscritos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <h4 className="font-medium">{enrollment.student.name}</h4>
                          <p className="text-sm text-muted-foreground">{enrollment.student.email}</p>
                          <p className="text-sm text-muted-foreground">
                            Parceiro: {enrollment.partner.company}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge variant={
                            enrollment.status === 'completed' ? 'default' :
                            enrollment.status === 'in_progress' ? 'secondary' : 'outline'
                          }>
                            {enrollment.status === 'completed' ? 'Concluído' :
                             enrollment.status === 'in_progress' ? 'Em Progresso' : 'Inscrito'}
                          </Badge>
                          <div className="mt-2">
                            <div className="text-sm font-medium">
                              {enrollment.progress}% completo
                            </div>
                            <Progress value={parseFloat(enrollment.progress || '0')} className="w-24 mt-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {enrollments.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum aluno inscrito neste curso ainda.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="info" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Curso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Instrutores</h4>
                <div className="flex flex-wrap gap-2">
                  {course.instructors?.map((instructor, index) => (
                    <Badge key={index} variant="secondary">{instructor}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Requisitos</h4>
                <ul className="list-disc list-inside space-y-1">
                  {course.requirements?.map((requirement, index) => (
                    <li key={index} className="text-sm">{requirement}</li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium">Duração</h4>
                  <p className="text-sm text-muted-foreground">{course.duration} horas</p>
                </div>
                <div>
                  <h4 className="font-medium">Nível</h4>
                  <p className="text-sm text-muted-foreground capitalize">{course.level}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="certificates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Gestão de Certificados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrollments.filter(e => e.status === 'completed').map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{enrollment.student.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Concluído em: {enrollment.completionDate ? 
                          new Date(enrollment.completionDate).toLocaleDateString('pt-BR') : 'N/A'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Nota: {enrollment.grade || 'N/A'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {enrollment.certificateIssued ? (
                        <Badge variant="default">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Emitido
                        </Badge>
                      ) : enrollment.certificateRequested ? (
                        <Badge variant="secondary">
                          <Clock className="w-3 h-3 mr-1" />
                          Solicitado
                        </Badge>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => requestCertificateMutation.mutate(enrollment.id)}
                          disabled={requestCertificateMutation.isPending}
                        >
                          <Download className="w-3 h-3 mr-1" />
                          Solicitar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {enrollments.filter(e => e.status === 'completed').length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum aluno concluiu este curso ainda.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}