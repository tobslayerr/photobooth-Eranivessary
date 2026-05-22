/* eslint-disable @typescript-eslint/ban-ts-comment */
/* src/pages/LoadingPage.tsx */
import MainLayout from '../components/MainLayout';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { base64ToFile } from '../utils/fileHelpers';
// @ts-expect-error
import gifshot from 'gifshot';

// --- STYLES (SCRAPBOOK THEME) ---
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

  /* SCRAPBOOK CARD */
  .scrapbook-card {
    background: #FFFAEE; 
    border: 4px solid #2D1714;
    padding: 40px 30px;
    box-shadow: 15px 15px 0px #78A2D2; 
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 450px;
    width: 90%;
    position: relative;
    transform: rotate(1deg);
    animation: floating 4s ease-in-out infinite;
  }

  @keyframes floating {
    0%, 100% { transform: translateY(0) rotate(1deg); }
    50% { transform: translateY(-5px) rotate(0deg); }
  }

  /* PHOTO PREVIEW BOX */
  .photo-preview {
    width: 130px; 
    height: 350px; 
    padding: 8px;
    background: #FFFAEE;
    border: 3px solid #2D1714;
    box-shadow: 8px 8px 0px rgba(45, 23, 20, 0.3);
    transform: rotate(-3deg);
    margin-bottom: 30px;
    position: relative;
    transition: transform 0.3s;
  }
  .photo-preview:hover {
    transform: rotate(0deg) scale(1.05);
  }

  /* RETRO ANIMATED PROGRESS BAR */
  .progress-track {
    background: #FFFAEE;
    border: 4px solid #2D1714;
    height: 28px;
    width: 100%;
    position: relative;
    margin-top: 10px;
    box-shadow: 4px 4px 0px #2D1714;
    overflow: hidden;
  }
  
  .progress-fill {
    background: repeating-linear-gradient(
      45deg,
      #9CA22A,
      #9CA22A 15px,
      #868b24 15px,
      #868b24 30px
    );
    background-size: 42px 42px;
    height: 100%;
    transition: width 0.3s ease-out;
    border-right: 4px solid #2D1714;
    animation: moveStripes 1s linear infinite;
  }

  @keyframes moveStripes {
    0% { background-position: 0 0; }
    100% { background-position: 42px 0; }
  }

  /* Coretan Background & Ornamen */
  .scribble {
    font-family: 'Caveat', cursive;
    color: #2D1714;
    position: absolute;
    z-index: 0;
  }

  .badge-stamp {
    position: absolute;
    bottom: 20px;
    right: -20px;
    background: #FEFFAF;
    border: 3px solid #2D1714;
    color: #2D1714;
    font-family: 'Shrikhand', serif;
    padding: 5px 15px;
    transform: rotate(-15deg);
    box-shadow: 4px 4px 0 #2D1714;
    font-size: 1.2rem;
    z-index: 20;
  }
`;

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isProcessing = useRef(false);
  
  const [progress, setProgress] = useState(0);

  // Menangkap gifFrames dari route sebelumnya (SoftcopyPage)
  const { sessionId, contactName, rawPhotos, savedFrames, gifFrames } = (location.state || {}) as {
      sessionId: string | null,
      contactName: string,
      rawPhotos: string[],
      savedFrames: string[],
      gifFrames?: string[] // Berisi 3 array string gambar
  };

  const previewImage = savedFrames && savedFrames.length > 0 ? savedFrames[0] : null;

  // Efek memuat (Progress bar visual)
  useEffect(() => {
    const interval = setInterval(() => {
        setProgress((prev) => {
            if (prev >= 90) return 90; // Mentok di 90% sampai API selesai
            return prev + Math.random() * 8; 
        });
    }, 400);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!contactName || !rawPhotos || !savedFrames) {
        navigate('/menu');
        return;
    }

    const processUpload = async () => {
        if (isProcessing.current) return;
        isProcessing.current = true;

        try {
            const formData = new FormData();
            formData.append('session_id', sessionId || '');
            formData.append('contact_name', contactName);
            
            // 1. Upload 3 Foto Asli (Mentah) ke Folder "non_frame_files"
            for (let i = 0; i < rawPhotos.length; i++) {
                const f = await base64ToFile(rawPhotos[i], `original_${i+1}.jpg`);
                formData.append('non_frame_files', f);
            }

            // 2. GENERATE ANIMASI GIF DARI 3 FOTO (SLIDESHOW)
            if (gifFrames && gifFrames.length > 0) {
                // Membuat animasi GIF menggunakan gifshot
                const animatedGifBase64 = await new Promise<string>((resolve, reject) => {
                    gifshot.createGIF({
                        images: gifFrames, // Array 3 gambar 16:9 dari SoftcopyPage
                        gifWidth: 1920,
                        gifHeight: 1080,
                        interval: 2, // Durasi: 2 Detik per foto
                        numFrames: gifFrames.length
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    }, function(obj: any) {
                        if (!obj.error) {
                            resolve(obj.image); // Menghasilkan "data:image/gif;base64,..."
                        } else {
                            reject(obj.error);
                        }
                    });
                });

                // Convert file GIF yang sudah jadi ke File object lalu simpan di folder non_frame_files
                const gifFile = await base64ToFile(animatedGifBase64, `slideshow_animasi.gif`);
                formData.append('non_frame_files', gifFile);
            }

            // 3. Upload Frame Cetak Hasil Edit (Photobooth) ke Folder "frame_files"
            for (let i = 0; i < savedFrames.length; i++) {
                const base64Str = savedFrames[i];
                let extension = '.jpg';
                if (base64Str.startsWith('data:image/gif')) extension = '.gif';
                const f = await base64ToFile(base64Str, `frame_${i+1}${extension}`);
                formData.append('frame_files', f);
            }

            // Mengirim ke API Backend
            const response = await api.post('/softcopy/upload-framed', formData);
            const driveLink = response.data.driveLink;

            setProgress(100);
            
            setTimeout(() => {
                navigate('/finish', {
                    state: {
                        driveLink: driveLink,
                        savedFrames: savedFrames,
                        rawPhotos: rawPhotos,
                        contactName: contactName
                    }
                });
            }, 800);

        } catch (err) {
            console.error("Upload Failed:", err);
            alert("Gagal memproses/mengupload foto. Silakan coba lagi.");
            navigate('/softcopy', { state: { images: rawPhotos } });
        }
    };

    // Jeda 1 detik agar animasi UI memuat terlihat bagus
    setTimeout(processUpload, 1000);
  }, [navigate, location.state, sessionId, contactName, rawPhotos, savedFrames, gifFrames]); 

  return (
    <MainLayout>
      <style>{styles}</style>
      
      {/* Background utama dengan efek dotted paper */}
      <div 
        className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden bg-[#FFFAEE]"
        style={{
            backgroundImage: `radial-gradient(rgba(120, 162, 210, 0.4) 2px, transparent 2px)`,
            backgroundSize: '30px 30px'
        }}
      >
        
        {/* --- DEKORASI LUAR (Scribbles & Stars) --- */}
        <div className="scribble font-bold" style={{ top: '15%', left: '8%', transform: 'rotate(-15deg)', fontSize: '3rem' }}>Just a sec!</div>
        <div className="scribble font-shrikhand text-[#78A2D2]" style={{ top: '20%', right: '10%', transform: 'rotate(20deg)', fontSize: '4rem' }}>★</div>
        <div className="scribble" style={{ bottom: '15%', right: '12%', transform: 'rotate(10deg)', fontSize: '2.5rem' }}>Creating GIF...</div>
        <div className="scribble font-shrikhand text-[#9CA22A]" style={{ bottom: '20%', left: '10%', transform: 'rotate(-20deg)', fontSize: '3rem' }}>★</div>

        {/* --- MAIN CONTENT (SCRAPBOOK CARD) --- */}
        <div className="relative z-20 w-full flex justify-center px-4">
            
            <div className="scrapbook-card">
                
                {/* Washi Tapes */}
                <div className="washi-tape tape-yellow" style={{ top: '-15px', left: '-20px', width: '120px', transform: 'rotate(-40deg)' }}></div>
                <div className="washi-tape tape-blue" style={{ top: '-15px', right: '-20px', width: '100px', transform: 'rotate(45deg)' }}></div>

                {/* Stempel/Badge */}
                <div className="badge-stamp">PLEASE WAIT</div>

                {/* Title */}
                <h2 className="font-shrikhand text-4xl lg:text-5xl text-[#273A5D] mb-8 tracking-wide drop-shadow-[3px_3px_0_#9CA22A]">
                    UPLOADING
                    <span className="animate-pulse">...</span>
                </h2>

                {/* Photo Preview (Photostrip Mode) */}
                <div className="photo-preview">
                    <div className="washi-tape tape-olive" style={{ top: '-10px', left: '20%', width: '60%', height: '20px', transform: 'rotate(3deg)', zIndex: 20 }}></div>
                    
                    {previewImage ? (
                        <div className="w-full h-full bg-[#2D1714] overflow-hidden border-2 border-[#2D1714]">
                            <img src={previewImage} alt="Uploading" className="w-full h-full object-cover filter contrast-110" />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-[#FFFAEE] border-2 border-[#2D1714] flex flex-col items-center justify-center text-[#2D1714] font-caveat text-xl font-bold">
                            <span className="animate-bounce text-4xl mb-2">📸</span>
                            Wait...
                        </div>
                    )}
                </div>

                {/* Progress Bar Container */}
                <div className="w-full mt-4">
                    <div className="flex justify-between text-[#2D1714] font-poppins font-bold text-sm mb-1 px-1 uppercase tracking-widest border-b-2 border-[#2D1714] pb-1">
                        <span>Saving Memories</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    
                    <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                    </div>

                    <p className="text-[#2D1714] font-caveat text-center mt-6 text-2xl font-bold leading-tight">
                        Merangkai foto & membuat GIF...
                    </p>
                </div>
            </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoadingPage;