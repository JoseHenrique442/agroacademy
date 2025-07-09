import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Target, Eye, Heart, CheckCircle, Users, Award, Zap } from "lucide-react";

export default function About() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();

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

  const instructors = [
    {
      name: "Dr. Carlos Silva",
      title: "Especialista CAAR",
      image: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
      bio: "Mais de 15 anos de experiência em aviação civil e certificação ANAC."
    },
    {
      name: "Ana Santos",
      title: "Instrutora DJI",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c1fa?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
      bio: "Certificada DJI Enterprise e especialista em aplicações agrícolas."
    },
    {
      name: "Roberto Lima",
      title: "Coord. Enterprise",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=150&h=150",
      bio: "Engenheiro agrônomo com foco em tecnologia de precisão."
    }
  ];

  const differentials = [
    {
      icon: <Award className="h-6 w-6" />,
      title: "Maior escola global",
      description: "Reconhecida mundialmente como a maior escola de formação de pilotos de drones agrícolas"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Especialistas DJI",
      description: "Instrutores certificados e especializados em equipamentos DJI para agricultura"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Simuladores avançados",
      description: "Tecnologia de simulação de última geração para treinamento prático"
    },
    {
      icon: <CheckCircle className="h-6 w-6" />,
      title: "Parcerias institucionais",
      description: "Convênios com universidades e instituições de pesquisa renomadas"
    }
  ];

  const partnerships = [
    "Universidade Federal de Viçosa",
    "Embrapa Instrumentação",
    "DJI Agriculture",
    "ANAC - Agência Nacional de Aviação Civil",
    "Sindicato Nacional das Empresas de Aviação Agrícola"
  ];

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
                  <Bot className="h-6 w-6 text-agro-primary" />
                  <span>Sobre a AgroAcademy</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-lg">
                  A maior escola de formação de pilotos de drones agrícolas do mundo, 
                  democratizando o acesso à tecnologia de precisão no campo.
                </p>
              </CardContent>
            </Card>

            {/* Mission, Vision, Values */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-agro-primary" />
                      <span>Nossa Missão</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Formar os melhores profissionais em drones agrícolas do mundo, 
                      democratizando o acesso à tecnologia de precisão no campo e 
                      contribuindo para uma agricultura mais sustentável e eficiente.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-agro-primary" />
                      <span>Nossa Visão</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Ser a referência mundial em educação e formação de profissionais 
                      especializados em tecnologia de drones para agricultura, 
                      impulsionando a transformação digital do agronegócio.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-agro-primary" />
                      <span>Nossos Valores</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-agro-primary mr-2 mt-1" />
                        Excelência em ensino e formação profissional
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-agro-primary mr-2 mt-1" />
                        Inovação tecnológica aplicada à agricultura
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-agro-primary mr-2 mt-1" />
                        Sustentabilidade e responsabilidade ambiental
                      </li>
                      <li className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-agro-primary mr-2 mt-1" />
                        Acessibilidade e democratização do conhecimento
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600" 
                  alt="Instalações da AgroAcademy" 
                  className="w-full h-full object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>

            {/* Differentials */}
            <Card>
              <CardHeader>
                <CardTitle>Nossos Diferenciais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {differentials.map((differential, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="bg-agro-primary/10 p-2 rounded-lg">
                        <div className="text-agro-primary">
                          {differential.icon}
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">{differential.title}</h4>
                        <p className="text-gray-600 text-sm">{differential.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructor Team */}
            <Card>
              <CardHeader>
                <CardTitle>Nossa Equipe</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {instructors.map((instructor, index) => (
                    <div key={index} className="text-center">
                      <img 
                        src={instructor.image} 
                        alt={instructor.name} 
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover shadow-lg"
                      />
                      <h5 className="font-medium text-gray-900 mb-1">{instructor.name}</h5>
                      <p className="text-sm text-agro-primary font-medium mb-2">{instructor.title}</p>
                      <p className="text-xs text-gray-600">{instructor.bio}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Technologies and Equipment */}
            <Card>
              <CardHeader>
                <CardTitle>Tecnologias Utilizadas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Equipamentos</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-agro-primary mr-2" />
                        DJI Agras T10, T20, T30
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-agro-primary mr-2" />
                        DJI Mavic 3 Enterprise
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-agro-primary mr-2" />
                        DJI Phantom 4 RTK
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-agro-primary mr-2" />
                        Sensores multiespectrais
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Plataformas</h4>
                    <ul className="space-y-2 text-gray-600">
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-agro-primary mr-2" />
                        Simuladores de voo DJI Flight Simulator
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-agro-primary mr-2" />
                        Software de planejamento de missões
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-agro-primary mr-2" />
                        Plataformas de análise de dados
                      </li>
                      <li className="flex items-center">
                        <CheckCircle className="h-4 w-4 text-agro-primary mr-2" />
                        Sistemas de mapeamento e GIS
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Partnerships */}
            <Card>
              <CardHeader>
                <CardTitle>Parcerias Institucionais</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {partnerships.map((partner, index) => (
                    <div key={index} className="flex items-center p-3 border border-gray-200 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-agro-primary mr-3" />
                      <span className="text-gray-700 font-medium">{partner}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Entre em Contato</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Informações de Contato</h4>
                    <div className="space-y-2 text-gray-600">
                      <p>📧 contato@agroacademy.com.br</p>
                      <p>📱 +55 (11) 9999-9999</p>
                      <p>📍 São Paulo, SP - Brasil</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Horário de Atendimento</h4>
                    <div className="space-y-2 text-gray-600">
                      <p>Segunda a Sexta: 8h às 18h</p>
                      <p>Sábado: 8h às 12h</p>
                      <p>Suporte 24/7 para parceiros Gold</p>
                    </div>
                  </div>
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
