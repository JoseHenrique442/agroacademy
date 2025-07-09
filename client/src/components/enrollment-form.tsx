import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Users, Star, Tag } from "lucide-react";
import type { Course, Partner } from "@shared/schema";

interface EnrollmentFormProps {
  course: Course;
  partner: Partner;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading: boolean;
}

export default function EnrollmentForm({
  course,
  partner,
  isOpen,
  onClose,
  onConfirm,
  isLoading
}: EnrollmentFormProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Confirmar Inscrição</DialogTitle>
          <DialogDescription>
            Você está se inscrevendo no curso {course.name}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Course Information */}
          <div className="border rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">{course.name}</h4>
            <p className="text-gray-600 text-sm mb-3">{course.description}</p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
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
            
            {course.level && (
              <Badge variant="secondary" className="mb-2">
                {course.level === 'beginner' && 'Iniciante'}
                {course.level === 'intermediate' && 'Intermediário'}
                {course.level === 'advanced' && 'Avançado'}
              </Badge>
            )}
          </div>

          {/* Partner Information */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h5 className="font-medium text-gray-900 mb-2">Informações do Parceiro</h5>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>Empresa:</strong> {partner.company}</p>
              <p className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                <strong>TAG UTM:</strong> {partner.utmTag}
              </p>
              <p><strong>Classificação:</strong> {partner.classification}</p>
            </div>
          </div>

          {/* Benefits */}
          {partner.classification !== 'bronze' && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h5 className="font-medium text-green-900 mb-2">🎉 Benefícios Aplicados</h5>
              <p className="text-sm text-green-700">
                {partner.classification === 'silver' && '10% de desconto aplicado automaticamente'}
                {partner.classification === 'gold' && '15% de desconto aplicado automaticamente'}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button 
            onClick={onConfirm} 
            disabled={isLoading}
            className="bg-agro-primary hover:bg-agro-primary-dark"
          >
            {isLoading ? 'Processando...' : 'Confirmar Inscrição'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
