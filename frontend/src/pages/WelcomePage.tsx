/* src/pages/WelcomePage.tsx */
import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { usePhotos } from '../context/PhotoContext';
import { AiFillCamera, AiFillStar, AiFillHeart } from 'react-icons/ai';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Shrikhand&family=Poppins:wght@400;600;800&family=Caveat:wght@700&display=swap');

  .font-shrikhand { font-family: 'Shrikhand', serif; }
  .font-poppins { font-family: 'Poppins', sans-serif; }
  .font-caveat { font-family: 'Caveat', cursive; }

  /* Background Kertas Dotted */
  .bg-scrapbook {
    background-color: #FFFAEE;
    background-image: radial-gradient(rgba(120, 162, 210, 0.4) 3px, transparent 3px);
    background-size: 35px 35px;
  }

  /* --- ANIMASI TERUS-MENERUS --- */
  @keyframes floatLeft {
    0%, 100% { transform: translateY(0) rotate(-15deg); }
    50% { transform: translateY(-30px) rotate(-10deg); }
  }
  @keyframes floatRight {
    0%, 100% { transform: translateY(0) rotate(12deg); }
    50% { transform: translateY(-25px) rotate(18deg); }
  }
  @keyframes heartbeat {
    0%, 20%, 40%, 100% { transform: scale(1) rotate(-1deg); }
    10%, 30% { transform: scale(1.08) rotate(1deg); }
  }
  @keyframes wiggleSlow {
    0%, 100% { transform: rotate(-3deg); }
    50% { transform: rotate(3deg); }
  }
  @keyframes spinConstant {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes shadowPulse {
    0%, 100% { box-shadow: 15px 15px 0px #9CA22A; border-color: #2D1714; }
    50% { box-shadow: 18px 18px 0px #78A2D2; border-color: #78A2D2; }
  }

  /* Washi Tape Decorations */
  .washi-tape {
    position: absolute;
    height: 40px;
    background-color: rgba(255,255,255,0.4);
    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
    backdrop-filter: blur(2px);
    z-index: 10;
  }
  .tape-blue { background-color: rgba(120, 162, 210, 0.85); }
  .tape-olive { background-color: rgba(156, 162, 42, 0.85); }
  .tape-yellow { background-color: rgba(254, 255, 175, 0.95); }
  .tape-pink { background-color: rgba(255, 182, 193, 0.85); }

  /* Polaroid Melayang (Levitation) */
  .polaroid-left {
    background: #FFF; padding: 12px 12px 45px 12px; border: 3px solid #2D1714;
    box-shadow: 8px 8px 0px rgba(45, 23, 20, 0.25);
    position: absolute; z-index: 0;
    animation: floatLeft 6s ease-in-out infinite;
  }
  
  .polaroid-right {
    background: #FFF; padding: 12px 12px 45px 12px; border: 3px solid #2D1714;
    box-shadow: -8px 8px 0px rgba(45, 23, 20, 0.25);
    position: absolute; z-index: 0;
    animation: floatRight 7s ease-in-out infinite;
  }

  /* Main Title Bergoyang */
  .title-scrapbook {
    font-family: 'Shrikhand', serif;
    font-size: clamp(4rem, 8vw, 7.5rem);
    color: #273A5D; 
    -webkit-text-stroke: 3px #2D1714;
    text-shadow: 8px 8px 0px #78A2D2, 12px 12px 0px #2D1714;
    line-height: 1.1;
    text-align: center;
    transform: rotate(-2deg);
    animation: wiggleSlow 4s ease-in-out infinite;
  }

  /* Sticker Badge */
  .sticker-badge {
    background: #9CA22A; 
    color: #FFFAEE;
    font-family: 'Poppins', sans-serif;
    font-weight: 800;
    padding: 8px 30px;
    border: 3px solid #2D1714;
    box-shadow: 5px 5px 0px #2D1714;
    transform: rotate(5deg);
    display: inline-block;
    transition: 0.3s;
  }
  .sticker-badge:hover { transform: rotate(-2deg) scale(1.1); box-shadow: 8px 8px 0px #2D1714;}

  /* Tombol Scrapbook Besar (Berdenyut) */
  .btn-scrapbook {
    background: #FF5757; 
    color: #FFFAEE; 
    font-family: 'Shrikhand', serif;
    font-size: 2.8rem;
    padding: 20px 60px;
    border: 5px solid #2D1714;
    box-shadow: 8px 8px 0px #2D1714;
    border-radius: 60px;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    display: flex; align-items: center; gap: 15px;
    position: relative;
    z-index: 20;
    animation: heartbeat 2.5s infinite;
  }

  .btn-scrapbook:hover {
    box-shadow: 12px 12px 0px #2D1714;
    background: #E04848;
    animation: none; /* Berhenti berdenyut saat di-hover */
    transform: scale(1.05) rotate(-1deg);
  }

  .btn-scrapbook:active {
    transform: translate(6px, 6px) scale(0.95);
    box-shadow: 0px 0px 0px #2D1714;
  }

  /* Pen scribbles */
  .scribble {
    font-family: 'Caveat', cursive;
    color: #2D1714;
    font-size: 2.5rem;
    position: absolute;
    font-weight: bold;
  }

  /* Box Utama (Glow Bergerak) */
  .main-box {
    background: rgba(255, 250, 238, 0.95);
    border: 5px dashed #2D1714;
    border-radius: 20px;
    animation: shadowPulse 5s ease-in-out infinite;
    backdrop-filter: blur(5px);
  }
`;

const WelcomePage = () => {
  const navigate = useNavigate();
  const { clearPhotos } = usePhotos();

  const startSession = () => {
    // Memberikan delay sangat sebentar untuk membiarkan efek klik (active) terlihat
    setTimeout(() => {
        clearPhotos();
        navigate('/camera');
    }, 150);
  };

  return (
    <MainLayout isFullScreen={true}>
      <style>{styles}</style>
      <div className="w-full h-full flex flex-col items-center justify-center relative select-none overflow-hidden bg-scrapbook">
        
        {/* --- ORNAMEN ANIMASI BERGERAK (Stars & Hearts) --- */}
        <div className="absolute top-[10%] right-[22%] text-6xl text-[#FEFFAF] drop-shadow-[3px_3px_0_#2D1714] z-0" style={{ animation: 'spinConstant 15s linear infinite' }}>
            <AiFillStar />
        </div>
        <div className="absolute bottom-[20%] left-[25%] text-7xl text-[#FF5757] drop-shadow-[3px_3px_0_#2D1714] z-0" style={{ animation: 'wiggleSlow 3s ease-in-out infinite' }}>
            <AiFillHeart />
        </div>
        <div className="absolute top-[30%] left-[10%] text-6xl text-[#78A2D2] drop-shadow-[3px_3px_0_#2D1714] z-0" style={{ animation: 'spinConstant 20s linear infinite reverse' }}>
            <AiFillStar />
        </div>

        {/* --- DEKORASI SCRAPBOOK (POLAROID MELAYANG) --- */}
        
        {/* Polaroid Melayang Kiri */}
        <div className="polaroid-left" style={{ top: '15%', left: '6%', width: '250px', height: '300px' }}>
            <div className="w-full h-full bg-[#78A2D2] border-2 border-[#2D1714] overflow-hidden flex items-center justify-center">
                <AiFillCamera className="text-8xl text-[#2D1714] opacity-20" />
            </div>
            <div className="text-center font-caveat text-3xl font-bold text-[#2D1714] mt-2">Ready?</div>
            <div className="washi-tape tape-yellow" style={{ top: '-15px', left: '20px', width: '120px', transform: 'rotate(-5deg)' }}></div>
        </div>

        {/* Polaroid Melayang Kanan */}
        <div className="polaroid-right" style={{ bottom: '15%', right: '8%', width: '270px', height: '320px' }}>
            <div className="w-full h-full bg-[#9CA22A] border-2 border-[#2D1714] overflow-hidden flex items-center justify-center">
                <AiFillStar className="text-9xl text-[#2D1714] opacity-20" />
            </div>
            <div className="text-center font-caveat text-3xl font-bold text-[#2D1714] mt-2">Cheese!</div>
            <div className="washi-tape tape-pink" style={{ top: '-15px', right: '10px', width: '130px', transform: 'rotate(12deg)' }}></div>
        </div>

        {/* Coretan / Tulisan Tangan di Background */}
        <div className="scribble" style={{ top: '22%', right: '18%', transform: 'rotate(-8deg)' }}>Good luck on your new adventure!</div>
        <div className="scribble" style={{ bottom: '12%', left: '12%', fontSize: '3rem', transform: 'rotate(5deg)' }}>#ERAPICKS</div>

        {/* --- KONTEN UTAMA (BOX TENGAH BERDENYUT) --- */}
        <div className="main-box relative z-10 flex flex-col items-center text-center px-6 py-12 lg:px-14 lg:py-16">
          
          {/* Isolasi menempelkan Box Tengah ke Layar */}
          <div className="washi-tape tape-blue" style={{ top: '-25px', left: '40%', width: '180px', transform: 'rotate(-2deg)' }}></div>

          {/* Subtitle Atas */}
          <div className="font-poppins font-bold text-[#2D1714] text-xl tracking-widest mb-4 border-b-4 border-[#2D1714] pb-2 uppercase">
            BPRS ERAFM UNJ
          </div>

          {/* Logo Group */}
          <div className="mb-10 relative mt-4">
            <h1 className="title-scrapbook">
              ERANIVESSARY
            </h1>
            <div className="absolute -bottom-6 -right-6 sticker-badge text-4xl">
              2026
            </div>
          </div>

          <p className="font-caveat text-4xl text-[#2D1714] mb-12 font-bold flex items-center gap-3 bg-[#FEFFAF] px-6 py-2 border-3 border-[#2D1714] transform rotate(-2deg) shadow-[6px_6px_0px_#2D1714]">
             <AiFillCamera />
             ARENA PRESTASI - 23 MEI 2026
          </p>

          {/* Tombol Mulai Besar (Dengan animasi Heartbeat) */}
          <button 
            onClick={startSession}
            className="btn-scrapbook group"
          >
            <AiFillCamera className="group-hover:scale-110 transition-transform duration-300" />
            <span>MULAI FOTO!</span>
          </button>

          {/* Teks Instruksi Bawah Bergoyang */}
          <p className="mt-10 font-poppins text-[#2D1714] font-black text-lg tracking-widest animate-bounce uppercase">
            Sentuh layar untuk memulai
          </p>

        </div>
      </div>
    </MainLayout>
  );
};

export default WelcomePage;
