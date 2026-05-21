/* src/pages/SoftcopyPage.tsx */
import MainLayout from '../components/MainLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import { AiOutlineCloudUpload, AiFillCaretLeft } from 'react-icons/ai';
import { FaSun, FaCloud, FaCheckCircle } from 'react-icons/fa';
import { GiPalmTree, GiPartyPopper } from 'react-icons/gi';

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

// --- STYLES ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Titan+One&family=Patrick+Hand&display=swap');

  .font-title { font-family: 'Titan One', cursive; }
  .font-hand { font-family: 'Patrick Hand', cursive; }

  /* BACKGROUND ANIMATIONS (Shared) */
  @keyframes gradientBG {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  @keyframes floatCloud {
    0% { transform: translateX(-100px); opacity: 0.8; }
    50% { opacity: 1; }
    100% { transform: translateX(120vw); opacity: 0.8; }
  }
  @keyframes spinSun {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes sway {
    0%, 100% { transform: rotate(-1.5deg); }
    50% { transform: rotate(1.5deg); }
  }
  @keyframes floatBubble {
    0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
    50% { opacity: 0.8; }
    100% { transform: translateY(-20vh) scale(1.2); opacity: 0; }
  }

  /* CLASSES */
  .summer-bg {
    background: linear-gradient(to bottom, #4facfe 0%, #00f2fe 60%, #fff 100%);
    overflow: hidden;
    position: relative;
    width: 100%; height: 100%;
  }

  .cloud-deco {
    position: absolute;
    color: rgba(255, 255, 255, 0.9);
    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.05));
    z-index: 1; pointer-events: none;
  }

  .sun-deco {
    position: absolute;
    top: -60px; right: -60px;
    color: #FFD700;
    font-size: 180px;
    z-index: 0;
    animation: spinSun 25s linear infinite;
    filter: drop-shadow(0 0 20px rgba(255, 165, 0, 0.4));
    pointer-events: none;
  }

  .palm-tree {
    position: absolute;
    bottom: -10px;
    font-size: 150px;
    color: #2E8B57;
    z-index: 2;
    filter: drop-shadow(5px 5px 0 rgba(0,0,0,0.1));
    animation: sway 5s ease-in-out infinite alternate;
    pointer-events: none;
  }
  
  .wave-footer {
    position: absolute; bottom: 0; left: 0; width: 100%; height: 100px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.4' d='M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
    background-size: cover; z-index: 1; pointer-events: none;
  }

  .bubble {
    position: absolute;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.6);
    bottom: -50px;
    animation: floatBubble linear infinite;
    z-index: 2; pointer-events: none;
  }

  /* --- HANGING STRIP EFFECT --- */
  .rope-container {
    position: relative;
    height: 100%;
    display: flex;
    justify-content: center;
    /* Animation sway applies to the whole container hanging from top */
    transform-origin: top center;
    animation: sway 4s ease-in-out infinite;
  }

  .rope {
    position: absolute;
    top: -100px; 
    width: 4px;
    height: 150px;
    background: repeating-linear-gradient(45deg, #d4a373, #d4a373 5px, #faedcd 5px, #faedcd 10px);
    box-shadow: 2px 0 5px rgba(0,0,0,0.2);
    z-index: 10;
  }

  .wood-clip {
    position: absolute;
    top: 30px; /* Position at the end of the rope */
    width: 24px;
    height: 50px;
    background: #a98467;
    border-radius: 4px;
    box-shadow: 2px 4px 6px rgba(0,0,0,0.3);
    z-index: 20;
    border-bottom: 5px solid #6f4e37;
  }

  .photo-strip-visual {
    margin-top: 50px; /* Offset from top to hang below clip */
    background: white;
    padding: 10px;
    box-shadow: 0 20px 40px rgba(0,0,0,0.25);
    border-radius: 2px;
    /* Limit height for preview */
    max-height: 80vh; 
    width: auto;
    object-fit: contain;
  }

  /* --- BUTTONS --- */
  .btn-3d { transition: all 0.1s; position: relative; top: 0; }
  .btn-3d:active { top: 6px; box-shadow: 0 0 0 0 !important; }

  .btn-upload {
    background: #8B5CF6; color: white; border: 4px solid white; box-shadow: 0 6px 0 #5B21B6;
  }
  .btn-upload:hover { background: #7C3AED; }

  .btn-back {
    background: #F59E0B; color: white; border: 4px solid white; box-shadow: 0 6px 0 #B45309;
  }
  .btn-back:hover { background: #D97706; }
`;

const SoftcopyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { images: rawPhotos = [] } = (location.state || {}) as { images: string[] };
  const [generatedFrame, setGeneratedFrame] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bubbles, setBubbles] = useState<number[]>([]);

  useEffect(() => {
    setBubbles(Array.from({ length: 15 }).map((_, i) => i));
    if (rawPhotos.length < 4) {
        navigate('/camera');
    }
  }, [rawPhotos, navigate]);

  // Fungsi menggambar frame
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
              contactName: `FUNDAY_${uniqueCode}`,
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
      
      <div className="summer-bg w-full h-full flex flex-col items-center justify-center relative overflow-hidden">

        {/* --- DECORATIONS (Same as WelcomePage) --- */}
        <div className="sun-deco"><FaSun /></div>
        <div className="cloud-deco" style={{ top: '15%', fontSize: '4rem', animation: 'floatCloud 25s linear infinite' }}><FaCloud /></div>
        <div className="cloud-deco" style={{ top: '35%', fontSize: '3rem', animation: 'floatCloud 35s linear infinite', animationDelay: '-10s' }}><FaCloud /></div>
        
        {/* Palm Trees */}
        <div className="palm-tree" style={{ left: '-20px', transformOrigin: 'bottom center' }}><GiPalmTree /></div>
        <div className="palm-tree" style={{ right: '-20px', transformOrigin: 'bottom center', animationDelay: '1s' }}><GiPalmTree /></div>

        {/* Wave & Bubbles */}
        <div className="wave-footer"></div>
        {bubbles.map((i) => (
          <div key={i} className="bubble" style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 30 + 10}px`, height: `${Math.random() * 30 + 10}px`,
              animationDuration: `${Math.random() * 5 + 4}s`, animationDelay: `${Math.random() * 5}s`
          }} />
        ))}

        {/* --- MAIN CONTENT (Split Columns) --- */}
        <div className="flex flex-col lg:flex-row h-full w-full max-w-7xl items-center p-4 lg:p-8 gap-8 lg:gap-16 z-10 relative">
            
            {/* --- LEFT: HANGING PHOTO STRIP --- */}
            <div className="flex-1 h-full w-full flex flex-col items-center justify-start pt-10 relative order-2 lg:order-1">
                
                {/* Mobile Title */}
                <h2 className="lg:hidden font-title text-4xl text-white drop-shadow-md mb-4">
                    NICE SHOT!
                </h2>

                <div className="rope-container h-full">
                    {/* Visual Rope Elements */}
                    <div className="rope"></div>
                    <div className="wood-clip"></div>
                    
                    {/* The Generated Strip */}
                    <div className="relative">
                        <canvas ref={canvasRef} className="hidden" />
                        
                        {generatedFrame ? (
                            <img src={generatedFrame} alt="Result" className="photo-strip-visual" />
                        ) : (
                            <div className="photo-strip-visual w-[150px] h-[400px] bg-gray-100 flex items-center justify-center text-gray-400 font-bold animate-pulse">
                                Developing...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* --- RIGHT: CONTROL PANEL --- */}
            <div className="w-full lg:w-[450px] flex flex-col gap-6 order-1 lg:order-2 mb-10 lg:mb-0">
                
                <div className="bg-white/30 backdrop-blur-md border-2 border-white/60 p-6 lg:p-10 rounded-[40px] shadow-[0_15px_40px_rgba(0,0,0,0.1)] text-center relative overflow-hidden">
                    
                    {/* Glass Reflection Effect */}
                    <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/20 to-transparent pointer-events-none"></div>

                    <h2 className="hidden lg:block font-title text-5xl text-white drop-shadow-[3px_3px_0_#0ea5e9] mb-3 leading-tight">
                        SIAP CETAK?
                    </h2>
                    
                    <div className="inline-block bg-white/70 backdrop-blur-sm px-4 py-2 rounded-xl mb-8 shadow-sm">
                        <p className="font-hand text-xl text-slate-800 font-bold flex items-center justify-center gap-2">
                             <GiPartyPopper className="text-yellow-500 text-2xl"/>
                             <span>Abadikan Momenmu Sekarang!</span>
                        </p>
                    </div>

                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={handleUpload}
                            disabled={!generatedFrame || isSubmitting}
                            className="btn-3d btn-upload w-full py-4 rounded-2xl font-title text-2xl flex items-center justify-center gap-3"
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

                        <div className="flex items-center gap-3 my-2 opacity-60">
                            <div className="h-0.5 bg-slate-800 flex-1"></div>
                            <span className="font-bold text-slate-800 text-sm">ATAU</span>
                            <div className="h-0.5 bg-slate-800 flex-1"></div>
                        </div>

                        <button 
                            onClick={handleBackToMenu}
                            className="btn-3d btn-back w-full py-3 rounded-2xl font-title text-xl flex items-center justify-center gap-2"
                        >
                            <AiFillCaretLeft size={24}/> 
                            KEMBALI KE MENU
                        </button>
                    </div>

                    <p className="mt-6 text-slate-800/60 font-bold text-xs flex items-center justify-center gap-1">
                        <FaCheckCircle className="text-green-500" />
                        Foto otomatis tersimpan di Cloud
                    </p>
                </div>

            </div>

        </div>
      </div>
    </MainLayout>
  );
};

export default SoftcopyPage;