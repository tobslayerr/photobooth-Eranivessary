import React from 'react';

interface ModalProps {
  isOpen: boolean;
  title: string;
  message?: string;        
  children?: React.ReactNode; 
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;    
  isDestructive?: boolean; 
  isProcessing?: boolean;  
  showConfirmButton?: boolean; 
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Titan+One&family=Patrick+Hand&display=swap');
  
  /* FONTS */
  .font-title { font-family: 'Titan One', cursive; }
  .font-hand { font-family: 'Patrick Hand', cursive; }
  
  /* MODAL BOX: White Card Style */
  .modal-box {
    background-color: #FFF;
    border: 4px solid #FF7F50; /* Coral border */
    border-radius: 20px;
    box-shadow: 
      10px 10px 0 rgba(0,0,0,0.1), /* Bayangan Keras Retro */
      0 0 0 8px rgba(255, 255, 255, 0.5); /* Outer glow transparan */
    position: relative;
    overflow: visible;
  }

  /* BUTTONS: Beach Pill Shape */
  .btn-beach {
    background: #FF7F50;
    color: white;
    border: none;
    border-radius: 50px;
    text-transform: uppercase;
    font-family: 'Titan One', cursive;
    letter-spacing: 1px;
    box-shadow: 0 5px 0 #CD5C5C; /* Efek 3D */
    transition: transform 0.1s, box-shadow 0.1s;
    font-size: 1rem;
  }
  .btn-beach:hover:not(:disabled) {
    transform: translateY(-2px);
    background: #ff8a65;
    box-shadow: 0 7px 0 #CD5C5C;
  }
  .btn-beach:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 0 0 #CD5C5C;
  }

  /* BUTTONS: Destructive (Red) */
  .btn-beach-destructive {
    background: #EF4444;
    color: white;
    border: none;
    border-radius: 50px;
    font-family: 'Titan One', cursive;
    box-shadow: 0 5px 0 #991B1B;
    transition: transform 0.1s, box-shadow 0.1s;
  }
  .btn-beach-destructive:hover:not(:disabled) {
    background: #f87171;
    transform: translateY(-2px);
    box-shadow: 0 7px 0 #991B1B;
  }
  .btn-beach-destructive:active:not(:disabled) {
    transform: translateY(3px);
    box-shadow: 0 0 0 #991B1B;
  }

  /* BUTTONS: Cancel (Outline/Sand) */
  .btn-beach-cancel {
    background: #FFF;
    border: 3px solid #DDD;
    color: #888;
    border-radius: 50px;
    font-family: 'Titan One', cursive;
    transition: all 0.2s;
  }
  .btn-beach-cancel:hover:not(:disabled) {
    border-color: #AAA;
    color: #555;
    background: #f9f9f9;
  }

  /* DECORATION: Tape Effect (Selotip) */
  .tape-deco {
    position: absolute;
    top: -15px; left: 50%;
    transform: translateX(-50%);
    width: 120px; height: 35px;
    background-color: rgba(255, 255, 255, 0.4);
    background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.2) 10px, rgba(255,255,255,0.2) 20px);
    border-left: 2px solid rgba(255,255,255,0.5);
    border-right: 2px solid rgba(255,255,255,0.5);
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    z-index: 30;
  }

  /* DECORATION: Sun Icon CSS */
  .sun-icon {
    position: absolute;
    top: -25px;
    right: -25px;
    width: 60px;
    height: 60px;
    background: #FFD700;
    border-radius: 50%;
    border: 4px solid #FFA500;
    box-shadow: 0 0 10px rgba(255, 165, 0, 0.5);
    z-index: 40;
    display: flex; align-items: center; justify-content: center;
    font-size: 30px;
  }
`;

const ConfirmationModal: React.FC<ModalProps> = ({
  isOpen,
  title,
  message,
  children,
  onConfirm,
  onCancel,
  confirmText = 'YA, LANJUTKAN',
  cancelText = 'BATAL',        
  isDestructive = false,        
  isProcessing = false,
  showConfirmButton = true
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={(e) => e.stopPropagation()}>
      <style>{styles}</style>
      
      {/* MODAL BOX */}
      <div className="w-full max-w-md modal-box p-1 animate-in fade-in zoom-in duration-300">
        
        {/* DEKORASI ATAS */}
        <div className="tape-deco"></div>
        <div className="sun-icon">☀️</div>
        
        <div className="p-8 text-center relative z-20">
            {/* TITLE */}
            <h3 className="text-3xl mb-4 font-title text-orange-500 uppercase tracking-wide drop-shadow-sm">
                {title}
            </h3>
            
            {/* CONTENT */}
            <div className="text-gray-600 mb-8 text-xl font-hand leading-relaxed px-2">
                {children ? children : message}
            </div>
            
            {/* BUTTONS */}
            <div className="flex flex-col-reverse sm:flex-row justify-center gap-3 font-title text-lg">
              <button 
                onClick={onCancel} 
                disabled={isProcessing}
                className="flex-1 py-3 btn-beach-cancel disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {cancelText}
              </button>
              
              {showConfirmButton && (
                <button 
                  onClick={onConfirm} 
                  disabled={isProcessing}
                  className={`flex-1 py-3 disabled:opacity-50 disabled:cursor-not-allowed ${isDestructive ? 'btn-beach-destructive' : 'btn-beach'}`}
                >
                    {isProcessing ? 'LOADING...' : confirmText}
                </button>
              )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;