/* eslint-disable react-hooks/purity */
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import QRCode from 'react-qr-code';
import { 
  AiOutlineArrowLeft, 
  AiOutlineQrcode,
  AiOutlinePicture,
  AiOutlineCheckCircle,
} from 'react-icons/ai';
import { FaCameraRetro } from 'react-icons/fa'; 
import { useState, useMemo } from 'react';
import ConfirmationModal from '../components/ConfirmationModal';

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

  @keyframes popIn {
    from { transform: scale(0.8); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }

  /* --- HEADER SECTION --- */
  .page-header {
    width: 100%;
    text-align: center;
    position: relative;
    z-index: 30;
    padding-top: 40px;
    padding-bottom: 20px;
  }
  
  .title-main {
    font-size: clamp(3rem, 6vw, 4.5rem);
    color: #273A5D;
    -webkit-text-stroke: 2px #2D1714;
    text-shadow: 6px 6px 0 #78A2D2, 8px 8px 0 #2D1714;
    line-height: 1;
    margin-bottom: 10px;
    transform: rotate(-1deg);
    display: inline-block;
  }

  .subtitle-badge {
    background: #FEFFAF;
    color: #2D1714;
    padding: 5px 20px;
    border: 2px solid #2D1714;
    font-family: 'Caveat', cursive;
    font-size: 2rem;
    font-weight: bold;
    display: inline-block;
    box-shadow: 4px 4px 0 #2D1714;
    transform: rotate(2deg);
  }

  /* --- PHOTO PILE (SCRAPBOOK STYLE) --- */
  .polaroid-wrapper {
    position: absolute;
    top: 50%; left: 50%;
    transition: z-index 0s;
  }

  .polaroid-inner {
    background: #FFFAEE;
    padding: 10px 10px 45px 10px;
    width: 200px;
    box-shadow: 6px 6px 0 rgba(45,23,20,0.3);
    border: 2px solid #2D1714;
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
  }
  
  .polaroid-inner.landscape { width: 280px; }

  .polaroid-inner img {
    width: 100%; height: auto; display: block;
    border: 2px solid #2D1714;
    filter: contrast(1.1);
  }

  .polaroid-wrapper:hover { z-index: 100 !important; }
  .polaroid-wrapper:hover .polaroid-inner {
    transform: scale(1.15); 
    box-shadow: 12px 12px 0 rgba(45,23,20,0.4);
  }

  /* --- QR CODE CARD --- */
  .qr-card-container {
    background: #FFFAEE;
    border: 4px solid #2D1714;
    padding: 40px;
    box-shadow: 12px 12px 0 #9CA22A;
    text-align: center;
    width: 100%;
    max-width: 450px;
    animation: popIn 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    transform: rotate(1deg);
  }

  .qr-box-white {
    background: #FFF;
    padding: 20px;
    border: 4px solid #2D1714;
    box-shadow: 6px 6px 0 #2D1714;
    margin: 20px auto;
    display: inline-block;
  }

  .btn-finish {
    background: #273A5D;
    color: #FEFFAF;
    font-family: 'Shrikhand', serif;
    font-size: 1.8rem;
    padding: 15px 0;
    width: 100%;
    border: 3px solid #2D1714;
    box-shadow: 6px 6px 0 #78A2D2, 8px 8px 0 #2D1714;
    transition: all 0.1s;
    display: flex; justify-content: center; align-items: center; gap: 10px;
    cursor: pointer;
    margin-top: 10px;
  }
  .btn-finish:hover {
    transform: translate(-2px, -2px);
    box-shadow: 8px 8px 0 #78A2D2, 10px 10px 0 #2D1714;
  }
  .btn-finish:active {
    transform: translate(4px, 4px);
    box-shadow: 2px 2px 0 #78A2D2, 4px 4px 0 #2D1714;
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

  /* TUTORIAL OVERLAY (Scrapbook Style) */
  .tutorial-overlay {
    background: rgba(255, 250, 238, 0.85); /* Cream semi-transparent */
    backdrop-filter: blur(5px);
    position: fixed; inset: 0; z-index: 9999;
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
  }
  .tutorial-card {
    background: #FFFAEE; 
    border: 4px solid #2D1714; 
    padding: 40px; 
    max-width: 450px;
    width: 100%; 
    text-align: center; 
    box-shadow: 12px 12px 0 #78A2D2;
    animation: popIn 0.4s;
    position: relative;
    transform: rotate(-1deg);
  }
  .tut-dots { display: flex; justify-content: center; gap: 10px; margin-bottom: 25px; }
  .tut-dot { width: 12px; height: 12px; border: 2px solid #2D1714; background: transparent; transition: 0.3s; }
  .tut-dot.active { background: #9CA22A; transform: scale(1.3); }

  /* Coretan Background */
  .scribble {
    font-family: 'Caveat', cursive;
    color: #2D1714;
    font-size: 3rem;
    position: absolute;
    z-index: 0;
  }
`;

const HANDWRITTEN_NOTES = ["Memories", "So Cute!", "Eranivessary", "2026", "Love it!", "Epic", "Smile", "Squad"];
const MARKER_COLORS = ["#2D1714", "#273A5D", "#78A2D2", "#9CA22A"];

const TUTORIAL_STEPS = [
    { title: "ALL DONE!", desc: "Sesi foto selesai! Hasil fotomu ada di tumpukan sebelah kiri.", icon: <AiOutlinePicture className="text-6xl text-[#2D1714]" /> },
    { title: "SCAN & SAVE", desc: "Scan QR Code untuk menyimpan semua foto ke HP kamu.", icon: <AiOutlineQrcode className="text-6xl text-[#2D1714]" /> },
    { title: "FINISH", desc: "Pastikan sudah download sebelum menekan tombol Selesai ya!", icon: <AiOutlineCheckCircle className="text-6xl text-[#2D1714]" /> }
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const PhotoItem = ({ src, style, isFramed }: { src: string, style: any, isFramed: boolean }) => {
    const [isLandscape, setIsLandscape] = useState(false);
    
    const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
        const img = e.currentTarget;
        if (isFramed && img.naturalWidth > img.naturalHeight) setIsLandscape(true);
    };

    return (
        <div 
            className="polaroid-wrapper"
            style={{ 
                transform: style.transform, 
                zIndex: isLandscape ? style.initialZ + 50 : style.initialZ,
            }}
        >
            <div className={`polaroid-inner ${isLandscape ? 'landscape' : ''}`}>
                <div className="washi-tape tape-yellow" style={{ top: '-15px', left: '20%', width: '60%', transform: 'rotate(-2deg)' }}></div>
                <img src={src} alt="Memory" loading="lazy" onLoad={handleImageLoad} />
                <div 
                    className="absolute bottom-1 left-0 right-0 text-center font-caveat text-3xl font-bold"
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
    const rot = Math.floor(Math.random() * 40) - 20; 
    const x = Math.floor(Math.random() * 120) - 60; 
    const y = Math.floor(Math.random() * 80) - 40;
    
    return {
        transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) rotate(${rot}deg)`,
        initialZ: index + 1,
        note: HANDWRITTEN_NOTES[index % HANDWRITTEN_NOTES.length],
        color: MARKER_COLORS[index % MARKER_COLORS.length]
    };
  };

  if (!driveLink) return <MainLayout isFullScreen={true}><div className="flex h-full items-center justify-center font-shrikhand text-2xl text-[#2D1714]"><button onClick={() => navigate('/')}>Return Home</button></div></MainLayout>;

  const nextStep = () => {
    if (tutStep < TUTORIAL_STEPS.length - 1) setTutStep(tutStep + 1);
    else setShowTutorial(false);
  };

  return (
    <MainLayout isFullScreen={true}>
      <style>{styles}</style>
      
      {/* Container transparan karena pattern kertas sudah di MainLayout */}
      <div className="w-full h-full flex flex-col items-center relative overflow-hidden">
        
        {/* --- DEKORASI LUAR --- */}
        <div className="scribble" style={{ top: '10%', left: '5%', transform: 'rotate(-10deg)' }}>Don't forget to save!</div>
        <div className="scribble" style={{ bottom: '15%', left: '10%', transform: 'rotate(15deg)', fontSize: '4rem' }}>xoxo</div>

        {/* --- HEADER --- */}
        <div className="page-header">
            <h1 className="title-main font-shrikhand">SESSION COMPLETED</h1><br/>
            <div className="subtitle-badge mt-2">
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
                    
                    {/* Washi Tapes on QR Card */}
                    <div className="washi-tape tape-blue" style={{ top: '-15px', right: '-20px', width: '100px', transform: 'rotate(45deg)' }}></div>

                    <h2 className="font-shrikhand text-4xl text-[#2D1714] mb-2 drop-shadow-[2px_2px_0_#FEFFAF]">SCAN ME!</h2>
                    <p className="font-poppins text-sm text-[#2D1714] font-bold mb-4 uppercase tracking-widest border-b-2 border-[#2D1714] pb-2 inline-block">
                        Simpan foto ke HP kamu
                    </p>

                    <div className="qr-box-white">
                        <QRCode 
                            value={driveLink} 
                            size={200} 
                            style={{ height: "auto", maxWidth: "100%", width: "100%" }} 
                            viewBox={`0 0 256 256`}
                            fgColor="#2D1714"
                        />
                    </div>

                    <button onClick={() => setShowConfirm(true)} className="btn-finish">
                        <AiOutlineArrowLeft /> SELESAI
                    </button>
                </div>
            </div>

        </div>

      </div>

      {/* --- TUTORIAL OVERLAY SCRAPBOOK --- */}
      {showTutorial && (
        <div className="tutorial-overlay">
            <div className="tutorial-card">
                <div className="washi-tape tape-olive" style={{ top: '-15px', left: '30%', width: '40%', transform: 'rotate(-2deg)' }}></div>
                
                <div className="bg-[#FEFFAF] border-2 border-[#2D1714] rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0_#2D1714]">
                    {TUTORIAL_STEPS[tutStep].icon}
                </div>
                
                <h2 className="font-shrikhand text-3xl text-[#273A5D] mb-2 drop-shadow-[2px_2px_0_#9CA22A]">{TUTORIAL_STEPS[tutStep].title}</h2>
                <p className="font-poppins text-lg font-bold text-[#2D1714] mb-8 leading-tight px-2">{TUTORIAL_STEPS[tutStep].desc}</p>
                
                <div className="tut-dots">
                    {TUTORIAL_STEPS.map((_, i) => <div key={i} className={`tut-dot ${i === tutStep ? 'active' : ''}`} />)}
                </div>
                
                <button onClick={nextStep} className="w-full py-3 bg-[#78A2D2] text-[#FFFAEE] font-shrikhand text-xl border-2 border-[#2D1714] shadow-[4px_4px_0_#2D1714] hover:translate-x-1 hover:translate-y-1 hover:shadow-[0_0_0_#2D1714] transition-all">
                    {tutStep === TUTORIAL_STEPS.length - 1 ? "MENGERTI!" : "LANJUT >"}
                </button>
            </div>
        </div>
      )}

      {/* Gunakan Modal Bawaan (Bisa Anda modifikasi UI modal-nya terpisah jika perlu) */}
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