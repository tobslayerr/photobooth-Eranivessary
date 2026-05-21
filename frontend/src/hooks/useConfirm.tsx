import  { createContext, useContext, useState, type ReactNode } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';

interface ModalContextType {
  confirm: (title: string, message: string) => Promise<boolean>;
}

interface PromiseCallbacks {
  resolve: (value: boolean) => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

const defaultModalProps = {
  isOpen: false,
  title: '',
  message: '',
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modalProps, setModalProps] = useState(defaultModalProps);
  const [promiseCallbacks, setPromiseCallbacks] = useState<PromiseCallbacks | null>(null);

  const confirm = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setModalProps({ isOpen: true, title, message });
      setPromiseCallbacks({ resolve });
    });
  };

  const handleCancel = () => {
    if (promiseCallbacks) {
      promiseCallbacks.resolve(false); 
    }
    setModalProps(defaultModalProps);
    setPromiseCallbacks(null);
  };

  const handleConfirm = () => {
    if (promiseCallbacks) {
      promiseCallbacks.resolve(true); 
    }
    setModalProps(defaultModalProps);
    setPromiseCallbacks(null);
  };

  return (
    <ModalContext.Provider value={{ confirm }}>
      <ConfirmationModal
        {...modalProps}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
      {children}
    </ModalContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useConfirm harus digunakan di dalam ModalProvider');
  }
  return context.confirm;
};