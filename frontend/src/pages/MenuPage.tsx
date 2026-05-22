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

// --- CSS STYLES (SCRAPBOOK THEME) ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Shrikhand&family=Poppins:wght@400;600;800&family=Caveat:wght@700&display=swap');

  /* FONTS */
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

  /* --- BIG POLAROID FRAME (SCRAPBOOK STYLE) --- */
  .polaroid-container {
    position: relative;
    width: 100%;
    max-width: 650px; 
    margin: 0 auto;
    z-index: 20;
  }

  .polaroid-frame {
    background: #FFFAEE; /* Cream Paper */
    padding: 15px 15px 80px 15px;
    border: 4px solid #2D1714;
    box-shadow: 15px 15px 0 #78A2D2;
    transform: rotate(-1deg);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    animation: fadeIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
  }
  
  .polaroid-frame:hover {
    transform: rotate(0deg) scale(1.02);
    box-shadow: 20px 20px 0 #2D1714;
  }

  .photo-number {
    position: absolute; bottom: 20px; right: 25px;
    font-family: 'Shrikhand', serif; 
    color: #273A5D; 
    font-size: 2.5rem; 
    z-index: 0;
  }
  
  .handwriting {
    position: absolute; bottom: 25px; left: 25px;
    font-family: 'Caveat', cursive; 
    color: #2D1714; 
    font-size: 2.2rem; 
    font-weight: bold;
    z-index: 1;
  }

  /* --- FLOATING NAVIGATION BUTTONS --- */
  .nav-btn-scrap {
    position: absolute;
    top: 50%;
    transform: translateY(-70%); 
    width: 60px; height: 60px;
    background: #FEFFAF;
    border: 3px solid #2D1714;
    color: #2D1714;
    display: flex; align-items: center; justify-content: center;
    font-size: 2rem;
    cursor: pointer;
    box-shadow: 6px 6px 0 #2D1714;
    transition: all 0.1s;
    z-index: 50;
  }

  .nav-btn-scrap:active {
    background: #FFFAEE;
    transform: translateY(-70%) translate(4px, 4px);
    box-shadow: 0 0 0 #2D1714;
  }

  .nav-prev { left: -30px; }
  .nav-next { right: -30px; }

  @media (max-width: 768px) {
    .nav-btn-scrap { width: 50px; height: 50px; font-size: 1.5rem; }
    .nav-prev { left: -10px; }
    .nav-next { right: -10px; }
    .polaroid-container { padding: 0 20px; }
  }

  /* --- ACTION BUTTONS --- */
  .btn-scrapbook {
    border: 4px solid #2D1714;
    font-family: 'Shrikhand', serif;
    font-size: 1.4rem;
    padding: 16px 32px;
    transition: all 0.1s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
    cursor: pointer;
    z-index: 30;
  }

  .btn-save {
    background: #273A5D; 
    color: #FEFFAF; 
    box-shadow: 8px 8px 0 #9CA22A;
  }
  .btn-save:hover {
    transform: translate(-2px, -2px);
    box-shadow: 10px 10px 0 #9CA22A;
  }
  .btn-save:active {
    transform: translate(4px, 4px);
    box-shadow: 2px 2px 0 #9CA22A;
  }

  .btn-retake {
    background: #FFFAEE; 
    color: #2D1714; 
    box-shadow: 8px 8px 0 #2D1714;
  }
  .btn-retake:hover {
    transform: translate(-2px, -2px);
    box-shadow: 10px 10px 0 #2D1714;
  }
  .btn-retake:active {
    transform: translate(4px, 4px);
    box-shadow: 2px 2px 0 #2D1714;
  }

  /* --- MODAL SCRAPBOOK --- */
  .modal-scrapbook {
    background: #FFFAEE;
    border: 4px solid #2D1714;
    box-shadow: 15px 15px 0 #2D1714;
    position: relative;
    transform: rotate(1deg);
  }

  /* Coretan Background */
  .scribble {
    font-family: 'Caveat', cursive;
    color: #2D1714;
    font-size: 2.5rem;
    position: absolute;
    z-index: 0;
  }
`;

const MenuPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentPhotos } = usePhotos(); 

  const [sessionImages, setSessionImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showRetakeModal, setShowRetakeModal] = useState(false); 
  
  // State untuk Slideshow
  const [isPaused, setIsPaused] = useState(false);

  // Ambil gambar dari state navigasi atau context
  const { images } = (location.state || {}) as { images: string[] };

  useEffect(() => {
    if (currentPhotos && currentPhotos.length > 0) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSessionImages(currentPhotos);
    } else if (images && images.length > 0) {
        setSessionImages(images);
    } else {
        navigate('/');
    }
  }, [images, currentPhotos, navigate]);

  // --- LOGIC SLIDESHOW 2 DETIK ---
  useEffect(() => {
    if (sessionImages.length <= 1) return; 

    const interval = setInterval(() => {
        if (!isPaused) {
            setCurrentIndex((prev) => (prev + 1) % sessionImages.length);
        }
    }, 2000); 

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
      
      {/* Background transparan agar grid dari MainLayout terlihat */}
      <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">

        {/* --- DEKORASI LUAR (Coretan) --- */}
        <div className="scribble" style={{ top: '8%', left: '10%', transform: 'rotate(-10deg)' }}>Looking good!</div>
        <div className="scribble" style={{ bottom: '15%', right: '10%', transform: 'rotate(15deg)', fontSize: '3rem' }}>*Chef's Kiss*</div>

        {/* --- MAIN CONTENT --- */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pb-10">
            
            {/* Title */}
            <div className="text-center mb-6 z-30">
                <h2 className="font-shrikhand text-5xl md:text-6xl text-[#273A5D] drop-shadow-[4px_4px_0_#FEFFAF] tracking-wider transform -rotate-1">
                    PHOTO PREVIEW
                </h2>
                <div className="flex items-center justify-center gap-2 mt-4 bg-[#FFFAEE] border-2 border-[#2D1714] px-4 py-1 shadow-[4px_4px_0_#2D1714]">
                   {isPaused ? <AiFillPauseCircle className="text-[#2D1714] text-xl" /> : <AiFillPlayCircle className="text-[#2D1714] text-xl" />}
                   <p className="font-poppins text-sm text-[#2D1714] font-bold uppercase tracking-widest pt-1">
                       {isPaused ? "Paused" : "Auto Preview"}
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
                
                {/* Navigation Buttons */}
                <button onClick={prevImage} className="nav-btn-scrap nav-prev">
                    <AiFillCaretLeft />
                </button>
                <button onClick={nextImage} className="nav-btn-scrap nav-next">
                    <AiFillCaretRight />
                </button>

                {/* The Frame */}
                <div className="polaroid-frame w-full">
                    {/* Washi tape pada foto */}
                    <div className="washi-tape tape-yellow" style={{ top: '-15px', left: '35%', width: '130px', transform: 'rotate(-3deg)' }}></div>

                    {/* Aspect Ratio */}
                    <div className="w-full aspect-[4/3] bg-[#2D1714] overflow-hidden relative border-2 border-[#2D1714]">
                        <img 
                            src={sessionImages[currentIndex]} 
                            alt={`Snap ${currentIndex + 1}`} 
                            className="w-full h-full object-cover transition-opacity duration-500 filter contrast-110" 
                        />
                    </div>
                    
                    {/* Details */}
                    <span className="handwriting">Eranivessary '26</span>
                    <span className="photo-number">#{currentIndex + 1}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-5 w-full justify-center items-center mt-10">
                <button onClick={handleSave} className="btn-scrapbook btn-save min-w-[280px]">
                    <AiOutlineCloudUpload size={28} />
                    SIMPAN & PRINT
                </button>

                <button onClick={() => setShowRetakeModal(true)} className="btn-scrapbook btn-retake min-w-[200px]">
                    <AiOutlineDelete size={24} />
                    FOTO ULANG
                </button>
            </div>

        </div>

      </div>

      {/* --- MODAL WARNING (SCRAPBOOK THEME) --- */}
      {showRetakeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="modal-scrapbook p-8 max-w-sm w-full text-center">
                
                <div className="washi-tape tape-blue" style={{ top: '-15px', left: '10%', width: '100px', transform: 'rotate(-5deg)' }}></div>
                
                <div className="w-16 h-16 bg-[#FEFFAF] border-2 border-[#2D1714] shadow-[4px_4px_0_#2D1714] rounded-full flex items-center justify-center mx-auto mb-6 text-[#2D1714] text-4xl">
                    <AiFillWarning />
                </div>
                
                <h3 className="font-shrikhand text-3xl text-[#273A5D] mb-2 drop-shadow-[2px_2px_0_#9CA22A]">Foto Ulang?</h3>
                <p className="font-poppins text-[#2D1714] font-semibold mb-8 leading-relaxed px-2">
                    Foto yang sudah diambil akan terhapus. Yakin mau ulang?
                </p>
                
                <div className="flex flex-col gap-4">
                    <button onClick={confirmRetake} className="btn-scrapbook bg-[#9CA22A] text-[#FFFAEE] hover:bg-[#808722]">
                        YA, HAPUS & ULANG
                    </button>
                    <button onClick={() => setShowRetakeModal(false)} className="btn-scrapbook bg-[#FFFAEE] text-[#2D1714] shadow-none hover:shadow-[4px_4px_0_#2D1714]">
                        BATAL
                    </button>
                </div>

            </div>
        </div>
      )}

    </MainLayout>
  );
};

export default MenuPage;