import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { usePhotos } from '../context/PhotoContext';
import { AiFillCamera } from 'react-icons/ai';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Shrikhand&family=Poppins:wght@400;600;800&family=Caveat:wght@700&display=swap');

  .font-shrikhand { font-family: 'Shrikhand', serif; }
  .font-poppins { font-family: 'Poppins', sans-serif; }
  .font-caveat { font-family: 'Caveat', cursive; }

  /* Washi Tape Decorations */
  .washi-tape {
    position: absolute;
    height: 35px;
    background-color: rgba(255,255,255,0.4);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    backdrop-filter: blur(2px);
    z-index: 10;
  }
  .tape-blue { background-color: rgba(120, 162, 210, 0.8); } /* #78A2D2 */
  .tape-olive { background-color: rgba(156, 162, 42, 0.8); } /* #9CA22A */
  .tape-yellow { background-color: rgba(254, 255, 175, 0.9); } /* #FEFFAF */

  /* Polaroid Decorations */
  .polaroid-deco {
    background: #FFF;
    padding: 10px 10px 40px 10px;
    border: 2px solid #2D1714;
    box-shadow: 6px 6px 0px rgba(45, 23, 20, 0.2);
    position: absolute;
    z-index: 0;
  }

  /* Main Title with Hard Shadow */
  .title-scrapbook {
    font-family: 'Shrikhand', serif;
    font-size: clamp(3.5rem, 8vw, 6rem);
    color: #273A5D; /* Navy Blue */
    -webkit-text-stroke: 2px #2D1714;
    text-shadow: 6px 6px 0px #78A2D2, 8px 8px 0px #2D1714;
    line-height: 1.1;
    text-align: center;
    transform: rotate(-2deg);
  }

  /* Ripped Badge / Sticker */
  .sticker-badge {
    background: #9CA22A; /* Olive */
    color: #FFFAEE;
    font-family: 'Poppins', sans-serif;
    font-weight: 800;
    padding: 5px 25px;
    border: 3px solid #2D1714;
    box-shadow: 4px 4px 0px #2D1714;
    transform: rotate(4deg);
    display: inline-block;
  }

  /* Scrapbook Button */
  .btn-scrapbook {
    background: #273A5D; /* Navy Blue */
    color: #FEFFAF; /* Light Yellow */
    font-family: 'Shrikhand', serif;
    font-size: 2.2rem;
    padding: 15px 50px;
    border: 4px solid #2D1714;
    box-shadow: 8px 8px 0px #78A2D2, 10px 10px 0px #2D1714;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.1s ease-in-out;
    display: flex; align-items: center; gap: 15px;
    position: relative;
    z-index: 20;
  }

  .btn-scrapbook:hover {
    transform: translate(-2px, -2px);
    box-shadow: 10px 10px 0px #78A2D2, 12px 12px 0px #2D1714;
    background: #1f2e4a;
  }

  .btn-scrapbook:active {
    transform: translate(6px, 6px);
    box-shadow: 2px 2px 0px #78A2D2, 4px 4px 0px #2D1714;
  }

  /* Pen scribbles */
  .scribble {
    font-family: 'Caveat', cursive;
    color: #2D1714;
    font-size: 2rem;
    position: absolute;
    transform: rotate(-10deg);
  }
`;

const WelcomePage = () => {
  const navigate = useNavigate();
  const { clearPhotos } = usePhotos();

  const startSession = () => {
    setTimeout(() => {
        clearPhotos();
        navigate('/camera');
    }, 150);
  };

  return (
    <MainLayout isFullScreen={true}>
      <style>{styles}</style>
      <div className="w-full h-full flex flex-col items-center justify-center relative select-none">
        
        {/* --- DEKORASI SCRAPBOOK (BACKGROUND) --- */}
        
        {/* Polaroid Kiri */}
        <div className="polaroid-deco" style={{ top: '15%', left: '8%', transform: 'rotate(-15deg)', width: '200px', height: '240px' }}>
            <div className="w-full h-full bg-[#78A2D2] border-2 border-[#2D1714]"></div>
            <div className="washi-tape tape-yellow" style={{ top: '-10px', left: '20px', width: '100px', transform: 'rotate(-5deg)' }}></div>
        </div>

        {/* Polaroid Kanan */}
        <div className="polaroid-deco" style={{ bottom: '20%', right: '10%', transform: 'rotate(10deg)', width: '220px', height: '260px' }}>
            <div className="w-full h-full bg-[#9CA22A] border-2 border-[#2D1714]"></div>
            <div className="washi-tape tape-blue" style={{ top: '-15px', right: '10px', width: '120px', transform: 'rotate(12deg)' }}></div>
        </div>

        {/* Coretan / Tulisan Tangan */}
        <div className="scribble" style={{ top: '25%', right: '20%' }}>Good luck on your new adventure!</div>
        <div className="scribble" style={{ bottom: '15%', left: '15%', fontSize: '2.5rem' }}>#ERAPICKS</div>

        {/* --- KONTEN UTAMA --- */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 bg-[#FFFAEE]/80 p-10 rounded-xl border-[3px] border-dashed border-[#2D1714] shadow-[10px_10px_0px_#9CA22A]">
          
          {/* Isolasi untuk konten tengah */}
          <div className="washi-tape tape-blue" style={{ top: '-20px', left: '40%', width: '150px', transform: 'rotate(-2deg)' }}></div>

          {/* Subtitle Atas (Sesuai Moodboard) */}
          <div className="font-poppins font-bold text-[#2D1714] text-lg tracking-widest mb-2 border-b-2 border-[#2D1714] pb-1 uppercase">
            BPRS ERAFM UNJ
          </div>

          {/* Logo Group */}
          <div className="mb-6 relative mt-4">
            <h1 className="title-scrapbook">
              ERANIVESSARY
            </h1>
            <div className="absolute -bottom-4 -right-4 sticker-badge text-3xl">
              2026
            </div>
          </div>

          <p className="font-caveat text-3xl text-[#2D1714] mb-8 font-bold flex items-center gap-2 bg-[#FEFFAF] px-4 py-1 border-2 border-[#2D1714] transform rotate(-2deg)">
             <AiFillCamera />
             ARENA PRESTASI - 23 MEI 2026
          </p>

          {/* Tombol Mulai Besar */}
          <button 
            onClick={startSession}
            className="btn-scrapbook group"
          >
            <AiFillCamera className="group-hover:scale-110 transition-transform duration-300" />
            <span>MULAI FOTO!</span>
          </button>

          <p className="mt-8 font-poppins text-[#2D1714] font-bold text-sm tracking-widest animate-bounce">
            SENTUH LAYAR UNTUK MEMULAI
          </p>

        </div>
      </div>
    </MainLayout>
  );
};

export default WelcomePage;