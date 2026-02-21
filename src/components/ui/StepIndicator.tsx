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
    <div className="flex items-center justify-center gap-2 py-4 px-4">
      {Array.from({ length: totalSteps }, (_, i) => {
        const step = i + 1;
        const isActive = step === currentStep;
        const isCompleted = step < currentStep;
        return (
          <div key={step} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                isActive
                  ? "bg-cm-gold text-cm-navy scale-110"
                  : isCompleted
                    ? "bg-cm-gold/30 text-cm-gold"
                    : "bg-cm-deep border border-cm-gold/20 text-cm-beige/40"
              }`}
            >
              {isCompleted ? "✓" : step}
            </div>
            {step < totalSteps && (
              <div
                className={`w-6 h-0.5 transition-colors duration-300 ${
                  isCompleted ? "bg-cm-gold/40" : "bg-cm-gold/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
