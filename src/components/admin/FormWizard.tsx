import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  validation?: () => boolean | Promise<boolean>;
  isOptional?: boolean;
}

interface FormWizardProps {
  steps: Step[];
  onComplete: (data: any) => void;
  onCancel?: () => void;
  title?: string;
  description?: string;
  data?: any;
  onDataChange?: (data: any) => void;
}

const FormWizard: React.FC<FormWizardProps> = ({
  steps,
  onComplete,
  onCancel,
  title,
  description,
  data = {},
  onDataChange
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [isValidating, setIsValidating] = useState(false);

  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === steps.length - 1;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const validateCurrentStep = async () => {
    if (!currentStepData.validation) return true;
    
    setIsValidating(true);
    try {
      const isValid = await currentStepData.validation();
      if (isValid) {
        setCompletedSteps(prev => new Set([...prev, currentStep]));
      }
      return isValid;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && !isLastStep) {
      setCurrentStep(prev => prev + 1);
    } else if (isValid && isLastStep) {
      onComplete(data);
    }
  };

  const handlePrevious = () => {
    if (!isFirstStep) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleStepClick = async (stepIndex: number) => {
    if (stepIndex < currentStep || completedSteps.has(stepIndex)) {
      setCurrentStep(stepIndex);
    } else if (stepIndex === currentStep + 1) {
      const isValid = await validateCurrentStep();
      if (isValid) {
        setCurrentStep(stepIndex);
      }
    }
  };

  const updateData = (newData: any) => {
    const updatedData = { ...data, ...newData };
    onDataChange?.(updatedData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      {(title || description) && (
        <div className="text-center space-y-2">
          {title && <h1 className="text-2xl font-bold">{title}</h1>}
          {description && <p className="text-muted-foreground">{description}</p>}
        </div>
      )}

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Step {currentStep + 1} of {steps.length}</span>
              <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Step Navigation */}
      <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
        {steps.map((step, index) => (
          <button
            key={step.id}
            onClick={() => handleStepClick(index)}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors
              ${index === currentStep 
                ? 'bg-primary text-primary-foreground' 
                : completedSteps.has(index)
                ? 'bg-accent text-accent-foreground'
                : index < currentStep || completedSteps.has(index)
                ? 'bg-muted text-muted-foreground hover:bg-muted/80 cursor-pointer'
                : 'bg-muted/50 text-muted-foreground/50 cursor-not-allowed'
              }
            `}
            disabled={index > currentStep && !completedSteps.has(index)}
          >
            <div className={`
              flex items-center justify-center w-6 h-6 rounded-full text-xs
              ${completedSteps.has(index) ? 'bg-accent-light' : 'bg-background/20'}
            `}>
              {completedSteps.has(index) ? (
                <Check className="h-3 w-3" />
              ) : (
                index + 1
              )}
            </div>
            <span className="hidden sm:inline">{step.title}</span>
            {step.isOptional && (
              <Badge variant="secondary" className="text-xs ml-1">Optional</Badge>
            )}
          </button>
        ))}
      </div>

      {/* Current Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            {currentStepData.title}
            {currentStepData.isOptional && (
              <Badge variant="outline">Optional</Badge>
            )}
          </CardTitle>
          {currentStepData.description && (
            <CardDescription>{currentStepData.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {React.cloneElement(currentStepData.component as React.ReactElement, {
            data,
            onDataChange: updateData
          })}
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <div>
          {!isFirstStep && (
            <Button variant="outline" onClick={handlePrevious}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
          )}
        </div>

        <div className="flex items-center space-x-2">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
          
          <Button 
            onClick={handleNext}
            disabled={isValidating}
            className="btn-primary"
          >
            {isValidating ? (
              'Validating...'
            ) : isLastStep ? (
              'Complete'
            ) : (
              <>
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Step Summary */}
      <Card className="bg-muted/30">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{completedSteps.size}</div>
              <div className="text-sm text-muted-foreground">Completed</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-accent">{currentStep + 1}</div>
              <div className="text-sm text-muted-foreground">Current</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary-foreground">{steps.length - completedSteps.size - 1}</div>
              <div className="text-sm text-muted-foreground">Remaining</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FormWizard;