import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, GraduationCap, Users, Award } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <div className="flex justify-center mb-8">
              <div className="bg-white/10 p-4 rounded-2xl">
                <Bot className="h-16 w-16" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-6">AgroAcademy</h1>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">
              A maior escola de formação de pilotos de drones agrícolas do mundo.
              Democratizando o acesso à tecnologia de precisão no campo.
            </p>
            <Button 
              size="lg" 
              className="bg-white text-green-600 hover:bg-gray-100 font-semibold px-8 py-4 text-lg"
              onClick={() => window.location.href = "/api/login"}
            >
              Acessar Portal de Parceiros
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Nossos Diferenciais
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Formação completa com tecnologia de ponta e especialistas certificados
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Cursos Especializados</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                CAAR, Piloto DJI, Piloto Enterprise e muito mais.
                Formação completa do básico ao avançado.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Rede de Parceiros</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Faça parte da maior rede de profissionais em drones agrícolas.
                Conecte-se e cresça junto conosco.
              </p>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-yellow-600" />
              </div>
              <CardTitle>Certificação Reconhecida</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Certificados reconhecidos nacionalmente.
                Especialistas DJI e parcerias institucionais.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para começar sua jornada?
          </h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Acesse o portal de parceiros e descubra todas as oportunidades que preparamos para você.
          </p>
          <Button 
            size="lg" 
            className="bg-green-600 hover:bg-green-700 font-semibold px-8 py-4 text-lg"
            onClick={() => window.location.href = "/api/login"}
          >
            Fazer Login
          </Button>
        </div>
      </div>
    </div>
  );
}
