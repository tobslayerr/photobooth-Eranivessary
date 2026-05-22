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
  @import url('https://fonts.googleapis.com/css2?family=Shrikhand&family=Poppins:wght@400;600;800&family=Caveat:wght@700&display=swap');
  
  /* FONTS */
  .font-shrikhand { font-family: 'Shrikhand', serif; }
  .font-poppins { font-family: 'Poppins', sans-serif; }
  .font-caveat { font-family: 'Caveat', cursive; }
  
  /* MODAL BOX: Scrapbook Card Style */
  .modal-scrapbook {
    background-color: #FFFAEE; /* Cream paper */
    border: 4px solid #2D1714;
    box-shadow: 12px 12px 0 #78A2D2; /* Soft Blue Hard Shadow */
    position: relative;
    overflow: visible;
    transform: rotate(-1deg);
  }

  /* DECORATION: Washi Tape */
  .washi-tape {
    position: absolute;
    height: 35px;
    background-color: rgba(255,255,255,0.4);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    backdrop-filter: blur(2px);
    z-index: 30;
  }
  .tape-blue { background-color: rgba(120, 162, 210, 0.8); }
  .tape-olive { background-color: rgba(156, 162, 42, 0.8); }
  .tape-yellow { background-color: rgba(254, 255, 175, 0.9); }

  /* BUTTONS: Scrapbook Base */
  .btn-scrap {
    border: 3px solid #2D1714;
    text-transform: uppercase;
    font-family: 'Shrikhand', serif;
    letter-spacing: 1px;
    transition: transform 0.1s, box-shadow 0.1s;
    font-size: 1.1rem;
    cursor: pointer;
  }
  .btn-scrap:active:not(:disabled) {
    transform: translate(4px, 4px) !important;
    box-shadow: 0 0 0 #2D1714 !important;
  }

  /* BUTTONS: Primary/Confirm (Navy Blue) */
  .btn-scrap-confirm {
    background: #273A5D;
    color: #FEFFAF;
    box-shadow: 6px 6px 0 #2D1714;
  }
  .btn-scrap-confirm:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0 #2D1714;
  }

  /* BUTTONS: Destructive (Olive Green) */
  .btn-scrap-destructive {
    background: #9CA22A;
    color: #FFFAEE;
    box-shadow: 6px 6px 0 #2D1714;
  }
  .btn-scrap-destructive:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0 #2D1714;
  }

  /* BUTTONS: Cancel (Cream/Outline) */
  .btn-scrap-cancel {
    background: #FFFAEE;
    color: #2D1714;
    box-shadow: 4px 4px 0 #2D1714;
  }
  .btn-scrap-cancel:hover:not(:disabled) {
    background: #FFF;
    transform: translate(-2px, -2px);
    box-shadow: 6px 6px 0 #2D1714;
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
      <div className="w-full max-w-md modal-scrapbook animate-in fade-in zoom-in duration-200">
        
        {/* DEKORASI ATAS (Washi Tape) */}
        <div className="washi-tape tape-yellow" style={{ top: '-15px', left: '50%', transform: 'translateX(-50%) rotate(-2deg)', width: '130px' }}></div>
        
        <div className="p-8 text-center relative z-20">
            {/* TITLE */}
            <h3 className="text-3xl mb-4 font-shrikhand text-[#273A5D] drop-shadow-[2px_2px_0_#9CA22A]">
                {title}
            </h3>
            
            {/* CONTENT */}
            <div className="text-[#2D1714] mb-8 text-lg font-poppins font-bold leading-relaxed px-2">
                {children ? children : message}
            </div>
            
            {/* BUTTONS */}
            <div className="flex flex-col-reverse sm:flex-row justify-center gap-4 mt-2">
              <button 
                onClick={onCancel} 
                disabled={isProcessing}
                className="flex-1 py-3 btn-scrap btn-scrap-cancel disabled:opacity-50 disabled:cursor-not-allowed"
              >
                  {cancelText}
              </button>
              
              {showConfirmButton && (
                <button 
                  onClick={onConfirm} 
                  disabled={isProcessing}
                  className={`flex-1 py-3 btn-scrap disabled:opacity-50 disabled:cursor-not-allowed ${isDestructive ? 'btn-scrap-destructive' : 'btn-scrap-confirm'}`}
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