import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { usePhotos } from '../context/PhotoContext';
import { AiFillCamera } from 'react-icons/ai';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Shrikhand&family=Poppins:wght@400;600;800&family=Caveat:wght@700&display=swap');

  .font-shrikhand { font-family: 'Shrikhand', serif; }
  .font-poppins { font-family: 'Poppins', sans-serif; }
  .font-caveat { font-family: 'Caveat', cursive; }

  /* Washi Tapes */
  .washi-tape { position: absolute; height: 30px; backdrop-filter: blur(2px); z-index: 10; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border: 1px solid rgba(0,0,0,0.05); }
  .tape-blue { background-color: rgba(120, 162, 210, 0.8); }
  .tape-olive { background-color: rgba(156, 162, 42, 0.8); }
  .tape-yellow { background-color: rgba(254, 255, 175, 0.9); }

  /* Sidebar Kertas Biru (#78A2D2) */
  .scrapbook-panel {
    background: #78A2D2;
    border-left: 4px dashed #2D1714;
    box-shadow: -10px 0 20px rgba(0,0,0,0.1);
    position: relative;
  }

  /* Mini Polaroid / Photo Preview */
  .mini-polaroid {
    background: #FFFAEE; 
    padding: 8px 8px 25px 8px;
    border: 2px solid #2D1714;
    box-shadow: 4px 4px 0px rgba(45, 23, 20, 0.3);
    transform: rotate(-2deg); 
    transition: 0.3s;
    position: relative;
  }
  .mini-polaroid:nth-child(even) { transform: rotate(3deg); }

  /* Viewfinder Frame (Retro) */
  .cam-border {
    border: 15px solid #FFFAEE;
    border-bottom-width: 40px;
    border-radius: 2px;
    box-shadow: 8px 8px 0px #2D1714, 15px 15px 30px rgba(0,0,0,0.2);
    outline: 4px solid #2D1714;
    background: #000; 
    overflow: hidden; 
    position: relative;
  }

  .count-big {
    font-size: 10rem; color: #FEFFAF; 
    -webkit-text-stroke: 4px #2D1714;
    text-shadow: 8px 8px 0px #78A2D2;
    font-family: 'Shrikhand', serif;
  }

  /* Button Controls */
  .btn-retro {
    border: 4px solid #2D1714;
    box-shadow: 4px 4px 0px #2D1714;
    transition: all 0.1s;
  }
  .btn-retro:active { transform: translate(4px, 4px); box-shadow: 0px 0px 0px #2D1714; }

  /* Printing Overlay */
  .print-overlay-container {
    position: fixed; inset: 0; z-index: 100;
    background: rgba(255, 250, 238, 0.9); /* Cream */
    backdrop-filter: blur(5px);
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
  }
  
  .final-strip {
    width: 320px;
    background: #FFFAEE;
    border: 3px solid #2D1714;
    box-shadow: 10px 10px 0px #9CA22A;
    display: flex; flex-direction: column;
    position: relative;
    overflow: hidden;
    transform: rotate(-2deg);
    animation: slideUp 1s ease-out forwards;
  }

  @keyframes slideUp {
    from { transform: translateY(100vh) rotate(-10deg); }
    to { transform: translateY(0) rotate(-2deg); }
  }
`;

const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

const CameraPage: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const { addPhoto, clearPhotos } = usePhotos();

  const [timerDuration, setTimerDuration] = useState<number>(3); 
  const totalShots = 4;

  const [isSessionActive, setIsSessionActive] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [isPrinting, setIsPrinting] = useState(false);

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
              ctx.translate(cvs.width, 0); ctx.scale(-1, 1);
              ctx.drawImage(videoRef.current, 0, 0, cvs.width, cvs.height);
              return cvs.toDataURL('image/jpeg', 1.0);
          }
      }
      return null;
  };

  const handleStartSession = async () => {
    if (isSessionActive || isPrinting) return;
    setIsSessionActive(true);
    clearPhotos();
    setCapturedPhotos([]); 
    
    const sessionPhotos: string[] = [];
    for (let i = 1; i <= totalShots; i++) {
        for (let c = timerDuration; c > 0; c--) {
            setCountdown(c); await sleep(1000);
        }
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
    
    setIsSessionActive(false);
    await sleep(500);
    setIsPrinting(true);
    await sleep(4000); 
    navigate('/menu', { state: { images: sessionPhotos } });
  };

  return (
    <MainLayout isFullScreen={true}>
      <style>{styles}</style>
      
      <div className={`fixed inset-0 bg-[#FFFAEE] z-[90] pointer-events-none transition-opacity duration-150 ${flash ? 'opacity-100' : 'opacity-0'}`} />

      {/* --- PRINTING ANIMATION (SCRAPBOOK GLUE) --- */}
      {isPrinting && (
          <div className="print-overlay-container">
              <div className="font-shrikhand text-[#273A5D] text-5xl mb-12 drop-shadow-[4px_4px_0_#9CA22A]">
                  PASTING PHOTOS...
              </div>
              <div className="final-strip">
                  <div className="washi-tape tape-yellow" style={{ top: '-15px', left: '30%', width: '120px', transform: 'rotate(-4deg)' }}></div>
                  <div className="flex flex-col w-full p-2 m-0 bg-[#FFFAEE]">
                      {[...Array(4)].map((_, i) => (
                          <div key={i} className="w-full aspect-video bg-black mb-2 border-2 border-[#2D1714]">
                              {capturedPhotos[i] && <img src={capturedPhotos[i]} alt="print" className="w-full h-full object-cover" />}
                          </div>
                      ))}
                      <div className="h-16 w-full flex items-center justify-center">
                         <span className="font-caveat text-[#2D1714] text-2xl font-bold">Eranivessary '26</span>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* --- MAIN UI --- */}
      <div className="w-full h-full flex overflow-hidden relative">
        <div className="relative z-20 flex w-full h-full">

            {/* --- LEFT: CAMERA AREA --- */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-4">
                
                {/* Washi Tape on Camera */}
                <div className="absolute top-[10%] z-30 washi-tape tape-yellow" style={{ left: '20%', width: '150px', transform: 'rotate(-5deg)' }}></div>

                {/* Viewfinder */}
                <div className="relative w-full max-w-4xl aspect-video cam-border">
                      <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover transform -scale-x-100" />
                      <canvas ref={canvasRef} className="hidden" />
                      
                      {countdown !== null && (
                          <div className="absolute inset-0 flex items-center justify-center z-50">
                              <span className="count-big">
                                  {countdown === 0 ? 'SNAP!' : countdown}
                              </span>
                          </div>
                      )}
                      {/* Logo bawah kamera */}
                      <div className="absolute bottom-2 right-4 font-caveat text-3xl font-bold text-[#2D1714]">
                          Eranivessary
                      </div>
                </div>

                {/* Bottom Controls */}
                {!isSessionActive && (
                    <div className="absolute bottom-10 flex items-center gap-8">
                        
                        {/* Timer */}
                        <div className="bg-[#FFFAEE] p-2 flex gap-2 border-[3px] border-[#2D1714] box-shadow-retro btn-retro">
                            {[3, 5, 10].map(t => (
                                <button 
                                    key={t} onClick={() => setTimerDuration(t)}
                                    className={`w-14 h-14 font-shrikhand text-2xl transition-all border-2 border-transparent ${timerDuration === t ? 'bg-[#9CA22A] text-[#FFFAEE] border-[#2D1714]' : 'text-[#2D1714] hover:bg-gray-200'}`}
                                >
                                    {t}s
                                </button>
                            ))}
                        </div>

                        {/* Shutter Button */}
                        <button 
                            onClick={handleStartSession}
                            className="w-28 h-28 bg-[#273A5D] rounded-full flex items-center justify-center btn-retro group"
                        >
                              <div className="w-20 h-20 bg-[#FEFFAF] rounded-full flex items-center justify-center border-4 border-[#2D1714] group-hover:scale-95 transition-transform">
                                  <AiFillCamera className="text-4xl text-[#273A5D]" />
                              </div>
                        </button>

                        {/* Info Pin */}
                        <div className="w-16 h-16 bg-[#FFFAEE] flex items-center justify-center btn-retro text-[#2D1714] font-shrikhand text-2xl transform rotate-12">
                            {totalShots}x
                        </div>
                    </div>
                )}
            </div>

            {/* --- RIGHT: SIDEBAR (SCRAPBOOK PAPER) --- */}
            <div className="w-32 md:w-80 h-full scrapbook-panel flex flex-col p-6 gap-6 overflow-y-auto">
                
                {/* Washi tape at top of sidebar */}
                <div className="washi-tape tape-olive" style={{ top: '-10px', right: '40px', width: '100px', transform: 'rotate(5deg)' }}></div>

                <h3 className="text-center font-shrikhand text-[#2D1714] text-3xl mb-2 mt-4 bg-[#FEFFAF] border-2 border-[#2D1714] py-1 shadow-[4px_4px_0px_#2D1714] transform rotate(-2deg)">
                    YOUR PICS
                </h3>
                
                {/* Preview Slots */}
                {[...Array(totalShots)].map((_, i) => (
                    <div key={i} className="mini-polaroid">
                        <div className="w-full aspect-video bg-[#2D1714] border-2 border-[#2D1714] overflow-hidden">
                            {capturedPhotos[i] ? (
                                <img src={capturedPhotos[i]} alt="shot" className="w-full h-full object-cover filter contrast-125" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[#FFFAEE] font-poppins text-xs opacity-50">KOSONG</div>
                            )}
                        </div>
                        <div className="text-center font-caveat text-[#2D1714] text-xl font-bold mt-2">
                            Foto #{i+1}
                        </div>
                        {/* Tape on mini polaroid */}
                        <div className="washi-tape tape-blue" style={{ top: '-10px', left: '10%', width: '40px', height: '15px', transform: 'rotate(-5deg)' }}></div>
                    </div>
                ))}
            </div>

            {/* Back Button */}
            {!isSessionActive && (
                <button onClick={() => navigate('/')} className="absolute top-6 left-6 z-50 bg-[#FEFFAF] text-[#2D1714] px-6 py-2 font-poppins font-bold uppercase tracking-widest btn-retro">
                    ← KEMBALI
                </button>
            )}
        </div>
      </div>
    </MainLayout>
  );
};

export default CameraPage;