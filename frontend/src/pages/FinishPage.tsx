/* src/pages/FinishPage.tsx */
import { useLocation, useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import QRCode from 'react-qr-code';
import { AiOutlineArrowRight } from 'react-icons/ai';
import { FaCameraRetro } from 'react-icons/fa'; 
import { useState } from 'react';
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
  .tape-blue { background-color: rgba(120, 162, 210, 0.85); }
  .tape-olive { background-color: rgba(156, 162, 42, 0.85); }
  .tape-yellow { background-color: rgba(254, 255, 175, 0.95); }

  /* Layout */
  .finish-grid {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    max-width: 1100px;
    gap: 40px;
    padding: 20px;
    z-index: 10;
  }

  @media (min-width: 1024px) {
    .finish-grid {
      flex-direction: row; /* Horizontal */
      align-items: center;
      gap: 60px;
    }
  }

  /* Frame Preview (Horizontal Layout) */
  .frame-container {
    display: flex;
    flex-direction: row;
    gap: 20px;
    justify-content: center;
    position: relative;
  }

  .frame-preview {
    background: #FFFAEE;
    padding: 12px;
    border: 3px solid #2D1714;
    box-shadow: 8px 8px 0 rgba(45,23,20,0.3);
    transform: rotate(-2deg);
    transition: 0.3s;
    position: relative;
  }
  .frame-preview:nth-child(even) {
    transform: rotate(2deg);
    box-shadow: 8px 8px 0 #9CA22A;
  }
  .frame-preview:hover { transform: rotate(0deg) scale(1.03); box-shadow: 10px 10px 0 #2D1714; z-index: 20; }

  /* QR CODE CARD */
  .qr-card-container {
    background: #FFFAEE;
    border: 4px solid #2D1714;
    padding: 35px 30px;
    box-shadow: 12px 12px 0 #78A2D2;
    text-align: center;
    width: 100%;
    max-width: 440px;
    position: relative;
    transform: rotate(1deg);
  }

  /* QR Box Besar */
  .qr-box-white {
    background: #FFF;
    padding: 20px;
    border: 4px solid #2D1714;
    box-shadow: 6px 6px 0 #2D1714;
    margin: 20px auto;
    display: inline-block;
  }

  /* Teks URL Link */
  .qr-link-text {
    font-family: 'Poppins', sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    color: #2D1714;
    background: #FEFFAF;
    padding: 10px;
    border: 2px dashed #2D1714;
    margin-top: -10px;
    margin-bottom: 25px;
    word-break: break-all;
    box-shadow: inset 0 0 5px rgba(0,0,0,0.05);
  }

  .btn-finish {
    background: #273A5D;
    color: #FEFFAF;
    font-family: 'Shrikhand', serif;
    font-size: 1.8rem;
    padding: 15px 25px;
    width: 100%;
    border: 3px solid #2D1714;
    box-shadow: 6px 6px 0 #9CA22A;
    transition: all 0.1s;
    display: flex; justify-content: center; align-items: center; gap: 12px;
    cursor: pointer;
  }
  .btn-finish:active {
    transform: translate(4px, 4px);
    box-shadow: 0 0 0 #9CA22A;
  }

  /* Scribbles */
  .scribble { font-family: 'Caveat', cursive; color: #2D1714; position: absolute; z-index: 0; }
`;

const FinishPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { driveLink, savedFrames } = (location.state || {}) as { driveLink: string, savedFrames: string[] };
  const [showConfirm, setShowConfirm] = useState(false);

  // Jika tidak ada data dari state sebelumnya, tampilkan info
  if (!driveLink && !savedFrames) {
      return (
          <MainLayout>
              <div className="w-full min-h-screen bg-[#FFFAEE] flex items-center justify-center flex-col">
                  <h1 className="font-shrikhand text-3xl mb-4">Tidak ada sesi aktif.</h1>
                  <button onClick={() => navigate('/')} className="bg-[#273A5D] text-[#FEFFAF] px-6 py-3 border-2 border-[#2D1714] font-shrikhand">Kembali ke Home</button>
              </div>
          </MainLayout>
      );
  }

  return (
    <MainLayout>
      <style>{styles}</style>
      
      <div 
        className="w-full min-h-screen flex flex-col items-center justify-center py-10 relative overflow-hidden bg-[#FFFAEE]"
        style={{ backgroundImage: `repeating-linear-gradient(transparent, transparent 39px, #78A2D2 39px, #78A2D2 40px)` }}
      >
        
        {/* Dekorasi Coretan Scrapbook (Moodboard) */}
        <div className="scribble text-5xl" style={{ top: '8%', left: '8%', transform: 'rotate(-10deg)' }}>All Done!</div>
        <div className="scribble text-6xl text-[#9CA22A]" style={{ bottom: '10%', right: '8%', transform: 'rotate(15deg)' }}>Yaaay!</div>
        <div className="scribble text-4xl text-[#78A2D2]" style={{ top: '15%', right: '12%', transform: 'rotate(-5deg)' }}>Scan Me</div>

        {/* Header */}
        <div className="mb-12 text-center z-10 mt-6 lg:mt-0">
            <h1 className="font-shrikhand text-5xl lg:text-6xl text-[#273A5D] drop-shadow-[4px_4px_0_#FEFFAF] transform -rotate-1 bg-[#FFFAEE] px-8 py-3 border-4 border-[#2D1714] inline-block">
                SESSION COMPLETED
            </h1>
            <div className="block mt-6">
                <div className="inline-block bg-[#FEFFAF] px-8 py-2 border-4 border-[#2D1714] font-caveat text-3xl font-bold shadow-[4px_4px_0_#2D1714] transform rotate-2">
                     <FaCameraRetro className="inline mr-2 mb-1 text-[#273A5D]"/> 
                     {savedFrames?.length || 0} Frames Ready
                </div>
            </div>
        </div>

        {/* Main Grid: Frame di Kiri, QR di Kanan */}
        <div className="finish-grid">
            
            {/* LEFT: Frames Preview */}
            <div className="frame-container">
                <div className="washi-tape tape-olive" style={{ top: '-15px', left: '10%', width: '120px', transform: 'rotate(4deg)', zIndex: 30 }}></div>
                <div className="washi-tape tape-yellow" style={{ top: '-10px', right: '15%', width: '100px', transform: 'rotate(-5deg)', zIndex: 30 }}></div>
                
                {savedFrames?.map((frame, i) => (
                    <div key={i} className="frame-preview">
                        <div className="absolute -top-4 -left-4 bg-[#2D1714] text-[#FFFAEE] font-shrikhand px-3 py-1 transform -rotate-12 z-20 text-xs border-2 border-[#FFFAEE] shadow-[3px_3px_0_#9CA22A]">
                            FRAME {i + 1}
                        </div>
                        <img src={frame} alt={`Frame ${i+1}`} className="w-[170px] lg:w-[220px] object-contain border-2 border-[#2D1714]" />
                    </div>
                ))}
            </div>

            {/* RIGHT: QR CARD */}
            <div className="qr-card-container">
                <div className="washi-tape tape-blue" style={{ top: '-15px', right: '-15px', width: '120px', transform: 'rotate(45deg)' }}></div>
                
                <h2 className="font-shrikhand text-3xl lg:text-4xl text-[#2D1714] mb-2 drop-shadow-[2px_2px_0_#FEFFAF]">
                    GET YOUR PHOTOS!
                </h2>
                
                <div className="qr-box-white">
                    {/* Ukuran QR Diperbesar ke 250 */}
                    <QRCode value={driveLink || 'https://google.com'} size={250} fgColor="#2D1714" />
                </div>

                <div className="qr-link-text">
                    <span className="opacity-80 block mb-1">Atau akses link berikut:</span>
                    <a href={driveLink} target="_blank" rel="noreferrer" className="text-blue-700 underline font-bold">
                        {driveLink || 'No Link Provided'}
                    </a>
                </div>

                <button onClick={() => setShowConfirm(true)} className="btn-finish">
                    SELESAI <AiOutlineArrowRight size={24} />
                </button>
            </div>
        </div>
      </div>

      <ConfirmationModal 
        isOpen={showConfirm}
        title="SUDAH DISIMPAN?"
        message="Link download dan foto tidak akan bisa diakses kembali setelah kamu keluar."
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
