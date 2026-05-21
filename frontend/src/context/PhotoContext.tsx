import { createContext, useContext, useState, type ReactNode } from 'react';

interface PhotoContextType {
  currentPhotos: string[];
  addPhoto: (photo: string) => void;
  removePhoto: (index: number) => void;
  clearPhotos: () => void;
}

const PhotoContext = createContext<PhotoContextType | undefined>(undefined);

export const PhotoProvider = ({ children }: { children: ReactNode }) => {
  const [currentPhotos, setCurrentPhotos] = useState<string[]>([]);

  const addPhoto = (photo: string) => {
    // PERBAIKAN: Batasan jumlah foto DIHAPUS.
    // Sekarang user bisa mengambil foto sebanyak memori browser muat.
    setCurrentPhotos((prev) => [...prev, photo]);
  };

  const removePhoto = (index: number) => {
    setCurrentPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const clearPhotos = () => {
    setCurrentPhotos([]);
  };

  return (
    <PhotoContext.Provider value={{ currentPhotos, addPhoto, removePhoto, clearPhotos }}>
      {children}
    </PhotoContext.Provider>
  );
};

export const usePhotos = () => {
  const context = useContext(PhotoContext);
  if (!context) {
    throw new Error('usePhotos must be used within a PhotoProvider');
  }
  return context;
};