import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import QRCode from 'react-qr-code';
import { 
  AiOutlineArrowLeft, 
  AiOutlineQrcode,
  AiOutlinePicture,
  AiOutlineCheckCircle,
  AiFillCloud,
} from 'react-icons/ai';
import { FaSun, FaCameraRetro } from 'react-icons/fa'; 
import { GiPalmTree } from 'react-icons/gi';
import { useState, useMemo } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Titan+One&family=Patrick+Hand&display=swap');
  
  .font-title { font-family: 'Titan One', cursive; }
  .font-hand { font-family: 'Patrick Hand', cursive; }
  
  /* --- BACKGROUND ANIMATIONS (Shared) --- */
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
    0%, 100% { transform: rotate(-5deg); }
    50% { transform: rotate(5deg); }
  }
  @keyframes popIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes floatHeader {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-10px); }
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

  /* --- HEADER SECTION --- */
  .page-header {
    width: 100%;
    text-align: center;
    position: relative;
    z-index: 30;
    padding-top: 30px;
    padding-bottom: 20px;
    animation: floatHeader 3s ease-in-out infinite;
  }
  
  .title-main {
    font-size: 3.5rem;
    color: #FFF;
    text-shadow: 
      3px 3px 0 #0ea5e9,
      6px 6px 0 rgba(0,0,0,0.1);
    line-height: 1;
    margin-bottom: 10px;
  }

  .subtitle-badge {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(4px);
    color: #0284c7;
    padding: 8px 24px;
    border-radius: 50px;
    font-family: 'Patrick Hand', cursive;
    font-size: 1.5rem;
    font-weight: bold;
    display: inline-block;
    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
    transform: rotate(-2deg);
  }

  /* --- PHOTO PILE (NO SHIFTING) --- */
  /* Wrapper: Menangani Posisi & Rotasi Acak */
  .polaroid-wrapper {
    position: absolute;
    top: 50%; left: 50%;
    /* transform di-set via inline style (translate & rotate) */
    transition: z-index 0s; /* Instant z-index switch */
  }

  /* Inner: Menangani Visual & Hover Effect */
  .polaroid-inner {
    background: #fff;
    padding: 10px 10px 45px 10px;
    width: 200px;
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    border-radius: 4px;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease, border-color 0.3s ease;
    border: 4px solid transparent;
  }
  
  .polaroid-inner.landscape { width: 280px; }

  .polaroid-inner img {
    width: 100%; height: auto; display: block;
    border: 1px solid #f1f5f9;
  }

  /* HOVER STATE: Wrapper naik ke atas, Inner membesar */
  .polaroid-wrapper:hover {
    z-index: 100 !important;
  }
  .polaroid-wrapper:hover .polaroid-inner {
    transform: scale(1.15); /* Hanya scale, TIDAK merubah rotasi wrapper */
    box-shadow: 0 25px 50px rgba(0,0,0,0.3);
    border-color: #FCD34D; /* Gold Border */
  }

  .tape {
    position: absolute; top: -12px; left: 50%;
    width: 80px; height: 25px;
    background: rgba(255, 255, 255, 0.5);
    transform: translateX(-50%) rotate(-1deg);
    backdrop-filter: blur(2px);
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    z-index: 20;
  }

  /* --- QR CODE CARD --- */
  .qr-card-container {
    background: rgba(255, 255, 255, 0.6);
    backdrop-filter: blur(16px);
    border: 3px solid rgba(255, 255, 255, 0.8);
    border-radius: 40px;
    padding: 40px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.15);
    text-align: center;
    width: 100%;
    max-width: 450px;
    animation: popIn 0.8s ease-out;
    position: relative;
    overflow: hidden;
  }

  .qr-box-white {
    background: #FFFFFF;
    padding: 20px;
    border-radius: 20px;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
    margin: 20px auto;
    display: inline-block;
    border: 2px solid #e2e8f0;
  }

  .btn-finish {
    background: #F59E0B;
    color: white;
    font-family: 'Titan One', cursive;
    font-size: 1.4rem;
    padding: 15px 0;
    width: 100%;
    border-radius: 20px;
    border: 4px solid white;
    box-shadow: 0 6px 0 #B45309;
    transition: all 0.2s;
    display: flex; justify-content: center; align-items: center; gap: 10px;
    cursor: pointer;
  }
  .btn-finish:hover {
    background: #D97706;
    transform: translateY(-2px);
    box-shadow: 0 8px 0 #B45309;
  }
  .btn-finish:active {
    transform: translateY(4px);
    box-shadow: 0 2px 0 #B45309;
  }

  /* --- LAYOUT GRID --- */
  .content-grid {
    display: flex;
    flex-direction: column;
    flex: 1;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    z-index: 20;
    position: relative;
  }

  @media (min-width: 1024px) {
    .content-grid {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 4rem;
    }
    .photo-deck-area {
        flex: 1; height: 100%;
    }
  }

  /* TUTORIAL OVERLAY */
  .tutorial-overlay {
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(5px);
    position: fixed; inset: 0; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .tutorial-card {
    background: #FFF; border-radius: 30px; padding: 40px; max-width: 450px;
    width: 100%; text-align: center; border: 4px solid #4facfe;
    box-shadow: 0 25px 50px rgba(0,0,0,0.3);
    animation: popIn 0.4s;
  }
  .tut-dots { display: flex; justify-content: center; gap: 8px; margin-bottom: 25px; }
  .tut-dot { width: 10px; height: 10px; border-radius: 50%; background: #e2e8f0; transition: 0.3s; }
  .tut-dot.active { background: #0ea5e9; transform: scale(1.3); }
`;

const HANDWRITTEN_NOTES = ["Summer!", "Bestie", "Love", "XOXO", "2025", "Fun!", "Cool", "Smile"];
const MARKER_COLORS = ["#ef4444", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"];

const TUTORIAL_STEPS = [
    { title: "ALL DONE!", desc: "Sesi foto selesai! Hasil fotomu ada di tumpukan sebelah kiri.", icon: <AiOutlinePicture className="text-6xl text-sky-500" /> },
    { title: "SCAN & SAVE", desc: "Scan QR Code untuk menyimpan semua foto ke HP kamu.", icon: <AiOutlineQrcode className="text-6xl text-sky-500" /> },
    { title: "FINISH", desc: "Pastikan sudah download sebelum menekan tombol Selesai ya!", icon: <AiOutlineCheckCircle className="text-6xl text-sky-500" /> }
];

// --- COMPONENT FOTO PINTAR (ANTI-GESER) ---
const PhotoItem = ({ src, style, isFramed }: { src: string, style: any, isFramed: boolean }) => {
    const [isLandscape, setIsLandscape] = useState(false);
    
    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        if (isFramed && img.naturalWidth > img.naturalHeight) setIsLandscape(true);
    };

    return (
        /* WRAPPER: Menangani POSISI & ROTASI (Fixed) */
        <div 
            className="polaroid-wrapper"
            style={{ 
                transform: style.transform, // Posisi tetap
                zIndex: isLandscape ? style.initialZ + 50 : style.initialZ,
            }}
        >
            {/* INNER: Menangani VISUAL & ZOOM (Tanpa merusak posisi) */}
            <div className={`polaroid-inner ${isLandscape ? 'landscape' : ''}`}>
                <div className="tape"></div>
                <img src={src} alt="Memory" loading="lazy" onLoad={handleImageLoad} />
                <div 
                    className="absolute bottom-3 left-0 right-0 text-center font-hand text-xl opacity-80"
                    style={{ color: style.color }}
                >
                    {style.note}
                </div>
            </div>
        </div>
    );
};

const FinishPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { driveLink, savedFrames, rawPhotos } = (location.state || {}) as { 
      driveLink: string, savedFrames: string[], rawPhotos: string[], 
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [tutStep, setTutStep] = useState(0);

  const allPhotos = useMemo(() => [
      ...(savedFrames || []).map(src => ({ src, isFramed: true })),
      ...(rawPhotos || []).map(src => ({ src, isFramed: false }))
  ], [savedFrames, rawPhotos]);

  const getRandomStyle = (index: number) => {
    // Posisi acak relatif terhadap tengah container
    const rot = Math.floor(Math.random() * 40) - 20; 
    const x = Math.floor(Math.random() * 120) - 60; 
    const y = Math.floor(Math.random() * 80) - 40;
    
    return {
        // Kita translate dari center (-50%, -50%) lalu tambah offset acak
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rot}deg)`,
        initialZ: index + 1,
        note: HANDWRITTEN_NOTES[index % HANDWRITTEN_NOTES.length],
        color: MARKER_COLORS[index % MARKER_COLORS.length]
    };
  };

  if (!driveLink) return <MainLayout isFullScreen={true}><div className="flex h-full items-center justify-center"><button onClick={() => navigate('/')}>Return Home</button></div></MainLayout>;

  const nextStep = () => {
    if (tutStep < TUTORIAL_STEPS.length - 1) setTutStep(tutStep + 1);
    else setShowTutorial(false);
  };

  return (
    <MainLayout isFullScreen={true}>
      <style>{styles}</style>
      
      <div className="summer-bg w-full h-full flex flex-col items-center relative">
        
        {/* --- BACKGROUND DECORATIONS --- */}
        <div className="sun-deco"><FaSun /></div>
        <div className="cloud-deco" style={{ top: '15%', fontSize: '4rem', animation: 'floatCloud 25s linear infinite' }}><AiFillCloud /></div>
        <div className="cloud-deco" style={{ top: '35%', fontSize: '3rem', animation: 'floatCloud 35s linear infinite', animationDelay: '-10s' }}><AiFillCloud /></div>
        <div className="palm-tree" style={{ left: '-20px', transformOrigin: 'bottom center' }}><GiPalmTree /></div>
        <div className="palm-tree" style={{ right: '-20px', transformOrigin: 'bottom center', animationDelay: '1s' }}><GiPalmTree /></div>
        <div className="wave-footer"></div>

        {/* --- HEADER (Fixed at Top) --- */}
        <div className="page-header">
            <h1 className="title-main font-title">SESSION COMPLETED</h1>
            <div className="subtitle-badge">
                 <FaCameraRetro className="inline mr-2 mb-1"/> 
                 {allPhotos.length} Memories Captured
            </div>
        </div>

        {/* --- MAIN CONTENT --- */}
        <div className="content-grid">

            {/* LEFT: PHOTO PILE */}
            <div className="photo-deck-area relative">
                {allPhotos.map((photo, index) => { 
                    if (index > 14) return null; 
                    const style = getRandomStyle(index);
                    return <PhotoItem key={index} src={photo.src} isFramed={photo.isFramed} style={style} />;
                })}
            </div>

            {/* RIGHT: QR CARD */}
            <div className="flex flex-col items-center justify-center">
                <div className="qr-card-container">
                    
                    <h2 className="font-title text-4xl text-sky-500 mb-1">SCAN ME!</h2>
                    <p className="font-hand text-xl text-slate-500 font-bold mb-4">Simpan foto ke HP kamu</p>

                    <div className="qr-box-white">
                        <QRCode 
                            value={driveLink} 
                            size={200} 
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }} 
                            viewBox={`0 0 256 256`}
                        />
                    </div>

                    <button onClick={() => setShowConfirm(true)} className="btn-finish">
                        <AiOutlineArrowLeft /> SELESAI
                    </button>
                </div>
            </div>

        </div>

      </div>

      {/* --- TUTORIAL & MODAL --- */}
      {showTutorial && (
        <div className="tutorial-overlay">
            <div className="tutorial-card">
                <div className="bg-sky-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4 border border-sky-100 shadow-sm">
                    {TUTORIAL_STEPS[tutStep].icon}
                </div>
                <h2 className="font-title text-3xl text-sky-600 mb-2">{TUTORIAL_STEPS[tutStep].title}</h2>
                <p className="font-hand text-2xl text-slate-600 mb-6 leading-tight px-2">{TUTORIAL_STEPS[tutStep].desc}</p>
                <div className="tut-dots">
                    {TUTORIAL_STEPS.map((_, i) => <div key={i} className={`tut-dot ${i === tutStep ? 'active' : ''}`} />)}
                </div>
                <button onClick={nextStep} className="w-full py-3 bg-sky-500 text-white font-title text-xl rounded-xl hover:bg-sky-600 transition shadow-md">
                    {tutStep === TUTORIAL_STEPS.length - 1 ? "MENGERTI!" : "LANJUT >"}
                </button>
            </div>
        </div>
      )}

      <ConfirmationModal 
        isOpen={showConfirm}
        title="SUDAH DISIMPAN?"
        message="Link download akan hilang setelah kamu keluar. Yakin sudah scan?"
        confirmText="YA, KELUAR"
        cancelText="BELUM"
        onConfirm={() => navigate('/')}
        onCancel={() => setShowConfirm(false)}
        isDestructive={true}
      />
    </MainLayout>
  );
};

export default FinishPage;