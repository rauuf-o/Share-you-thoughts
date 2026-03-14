import React from "react";
interface GradientHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}
const GradientHeader = ({ title, subtitle, children }: GradientHeaderProps) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-500 to-violet-600 py-16 rounded-b-3xl shadow-lg">
      {/* Decorative blur */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute -top-24 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-white blur-3xl"></div>
      </div>

      <div className="relative container mx-auto px-4 text-center">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
            {title}
          </h1>

          <p className="mt-4 text-lg text-blue-100 leading-relaxed">
            {subtitle}
          </p>

          {children && (
            <div className="mt-6 flex justify-center gap-4">{children}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GradientHeader;
