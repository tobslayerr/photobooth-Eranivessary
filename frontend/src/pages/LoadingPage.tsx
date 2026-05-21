import MainLayout from '../components/MainLayout';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../api/api';
import { base64ToFile } from '../utils/fileHelpers';
import { FaSun, FaCloud, FaPaperPlane, FaWifi } from 'react-icons/fa';
import { GiPalmTree } from 'react-icons/gi';

// --- STYLES ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Titan+One&family=Patrick+Hand&display=swap');
  
  .font-title { font-family: 'Titan One', cursive; }
  .font-hand { font-family: 'Patrick Hand', cursive; }

  /* BACKGROUND ANIMATION (Shared) */
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
  @keyframes pulseGlow {
    0%, 100% { box-shadow: 0 0 20px rgba(255, 255, 255, 0.5); }
    50% { box-shadow: 0 0 40px rgba(255, 255, 255, 0.8); }
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

  /* GLASS CARD */
  .loading-card {
    background: rgba(255, 255, 255, 0.25);
    backdrop-filter: blur(12px);
    border: 2px solid rgba(255, 255, 255, 0.6);
    border-radius: 30px;
    padding: 30px;
    box-shadow: 0 20px 50px rgba(0,0,0,0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 450px; /* Sedikit lebih lebar */
    width: 90%;
    animation: pulseGlow 3s infinite;
    max-height: 90vh; /* Agar tidak melebihi tinggi layar */
  }

  /* PHOTO PREVIEW STRIP (VERTICAL) */
  .photo-preview-box {
    /* Ukuran disesuaikan dengan rasio photostrip (Memanjang ke bawah) */
    width: 140px; 
    height: 380px; 
    padding: 8px;
    background: white;
    box-shadow: 0 10px 25px rgba(0,0,0,0.25);
    transform: rotate(-2deg);
    margin-bottom: 20px;
    border-radius: 4px;
    transition: transform 0.3s;
    border: 1px solid #e2e8f0;
  }
  
  /* Saat hover, luruskan agar lebih jelas */
  .photo-preview-box:hover {
    transform: rotate(0deg) scale(1.05);
    z-index: 10;
  }

  /* PROGRESS BAR CUSTOM */
  .progress-track {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 50px;
    height: 14px;
    width: 100%;
    overflow: visible;
    position: relative;
    margin-top: 10px;
    border: 2px solid white;
  }
  
  .progress-fill {
    background: linear-gradient(90deg, #3b82f6, #06b6d4);
    border-radius: 50px;
    height: 100%;
    transition: width 0.3s ease-out;
    position: relative;
    box-shadow: 0 0 10px rgba(6, 182, 212, 0.5);
  }

  .plane-icon {
    position: absolute;
    right: -14px;
    top: 50%;
    transform: translateY(-50%) rotate(45deg);
    color: #0284c7;
    font-size: 26px;
    filter: drop-shadow(2px 2px 0 rgba(255,255,255,0.5));
    transition: all 0.3s ease-out;
  }

  .wave-footer {
    position: absolute; bottom: 0; left: 0; width: 100%; height: 100px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.4' d='M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
    background-size: cover; z-index: 1; pointer-events: none;
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
      
      <div className="summer-bg w-full h-full flex flex-col items-center justify-center relative">
        
        {/* --- BACKGROUND DECORATIONS --- */}
        <div className="sun-deco"><FaSun /></div>
        <div className="cloud-deco" style={{ top: '15%', fontSize: '4rem', animation: 'floatCloud 25s linear infinite' }}><FaCloud /></div>
        <div className="cloud-deco" style={{ top: '35%', fontSize: '3rem', animation: 'floatCloud 35s linear infinite', animationDelay: '-10s' }}><FaCloud /></div>
        
        <div className="palm-tree" style={{ left: '-20px', transformOrigin: 'bottom center' }}><GiPalmTree /></div>
        <div className="palm-tree" style={{ right: '-20px', transformOrigin: 'bottom center', animationDelay: '1s' }}><GiPalmTree /></div>
        
        <div className="wave-footer"></div>

        {/* --- MAIN CONTENT (GLASS CARD) --- */}
        <div className="relative z-20 w-full flex justify-center px-4">
            
            <div className="loading-card">
                
                {/* Title */}
                <h2 className="font-title text-3xl text-white drop-shadow-md mb-4 flex items-center gap-3">
                     SENDING... <FaWifi className="animate-pulse text-xl" />
                </h2>

                {/* Photo Preview Strip (Vertical Full View) */}
                <div className="photo-preview-box">
                    {previewImage ? (
                        <div className="w-full h-full bg-gray-100 overflow-hidden border border-gray-200">
                            {/* KUNCI: Object-contain dan h-full agar strip vertikal terlihat utuh */}
                            <img 
                                src={previewImage} 
                                alt="Uploading" 
                                className="w-full h-full object-contain" 
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                            Loading...
                        </div>
                    )}
                </div>

                {/* Progress Bar Container */}
                <div className="w-full">
                    <div className="flex justify-between text-white font-bold text-sm mb-1 px-1 drop-shadow-sm">
                        <span>Uploading to Cloud</span>
                        <span>{Math.round(progress)}%</span>
                    </div>
                    
                    <div className="progress-track">
                        <div 
                            className="progress-fill" 
                            style={{ width: `${progress}%` }}
                        >
                             {/* Plane Icon */}
                             <FaPaperPlane className="plane-icon" />
                        </div>
                    </div>

                    <p className="text-white/90 font-hand text-center mt-3 text-lg font-bold drop-shadow-sm">
                        Menyimpan...
                    </p>
                </div>

            </div>

        </div>

      </div>
    </MainLayout>
  );
};

export default LoadingPage;