"use client";

interface StepIndicatorProps {
  currentStep: number; // 1~5
  totalSteps?: number;
}

export default function StepIndicator({
  currentStep,
  totalSteps = 5,
}: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-1 py-5 px-4">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        return (
          <div key={step} className="flex items-center gap-1">
            <div
              className={`h-[1px] transition-all duration-500 ${
                isActive
                  ? "w-8 bg-cm-accent"
                  : isCompleted
                    ? "w-6 bg-cm-accent/40"
                    : "w-6 bg-cm-dim/20"
              }`}
            />
          </div>
        );
      })}
    </div>
  );
}
