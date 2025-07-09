import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, Users, Star, Play, Download } from "lucide-react";
import type { Course, Enrollment } from "@shared/schema";

interface CourseCardProps {
  course: Course;
  enrollment?: Enrollment;
}

export default function CourseCard({ course, enrollment }: CourseCardProps) {
  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Concluído</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800">Em Andamento</Badge>;
      case 'enrolled':
        return <Badge className="bg-yellow-100 text-yellow-800">Inscrito</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-800">Disponível</Badge>;
    }
  };

  const getCourseImage = (courseName: string) => {
    if (courseName.includes('CAAR')) {
      return 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200';
    }
    if (courseName.includes('DJI')) {
      return 'https://images.unsplash.com/photo-1508614999368-9260051292e5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200';
    }
    if (courseName.includes('ENTERPRISE')) {
      return 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200';
    }
    if (courseName.includes('COMBO')) {
      return 'https://images.unsplash.com/photo-1563906267088-b029e7101114?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200';
    }
    return 'https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200';
  };

  return (
    <Card className="hover:shadow-lg transition-shadow overflow-hidden">
      <div className="relative">
        <img 
          src={course.imageUrl || getCourseImage(course.name)} 
          alt={course.name} 
          className="w-full h-48 object-cover"
        />
        {enrollment && (
          <div className="absolute top-2 right-2">
            {getStatusBadge(enrollment.status)}
          </div>
        )}
      </div>
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-semibold text-gray-900">{course.name}</h4>
          {!enrollment && getStatusBadge()}
        </div>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{course.description}</p>
        
        {enrollment && enrollment.progress && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progresso</span>
              <span>{enrollment.progress}%</span>
            </div>
            <Progress value={parseFloat(enrollment.progress)} className="h-2" />
          </div>
        )}
        
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
            onClick={() => window.location.href = `/courses/${course.id}`}
          >
            <Play className="h-4 w-4 mr-2" />
            Gerenciar Curso
          </Button>
          <Button variant="outline" size="sm" onClick={() => window.location.href = `/courses/${course.id}`}>
            <Download className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
