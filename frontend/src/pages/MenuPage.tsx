import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { useEffect, useState } from 'react';
import { usePhotos } from '../context/PhotoContext';
import { 
  AiFillCaretLeft, 
  AiFillCaretRight, 
  AiOutlineCloudUpload,
  AiOutlineDelete,
  AiFillWarning,
  AiFillPauseCircle,
  AiFillPlayCircle
} from 'react-icons/ai';
import { FaSun, FaCloud } from 'react-icons/fa';
import { GiPalmTree } from 'react-icons/gi';

// --- CSS STYLES ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Titan+One&family=Patrick+Hand&display=swap');

  /* FONTS */
  .font-title { font-family: 'Titan One', cursive; }
  .font-hand { font-family: 'Patrick Hand', cursive; }

  /* BACKGROUND ANIMATIONS */
  @keyframes floatCloud {
    0% { transform: translateX(-100px); opacity: 0.8; }
    50% { opacity: 1; }
    100% { transform: translateX(100vw); opacity: 0.8; }
  }
  @keyframes spinSun {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes sway {
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
  }
  @keyframes floatBubble {
    0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
    50% { opacity: 0.8; }
    100% { transform: translateY(-20vh) scale(1.2); opacity: 0; }
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
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

  .bubble {
    position: absolute;
    background: rgba(255, 255, 255, 0.4);
    border-radius: 50%;
    border: 1px solid rgba(255, 255, 255, 0.6);
    bottom: -50px;
    animation: floatBubble linear infinite;
    z-index: 2; pointer-events: none;
  }

  /* --- BIG POLAROID FRAME --- */
  .polaroid-container {
    position: relative;
    width: 100%;
    max-width: 650px; /* Ukuran Maksimal Lebih Besar */
    margin: 0 auto;
    z-index: 20;
  }

  .polaroid-frame {
    background: white;
    padding: 15px 15px 70px 15px;
    box-shadow: 0 25px 60px rgba(0,0,0,0.2);
    border-radius: 6px;
    transform: rotate(-1deg);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    animation: fadeIn 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
    position: relative;
    overflow: hidden;
  }
  
  .polaroid-frame:hover {
    transform: rotate(0deg) scale(1.01);
    box-shadow: 0 30px 70px rgba(0,0,0,0.25);
  }

  .photo-number {
    position: absolute; bottom: 20px; right: 25px;
    font-family: 'Titan One', cursive; color: #cbd5e1; font-size: 2.5rem; z-index: 0;
  }
  
  .handwriting {
    position: absolute; bottom: 25px; left: 25px;
    font-family: 'Patrick Hand', cursive; color: #475569; font-size: 1.8rem; z-index: 1;
  }

  /* --- FLOATING NAVIGATION BUTTONS --- */
  .nav-btn-float {
    position: absolute;
    top: 50%;
    transform: translateY(-70%); /* Sedikit ke atas agar center dengan foto */
    width: 60px; height: 60px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(8px);
    border: 2px solid rgba(255, 255, 255, 0.8);
    color: #0ea5e9;
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem;
    cursor: pointer;
    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 50;
    opacity: 0.8;
  }

  .nav-btn-float:hover {
    background: #fff;
    transform: translateY(-70%) scale(1.15);
    color: #0284c7;
    opacity: 1;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
  }

  .nav-prev { left: -30px; }
  .nav-next { right: -30px; }

  /* Mobile adjustment for buttons */
  @media (max-width: 768px) {
    .nav-btn-float { width: 50px; height: 50px; font-size: 1.5rem; background: rgba(255,255,255,0.9); }
    .nav-prev { left: -10px; }
    .nav-next { right: -10px; }
    .polaroid-container { padding: 0 20px; }
  }

  /* --- ACTION BUTTONS --- */
  .btn-elegant {
    padding: 16px 32px;
    border-radius: 50px;
    font-family: 'Titan One', cursive;
    font-size: 1.2rem;
    letter-spacing: 1px;
    transition: all 0.2s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    z-index: 30;
  }

  .btn-save {
    background: #0ea5e9; color: white; border: 2px solid #0ea5e9;
  }
  .btn-save:hover {
    background: #0284c7; border-color: #0284c7;
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(14, 165, 233, 0.4);
  }

  .btn-retake {
    background: white; color: #ef4444; border: 2px solid #fecaca;
  }
  .btn-retake:hover {
    border-color: #ef4444; background: #fef2f2;
    transform: translateY(-2px);
  }

  .wave-footer {
    position: absolute; bottom: 0; left: 0; width: 100%; height: 100px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.4' d='M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
    background-size: cover; z-index: 1; pointer-events: none;
  }
`;

const MenuPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPhotos } = usePhotos(); 

  const [sessionImages, setSessionImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRetakeModal, setShowRetakeModal] = useState(false); 
  const [bubbles, setBubbles] = useState<number[]>([]);
  
  // State untuk Slideshow
  const [isPaused, setIsPaused] = useState(false);

  // Ambil gambar dari state navigasi atau context
  const { images } = (location.state || {}) as { images: string[] };

  useEffect(() => {
    setBubbles(Array.from({ length: 15 }).map((_, i) => i));

    if (currentPhotos && currentPhotos.length > 0) {
        setSessionImages(currentPhotos);
    } else if (images && images.length > 0) {
        setSessionImages(images);
    } else {
        navigate('/');
    }
  }, [images, currentPhotos, navigate]);

  // --- LOGIC SLIDESHOW 2 DETIK ---
  useEffect(() => {
    if (sessionImages.length <= 1) return; // Tidak perlu slideshow jika cuma 1 foto

    // Interval jalan hanya jika TIDAK dipause
    const interval = setInterval(() => {
        if (!isPaused) {
            setCurrentIndex((prev) => (prev + 1) % sessionImages.length);
        }
    }, 2000); // 2000ms = 2 detik

    return () => clearInterval(interval);
  }, [isPaused, sessionImages.length]);

  const nextImage = () => { setCurrentIndex((prev) => (prev + 1) % sessionImages.length); };
  const prevImage = () => { setCurrentIndex((prev) => (prev - 1 + sessionImages.length) % sessionImages.length); };
  
  const confirmRetake = () => { navigate('/camera'); };
  const handleSave = () => { navigate('/softcopy', { state: { images: sessionImages } }); };

  if (sessionImages.length === 0) return null;

  return (
    <MainLayout>
      <style>{styles}</style>
      
      <div className="summer-bg w-full h-full flex flex-col items-center justify-center relative">

        {/* --- DECORATIONS --- */}
        <div className="sun-deco"><FaSun /></div>
        <div className="cloud-deco" style={{ top: '15%', fontSize: '4rem', animation: 'floatCloud 25s linear infinite' }}><FaCloud /></div>
        <div className="cloud-deco" style={{ top: '35%', fontSize: '3rem', animation: 'floatCloud 35s linear infinite', animationDelay: '-10s' }}><FaCloud /></div>
        <div className="palm-tree" style={{ left: '-20px', transformOrigin: 'bottom center' }}><GiPalmTree /></div>
        <div className="palm-tree" style={{ right: '-20px', transformOrigin: 'bottom center', animationDelay: '1s' }}><GiPalmTree /></div>
        <div className="wave-footer"></div>
        {bubbles.map((i) => (
          <div key={i} className="bubble" style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 30 + 10}px`, height: `${Math.random() * 30 + 10}px`,
              animationDuration: `${Math.random() * 5 + 4}s`, animationDelay: `${Math.random() * 5}s`
          }} />
        ))}

        {/* --- MAIN CONTENT --- */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pb-10">
            
            {/* Title */}
            <div className="text-center mb-6 animate-[fadeIn_0.5s_ease-out] z-30">
                <h2 className="font-title text-5xl md:text-6xl text-white drop-shadow-md tracking-wider">
                    YOUR MEMORIES
                </h2>
                <div className="flex items-center justify-center gap-2 mt-2">
                   {isPaused ? <AiFillPauseCircle className="text-white/80" /> : <AiFillPlayCircle className="text-white/80" />}
                   <p className="font-hand text-xl text-white/90 font-bold">
                       {isPaused ? "Paused" : "Auto Previewing..."}
                   </p>
                </div>
            </div>

            {/* --- BIGGER POLAROID SECTION --- */}
            <div 
                className="polaroid-container"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onTouchStart={() => setIsPaused(true)}
                onTouchEnd={() => setIsPaused(false)}
            >
                
                {/* Floating Navigation Buttons (Clean & Neat) */}
                <button onClick={prevImage} className="nav-btn-float nav-prev">
                    <AiFillCaretLeft />
                </button>
                <button onClick={nextImage} className="nav-btn-float nav-next">
                    <AiFillCaretRight />
                </button>

                {/* The Frame */}
                <div className="polaroid-frame w-full">
                    {/* Aspect Ratio 4:3 or Video format for BIG impact */}
                    <div className="w-full aspect-[4/3] bg-gray-100 overflow-hidden relative border border-gray-200 shadow-inner rounded-sm">
                        <img 
                            src={sessionImages[currentIndex]} 
                            alt={`Snap ${currentIndex + 1}`} 
                            className="w-full h-full object-cover transition-opacity duration-500" // Smooth transition
                        />
                    </div>
                    
                    {/* Details */}
                    <span className="handwriting">FUNDAY 2025</span>
                    <span className="photo-number">#{currentIndex + 1}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-5 w-full justify-center items-center animate-[fadeIn_1s_ease-out] mt-8">
                <button onClick={handleSave} className="btn-elegant btn-save min-w-[280px]">
                    <AiOutlineCloudUpload size={28} />
                    SAVE & PRINT
                </button>

                <button onClick={() => setShowRetakeModal(true)} className="btn-elegant btn-retake min-w-[200px]">
                    <AiOutlineDelete size={24} />
                    RETAKE
                </button>
            </div>

        </div>

      </div>

      {/* --- ELEGANT MODAL WARNING --- */}
      {showRetakeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-[fadeIn_0.2s]">
            <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center shadow-2xl relative overflow-hidden">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500 text-4xl">
                    <AiFillWarning />
                </div>
                <h3 className="font-title text-2xl text-slate-800 mb-2">Retake Session?</h3>
                <p className="font-sans text-slate-500 mb-8 leading-relaxed">
                    These photos will be deleted permanently. Are you sure?
                </p>
                <div className="flex flex-col gap-3">
                    <button onClick={confirmRetake} className="w-full py-3 rounded-full font-bold text-white bg-red-500 hover:bg-red-600 transition-colors">
                        Yes, Delete & Retake
                    </button>
                    <button onClick={() => setShowRetakeModal(false)} className="w-full py-3 rounded-full font-bold text-slate-500 bg-gray-100 hover:bg-gray-200 transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        </div>
      )}

    </MainLayout>
  );
};

export default MenuPage;