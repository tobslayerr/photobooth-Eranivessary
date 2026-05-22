/* src/pages/CameraPage.tsx */
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { usePhotos } from '../context/PhotoContext';
import { AiFillCamera } from 'react-icons/ai';
import { FaCircle } from 'react-icons/fa';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Shrikhand&family=Poppins:wght@400;600;800&family=Caveat:wght@700&display=swap');

  .font-shrikhand { font-family: 'Shrikhand', serif; }
  .font-poppins { font-family: 'Poppins', sans-serif; }
  .font-caveat { font-family: 'Caveat', cursive; }

  /* Washi Tapes */
  .washi-tape { position: absolute; height: 35px; backdrop-filter: blur(2px); z-index: 40; box-shadow: 0 2px 5px rgba(0,0,0,0.15); border: 1px solid rgba(0,0,0,0.05); }
  .tape-blue { background-color: rgba(120, 162, 210, 0.85); }
  .tape-olive { background-color: rgba(156, 162, 42, 0.85); }
  .tape-yellow { background-color: rgba(254, 255, 175, 0.95); }
  .tape-pink { background-color: rgba(255, 182, 193, 0.85); }

  /* Sidebar Kertas Biru Dotted */
  .scrapbook-panel {
    background-color: #78A2D2;
    background-image: radial-gradient(rgba(255,255,255,0.4) 2px, transparent 2px);
    background-size: 20px 20px;
    border-left: 8px dashed #2D1714;
    box-shadow: -15px 0 30px rgba(0,0,0,0.2);
    position: relative;
    z-index: 30;
  }

  /* Mini Polaroid / Photo Preview */
  .mini-polaroid {
    background: #FFF; 
    padding: 12px 12px 35px 12px;
    border: 3px solid #2D1714;
    box-shadow: 6px 6px 0px rgba(45, 23, 20, 0.3);
    transform: rotate(-3deg); 
    transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
  }
  .mini-polaroid:nth-child(even) { transform: rotate(4deg); box-shadow: 6px 6px 0px #FEFFAF; }
  .mini-polaroid:hover { transform: rotate(0deg) scale(1.05); box-shadow: 8px 8px 0px #2D1714; z-index: 20;}

  /* Flash Animation untuk foto baru masuk */
  @keyframes popIn {
    0% { transform: scale(0.6) rotate(-15deg); opacity: 0; }
    70% { transform: scale(1.1) rotate(var(--rot)); opacity: 1; }
    100% { transform: scale(1) rotate(var(--rot)); opacity: 1; }
  }
  .pop-in { animation: popIn 0.5s forwards; }

  /* Viewfinder Frame (Retro Scrapbook BIG) */
  .cam-border {
    border: 24px solid #FFF;
    border-bottom-width: 80px; /* Ruang lebar di bawah untuk logo */
    border-radius: 4px;
    box-shadow: 16px 16px 0px #78A2D2, 20px 20px 0px #2D1714;
    outline: 6px solid #2D1714;
    background: #000; 
    position: relative;
    transform: rotate(-1deg);
    transition: all 0.3s;
  }

  /* Grid Kamera 3x3 */
  .camera-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.3) 2px, transparent 2px),
      linear-gradient(to bottom, rgba(255,255,255,0.3) 2px, transparent 2px);
    background-size: 33.33% 33.33%;
    z-index: 10;
  }

  /* Crosshair di tengah */
  .camera-crosshair {
    position: absolute;
    top: 50%; left: 50%;
    transform: translate(-50%, -50%);
    width: 30px; height: 30px;
    pointer-events: none;
    z-index: 10;
  }
  .camera-crosshair::before, .camera-crosshair::after {
    content: ''; position: absolute; background: rgba(255,255,255,0.9);
  }
  .camera-crosshair::before { top: 50%; left: 0; right: 0; height: 2px; transform: translateY(-50%); }
  .camera-crosshair::after { left: 50%; top: 0; bottom: 0; width: 2px; transform: translateX(-50%); }

  /* REC Indicator blink */
  @keyframes blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
  .rec-indicator {
    position: absolute; top: 15px; left: 20px;
    display: flex; align-items: center; gap: 8px;
    color: #FFF; font-family: 'Poppins', sans-serif; font-weight: bold;
    font-size: 1.2rem; z-index: 20; text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
  }
  .rec-dot {
    color: #FF5757; font-size: 1rem;
    animation: blink 1s infinite;
  }

  /* Animasi Hitungan Mundur (Bouncy Pop) */
  .count-big {
    font-size: 14rem; 
    color: #FEFFAF; 
    -webkit-text-stroke: 8px #2D1714;
    text-shadow: 12px 12px 0px #78A2D2;
    font-family: 'Shrikhand', serif;
    animation: popCount 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  }
  @keyframes popCount {
    0% { transform: scale(0.3); opacity: 0; }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); opacity: 1; }
  }

  /* Button Controls */
  .control-panel {
    background: #FFF;
    border: 6px solid #2D1714;
    box-shadow: 10px 10px 0px #9CA22A;
    border-radius: 60px;
    padding: 15px 35px;
    transform: rotate(1deg);
    display: flex;
    align-items: center;
    gap: 30px;
    z-index: 40;
    margin-top: -25px;
  }

  /* Shutter Button Baru yang Satisfying */
  .btn-shutter {
    width: 90px; height: 90px;
    background: #FF5757;
    border: 6px solid #2D1714;
    border-radius: 50%;
    box-shadow: inset 0 -6px 0 rgba(0,0,0,0.25), inset 0 4px 0 rgba(255,255,255,0.4), 6px 6px 0 #2D1714;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all 0.1s;
    margin: 0 15px;
  }
  .btn-shutter:active:not(:disabled) {
    transform: translateY(6px);
    box-shadow: inset 0 -2px 0 rgba(0,0,0,0.25), inset 0 2px 0 rgba(255,255,255,0.4), 0px 0px 0 #2D1714;
  }
  .btn-shutter:disabled { opacity: 0.5; cursor: not-allowed; }

  .btn-retro {
    background: #FEFFAF;
    border: 4px solid #2D1714;
    box-shadow: 4px 4px 0px #2D1714;
    transition: all 0.1s;
    cursor: pointer;
    font-family: 'Shrikhand', serif;
  }
  .btn-retro:active { transform: translate(4px, 4px); box-shadow: 0px 0px 0px #2D1714; }
  .btn-retro:hover:not(:disabled) { background: #FFF; }

  .btn-back-scrap {
    background: #FEFFAF;
    color: #2D1714;
    font-family: 'Poppins', sans-serif;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    border: 4px solid #2D1714;
    box-shadow: 6px 6px 0px #2D1714;
    transition: all 0.1s;
  }
  .btn-back-scrap:hover {
    transform: translate(-2px, -2px) rotate(-2deg);
    box-shadow: 8px 8px 0px #2D1714;
  }
  .btn-back-scrap:active {
    transform: translate(6px, 6px);
    box-shadow: 0px 0px 0px #2D1714;
  }

  /* Coretan */
  .scribble {
    font-family: 'Caveat', cursive;
    color: #2D1714;
    position: absolute;
    z-index: 0;
  }
`;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const CameraPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const { addPhoto, clearPhotos } = usePhotos();

  const [timerDuration, setTimerDuration] = useState<number>(3); 
  const totalShots = 3; 

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);

  // Toggle Camera
  useEffect(() => {
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
    return () => { if (stream) stream.getTracks().forEach(t => t.stop()); };
  }, []);

  const captureFrame = () => {
      if (videoRef.current && canvasRef.current) {
          const cvs = canvasRef.current;
          const ctx = cvs.getContext('2d');
          if (ctx) {
              cvs.width = 1920; cvs.height = 1080;
              ctx.translate(cvs.width, 0); ctx.scale(-1, 1); // Mirror 
              ctx.drawImage(videoRef.current, 0, 0, cvs.width, cvs.height);
              return cvs.toDataURL('image/jpeg', 1.0);
          }
      }
      return null;
  };

  const handleStartSession = async () => {
    if (isSessionActive) return;
    setIsSessionActive(true);
    clearPhotos();
    setCapturedPhotos([]); 
    
    const sessionPhotos: string[] = [];
    for (let i = 1; i <= totalShots; i++) {
        // Hitung Mundur
        for (let c = timerDuration; c > 0; c--) {
            setCountdown(c); await sleep(1000);
        }
        setCountdown(0); // SNAP
        setFlash(true);
        const photo = captureFrame();
        
        if (photo) {
            sessionPhotos.push(photo);
            addPhoto(photo);
            setCapturedPhotos(prev => [...prev, photo]);
        }
        await sleep(150); 
        setFlash(false); 
        setCountdown(null);
        if (i < totalShots) await sleep(1500); // Jeda sebelum jepretan selanjutnya
    }
    
    setIsSessionActive(false);
    navigate('/menu', { state: { images: sessionPhotos } });
  };

  return (
    <MainLayout isFullScreen={true}>
      <style>{styles}</style>
      
      {/* FLASH SCREEN EFFECT */}
      <div className={`fixed inset-0 bg-[#FFF] z-[90] pointer-events-none transition-opacity duration-100 ${flash ? 'opacity-100' : 'opacity-0'}`} />

      {/* --- MAIN UI --- */}
      <div 
        className="w-full h-full flex overflow-hidden relative bg-[#FFFAEE]"
        style={{ backgroundImage: `repeating-linear-gradient(transparent, transparent 39px, #78A2D2 39px, #78A2D2 40px)` }}
      >
        
        {/* Dekorasi Background Coretan */}
        <div className="scribble text-5xl" style={{ top: '8%', right: '35%', transform: 'rotate(15deg)' }}>Say Cheese!</div>
        <div className="scribble text-6xl text-[#9CA22A]" style={{ bottom: '20%', left: '4%', transform: 'rotate(-20deg)' }}>★ Smile</div>

        <div className="relative z-20 flex w-full h-full">

            {/* --- LEFT: CAMERA AREA --- */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-6 lg:p-10">
                
                {/* Back Button */}
                {!isSessionActive && (
                    <button onClick={() => navigate('/')} className="absolute top-6 left-6 z-50 btn-back-scrap px-6 py-3">
                        ← KEMBALI
                    </button>
                )}

                {/* Isolasi menempelkan Kamera ke Kertas */}
                <div className="washi-tape tape-yellow" style={{ top: '6%', left: '30%', width: '250px', transform: 'rotate(-3deg)' }}></div>
                <div className="washi-tape tape-olive" style={{ top: '10%', right: '15%', width: '150px', transform: 'rotate(8deg)' }}></div>

                {/* Viewfinder Frame Besar */}
                <div className="w-full max-w-5xl lg:max-w-6xl aspect-video cam-border flex flex-col">
                      <div className="w-full h-full overflow-hidden bg-[#2D1714] border-b-4 border-[#2D1714] relative">
                          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                          <canvas ref={canvasRef} className="hidden" />
                          
                          {/* Kamera Grid & Crosshair (Baru) */}
                          <div className="camera-grid"></div>
                          <div className="camera-crosshair"></div>

                          {/* Indikator REC (Baru) */}
                          {isSessionActive && (
                              <div className="rec-indicator">
                                  <FaCircle className="rec-dot" /> REC
                              </div>
                          )}
                      </div>
                      
                      {/* Animasi Hitungan Mundur */}
                      {countdown !== null && (
                          <div key={countdown} className="absolute inset-0 flex items-center justify-center z-50 bg-black/20 backdrop-blur-sm">
                              <span className="count-big">
                                  {countdown === 0 ? 'SNAP!' : countdown}
                              </span>
                          </div>
                      )}
                      
                      {/* Logo Frame */}
                      <div className="absolute bottom-3 left-0 right-0 text-center font-caveat text-5xl font-bold text-[#2D1714] tracking-widest drop-shadow-[2px_2px_0_#FEFFAF]">
                          Eranivessary '26
                      </div>
                </div>

                {/* Bottom Controls (Control Panel Scrapbook) */}
                {!isSessionActive && (
                    <div className="control-panel">
                        {/* Timer Options */}
                        <div className="flex gap-4">
                            {[3, 5, 10].map(t => (
                                <button 
                                    key={t} onClick={() => setTimerDuration(t)}
                                    className={`w-14 h-14 text-2xl rounded-full transition-all border-4 font-poppins font-bold ${timerDuration === t ? 'bg-[#9CA22A] text-[#FFFAEE] border-[#2D1714] scale-110 shadow-[4px_4px_0_#2D1714]' : 'bg-[#FFFAEE] text-[#2D1714] border-[#2D1714] hover:bg-gray-200'}`}
                                >
                                    {t}s
                                </button>
                            ))}
                        </div>

                        {/* Shutter Button (Lebih Satisfying) */}
                        <button 
                            onClick={handleStartSession}
                            disabled={isSessionActive}
                            className="btn-shutter group"
                        >
                              <div className="w-14 h-14 bg-[#2D1714] rounded-full flex items-center justify-center border-4 border-[#FFF] group-active:scale-95 transition-transform">
                                  <AiFillCamera className="text-3xl text-[#FFF]" />
                              </div>
                        </button>

                        {/* Counter Info */}
                        <div className="w-16 h-16 bg-[#FFFAEE] flex items-center justify-center rounded-lg btn-retro text-[#2D1714] text-3xl transform rotate-6">
                            {totalShots}x
                        </div>
                    </div>
                )}
            </div>

            {/* --- RIGHT: SIDEBAR (Hasil Foto) --- */}
            <div className="w-40 md:w-[400px] h-full scrapbook-panel flex flex-col p-8 gap-8 overflow-y-auto">
                <div className="washi-tape tape-pink" style={{ top: '-10px', right: '40px', width: '120px', transform: 'rotate(5deg)' }}></div>

                <h3 className="text-center font-shrikhand text-[#2D1714] text-4xl lg:text-5xl mb-2 mt-4 bg-[#FEFFAF] border-4 border-[#2D1714] py-3 shadow-[6px_6px_0px_#2D1714] transform rotate(-2deg)">
                    PICS
                </h3>
                
                {[...Array(totalShots)].map((_, i) => (
                    <div 
                        key={i} 
                        // Tambahkan kelas pop-in jika foto sudah ada
                        className={`mini-polaroid ${capturedPhotos[i] ? 'pop-in' : ''}`}
                        style={{ '--rot': i % 2 === 0 ? '-3deg' : '4deg' } as React.CSSProperties}
                    >
                        <div className="w-full aspect-video bg-[#2D1714] border-2 border-[#2D1714] overflow-hidden relative shadow-inner">
                            {capturedPhotos[i] ? (
                                <img src={capturedPhotos[i]} alt="shot" className="w-full h-full object-cover filter contrast-110" />
                            ) : (
                                <div className="w-full h-full flex flex-col items-center justify-center text-[#FFFAEE] opacity-40">
                                    <AiFillCamera className="text-4xl mb-2" />
                                </div>
                            )}
                        </div>
                        <div className="text-center font-caveat text-[#2D1714] text-3xl font-bold mt-4">
                            Foto #{i+1}
                        </div>
                        {/* Selotip tambahan di polaroid */}
                        <div className="washi-tape tape-blue" style={{ top: '-15px', left: '15%', width: '80px', height: '25px', transform: 'rotate(-5deg)' }}></div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CameraPage;
