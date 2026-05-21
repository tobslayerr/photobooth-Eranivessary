import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { usePhotos } from '../context/PhotoContext';
import { 
  AiFillCamera,
  AiFillThunderbolt,
  AiFillCloud
} from 'react-icons/ai';
import { FaBatteryFull, FaUmbrellaBeach, FaSun } from 'react-icons/fa';
import { GiPalmTree } from 'react-icons/gi';

// --- STYLES ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Titan+One&family=Patrick+Hand&display=swap');

  .font-title { font-family: 'Titan One', cursive; }
  .font-hand { font-family: 'Patrick Hand', cursive; }

  /* --- 1. BACKGROUND ANIMATIONS (From WelcomePage) --- */
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

  /* CLASSES BACKGROUND */
  .welcome-bg {
    background: linear-gradient(to bottom, #4facfe 0%, #00f2fe 60%, #fff 100%);
    overflow: hidden;
    position: relative;
    width: 100%; height: 100%;
  }

  .cloud-deco {
    position: absolute;
    color: rgba(255, 255, 255, 0.8);
    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));
    z-index: 1;
    pointer-events: none;
  }

  .sun-deco {
    position: absolute;
    top: -60px;
    right: -60px;
    color: #FFD700;
    font-size: 180px;
    z-index: 0;
    animation: spinSun 20s linear infinite;
    filter: drop-shadow(0 0 20px rgba(255, 165, 0, 0.6));
    pointer-events: none;
  }

  .palm-tree {
    position: absolute;
    bottom: -10px;
    font-size: 150px;
    color: #2E8B57;
    z-index: 2;
    filter: drop-shadow(5px 5px 0 rgba(0,0,0,0.2));
    animation: sway 4s ease-in-out infinite alternate;
    pointer-events: none;
  }

  .wave-footer {
    position: absolute;
    bottom: 0; left: 0; width: 100%; height: 100px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.4' d='M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
    background-size: cover;
    z-index: 1;
    pointer-events: none;
  }

  .bubble {
    position: absolute;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.5);
    bottom: -50px;
    animation: floatBubble linear infinite;
    z-index: 2;
    pointer-events: none;
  }

  /* --- 2. PRINTING ANIMATION (MAGIC RISE) --- */
  @keyframes riseFromBottom {
    0% { transform: translateY(120vh) scale(0.8) rotate(-5deg); opacity: 0; }
    60% { transform: translateY(-20px) scale(1.05) rotate(2deg); opacity: 1; }
    80% { transform: translateY(10px) scale(0.98) rotate(-1deg); }
    100% { transform: translateY(0) scale(1) rotate(0deg); opacity: 1; }
  }

  @keyframes shimmer {
    0% { transform: translateX(-150%) skewX(-20deg); }
    100% { transform: translateX(150%) skewX(-20deg); }
  }

  .print-overlay-container {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(8px);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }

  .magic-strip-container {
    position: relative;
    padding: 15px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    box-shadow: 0 0 50px rgba(255, 215, 0, 0.3);
    animation: riseFromBottom 1.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  }

  .final-strip {
    width: 320px;
    background: #FFF;
    box-shadow: 0 10px 40px rgba(0,0,0,0.5);
    display: flex; flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .final-strip::after {
    content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%);
    animation: shimmer 1.5s infinite;
    z-index: 60; pointer-events: none;
  }

  .strip-content {
    display: flex; flex-direction: column;
    width: 100%; padding: 0; margin: 0;
  }
  .strip-photo-slot {
    width: 100%; aspect-ratio: 16/9;
    background: #000;
  }
  .strip-photo-slot img {
    width: 100%; height: 100%; object-fit: contain; display: block;
  }
  .strip-frame-overlay {
    position: absolute; top: 0; left: 0; width: 100%; height: 100%;
    background-image: url('/frames/frameA.png');
    background-size: 100% 100%;
    z-index: 20; pointer-events: none;
  }

  /* --- 3. UI COMPONENTS --- */
  
  /* Sidebar Kayu */
  .wood-panel {
    background: #DEB887;
    background-image: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.05) 10px, rgba(0,0,0,0.05) 20px);
    border-left: 6px solid #8B4513;
    box-shadow: -5px 0 15px rgba(0,0,0,0.3);
  }

  .mini-polaroid {
    background: #fff; padding: 5px 5px 15px 5px;
    box-shadow: 2px 3px 5px rgba(0,0,0,0.2);
    transform: rotate(-3deg); transition: 0.3s;
    animation: popInSide 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  .mini-polaroid:nth-child(even) { transform: rotate(2deg); }
  @keyframes popInSide { from { transform: translateX(50px) scale(0); } to { transform: translateX(0) scale(1); } }

  .cam-border {
    border: 8px solid #fff; border-radius: 12px;
    box-shadow: 0 0 0 4px #FFD700, 0 20px 50px rgba(0,0,0,0.3);
    background: #000; overflow: hidden; position: relative;
  }

  .count-big {
    font-size: 10rem; color: #FFF; -webkit-text-stroke: 3px #FF4500;
    font-family: 'Titan One', cursive;
    animation: pulseBig 0.8s infinite alternate;
  }
  @keyframes pulseBig { from { transform: scale(1); } to { transform: scale(1.1); } }
`;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const CameraPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const { addPhoto, clearPhotos } = usePhotos();

  // Settings
  const [timerDuration, setTimerDuration] = useState<number>(3); 
  const totalShots = 4;

  // States
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);
  
  // Bubbles (Background Elements)
  const [bubbles, setBubbles] = useState<number[]>([]);

  // 1. Init
  useEffect(() => {
    // Setup Kamera
    let stream: MediaStream | null = null;
    const initCamera = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'user', width: { ideal: 1920 }, height: { ideal: 1080 } },
            });
            if (videoRef.current) videoRef.current.srcObject = stream;
        } catch (err) { console.error(err); }
    };
    initCamera();

    // Setup Bubbles (Same as WelcomePage)
    setBubbles(Array.from({ length: 20 }).map((_, i) => i));

    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, []);

  // 2. Capture Logic
  const captureFrame = () => {
      if (videoRef.current && canvasRef.current) {
          const cvs = canvasRef.current;
          const ctx = cvs.getContext('2d');
          if (ctx) {
              cvs.width = 1920; cvs.height = 1080;
              ctx.translate(cvs.width, 0); ctx.scale(-1, 1);
              ctx.drawImage(videoRef.current, 0, 0, cvs.width, cvs.height);
              return cvs.toDataURL('image/jpeg', 1.0);
          }
      }
      return null;
  };

  // 3. Workflow Sesi
  const handleStartSession = async () => {
    if (isSessionActive || isPrinting) return;

    setIsSessionActive(true);
    clearPhotos();
    setCapturedPhotos([]); 
    
    const sessionPhotos: string[] = [];

    for (let i = 1; i <= totalShots; i++) {
        // Countdown
        for (let c = timerDuration; c > 0; c--) {
            setCountdown(c); await sleep(1000);
        }
        
        // Action
        setCountdown(0); 
        setFlash(true);
        const photo = captureFrame();
        
        if (photo) {
            sessionPhotos.push(photo);
            addPhoto(photo);
            setCapturedPhotos(prev => [...prev, photo]);
        }

        await sleep(200); 
        setFlash(false); 
        setCountdown(null);
        if (i < totalShots) await sleep(1500);
    }
    
    // Selesai Foto
    setIsSessionActive(false);
    await sleep(500);
    
    // Trigger Animasi "Printing"
    setIsPrinting(true);
    
    // Tunggu animasi (4.5s) lalu pindah
    await sleep(4500); 
    navigate('/menu', { state: { images: sessionPhotos } });
  };

  return (
    <MainLayout isFullScreen={true}>
      <style>{styles}</style>
      
      {/* FLASH SCREEN */}
      <div className={`fixed inset-0 bg-white z-[90] pointer-events-none transition-opacity duration-150 ${flash ? 'opacity-100' : 'opacity-0'}`} />

      {/* --- PRINTING ANIMATION (MAGIC RISE) --- */}
      {isPrinting && (
          <div className="print-overlay-container">
              
              <div className="text-white font-title text-5xl mb-8 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] animate-bounce">
                  ✨ DEVELOPING PHOTOS ✨
              </div>

              {/* Wrapper untuk Efek Glow Emas */}
              <div className="magic-strip-container">
                  <div className="final-strip">
                      
                      {/* FRAME OVERLAY (PNG) */}
                      <div className="strip-frame-overlay"></div>

                      {/* PHOTOS (Stacked Vertically) */}
                      <div className="strip-content">
                          {[...Array(4)].map((_, i) => (
                              <div key={i} className="strip-photo-slot">
                                  {capturedPhotos[i] ? (
                                      <img src={capturedPhotos[i]} alt="print" />
                                  ) : (
                                      <div className="w-full h-full bg-black" />
                                  )}
                              </div>
                          ))}
                          {/* Footer Putih Kertas */}
                          <div className="h-16 w-full bg-white flex items-center justify-center">
                             <span className="font-hand text-gray-400 font-bold">SUMMER '25</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- MAIN UI (CAMERA PAGE) --- */}
      {/* NOTE: Menggunakan class 'welcome-bg' yang sama dengan WelcomePage */}
      <div className="welcome-bg w-full h-full flex overflow-hidden relative">
        
        {/* --- BACKGROUND DECORATIONS (Copied from WelcomePage) --- */}
        
        {/* Matahari */}
        <div className="sun-deco" style={{ right: '5%', top: '5%' }}><FaSun /></div>

        {/* Awan */}
        <div className="cloud-deco" style={{ top: '15%', fontSize: '4rem', animation: 'floatCloud 25s linear infinite' }}><AiFillCloud /></div>
        <div className="cloud-deco" style={{ top: '35%', fontSize: '3rem', animation: 'floatCloud 35s linear infinite', animationDelay: '-10s' }}><AiFillCloud /></div>
        
        {/* Pohon Kelapa (Hanya kiri agar tidak menutupi sidebar) */}
        <div className="palm-tree" style={{ left: '-20px', bottom: '-20px' }}><GiPalmTree /></div>
        <div className="palm-tree" style={{ right: '-50px', bottom: '-40px', opacity: 0.5, zIndex: 0 }}><GiPalmTree /></div>

        {/* Waves Footer */}
        <div className="wave-footer"></div>
        
        {/* Bubbles */}
        {bubbles.map((i) => (
          <div 
            key={i} 
            className="bubble" 
            style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 30 + 10}px`,
                height: `${Math.random() * 30 + 10}px`,
                animationDuration: `${Math.random() * 5 + 4}s`,
                animationDelay: `${Math.random() * 5}s`
            }} 
          />
        ))}


        {/* --- FOREGROUND CONTENT (Original Functionality) --- */}
        <div className="relative z-20 flex w-full h-full">

            {/* --- LEFT: CAMERA AREA (75%) --- */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-4">
                
                {/* Top Badge */}
                <div className="absolute top-6 bg-white/30 backdrop-blur-md px-5 py-2 rounded-full border border-white/50 text-white font-title flex gap-4 shadow-lg">
                    <span className="flex items-center gap-2"><FaUmbrellaBeach className="text-orange-300" /> SUMMER MODE</span>
                    <span className="flex items-center gap-2"><FaBatteryFull className="text-green-300" /> 100%</span>
                </div>

                {/* Viewfinder */}
                <div className="relative w-full max-w-4xl aspect-video cam-border">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                      <canvas ref={canvasRef} className="hidden" />
                      
                      {/* Countdown Overlay */}
                      {countdown !== null && (
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-50 backdrop-blur-sm">
                              <span className="count-big">
                                  {countdown === 0 ? 'SNAP!' : countdown}
                              </span>
                          </div>
                      )}
                </div>

                {/* Bottom Controls */}
                {!isSessionActive && (
                    <div className="absolute bottom-10 flex items-center gap-8">
                        
                        {/* Timer */}
                        <div className="bg-white/20 backdrop-blur px-2 py-2 rounded-full flex gap-2 border border-white/30">
                            {[3, 5, 10].map(t => (
                                <button 
                                    key={t} onClick={() => setTimerDuration(t)}
                                    className={`w-12 h-12 rounded-full font-title text-lg transition-all ${timerDuration === t ? 'bg-yellow-400 text-orange-900 scale-110 shadow-md' : 'text-black hover:bg-white/20'}`}
                                >
                                    {t}s
                                </button>
                            ))}
                        </div>

                        {/* Shutter Button */}
                        <button 
                            onClick={handleStartSession}
                            className="w-28 h-28 rounded-full bg-white border-8 border-red-500 shadow-[0_10px_30px_rgba(0,0,0,0.3)] flex items-center justify-center active:scale-95 transition-transform group"
                        >
                              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                  <AiFillCamera className="text-3xl text-white" />
                              </div>
                        </button>

                        {/* Flash Toggle */}
                        <div className="w-14 h-14 rounded-full bg-orange-500 border-4 border-white flex items-center justify-center shadow-lg text-yellow-200">
                            <AiFillThunderbolt className="text-2xl" />
                        </div>

                    </div>
                )}
            </div>


            {/* --- RIGHT: SIDEBAR (25%) --- */}
            <div className="w-28 md:w-72 h-full wood-panel flex flex-col p-4 gap-4 overflow-y-auto shadow-2xl">
                <h3 className="text-center font-title text-white text-xl drop-shadow-md border-b-2 border-white/20 pb-2">
                    YOUR PICS
                </h3>
                
                {/* Preview Slots */}
                {[...Array(totalShots)].map((_, i) => (
                    <div key={i} className="mini-polaroid">
                        <div className="w-full aspect-video bg-gray-200 border border-gray-300 overflow-hidden bg-black/10">
                            {capturedPhotos[i] ? (
                                <img src={capturedPhotos[i]} alt="shot" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">Waiting...</div>
                            )}
                        </div>
                        <div className="text-center font-hand text-gray-500 text-xs mt-1">
                            Moment #{i+1}
                        </div>
                    </div>
                ))}

                <div className="mt-auto text-center font-hand text-white/70 text-sm">
                    {totalShots - capturedPhotos.length} shots left
                </div>
            </div>

            {/* Back Button */}
            {!isSessionActive && (
                <button onClick={() => navigate('/')} className="absolute top-6 left-6 z-50 bg-white/20 hover:bg-white/40 px-5 py-2 rounded-full text-white font-title border border-white transition-all">
                    ← BACK
                </button>
            )}

        </div>

      </div>
    </MainLayout>
  );
};

export default CameraPage;