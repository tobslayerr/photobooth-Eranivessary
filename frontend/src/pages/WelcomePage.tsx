import { useNavigate } from 'react-router-dom';
import MainLayout from '../components/MainLayout';
import { usePhotos } from '../context/PhotoContext';
import { useEffect, useState } from 'react';
import { AiFillCamera, AiFillCloud } from 'react-icons/ai';
import { FaSun } from 'react-icons/fa';
import { GiPalmTree } from 'react-icons/gi';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Titan+One&family=Patrick+Hand&display=swap');

  /* ANIMATIONS */
  @keyframes floatCloud {
    0% { transform: translateX(-100px); opacity: 0.8; }
    50% { opacity: 1; }
    100% { transform: translateX(100vw); opacity: 0.8; }
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
    0% { transform: scale(0); opacity: 0; }
    80% { transform: scale(1.1); }
    100% { transform: scale(1); opacity: 1; }
  }

  @keyframes floatBubble {
    0% { transform: translateY(100vh) scale(0.5); opacity: 0; }
    50% { opacity: 0.8; }
    100% { transform: translateY(-20vh) scale(1.2); opacity: 0; }
  }

  /* CLASSES */
  .welcome-bg {
    background: linear-gradient(to bottom, #4facfe 0%, #00f2fe 60%, #fff 100%);
    overflow: hidden;
    position: relative;
    font-family: 'Titan One', cursive;
  }

  .cloud-deco {
    position: absolute;
    color: rgba(255, 255, 255, 0.8);
    filter: drop-shadow(0 4px 10px rgba(0,0,0,0.1));
    z-index: 1;
  }

  .sun-deco {
    position: absolute;
    top: -60px;
    right: -60px;
    color: #FFD700;
    font-size: 180px;
    z-index: 0;
    animation: spinSun 20s linear infinite;
    filter: drop-shadow(0 0 20px rgba(255, 165, 0, 0.6));
  }

  .palm-tree {
    position: absolute;
    bottom: -10px;
    font-size: 150px;
    color: #2E8B57; /* SeaGreen */
    z-index: 5;
    filter: drop-shadow(5px 5px 0 rgba(0,0,0,0.2));
    animation: sway 4s ease-in-out infinite alternate;
  }

  .main-title {
    font-size: 6rem;
    color: #FFFFFF;
    text-shadow: 
      4px 4px 0 #FF7F50, 
      8px 8px 0 #FF4500,
      12px 12px 20px rgba(0,0,0,0.4);
    line-height: 1;
    margin-bottom: 0.5rem;
    animation: popIn 1s cubic-bezier(0.68, -0.55, 0.27, 1.55);
  }

  .year-badge {
    background: #FFD700;
    color: #FF4500;
    padding: 5px 20px;
    border-radius: 50px;
    font-size: 2rem;
    transform: rotate(-5deg);
    border: 4px solid #FFF;
    box-shadow: 4px 4px 0 rgba(0,0,0,0.2);
    display: inline-block;
    animation: sway 2s ease-in-out infinite alternate;
  }

  .subtitle {
    font-family: 'Patrick Hand', cursive;
    font-size: 1.8rem;
    color: #005f73;
    background: rgba(255, 255, 255, 0.6);
    padding: 8px 24px;
    border-radius: 50px;
    backdrop-filter: blur(4px);
    margin-bottom: 3rem;
    border: 2px solid #fff;
  }

  /* BUTTON STYLING */
  .btn-start {
    background: #FF4500; /* Orange Red */
    color: white;
    font-size: 2.5rem;
    padding: 20px 60px;
    border-radius: 999px;
    border: 6px solid #FFF;
    font-family: 'Titan One', cursive;
    cursor: pointer;
    box-shadow: 
      0 10px 0 #8B0000, 
      0 20px 20px rgba(0,0,0,0.3);
    transition: all 0.1s;
    display: flex; align-items: center; gap: 15px;
    position: relative;
    z-index: 20;
    animation: popIn 1.2s;
  }

  .btn-start:active {
    transform: translateY(10px);
    box-shadow: 
      0 0 0 #8B0000, 
      0 0 5px rgba(0,0,0,0.3);
  }
  
  .btn-start:hover {
    background: #ff5722;
    transform: translateY(-2px);
    box-shadow: 
      0 12px 0 #8B0000, 
      0 25px 25px rgba(0,0,0,0.3);
  }

  /* BUBBLES */
  .bubble {
    position: absolute;
    background: rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border: 2px solid rgba(255, 255, 255, 0.5);
    bottom: -50px; /* Start below screen */
    animation: floatBubble linear infinite;
    z-index: 2;
    pointer-events: none;
  }

  /* WAVES FOOTER */
  .wave-footer {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100px;
    background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 320'%3E%3Cpath fill='%23ffffff' fill-opacity='0.4' d='M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z'%3E%3C/path%3E%3C/svg%3E");
    background-size: cover;
    z-index: 3;
  }
  
  /* RESPONSIVE TEXT */
  @media (max-width: 768px) {
    .main-title { font-size: 3.5rem; }
    .btn-start { font-size: 1.5rem; padding: 15px 40px; }
    .sun-deco { font-size: 120px; top: -30px; right: -30px; }
    .palm-tree { font-size: 100px; }
  }
`;

const WelcomePage = () => {
  const navigate = useNavigate();
  const { clearPhotos } = usePhotos();
  const [bubbles, setBubbles] = useState<number[]>([]);

  useEffect(() => {
    // Generate bubbles data
    setBubbles(Array.from({ length: 20 }).map((_, i) => i));
  }, []);

  const startSession = () => {
    // Tambahkan sedikit delay untuk efek suara/klik jika ada, lalu pindah
    const btn = document.querySelector('.btn-start');
    if(btn) btn.classList.add('active'); // trigger active state manual jika perlu
    
    setTimeout(() => {
        clearPhotos();
        navigate('/camera');
    }, 150);
  };

  return (
    <MainLayout isFullScreen={true}>
      <style>{styles}</style>
      <div className="welcome-bg w-full h-full flex flex-col items-center justify-center relative select-none">
        
        {/* --- DEKORASI BACKGROUND --- */}
        
        {/* Matahari Berputar */}
        <div className="sun-deco"><FaSun /></div>

        {/* Awan Bergerak */}
        <div className="cloud-deco" style={{ top: '15%', fontSize: '4rem', animation: 'floatCloud 25s linear infinite' }}><AiFillCloud /></div>
        <div className="cloud-deco" style={{ top: '35%', fontSize: '3rem', animation: 'floatCloud 35s linear infinite', animationDelay: '-10s' }}><AiFillCloud /></div>
        <div className="cloud-deco" style={{ top: '10%', fontSize: '5rem', animation: 'floatCloud 40s linear infinite', animationDelay: '-5s', opacity: 0.6 }}><AiFillCloud /></div>

        {/* Pohon Kelapa Kiri & Kanan */}
        <div className="palm-tree" style={{ left: '-20px', transformOrigin: 'bottom center' }}><GiPalmTree /></div>
        <div className="palm-tree" style={{ right: '-20px', transformOrigin: 'bottom center', animationDelay: '1s' }}><GiPalmTree /></div>

        {/* Waves Footer */}
        <div className="wave-footer"></div>
        
        {/* Bubbles Layer */}
        {bubbles.map((i) => (
          <div 
            key={i} 
            className="bubble" 
            style={{
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 30 + 10}px`,
                height: `${Math.random() * 30 + 10}px`,
                animationDuration: `${Math.random() * 5 + 4}s`,
                animationDelay: `${Math.random() * 5}s`
            }} 
          />
        ))}

        {/* --- KONTEN UTAMA --- */}
        <div className="relative z-10 flex flex-col items-center text-center px-4">
          
          {/* Logo Group */}
          <div className="mb-6 relative">
            <h1 className="main-title" style={{ fontSize: 'clamp(3rem, 8vw, 5rem)' }}>
              ERANIVESSARY
            </h1>
            <div className="year-badge">
              2026
            </div>
          </div>

          <p className="subtitle">
             <AiFillCamera className="inline mr-2" />
             PHOTOBOOTH - 23 MEI 2026
          </p>

          {/* Tombol Mulai Besar */}
          <button 
            onClick={startSession}
            className="btn-start group"
          >
            <AiFillCamera className="group-hover:rotate-12 transition-transform duration-300" />
            <span>MULAI FOTO!</span>
          </button>

          <p className="mt-8 text-white/80 font-bold font-sans text-sm tracking-widest animate-pulse">
            SENTUH LAYAR UNTUK MEMULAI
          </p>

        </div>
      </div>
    </MainLayout>
  );
};

export default WelcomePage;