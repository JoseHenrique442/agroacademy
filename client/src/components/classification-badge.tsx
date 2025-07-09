import { Badge } from "@/components/ui/badge";
import { Medal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ClassificationBadgeProps {
  classification: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
  className?: string;
}

export default function ClassificationBadge({ 
  classification, 
  size = "md", 
  showIcon = true,
  className 
}: ClassificationBadgeProps) {
  const getClassificationConfig = (classification: string) => {
    switch (classification.toLowerCase()) {
      case 'bronze':
        return {
          label: 'Bronze',
          bgColor: 'bg-orange-100',
          textColor: 'text-orange-800',
          borderColor: 'border-orange-300',
          iconColor: 'text-orange-600'
        };
      case 'silver':
        return {
          label: 'Prata',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-300',
          iconColor: 'text-gray-600'
        };
      case 'gold':
        return {
          label: 'Ouro',
          bgColor: 'bg-yellow-100',
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-300',
          iconColor: 'text-yellow-600'
        };
      default:
        return {
          label: 'Bronze',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-800',
          borderColor: 'border-gray-300',
          iconColor: 'text-gray-600'
        };
    }
  };

  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'px-2 py-1 text-xs';
      case 'lg':
        return 'px-4 py-2 text-base';
      default:
        return 'px-3 py-1 text-sm';
    }
  };

  const config = getClassificationConfig(classification);
  const sizeClasses = getSizeClasses(size);

  return (
    <Badge 
      variant="outline"
      className={cn(
        "flex items-center space-x-1 font-medium border",
        config.bgColor,
        config.textColor,
        config.borderColor,
        sizeClasses,
        className
      )}
    >
      {showIcon && (
        <Medal className={cn(
          "flex-shrink-0",
          config.iconColor,
          size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4'
        )} />
      )}
      <span>{config.label}</span>
    </Badge>
  );
}
