/* src/pages/MenuPage.tsx */
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
    height: 40px;
    background-color: rgba(255,255,255,0.4);
    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    backdrop-filter: blur(2px);
    z-index: 30;
  }
  .tape-blue { background-color: rgba(120, 162, 210, 0.85); }   
  .tape-olive { background-color: rgba(156, 162, 42, 0.85); }    
  .tape-yellow { background-color: rgba(254, 255, 175, 0.95); }  
  .tape-pink { background-color: rgba(255, 182, 193, 0.85); }

  /* --- BIG POLAROID FRAME (SCRAPBOOK STYLE) --- */
  .polaroid-container {
    position: relative;
    width: 100%;
    max-width: 900px; /* DIPERBESAR AGAR FOTO SANGAT JELAS */
    margin: 0 auto;
    z-index: 20;
    padding: 0 20px;
  }

  .polaroid-frame {
    background: #FFFAEE; 
    padding: 20px 20px 100px 20px; /* Padding bawah lebih luas untuk teks */
    border: 5px solid #2D1714;
    box-shadow: 16px 16px 0 #78A2D2, 24px 24px 0 #2D1714; /* Shadow dobel agar timbul */
    transform: rotate(-1deg);
    transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.3s ease;
    animation: dropIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
  }
  
  .polaroid-frame:hover {
    transform: rotate(0deg) scale(1.02);
    box-shadow: 20px 20px 0 #2D1714;
  }

  @keyframes dropIn {
    0% { transform: scale(0.8) rotate(-5deg); opacity: 0; }
    100% { transform: scale(1) rotate(-1deg); opacity: 1; }
  }

  /* Animasi Transisi Foto Dalam Frame */
  .photo-slide-in {
    animation: fadeZoom 0.4s ease-out forwards;
  }
  @keyframes fadeZoom {
    0% { opacity: 0.5; transform: scale(0.98); filter: grayscale(50%); }
    100% { opacity: 1; transform: scale(1); filter: grayscale(0%); }
  }

  .photo-number {
    position: absolute; bottom: 20px; right: 30px;
    font-family: 'Shrikhand', serif; 
    color: #273A5D; 
    font-size: 4rem; 
    z-index: 0;
    text-shadow: 4px 4px 0 #FEFFAF;
  }
  
  .handwriting {
    position: absolute; bottom: 35px; left: 30px;
    font-family: 'Caveat', cursive; 
    color: #2D1714; 
    font-size: 3rem; 
    font-weight: bold;
    z-index: 1;
    transform: rotate(-2deg);
  }

  /* --- FLOATING NAVIGATION BUTTONS --- */
  .nav-btn-scrap {
    position: absolute;
    top: 50%;
    transform: translateY(-80%); 
    width: 75px; height: 75px;
    background: #FEFFAF;
    border: 5px solid #2D1714;
    color: #2D1714;
    display: flex; align-items: center; justify-content: center;
    font-size: 2.8rem;
    cursor: pointer;
    box-shadow: 6px 6px 0 #2D1714;
    transition: all 0.1s;
    z-index: 50;
    border-radius: 50%; /* Dibuat bulat lucu */
  }

  .nav-btn-scrap:active {
    background: #FFF;
    transform: translateY(-80%) translate(4px, 4px);
    box-shadow: 0 0 0 #2D1714;
  }

  .nav-prev { left: -35px; }
  .nav-next { right: -35px; }

  @media (max-width: 1024px) {
    .nav-btn-scrap { width: 60px; height: 60px; font-size: 2rem; }
    .nav-prev { left: 5px; }
    .nav-next { right: 5px; }
  }

  /* --- ACTION BUTTONS --- */
  .btn-scrapbook {
    border: 5px solid #2D1714;
    font-family: 'Shrikhand', serif;
    font-size: 1.6rem;
    padding: 18px 35px;
    transition: all 0.1s;
    display: flex; align-items: center; justify-content: center; gap: 12px;
    cursor: pointer;
    z-index: 30;
  }

  .btn-save {
    background: #273A5D; 
    color: #FEFFAF; 
    box-shadow: 8px 8px 0 #9CA22A;
  }
  .btn-save:hover {
    transform: translate(-3px, -3px) rotate(-1deg);
    box-shadow: 11px 11px 0 #9CA22A;
  }
  .btn-save:active {
    transform: translate(5px, 5px) rotate(0deg);
    box-shadow: 0 0 0 #9CA22A;
  }

  .btn-retake {
    background: #FFFAEE; 
    color: #2D1714; 
    box-shadow: 8px 8px 0 #2D1714;
  }
  .btn-retake:hover {
    transform: translate(-3px, -3px) rotate(1deg);
    box-shadow: 11px 11px 0 #2D1714;
  }
  .btn-retake:active {
    transform: translate(5px, 5px) rotate(0deg);
    box-shadow: 0 0 0 #2D1714;
  }

  /* --- MODAL SCRAPBOOK --- */
  .modal-scrapbook {
    background: #FFFAEE;
    border: 5px solid #2D1714;
    box-shadow: 16px 16px 0 #2D1714;
    position: relative;
    transform: rotate(1deg);
  }

  /* Coretan Background */
  .scribble {
    font-family: 'Caveat', cursive;
    color: #2D1714;
    position: absolute;
    z-index: 0;
  }

  /* Indikator Status Auto Preview */
  .status-badge {
    display: inline-flex;
    align-items: center; justify-content: center; gap: 8px;
    background: #FEFFAF;
    border: 3px solid #2D1714;
    padding: 8px 20px;
    box-shadow: 5px 5px 0 #2D1714;
    font-family: 'Poppins', sans-serif;
    font-size: 1rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    transform: rotate(1deg);
    margin-top: 15px;
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
      
      {/* Background Kertas Garis-Garis */}
      <div 
        className="w-full min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-[#FFFAEE]"
        style={{ backgroundImage: `repeating-linear-gradient(transparent, transparent 39px, #78A2D2 39px, #78A2D2 40px)` }}
      >

        {/* --- DEKORASI LUAR (Coretan) --- */}
        <div className="scribble text-5xl lg:text-6xl" style={{ top: '6%', left: '8%', transform: 'rotate(-10deg)' }}>Looking good!</div>
        <div className="scribble text-5xl text-[#9CA22A]" style={{ bottom: '15%', right: '5%', transform: 'rotate(15deg)' }}>Best Shots</div>

        {/* --- MAIN CONTENT --- */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full h-full pb-10 mt-10 lg:mt-0">
            
            {/* Title & Status */}
            <div className="text-center mb-8 z-30">
                <h2 className="font-shrikhand text-5xl md:text-6xl lg:text-7xl text-[#273A5D] drop-shadow-[4px_4px_0_#FEFFAF] tracking-wider transform -rotate-1 bg-[#FFFAEE] px-8 py-2 border-4 border-[#2D1714] inline-block">
                    PHOTO PREVIEW
                </h2>
                <div className="block mt-2">
                    <div className="status-badge">
                       {isPaused ? <AiFillPauseCircle className="text-[#FF5757] text-2xl" /> : <AiFillPlayCircle className="text-[#9CA22A] text-2xl" />}
                       <p className="text-[#2D1714] pt-1">
                           {isPaused ? "Paused" : "Auto Preview"}
                       </p>
                    </div>
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
                
                {/* Navigation Buttons (Kiri - Kanan) */}
                <button onClick={prevImage} className="nav-btn-scrap nav-prev">
                    <AiFillCaretLeft />
                </button>
                <button onClick={nextImage} className="nav-btn-scrap nav-next">
                    <AiFillCaretRight />
                </button>

                {/* The Polaroid Frame */}
                <div className="polaroid-frame w-full">
                    {/* Washi Tapes Penghias Frame */}
                    <div className="washi-tape tape-yellow" style={{ top: '-20px', left: '30%', width: '180px', transform: 'rotate(-3deg)' }}></div>
                    <div className="washi-tape tape-olive" style={{ top: '-10px', right: '-10px', width: '100px', transform: 'rotate(45deg)' }}></div>
                    <div className="washi-tape tape-blue" style={{ bottom: '50px', left: '-15px', width: '90px', transform: 'rotate(35deg)' }}></div>

                    {/* Image Area (Aspect Ratio 16:9 agar tidak terpotong) */}
                    <div className="w-full aspect-video bg-[#2D1714] overflow-hidden relative border-4 border-[#2D1714] shadow-inner">
                        {/* Menambahkan key={currentIndex} agar animasi berjalan ulang tiap foto berganti */}
                        <img 
                            key={currentIndex}
                            src={sessionImages[currentIndex]} 
                            alt={`Snap ${currentIndex + 1}`} 
                            className="w-full h-full object-cover filter contrast-110 photo-slide-in" 
                        />
                    </div>
                    
                    {/* Details di Bawah Frame */}
                    <span className="handwriting">Eranivessary '26</span>
                    <span className="photo-number">#{currentIndex + 1}</span>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col md:flex-row gap-6 w-full justify-center items-center mt-12 z-30 px-4">
                <button onClick={handleSave} className="btn-scrapbook btn-save min-w-[300px]">
                    <AiOutlineCloudUpload size={32} />
                    SIMPAN & LANJUT
                </button>

                <button onClick={() => setShowRetakeModal(true)} className="btn-scrapbook btn-retake min-w-[220px]">
                    <AiOutlineDelete size={28} />
                    FOTO ULANG
                </button>
            </div>

        </div>

      </div>

      {/* --- MODAL WARNING (SCRAPBOOK THEME) --- */}
      {showRetakeModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="modal-scrapbook p-8 max-w-md w-full text-center">
                
                <div className="washi-tape tape-pink" style={{ top: '-15px', left: '10%', width: '120px', transform: 'rotate(-5deg)' }}></div>
                
                <div className="w-20 h-20 bg-[#FEFFAF] border-4 border-[#2D1714] shadow-[6px_6px_0_#2D1714] rounded-full flex items-center justify-center mx-auto mb-6 text-[#2D1714] text-5xl">
                    <AiFillWarning />
                </div>
                
                <h3 className="font-shrikhand text-4xl text-[#273A5D] mb-3 drop-shadow-[2px_2px_0_#9CA22A]">Foto Ulang?</h3>
                <p className="font-poppins text-[#2D1714] text-lg font-semibold mb-8 leading-relaxed px-2">
                    Foto yang sudah diambil akan terhapus semua. Yakin mau ulang sesi ini?
                </p>
                
                <div className="flex flex-col gap-4">
                    <button onClick={confirmRetake} className="btn-scrapbook bg-[#FF5757] text-[#FFFAEE] border-[#2D1714] hover:translate-y-1 hover:shadow-none shadow-[4px_4px_0_#2D1714]">
                        YA, HAPUS & ULANG
                    </button>
                    <button onClick={() => setShowRetakeModal(false)} className="btn-scrapbook bg-[#FFFAEE] text-[#2D1714] border-[#2D1714] shadow-none hover:shadow-[4px_4px_0_#2D1714] transition-all">
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
