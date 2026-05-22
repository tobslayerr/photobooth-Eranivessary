import MainLayout from '../components/MainLayout';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { base64ToFile } from '../utils/fileHelpers';

// --- STYLES ---
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

  /* SCRAPBOOK CARD */
  .scrapbook-card {
    background: #FFFAEE;
    border: 4px solid #2D1714;
    padding: 40px 30px;
    box-shadow: 12px 12px 0px #78A2D2;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 450px;
    width: 90%;
    position: relative;
    transform: rotate(1deg);
    animation: slightShake 3s ease-in-out infinite alternate;
  }

  @keyframes slightShake {
    0% { transform: rotate(1deg); }
    100% { transform: rotate(-1deg); }
  }

  /* PHOTO STRIP (VERTICAL) */
  .photo-strip {
    width: 140px; 
    height: 380px; 
    padding: 8px;
    background: #FFFAEE;
    border: 2px solid #2D1714;
    box-shadow: 6px 6px 0px rgba(45, 23, 20, 0.3);
    transform: rotate(-3deg);
    margin-bottom: 30px;
    transition: transform 0.3s ease;
    position: relative;
  }
  
  .photo-strip:hover {
    transform: rotate(0deg) scale(1.05) translateY(-5px);
    box-shadow: 8px 12px 0px rgba(45, 23, 20, 0.4);
    z-index: 20;
  }

  /* RETRO PROGRESS BAR */
  .progress-track {
    background: #FFFAEE;
    border: 3px solid #2D1714;
    height: 24px;
    width: 100%;
    position: relative;
    margin-top: 10px;
    box-shadow: 4px 4px 0px #2D1714;
    overflow: hidden;
  }
  
  .progress-fill {
    background: #9CA22A; /* Olive Green */
    height: 100%;
    transition: width 0.3s ease-out;
    border-right: 3px solid #2D1714;
    position: relative;
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

const LoadingPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isProcessing = useRef(false);
  
  const [progress, setProgress] = useState(0);

  const { sessionId, contactName, rawPhotos, savedFrames } = (location.state || {}) as {
      sessionId: string | null,
      contactName: string,
      rawPhotos: string[],
      savedFrames: string[]
  };

  const previewImage = savedFrames && savedFrames.length > 0 ? savedFrames[0] : null;

  useEffect(() => {
    const interval = setInterval(() => {
        setProgress((prev) => {
            if (prev >= 90) return 90;
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
            
            for (let i = 0; i < rawPhotos.length; i++) {
                const f = await base64ToFile(rawPhotos[i], `original_${i+1}.jpg`);
                formData.append('non_frame_files', f);
            }

            for (let i = 0; i < savedFrames.length; i++) {
                const base64Str = savedFrames[i];
                let extension = '.jpg';
                if (base64Str.startsWith('data:image/gif')) extension = '.gif';
                const f = await base64ToFile(base64Str, `frame_${i+1}${extension}`);
                formData.append('frame_files', f);
            }

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
            alert("Gagal mengupload foto. Silakan coba lagi.");
            navigate('/softcopy', { state: { images: rawPhotos } });
        }
    };

    setTimeout(processUpload, 1000);

  }, [navigate, location.state, sessionId, contactName, rawPhotos, savedFrames]); 

  return (
    <MainLayout isFullScreen={true}>
      <style>{styles}</style>
      
      {/* Container utama transparan karena background kertas grid sudah ada di MainLayout */}
      <div className="w-full h-full flex flex-col items-center justify-center relative overflow-hidden">
        
        {/* --- DEKORASI LUAR (Coretan) --- */}
        <div className="scribble" style={{ top: '15%', left: '10%', transform: 'rotate(-15deg)' }}>Hold on tight!</div>
        <div className="scribble" style={{ bottom: '20%', right: '15%', transform: 'rotate(10deg)', fontSize: '3rem' }}>Almost done...</div>

        {/* --- MAIN CONTENT (SCRAPBOOK PAPER CARD) --- */}
        <div className="relative z-20 w-full flex justify-center px-4">
            
            <div className="scrapbook-card">
                
                {/* Washi Tapes menempelkan card ke background */}
                <div className="washi-tape tape-yellow" style={{ top: '-15px', left: '-20px', width: '100px', transform: 'rotate(-45deg)' }}></div>
                <div className="washi-tape tape-blue" style={{ top: '-15px', right: '-20px', width: '100px', transform: 'rotate(45deg)' }}></div>

                {/* Title */}
                <h2 className="font-shrikhand text-4xl text-[#273A5D] mb-6 tracking-wide drop-shadow-[2px_2px_0_#9CA22A]">
                    PASTING...
                </h2>

                {/* Photo Preview Strip */}
                <div className="photo-strip">
                    {/* Washi tape kecil di atas foto */}
                    <div className="washi-tape tape-olive" style={{ top: '-10px', left: '15%', width: '70%', height: '20px', transform: 'rotate(2deg)' }}></div>
                    
                    {previewImage ? (
                        <div className="w-full h-full bg-[#2D1714] overflow-hidden border-2 border-[#2D1714]">
                            <img 
                                src={previewImage} 
                                alt="Uploading" 
                                className="w-full h-full object-contain filter contrast-125" 
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-[#FFFAEE] border-2 border-[#2D1714] flex items-center justify-center text-[#2D1714] font-caveat text-2xl font-bold">
                            Waiting...
                        </div>
                    )}
                </div>

                {/* Progress Bar Container */}
                <div className="w-full mt-2">
                    <div className="flex justify-between text-[#2D1714] font-poppins font-bold text-sm mb-1 px-1 uppercase tracking-wider">
                        <span>Uploading to Cloud</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    
                    <div className="progress-track">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>

                    <p className="text-[#2D1714] font-caveat text-center mt-4 text-2xl font-bold">
                        Menyimpan momenmu...
                    </p>
                </div>

            </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default LoadingPage;