import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, PlayCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressStep {
  id: string;
  title: string;
  description?: string;
  status: 'completed' | 'in_progress' | 'pending' | 'failed';
  progress?: number;
  dueDate?: string;
}

interface ProgressTrackerProps {
  title?: string;
  steps: ProgressStep[];
  overallProgress?: number;
  showOverallProgress?: boolean;
  className?: string;
}

export default function ProgressTracker({
  title = "Progresso",
  steps,
  overallProgress,
  showOverallProgress = true,
  className
}: ProgressTrackerProps) {
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'in_progress':
        return <PlayCircle className="h-5 w-5 text-blue-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <Clock className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 text-xs">Concluído</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 text-xs">Em Andamento</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 text-xs">Falhou</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800 text-xs">Pendente</Badge>;
    }
  };

  const getStepBorderColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-green-200 bg-green-50';
      case 'in_progress':
        return 'border-blue-200 bg-blue-50';
      case 'failed':
        return 'border-red-200 bg-red-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  const calculateOverallProgress = () => {
    if (overallProgress !== undefined) return overallProgress;
    
    const completedSteps = steps.filter(step => step.status === 'completed').length;
    return (completedSteps / steps.length) * 100;
  };

  const totalProgress = calculateOverallProgress();

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{title}</CardTitle>
          {showOverallProgress && (
            <div className="text-sm text-gray-600">
              {Math.round(totalProgress)}% concluído
            </div>
          )}
        </div>
        {showOverallProgress && (
          <Progress value={totalProgress} className="h-2" />
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "relative flex items-start space-x-3 p-4 rounded-lg border",
                getStepBorderColor(step.status)
              )}
            >
              {/* Step connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-6 top-12 w-0.5 h-8 bg-gray-200" />
              )}
              
              {/* Step icon */}
              <div className="flex-shrink-0 mt-0.5">
                {getStepIcon(step.status)}
              </div>
              
              {/* Step content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {step.title}
                  </h4>
                  {getStatusBadge(step.status)}
                </div>
                
                {step.description && (
                  <p className="text-sm text-gray-600 mb-2">
                    {step.description}
                  </p>
                )}
                
                {step.progress !== undefined && step.status === 'in_progress' && (
                  <div className="mb-2">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Progresso</span>
                      <span>{step.progress}%</span>
                    </div>
                    <Progress value={step.progress} className="h-1.5" />
                  </div>
                )}
                
                {step.dueDate && step.status !== 'completed' && (
                  <p className="text-xs text-gray-500">
                    Prazo: {new Date(step.dueDate).toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
        
        {steps.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
            <p>Nenhuma etapa definida</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
