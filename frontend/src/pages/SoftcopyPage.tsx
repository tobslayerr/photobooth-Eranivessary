/* src/pages/SoftcopyPage.tsx */
import MainLayout from '../components/MainLayout';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AiOutlineCloudUpload, AiFillCaretLeft, AiOutlineControl, AiOutlineArrowUp, AiOutlineArrowDown, AiOutlineUndo } from 'react-icons/ai';
import { FaCheckCircle } from 'react-icons/fa';

// --- CONFIGURATION ---
const CANVAS_W = 591;
const CANVAS_H = 1772;
const PHOTO_W = 534;
const PHOTO_H = 445;

const GIF_W = 1920;
const GIF_H = 1080;

// Koordinat Box Foto pada Frame
const PHOTO_X_POS = [28, 29, 27];
const PHOTO_Y_POS = [47, 520, 992];

// --- STYLES (SCRAPBOOK THEME & RESPONSIVE BIG) ---
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Shrikhand&family=Poppins:wght@400;600;800&family=Caveat:wght@700&display=swap');

  .font-shrikhand { font-family: 'Shrikhand', serif; }
  .font-poppins { font-family: 'Poppins', sans-serif; }
  .font-caveat { font-family: 'Caveat', cursive; }

  /* Washi Tapes */
  .washi-tape { position: absolute; height: 40px; background-color: rgba(255,255,255,0.4); box-shadow: 0 2px 4px rgba(0,0,0,0.15); backdrop-filter: blur(2px); z-index: 10; }
  .tape-blue { background-color: rgba(120, 162, 210, 0.85); }
  .tape-olive { background-color: rgba(156, 162, 42, 0.85); }
  .tape-yellow { background-color: rgba(254, 255, 175, 0.95); }

  /* Frame Preview Styling - DIPERBESAR */
  .frame-preview {
    background: #FFFAEE; padding: 15px; border: 4px solid #2D1714;
    box-shadow: 10px 10px 0 rgba(45,23,20,0.3); transform: rotate(-1deg); transition: 0.3s; position: relative;
    cursor: pointer;
  }
  .frame-preview:hover { transform: rotate(0deg) scale(1.02); box-shadow: 14px 14px 0 #2D1714; z-index: 20; }
  .frame-active { transform: rotate(0deg) scale(1.03); box-shadow: 16px 16px 0 #78A2D2; border-color: #78A2D2; z-index: 20; }
  
  /* Frame height ditingkatkan agar tampil dominan di layar */
  .frame-preview img { height: 65vh; width: auto; object-fit: contain; } 

  /* Control Panel Scrapbook - DIPERBESAR */
  .panel-scrapbook {
    background: #FFFAEE; border: 5px solid #2D1714; padding: 25px 30px;
    box-shadow: 14px 14px 0 #78A2D2; position: relative; z-index: 10;
    width: 100%; border-radius: 4px;
  }

  /* Tabs */
  .btn-tab { 
    background: #FEFFAF; color: #2D1714; font-family: 'Shrikhand', serif; 
    padding: 12px 25px; border: 5px solid #2D1714; border-bottom: none; 
    box-shadow: 4px -4px 0 rgba(0,0,0,0.1); cursor: pointer; margin-right: 10px; 
    opacity: 0.6; transition: 0.2s; font-size: 1.2rem;
  }
  .btn-tab.active { 
    background: #FFFAEE; opacity: 1; box-shadow: 6px -6px 0 #78A2D2; 
    padding-top: 18px; margin-top: -6px; z-index: 12; position: relative; 
    border-color: #2D1714;
  }

  /* Thumbnails for Editing - DIPERBESAR */
  .thumb-card {
    background: #FFF; border: 4px solid #2D1714; padding: 12px 15px;
    box-shadow: 6px 6px 0 #2D1714; display: flex; align-items: center; gap: 15px; margin-bottom: 15px;
  }
  .thumb-img-box { width: 95px; height: 95px; background: #2D1714; overflow: hidden; border: 3px solid #2D1714; flex-shrink: 0; }
  
  /* Buttons */
  .btn-scrap {
    border: 4px solid #2D1714; font-family: 'Shrikhand', serif; text-transform: uppercase;
    transition: all 0.1s; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px;
  }
  .btn-upload { background: #273A5D; color: #FEFFAF; box-shadow: 8px 8px 0 #9CA22A; }
  .btn-upload:active:not(:disabled) { transform: translate(4px, 4px); box-shadow: 0 0 0 #9CA22A; }
  .btn-upload:disabled { opacity: 0.7; cursor: not-allowed; }

  .btn-back { background: #FEFFAF; color: #2D1714; box-shadow: 6px 6px 0 #2D1714; }
  .btn-back:active { transform: translate(3px, 3px); box-shadow: 0 0 0 #2D1714; }

  .btn-action { background: #78A2D2; color: #FFFAEE; font-family: 'Poppins', sans-serif; font-size: 0.95rem; font-weight: bold; padding: 10px 14px; box-shadow: 4px 4px 0 #2D1714; }
  .btn-action:active { transform: translate(2px, 2px); box-shadow: 0 0 0 #2D1714; }

  .scribble { font-family: 'Caveat', cursive; color: #2D1714; position: absolute; z-index: 0; }

  /* Range Slider - DIPERBESAR */
  input[type=range] { -webkit-appearance: none; width: 100%; background: transparent; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; height: 28px; width: 28px; border-radius: 50%; background: #9CA22A; border: 3px solid #2D1714; cursor: pointer; margin-top: -10px; box-shadow: 3px 3px 0 #2D1714;}
  input[type=range]::-webkit-slider-runnable-track { width: 100%; height: 8px; background: #2D1714; border-radius: 4px; }

  /* Mencegah Scroll berlebih pada Desktop 1920x1080 */
  @media (min-width: 1024px) {
    .fit-screen-layout { height: 100vh; overflow: hidden; }
  }
`;

const SoftcopyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { images: rawPhotos = [] } = (location.state || {}) as { images: string[] };
  
  // State Utama
  const [generatedFrames, setGeneratedFrames] = useState<string[]>([]);
  const [generatedGifFrames, setGeneratedGifFrames] = useState<string[]>([]); // 3 Gambar 16:9 untuk GIF
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State Editor Posisi & Urutan PER FRAME
  const [activeTab, setActiveTab] = useState(0); 
  const [frameConfigs, setFrameConfigs] = useState([
    { order: [0, 1, 2], pan: [{x: 50, y: 50}, {x: 50, y: 50}, {x: 50, y: 50}] },
    { order: [0, 1, 2], pan: [{x: 50, y: 50}, {x: 50, y: 50}, {x: 50, y: 50}] }
  ]);
  
  const [editModalData, setEditModalData] = useState<{frameIdx: number, slotIdx: number, rawIdx: number} | null>(null);

  useEffect(() => {
    if (rawPhotos.length < 3) {
        navigate('/camera');
    }
  }, [rawPhotos, navigate]);

  // FUNGSI 1: Draw Canvas untuk Frame Foto (Samping-sampingan)
  const drawFrames = async () => {
      const frames = [];
      const framePaths = ['/frames/frame1.png', '/frames/frame2.png'];

      for (let f = 0; f < framePaths.length; f++) {
          const path = framePaths[f];
          const config = frameConfigs[f];

          const canvas = document.createElement('canvas');
          canvas.width = CANVAS_W;
          canvas.height = CANVAS_H;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;

          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

          for (let slot = 0; slot < 3; slot++) {
              const rawIdx = config.order[slot];
              if (rawPhotos[rawIdx]) {
                  const img = new Image();
                  img.src = rawPhotos[rawIdx];
                  await new Promise(r => img.onload = r);

                  const imgRatio = img.width / img.height;
                  const boxRatio = PHOTO_W / PHOTO_H;
                  let sx, sy, sWidth, sHeight;

                  const panX = config.pan[slot].x / 100;
                  const panY = config.pan[slot].y / 100;

                  if (imgRatio > boxRatio) {
                      sHeight = img.height;
                      sWidth = img.height * boxRatio;
                      sx = (img.width - sWidth) * panX; 
                      sy = 0;
                  } else {
                      sWidth = img.width;
                      sHeight = img.width / boxRatio;
                      sx = 0;
                      sy = (img.height - sHeight) * panY;
                  }

                  ctx.drawImage(img, sx, sy, sWidth, sHeight, PHOTO_X_POS[slot], PHOTO_Y_POS[slot], PHOTO_W, PHOTO_H);
              }
          }

          const frameImg = new Image();
          frameImg.src = path;
          await new Promise((resolve) => { frameImg.onload = resolve; frameImg.onerror = resolve; });
          ctx.drawImage(frameImg, 0, 0, CANVAS_W, CANVAS_H);
          
          frames.push(canvas.toDataURL('image/jpeg', 0.85));
      }
      setGeneratedFrames(frames);
  };

  // FUNGSI 2: Draw Canvas untuk 3 Foto Mode GIF (Rasio 16:9)
  // LOGIC GIF INI BERJALAN DI BACKGROUND SAJA TANPA ADA PREVIEW UI
  const drawGifFrames = async () => {
      const gifImages = [];
      for (let i = 0; i < 3; i++) {
          if (!rawPhotos[i]) continue;
          
          const canvas = document.createElement('canvas');
          canvas.width = GIF_W;
          canvas.height = GIF_H;
          const ctx = canvas.getContext('2d');
          if (!ctx) continue;

          ctx.fillStyle = '#2D1714'; // Background hitam manis jika rasio tidak pas
          ctx.fillRect(0, 0, GIF_W, GIF_H);

          const img = new Image();
          img.src = rawPhotos[i];
          await new Promise(r => img.onload = r);

          // Memotong otomatis di tengah agar pas 16:9
          const imgRatio = img.width / img.height;
          const boxRatio = GIF_W / GIF_H;
          let sx, sy, sWidth, sHeight;

          if (imgRatio > boxRatio) {
              sHeight = img.height;
              sWidth = img.height * boxRatio;
              sx = (img.width - sWidth) / 2;
              sy = 0;
          } else {
              sWidth = img.width;
              sHeight = img.width / boxRatio;
              sx = 0;
              sy = (img.height - sHeight) / 2;
          }

          ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, GIF_W, GIF_H);
          gifImages.push(canvas.toDataURL('image/jpeg', 0.85));
      }
      setGeneratedGifFrames(gifImages);
  };

  // Trigger draw frame UI setiap urutan/geser diubah
  useEffect(() => {
      if (rawPhotos.length >= 3) {
          drawFrames();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frameConfigs]);

  // Trigger draw GIF 16:9 hanya sekali di background
  useEffect(() => {
      if (rawPhotos.length >= 3) {
          drawGifFrames();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawPhotos]);

  // --- ACTIONS ---
  const moveUp = (frameIdx: number, slotIdx: number) => {
      if (slotIdx === 0) return;
      const newConfigs = [...frameConfigs];
      const newOrder = [...newConfigs[frameIdx].order];
      const newPan = [...newConfigs[frameIdx].pan];
      
      [newOrder[slotIdx - 1], newOrder[slotIdx]] = [newOrder[slotIdx], newOrder[slotIdx - 1]];
      [newPan[slotIdx - 1], newPan[slotIdx]] = [newPan[slotIdx], newPan[slotIdx - 1]];
      
      newConfigs[frameIdx] = { order: newOrder, pan: newPan };
      setFrameConfigs(newConfigs);
  };

  const moveDown = (frameIdx: number, slotIdx: number) => {
      if (slotIdx === 2) return;
      const newConfigs = [...frameConfigs];
      const newOrder = [...newConfigs[frameIdx].order];
      const newPan = [...newConfigs[frameIdx].pan];
      
      [newOrder[slotIdx + 1], newOrder[slotIdx]] = [newOrder[slotIdx], newOrder[slotIdx + 1]];
      [newPan[slotIdx + 1], newPan[slotIdx]] = [newPan[slotIdx], newPan[slotIdx + 1]];
      
      newConfigs[frameIdx] = { order: newOrder, pan: newPan };
      setFrameConfigs(newConfigs);
  };

  const handleUndoTab = () => {
      const newConfigs = [...frameConfigs];
      newConfigs[activeTab] = {
          order: [0, 1, 2],
          pan: [{x: 50, y: 50}, {x: 50, y: 50}, {x: 50, y: 50}]
      };
      setFrameConfigs(newConfigs);
  };

  const handleUpload = () => {
      if (generatedFrames.length < 2 || generatedGifFrames.length < 3) return;
      setIsSubmitting(true);
      const uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      
      // MENGIRIM PAYLOAD KE BACKEND (Google Drive API via LoadingPage)
      navigate('/loading', {
          state: {
              contactName: `ERANIVESSARY_${uniqueCode}`,
              rawPhotos: rawPhotos,
              savedFrames: generatedFrames, // 2 Gambar Frame Print
              gifFrames: generatedGifFrames, // 3 Gambar 16:9 Untuk GIF Google Drive
              gifConfig: { delayMs: 2000 } // Setting Auto Slide GIF = 2 Detik
          }
      });
  };

  return (
    <MainLayout>
      <style>{styles}</style>
      
      <div 
        className="w-full min-h-screen fit-screen-layout flex items-center justify-center relative bg-[#FFFAEE]"
        style={{ backgroundImage: `repeating-linear-gradient(transparent, transparent 39px, #78A2D2 39px, #78A2D2 40px)` }}
      >
        <div className="scribble text-5xl lg:text-6xl" style={{ top: '8%', left: '8%', transform: 'rotate(-10deg)' }}>Print me!</div>
        <div className="scribble text-6xl lg:text-7xl text-[#9CA22A]" style={{ bottom: '10%', right: '5%', transform: 'rotate(15deg)' }}>Wow!</div>

        {/* LAYOUT KIRI-KANAN PADA DEKSTOP (Max Width Diperlebar menjadi 1400px) */}
        <div className="flex flex-col lg:flex-row items-center justify-center w-full max-w-[1400px] px-6 gap-10 lg:gap-20 z-10 mx-auto">
            
            {/* --- KIRI: CONTROL PANEL EDITOR --- */}
            {/* Diperbesar menjadi max-w-[500px] agar lebih lega */}
            <div className="w-full lg:max-w-[480px] flex-shrink-0 order-2 lg:order-1">
                <div className="flex ml-4">
                    <button className={`btn-tab ${activeTab === 0 ? 'active' : ''}`} onClick={() => setActiveTab(0)}>
                        Edit Frame 1
                    </button>
                    <button className={`btn-tab ${activeTab === 1 ? 'active' : ''}`} onClick={() => setActiveTab(1)}>
                        Edit Frame 2
                    </button>
                </div>
                
                <div className="panel-scrapbook">
                    <div className="washi-tape tape-blue" style={{ top: '-15px', right: '-20px', width: '120px', transform: 'rotate(45deg)' }}></div>

                    <h2 className="font-shrikhand text-3xl lg:text-4xl text-[#2D1714] mb-6 text-center uppercase border-b-4 border-[#2D1714] pb-3 inline-block mx-auto w-full">
                        Atur <span className="text-[#78A2D2]">Frame {activeTab + 1}</span>
                    </h2>

                    {/* Editor List */}
                    <div className="flex flex-col gap-3 mb-8">
                        {frameConfigs[activeTab].order.map((rawIdx, slotIdx) => (
                            <div key={slotIdx} className="thumb-card">
                                <div className="thumb-img-box">
                                    <img 
                                        src={rawPhotos[rawIdx]} 
                                        alt={`Thumb ${slotIdx}`} 
                                        className="w-full h-full object-cover filter contrast-125"
                                        style={{ objectPosition: `${frameConfigs[activeTab].pan[slotIdx].x}% ${frameConfigs[activeTab].pan[slotIdx].y}%` }}
                                    />
                                </div>
                                <div className="flex-1 flex flex-col justify-center gap-2">
                                    <p className="font-poppins text-lg font-bold text-[#2D1714] leading-none">Posisi #{slotIdx + 1}</p>
                                    <div className="flex gap-2 mt-1">
                                        <button onClick={() => moveUp(activeTab, slotIdx)} disabled={slotIdx === 0} className="btn-scrap btn-action disabled:opacity-30 p-2">
                                            <AiOutlineArrowUp size={22}/>
                                        </button>
                                        <button onClick={() => moveDown(activeTab, slotIdx)} disabled={slotIdx === 2} className="btn-scrap btn-action disabled:opacity-30 p-2">
                                            <AiOutlineArrowDown size={22}/>
                                        </button>
                                        <button onClick={() => setEditModalData({frameIdx: activeTab, slotIdx, rawIdx})} className="btn-scrap btn-action bg-[#9CA22A] px-4 py-2 flex-1 text-base">
                                            <AiOutlineControl size={20}/> GESER
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="flex flex-col gap-4">
                        <button 
                            onClick={handleUpload}
                            disabled={generatedFrames.length < 2 || isSubmitting}
                            className="btn-scrap btn-upload w-full py-4 text-xl lg:text-2xl"
                        >
                            {isSubmitting ? "UPLOADING..." : <><AiOutlineCloudUpload size={28}/> SIMPAN & CETAK</>}
                        </button>

                        <div className="flex gap-4 mt-1">
                            <button onClick={handleUndoTab} className="btn-scrap btn-back flex-1 py-3 text-base">
                                <AiOutlineUndo size={20}/> RESET FR {activeTab + 1}
                            </button>
                            <button onClick={() => navigate('/menu', { state: { images: rawPhotos } })} className="btn-scrap btn-back flex-1 py-3 text-base">
                                <AiFillCaretLeft size={20}/> KEMBALI
                            </button>
                        </div>
                    </div>

                    <p className="mt-5 text-[#2D1714] font-poppins font-bold text-sm uppercase text-center opacity-80 flex items-center justify-center gap-2">
                        <FaCheckCircle className="text-[#9CA22A] text-xl" /> 
                        Perubahan otomatis disimpan
                    </p>
                </div>
            </div>

            {/* --- KANAN: PREVIEW AREA (2 FRAME) --- */}
            <div className="flex flex-col items-center justify-center order-1 lg:order-2">
                <h1 className="font-shrikhand text-4xl lg:text-5xl text-[#273A5D] mb-8 lg:mb-12 drop-shadow-[4px_4px_0_#FEFFAF] transform -rotate-2 bg-[#FFFAEE] px-8 py-3 border-5 border-[#2D1714]">
                    REVIEW FOTO
                </h1>

                <div className="flex justify-center gap-6 lg:gap-14 relative">
                    <div className="washi-tape tape-olive" style={{ top: '-15px', left: '10%', width: '150px', transform: 'rotate(4deg)', zIndex: 30 }}></div>
                    <div className="washi-tape tape-yellow" style={{ top: '-10px', right: '15%', width: '130px', transform: 'rotate(-5deg)', zIndex: 30 }}></div>

                    {generatedFrames.map((frame, i) => (
                        <div 
                            key={i} 
                            className={`frame-preview ${activeTab === i ? 'frame-active' : ''}`}
                            onClick={() => setActiveTab(i)}
                        >
                            <div className="absolute -top-5 -left-5 bg-[#2D1714] text-[#FFFAEE] font-shrikhand px-4 py-2 transform -rotate-12 z-20 text-sm border-3 border-[#FFFAEE] shadow-[4px_4px_0_#9CA22A]">
                                FRAME {i + 1}
                            </div>
                            <img src={frame} alt={`Frame ${i+1}`} className="border-3 border-[#2D1714] filter contrast-110" />
                        </div>
                    ))}
                </div>
            </div>

        </div>
      </div>

      {/* --- MODAL EDIT POSISI (PAN/CROP) - DIPERBESAR --- */}
      {editModalData && (
          <div className="fixed inset-0 z-[100] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-[#FFFAEE] border-5 border-[#2D1714] p-8 max-w-lg w-full shadow-[16px_16px_0_#2D1714] transform rotate-1 relative">
                  <div className="washi-tape tape-yellow" style={{ top: '-15px', left: '30%', width: '150px', transform: 'rotate(-3deg)' }}></div>
                  
                  <h3 className="font-shrikhand text-2xl lg:text-3xl text-[#273A5D] mb-5 text-center mt-2 uppercase">
                      GESER FOTO (FR {editModalData.frameIdx + 1})
                  </h3>
                  
                  <div className="w-full aspect-[534/445] bg-[#2D1714] border-4 border-[#2D1714] mb-8 overflow-hidden relative shadow-inner">
                      <img 
                          src={rawPhotos[editModalData.rawIdx]} 
                          alt="Edit Preview"
                          className="w-full h-full object-cover transition-all duration-75"
                          style={{
                              objectPosition: `${frameConfigs[editModalData.frameIdx].pan[editModalData.slotIdx].x}% ${frameConfigs[editModalData.frameIdx].pan[editModalData.slotIdx].y}%`
                          }}
                      />
                  </div>

                  <div className="mb-6">
                      <label className="font-poppins font-bold text-sm text-[#2D1714] mb-3 block uppercase justify-between">
                          <span>Kiri</span> <span>Kanan</span>
                      </label>
                      <input 
                          type="range" min="0" max="100" 
                          value={frameConfigs[editModalData.frameIdx].pan[editModalData.slotIdx].x}
                          onChange={(e) => {
                              const newConfigs = [...frameConfigs];
                              newConfigs[editModalData.frameIdx].pan[editModalData.slotIdx].x = parseInt(e.target.value);
                              setFrameConfigs(newConfigs);
                          }}
                      />
                  </div>
                  <div className="mb-10">
                      <label className="font-poppins font-bold text-sm text-[#2D1714] mb-3 block uppercase justify-between">
                          <span>Atas</span> <span>Bawah</span>
                      </label>
                      <input 
                          type="range" min="0" max="100" 
                          value={frameConfigs[editModalData.frameIdx].pan[editModalData.slotIdx].y}
                          onChange={(e) => {
                              const newConfigs = [...frameConfigs];
                              newConfigs[editModalData.frameIdx].pan[editModalData.slotIdx].y = parseInt(e.target.value);
                              setFrameConfigs(newConfigs);
                          }}
                      />
                  </div>

                  <button onClick={() => setEditModalData(null)} className="btn-scrap btn-upload w-full py-4 text-xl">
                      SELESAI
                  </button>
              </div>
          </div>
      )}

    </MainLayout>
  );
};

export default SoftcopyPage;
