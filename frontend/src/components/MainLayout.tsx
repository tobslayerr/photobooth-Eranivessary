/* src/components/MainLayout.tsx */
import React from 'react';

interface Props {
  children: React.ReactNode;
  isFullScreen?: boolean; 
}

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <main className="h-screen w-screen overflow-hidden bg-funday text-slate-800">
      {/* Dekorasi Ombak Statis di Background (Opsional CSS shape) */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-[#F59E0B] opacity-20 rounded-t-[100%] scale-150 translate-y-16 pointer-events-none blur-3xl"></div>
      
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </main>
  );
};

export default MainLayout;