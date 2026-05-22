/* src/pages/SoftcopyPage.tsx */
import MainLayout from '../components/MainLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { AiOutlineCloudUpload, AiFillCaretLeft } from 'react-icons/ai';
import { FaCheckCircle } from 'react-icons/fa';

// --- CONFIGURATION ---
const DPI_SCALE = 118; // approx 300 DPI pixels per cm
const CANVAS_W = 10.5 * DPI_SCALE;
const CANVAS_H = 29.7 * DPI_SCALE;

const PHOTO_W = 9.23 * DPI_SCALE;
const PHOTO_H = 5.56 * DPI_SCALE;
const PHOTO_X = 0.64 * DPI_SCALE;

const PHOTO_Y_POS = [
    1.05 * DPI_SCALE,
    6.96 * DPI_SCALE,
    12.86 * DPI_SCALE,
    18.77 * DPI_SCALE
];

// --- STYLES (SCRAPBOOK THEME) ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Shrikhand&family=Poppins:wght@400;600;800&family=Caveat:wght@700&display=swap');

  .font-shrikhand { font-family: 'Shrikhand', serif; }
  .font-poppins { font-family: 'Poppins', sans-serif; }
  .font-caveat { font-family: 'Caveat', cursive; }

  /* Washi Tapes */
  .washi-tape {
    position: absolute;
    height: 35px;
    background-color: rgba(255,255,255,0.4);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    backdrop-filter: blur(2px);
    z-index: 10;
  }
  .tape-blue { background-color: rgba(120, 162, 210, 0.8); }   /* #78A2D2 */
  .tape-olive { background-color: rgba(156, 162, 42, 0.8); }    /* #9CA22A */
  .tape-yellow { background-color: rgba(254, 255, 175, 0.9); }  /* #FEFFAF */

  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  /* --- PHOTO STRIP SCRAPBOOK --- */
  .photo-strip-container {
    position: relative;
    background: #FFFAEE; /* Cream Paper */
    padding: 10px;
    border: 4px solid #2D1714;
    box-shadow: 12px 12px 0 #78A2D2;
    transform: rotate(-2deg);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    z-index: 20;
    animation: fadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  .photo-strip-container:hover {
    transform: rotate(0deg) scale(1.02);
    box-shadow: 15px 15px 0 #2D1714;
  }

  .photo-strip-visual {
    background: white;
    max-height: 75vh; 
    width: auto;
    object-fit: contain;
    border: 2px solid #2D1714;
  }

  /* --- CONTROL PANEL SCRAPBOOK --- */
  .panel-scrapbook {
    background: #FFFAEE;
    border: 4px solid #2D1714;
    padding: 30px;
    box-shadow: 15px 15px 0 #9CA22A;
    position: relative;
    transform: rotate(1deg);
    z-index: 20;
    animation: fadeIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  /* --- BUTTONS --- */
  .btn-scrapbook {
    border: 4px solid #2D1714;
    font-family: 'Shrikhand', serif;
    transition: all 0.1s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    cursor: pointer;
    z-index: 30;
    text-transform: uppercase;
  }

  .btn-upload {
    background: #273A5D; 
    color: #FEFFAF; 
    box-shadow: 8px 8px 0 #78A2D2;
  }
  .btn-upload:hover:not(:disabled) {
    transform: translate(-2px, -2px);
    box-shadow: 10px 10px 0 #78A2D2;
  }
  .btn-upload:active:not(:disabled) {
    transform: translate(4px, 4px);
    box-shadow: 2px 2px 0 #78A2D2;
  }
  .btn-upload:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .btn-back {
    background: #FEFFAF; 
    color: #2D1714; 
    box-shadow: 6px 6px 0 #2D1714;
  }
  .btn-back:hover {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0 #2D1714;
  }
  .btn-back:active {
    transform: translate(4px, 4px);
    box-shadow: 2px 2px 0 #2D1714;
  }

  /* Coretan Background */
  .scribble {
    font-family: 'Caveat', cursive;
    color: #2D1714;
    position: absolute;
    z-index: 0;
  }
`;

const SoftcopyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { images: rawPhotos = [] } = (location.state || {}) as { images: string[] };
  const [generatedFrame, setGeneratedFrame] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (rawPhotos.length < 4) {
        navigate('/camera');
    }
  }, [rawPhotos, navigate]);

  // Fungsi menggambar frame (Logika Canvas TIDAK DIUBAH)
  useEffect(() => {
    const drawFrame = async () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = CANVAS_W;
        canvas.height = CANVAS_H;

        // Background Putih
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

        // Load & Draw 4 Foto
        for (let i = 0; i < 4; i++) {
            if (rawPhotos[i]) {
                const img = new Image();
                img.src = rawPhotos[i];
                await new Promise(r => { img.onload = r; });

                const imgRatio = img.width / img.height;
                const boxRatio = PHOTO_W / PHOTO_H;
                let sx, sy, sWidth, sHeight;

                if (imgRatio > boxRatio) {
                    sHeight = img.height;
                    sWidth = img.height * boxRatio;
                    sx = (img.width - sWidth) / 2;
                    sy = 0;
                } else {
                    sWidth = img.width;
                    sHeight = img.width / boxRatio;
                    sx = 0;
                    sy = (img.height - sHeight) / 2;
                }
                ctx.drawImage(img, sx, sy, sWidth, sHeight, PHOTO_X, PHOTO_Y_POS[i], PHOTO_W, PHOTO_H);
            }
        }

        // Overlay Frame
        try {
            const frameImg = new Image();
            frameImg.src = '/frames/frameA.png'; 
            await new Promise((resolve) => { 
                frameImg.onload = resolve; 
                frameImg.onerror = () => { console.warn("Frame overlay missing"); resolve(null); };
            });
            ctx.drawImage(frameImg, 0, 0, CANVAS_W, CANVAS_H);
        } catch (e) { console.log(e); }

        setGeneratedFrame(canvas.toDataURL('image/jpeg', 0.95));
    };

    if (rawPhotos.length > 0) drawFrame();
  }, [rawPhotos]);

  const handleUpload = () => {
      if (!generatedFrame) return;
      setIsSubmitting(true);
      const uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      navigate('/loading', {
          state: {
              contactName: `ERANIVESSARY_${uniqueCode}`,
              rawPhotos: rawPhotos,
              savedFrames: [generatedFrame]
          }
      });
  };

  const handleBackToMenu = () => {
      navigate('/menu', { state: { images: rawPhotos } });
  };

  return (
    <MainLayout>
      <style>{styles}</style>
      
      {/* Container utama transparan agar pola grid MainLayout terlihat */}
      <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">

        {/* --- DEKORASI LUAR (Coretan Buku Jurnal) --- */}
        <div className="scribble text-5xl" style={{ top: '8%', left: '8%', transform: 'rotate(-10deg)' }}>Print me!</div>
        <div className="scribble text-6xl" style={{ bottom: '12%', right: '10%', transform: 'rotate(15deg)' }}>Wow!</div>

        {/* --- MAIN CONTENT (Split Columns) --- */}
        <div className="flex flex-col lg:flex-row h-full w-full max-w-6xl items-center p-4 lg:p-8 gap-8 lg:gap-16 z-10 relative">
            
            {/* --- LEFT: HANGING PHOTO STRIP (SCRAPBOOK TAPE) --- */}
            <div className="flex-1 h-full w-full flex flex-col items-center justify-center relative order-2 lg:order-1 pt-4 lg:pt-0">
                
                {/* Mobile Title */}
                <h2 className="lg:hidden font-shrikhand text-4xl text-[#273A5D] drop-shadow-[2px_2px_0_#FEFFAF] mb-6">
                    NICE SHOT!
                </h2>

                <div className="photo-strip-container">
                    {/* Isolasi menempelkan foto ke dinding */}
                    <div className="washi-tape tape-olive" style={{ top: '-15px', left: '25%', width: '50%', transform: 'rotate(2deg)' }}></div>
                    
                    {/* The Generated Strip */}
                    <div className="relative">
                        <canvas ref={canvasRef} className="hidden" />
                        
                        {generatedFrame ? (
                            <img src={generatedFrame} alt="Result" className="photo-strip-visual filter contrast-110" />
                        ) : (
                            <div className="photo-strip-visual w-[150px] h-[400px] bg-[#FFFAEE] flex items-center justify-center text-[#2D1714] font-caveat text-3xl font-bold animate-pulse">
                                Loading...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- RIGHT: CONTROL PANEL --- */}
            <div className="w-full lg:w-[450px] flex flex-col gap-6 order-1 lg:order-2 mb-4 lg:mb-0">
                
                <div className="panel-scrapbook text-center">
                    
                    {/* Washi Tape Hiasan Pojok */}
                    <div className="washi-tape tape-blue" style={{ top: '-15px', right: '-20px', width: '100px', transform: 'rotate(45deg)' }}></div>

                    <h2 className="hidden lg:block font-shrikhand text-5xl text-[#273A5D] drop-shadow-[4px_4px_0_#9CA22A] mb-4 leading-tight">
                        SIAP CETAK?
                    </h2>
                    
                    <div className="inline-block bg-[#FEFFAF] border-2 border-[#2D1714] px-4 py-2 mb-8 shadow-[4px_4px_0_#2D1714] transform rotate(-2deg)">
                        <p className="font-poppins text-sm text-[#2D1714] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                             Abadikan Momenmu!
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={handleUpload}
                            disabled={!generatedFrame || isSubmitting}
                            className="btn-scrapbook btn-upload w-full py-4 text-2xl"
                        >
                            {isSubmitting ? (
                                <span className="animate-pulse">UPLOADING...</span>
                            ) : (
                                <>
                                    <AiOutlineCloudUpload size={32}/> 
                                    SIMPAN & PRINT
                                </>
                            )}
                        </button>

                        <div className="flex items-center gap-3 my-2 opacity-80">
                            <div className="h-0.5 bg-[#2D1714] flex-1"></div>
                            <span className="font-poppins font-bold text-[#2D1714] text-xs uppercase tracking-widest">ATAU</span>
                            <div className="h-0.5 bg-[#2D1714] flex-1"></div>
                        </div>

                        <button 
                            onClick={handleBackToMenu}
                            className="btn-scrapbook btn-back w-full py-3 text-xl"
                        >
                            <AiFillCaretLeft size={24}/> 
                            KEMBALI KE MENU
                        </button>
                    </div>

                    <p className="mt-6 text-[#2D1714] font-poppins font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 opacity-80">
                        <FaCheckCircle className="text-[#9CA22A] text-base" />
                        Foto otomatis tersimpan
                    </p>
                </div>

            </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default SoftcopyPage;