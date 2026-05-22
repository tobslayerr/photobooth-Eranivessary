/* src/components/MainLayout.tsx */
import React from 'react';

interface Props {
  children: React.ReactNode;
  isFullScreen?: boolean; 
}

const MainLayout: React.FC<Props> = ({ children }) => {
  return (
    <main 
      className="h-screen w-screen overflow-hidden text-[#2D1714]"
      style={{
        backgroundColor: '#FFFAEE', // Krem Kertas
        backgroundImage: `
          linear-gradient(rgba(120, 162, 210, 0.25) 1.5px, transparent 1.5px),
          linear-gradient(90deg, rgba(120, 162, 210, 0.25) 1.5px, transparent 1.5px)
        `, // Efek Grid Buku Kotak-kotak dengan warna Soft Blue (#78A2D2)
        backgroundSize: '35px 35px'
      }}
    >
      <div className="relative z-10 w-full h-full">
        {children}
      </div>
    </main>
  );
};

export default MainLayout;