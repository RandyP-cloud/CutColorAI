import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { Camera, Upload, RefreshCw, Scissors, Palette, Download, Sparkles, User, AlertCircle, Check, Zap, MoveHorizontal, Wand2, Triangle } from 'lucide-react';

const styleGraph = {
  'short-straight': { neighbors: ['short-wavy', 'pixie', 'bob'] },
  'short-wavy': { neighbors: ['short-straight', 'short-curly', 'bob'] },
  'short-curly': { neighbors: ['short-wavy', 'pixie'] },
  'short-layered': { neighbors: ['short-straight', 'pixie', 'bob'] },
  'pixie': { neighbors: ['buzz', 'short-layered', 'short-straight'] },
  'buzz': { neighbors: ['pixie'] },
  'bob': { neighbors: ['lob', 'short-straight', 'medium-straight'] },
  'lob': { neighbors: ['bob', 'medium-straight', 'long-straight'] },
  'medium-straight': { neighbors: ['medium-wavy', 'lob', 'long-straight'] },
  'medium-wavy': { neighbors: ['medium-straight', 'medium-curly', 'lob'] },
  'medium-curly': { neighbors: ['medium-wavy', 'medium-layered'] },
  'medium-layered': { neighbors: ['medium-straight', 'long-layered'] },
  'long-straight': { neighbors: ['long-wavy', 'medium-straight', 'long-layered'] },
  'long-wavy': { neighbors: ['long-straight', 'long-curly'] },
  'long-curly': { neighbors: ['long-wavy', 'long-blowout'] },
  'long-layered': { neighbors: ['long-straight', 'long-blowout'] },
  'long-blowout': { neighbors: ['long-layered', 'long-wavy'] },
  'bangs-curtain': { neighbors: ['bangs-wispy'] },
  'bangs-full': { neighbors: ['bangs-wispy'] },
  'bangs-wispy': { neighbors: ['bangs-curtain'] },
  'bangs-side': { neighbors: ['bangs-curtain'] },
};

const hairStyles = [
  { id: 'short-straight', label: 'Short Straight', prompt: 'short straight hair', category: 'short' },
  { id: 'short-wavy', label: 'Short Wavy', prompt: 'short wavy hair', category: 'short' },
  { id: 'short-curly', label: 'Short Curly', prompt: 'short curly hair', category: 'short' },
  { id: 'short-layered', label: 'Short Layered', prompt: 'short layered textured hair', category: 'short' },
  { id: 'pixie', label: 'Pixie Cut', prompt: 'a stylish short pixie cut', category: 'short' },
  { id: 'buzz', label: 'Buzz Cut', prompt: 'a clean buzz cut', category: 'short' },
  { id: 'medium-straight', label: 'Medium Straight', prompt: 'medium length straight hair', category: 'medium' },
  { id: 'medium-wavy', label: 'Medium Wavy', prompt: 'medium length wavy hair', category: 'medium' },
  { id: 'medium-curly', label: 'Medium Curly', prompt: 'medium length curly hair', category: 'medium' },
  { id: 'medium-layered', label: 'Medium Layered', prompt: 'medium length layered hair', category: 'medium' },
  { id: 'bob', label: 'Classic Bob', prompt: 'a classic chin-length bob', category: 'medium' },
  { id: 'lob', label: 'Long Bob (Lob)', prompt: 'a shoulder-length long bob', category: 'medium' },
  { id: 'long-straight', label: 'Long Straight', prompt: 'long straight sleek hair', category: 'long' },
  { id: 'long-wavy', label: 'Long Wavy', prompt: 'long wavy hair', category: 'long' },
  { id: 'long-curly', label: 'Long Curly', prompt: 'long voluminous curly hair', category: 'long' },
  { id: 'long-layered', label: 'Long Layered', prompt: 'long hair with face-framing layers', category: 'long' },
  { id: 'long-blowout', label: 'Long Blowout', prompt: 'long hair with a voluminous blowout style', category: 'long' },
  { id: 'bangs-curtain', label: 'Curtain Bangs', prompt: 'curtain bangs framing the face', category: 'bangs' },
  { id: 'bangs-full', label: 'Full Bangs', prompt: 'straight full bangs across the forehead', category: 'bangs' },
  { id: 'bangs-wispy', label: 'Wispy Bangs', prompt: 'soft wispy bangs', category: 'bangs' },
  { id: 'bangs-side', label: 'Side Bangs', prompt: 'side-swept bangs', category: 'bangs' },
];

const hairColors = [
  { id: 'w-10-0', label: 'Lightest Blonde', color: '#F0E6CE', prompt: 'Level 10 Lightest Natural Blonde', category: 'Naturals' },
  { id: 'w-8-0', label: 'Light Blonde', color: '#C7B08B', prompt: 'Level 8 Light Natural Blonde', category: 'Naturals' },
  { id: 'w-6-0', label: 'Dark Blonde', color: '#8A7256', prompt: 'Level 6 Dark Natural Blonde', category: 'Naturals' },
  { id: 'l-7', label: 'Medium Blonde', color: '#A88E6D', prompt: "Level 7 Medium Natural Blonde", category: 'Naturals' },
  { id: 'l-5', label: 'Light Brown', color: '#69523C', prompt: "Level 5 Light Natural Brown", category: 'Naturals' },
  { id: 'l-3', label: 'Dark Brown', color: '#33261D', prompt: "Level 3 Dark Natural Brown", category: 'Naturals' },
  { id: 's-1-0', label: 'Jet Black', color: '#050505', prompt: 'Level 1 Jet Black', category: 'Naturals' },
  { id: 'r-06n', label: 'Moroccan Sand', color: '#8B7355', prompt: 'Moroccan Sand Dark Blonde', category: 'Naturals' },
  { id: 's-8-4', label: 'Beige Blonde', color: '#CDB18B', prompt: 'Light Beige Blonde', category: 'Naturals' },
  { id: 'orig-bronde', label: 'Bronde', color: '#9C8360', prompt: 'Bronde (Brown/Blonde Blend)', category: 'Naturals' },
  { id: 'orig-positano', label: 'Positano Blonde', color: '#F2E8D5', prompt: 'Positano Lightest Blonde', category: 'Naturals' },
  { id: 'w-8-1', label: 'Light Ash', color: '#BCAFA0', prompt: 'Light Ash Blonde', category: 'Ash & Cool' },
  { id: 'w-10-16', label: 'Vanilla Ash', color: '#F2E8E0', prompt: 'Lightest Ash Violet Blonde', category: 'Ash & Cool' },
  { id: 'l-9-1', label: 'Very Light Ash', color: '#D4C4B1', prompt: "Very Light Ash Blonde", category: 'Ash & Cool' },
  { id: 'l-10-12', label: 'Frosty Pearl', color: '#F0EAD6', prompt: "Frosty Pearl Blonde", category: 'Ash & Cool' },
  { id: 's-9-5-1', label: 'Platinum Pearl', color: '#EBE0DA', prompt: 'Platinum Pearl', category: 'Ash & Cool' },
  { id: 's-6-12', label: 'Dark Ash Cendre', color: '#6E645C', prompt: 'Dark Blonde Ash Cendre', category: 'Ash & Cool' },
  { id: 'r-09v', label: 'Platinum Ice', color: '#E6E6FA', prompt: 'Platinum Ice Blonde', category: 'Ash & Cool' },
  { id: 'r-09p', label: 'Opal Glow', color: '#F5F5DC', prompt: 'Opal Glow Blonde', category: 'Ash & Cool' },
  { id: 'm-10a', label: 'Extra Light Ash', color: '#E0E0E0', prompt: 'Extra Light Ash Blonde', category: 'Ash & Cool' },
  { id: 'm-11a', label: 'High Lift Ash', color: '#F5F5F5', prompt: 'High Lift Ash Blonde', category: 'Ash & Cool' },
  { id: 'orig-silver', label: 'Silver Grey', color: '#C0C0C0', prompt: 'Silver Grey', category: 'Ash & Cool' },
  { id: 'orig-platinum', label: 'Platinum', color: '#E5E4D6', prompt: 'Pure Platinum', category: 'Ash & Cool' },
  { id: 'l-5-3', label: 'Golden Brown', color: '#735933', prompt: "Light Golden Brown", category: 'Golden & Beige' },
  { id: 'l-8-3', label: 'Golden Blonde', color: '#D4B881', prompt: "Light Golden Blonde", category: 'Golden & Beige' },
  { id: 'r-10gi', label: 'Tahitian Sand', color: '#EEDC82', prompt: 'Tahitian Sand Golden Blonde', category: 'Golden & Beige' },
  { id: 'w-55-46', label: 'Vibrant Red', color: '#802A2A', prompt: 'Vibrant Red Pasion', category: 'Reds & Coppers' },
  { id: 'w-7-43', label: 'Red Gold', color: '#B56242', prompt: 'Medium Red Gold Blonde', category: 'Reds & Coppers' },
  { id: 'l-7-43', label: 'Copper Golden', color: '#C27A4E', prompt: "Copper Golden Blonde", category: 'Reds & Coppers' },
  { id: 's-7-77', label: 'Copper Extra', color: '#B85A2D', prompt: 'Copper Extra', category: 'Reds & Coppers' },
  { id: 'r-07c', label: 'Curry Copper', color: '#C07548', prompt: 'Curry Copper', category: 'Reds & Coppers' },
  { id: 'r-03rb', label: 'Mahogany Red', color: '#3C1F1F', prompt: 'Mahogany Red Brown', category: 'Reds & Coppers' },
  { id: 'm-7r', label: 'True Red', color: '#B22222', prompt: 'True Red Blonde', category: 'Reds & Coppers' },
  { id: 'm-6rv', label: 'Red Violet', color: '#803040', prompt: 'Light Red Violet Brown', category: 'Reds & Coppers' },
  { id: 'm-8c', label: 'Light Copper', color: '#D2691E', prompt: 'Light Copper Blonde', category: 'Reds & Coppers' },
  { id: 'orig-b-copper', label: 'Bright Copper', color: '#D46945', prompt: 'Vibrant Bright Copper', category: 'Reds & Coppers' },
  { id: 'orig-rose', label: 'Rose Gold', color: '#B76E79', prompt: 'Rose Gold', category: 'Reds & Coppers' },
  { id: 'w-7-7', label: 'Deer Brown', color: '#9E7C5E', prompt: 'Medium Brunette Blonde (Deer Brown)', category: 'Brunettes' },
  { id: 'l-4-15', label: 'Choc Brown', color: '#4A3324', prompt: "Chocolate Brown", category: 'Brunettes' },
  { id: 's-5-65', label: 'Choc Gold', color: '#6B4226', prompt: 'Light Chocolate Gold Brown', category: 'Brunettes' },
  { id: 'r-05nw', label: 'Macchiato', color: '#6F4E37', prompt: 'Macchiato Warm Brown', category: 'Brunettes' },
  { id: 'm-504m', label: 'Mocha', color: '#5C4033', prompt: 'Medium Mocha Brown', category: 'Brunettes' },
  { id: 'orig-blue', label: 'Electric Blue', color: '#0047AB', prompt: 'Electric Blue', category: 'Fantasy' },
  { id: 'orig-pink', label: 'Pastel Pink', color: '#FFB7C5', prompt: 'Pastel Pink', category: 'Fantasy' },
  { id: 'orig-rainbow', label: 'Rainbow', color: 'linear-gradient(to right, red,orange,yellow,green,blue,indigo,violet)', prompt: 'Rainbow', category: 'Fantasy' },
];

const workerCode = `
  self.onmessage = async (e) => {
    const { type, payload, id } = e.data;
    if (type === 'resize') {
      const { dataUrl, maxWidth, maxHeight } = payload;
      try {
        const blob = await fetch(dataUrl).then(r => r.blob());
        const bitmap = await createImageBitmap(blob);
        let width = bitmap.width, height = bitmap.height;
        if (width > height) { if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; } } 
        else { if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; } }
        const canvas = new OffscreenCanvas(width, height);
        const ctx = canvas.getContext('2d');
        ctx.drawImage(bitmap, 0, 0, width, height);
        const blobResult = await canvas.convertToBlob({ type: 'image/jpeg', quality: 0.8 });
        const reader = new FileReader();
        reader.onloadend = () => self.postMessage({ type: 'resize_result', id, result: reader.result });
        reader.readAsDataURL(blobResult);
      } catch (err) { self.postMessage({ type: 'error', id, error: err.message }); }
    }
    if (type === 'swatch') {
      const { colors } = payload;
      const canvas = new OffscreenCanvas(512, 512);
      const ctx = canvas.getContext('2d');
      if (colors.length === 0) { ctx.fillStyle = '#FFFFFF'; ctx.fillRect(0, 0, 512, 512); } 
      else if (colors.length === 1) { ctx.fillStyle = colors[0].color; ctx.fillRect(0, 0, 512, 512); } 
      else {
        const gradient = ctx.createLinearGradient(0, 0, 512, 512);
        colors.forEach((c, index) => gradient.addColorStop(index / (colors.length - 1), c.color));
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 512, 512);
      }
      const blobResult = await canvas.convertToBlob({ type: 'image/jpeg' });
      const reader = new FileReader();
      reader.onloadend = () => { self.postMessage({ type: 'swatch_result', id, result: reader.result.split(',')[1] }); };
      reader.readAsDataURL(blobResult);
    }
  };
`;

const Header = ({ resetApp }) => (
  <header className="flex items-center justify-between py-4 px-6 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
    <div className="flex items-center space-x-2 text-rose-600">
      <Triangle size={28} className="fill-current rotate-180" />
      <h1 className="text-2xl font-bold tracking-tight text-gray-900">CutColor<span className="text-rose-500 font-light">AI</span></h1>
    </div>
    <button onClick={resetApp} className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors">New Makeover</button>
  </header>
);

const UploadView = ({ fileInputRef, onFileChange }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] p-8 animate-fade-in">
    <div className="max-w-md w-full text-center space-y-8">
      <h2 className="text-4xl font-extrabold text-gray-900">Discover Your New Look</h2>
      <div onClick={() => fileInputRef.current?.click()} className="group border-2 border-dashed border-gray-300 hover:border-rose-400 rounded-3xl p-12 bg-gray-50 cursor-pointer flex flex-col items-center transition-colors">
        <Upload className="text-rose-500 mb-4" size={32} />
        <p className="font-semibold text-gray-900">Click to upload photo</p>
        <input type="file" ref={fileInputRef} onChange={onFileChange} accept="image/*" className="hidden" />
      </div>
      <div className="grid grid-cols-3 gap-4 text-center">
        {[ { icon: User, text: "Front facing" }, { icon: Sparkles, text: "Good lighting" }, { icon: Check, text: "No obstructions" } ].map((item, idx) => (
          <div key={idx} className="flex flex-col items-center space-y-2 text-gray-400">
            <item.icon size={20} />
            <span className="text-xs font-medium">{item.text}</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const EditorView = ({ image, generatedImage, loading, sliderPosition, setSliderPosition, setMode, setImage, downloadImage, suggestedLooks, predicting, applySuggestion, selectedStyles, toggleStyle, groupedColors, selectedColors, toggleColor, customPrompt, setCustomPrompt, error, handleGenerateClick }) => {
  const imageContainerRef = useRef(null);
  const isDragging = useRef(false);

  const handleMouseDown = () => { isDragging.current = true; };
  const handleMouseUp = () => { isDragging.current = false; };
  const handleMouseMove = (e) => {
    if (!isDragging.current || !imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  };
  const handleTouchMove = (e) => {
    if (!imageContainerRef.current) return;
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percent);
  };

  return (
    <div className="flex flex-col lg:flex-row h-full min-h-[calc(100vh-80px)]">
      <div className="lg:w-1/2 p-6 flex flex-col items-center justify-start bg-gray-50 border-r border-gray-200 overflow-y-auto">
        <div ref={imageContainerRef} className="relative w-full max-w-md aspect-[3/4] rounded-2xl overflow-hidden shadow-2xl bg-white border border-gray-100 cursor-ew-resize select-none group"
          onMouseDown={handleMouseDown} onMouseUp={handleMouseUp} onMouseMove={handleMouseMove} onMouseLeave={handleMouseUp} onTouchMove={handleTouchMove}>
           {loading && (
            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
               <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-white">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500 mb-4"></div>
                  <p className="font-medium animate-pulse flex items-center gap-2"><Wand2 size={16} /> Creating Look...</p>
               </div>
            </div>
          )}
          <img src={generatedImage || image} alt="Result" className="absolute inset-0 w-full h-full object-cover" />
          {generatedImage && (
            <div className="absolute inset-0 w-full h-full overflow-hidden border-r-2 border-white shadow-[2px_0_10px_rgba(0,0,0,0.3)]" style={{ width: `${sliderPosition}%` }}>
              <img src={image} alt="Original" className="absolute inset-0 w-full h-full object-cover max-w-none" style={{ width: imageContainerRef.current ? `${imageContainerRef.current.clientWidth}px` : '100%' }} />
            </div>
          )}
          {generatedImage && !loading && (
            <div className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-[0_0_10px_rgba(0,0,0,0.5)] z-10" style={{ left: `${sliderPosition}%` }}>
              <div className="w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-400"><MoveHorizontal size={16} /></div>
            </div>
          )}
          {!generatedImage && !loading && <div className="absolute bottom-4 left-0 right-0 flex justify-center pointer-events-none"><span className="bg-black/50 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-medium">Original Photo</span></div>}
        </div>

        <div className="mt-6 flex flex-wrap gap-4 justify-center w-full max-w-md">
           <button onClick={() => { setImage(null); setMode('upload'); }} className="text-gray-500 hover:text-gray-900 text-sm flex items-center space-x-1 px-4 py-2 rounded-lg hover:bg-gray-200"><RefreshCw size={14} /> <span>New Photo</span></button>
            {generatedImage && <button onClick={() => downloadImage(generatedImage)} className="bg-gray-900 text-white text-sm flex items-center space-x-2 px-6 py-2 rounded-lg hover:bg-gray-800 shadow-lg"><Download size={16} /> <span>Save</span></button>}
        </div>
    </div>

    <div className="lg:w-1/2 p-6 lg:p-10 overflow-y-auto bg-white">
      <div className="max-w-lg mx-auto space-y-10">
        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Scissors className="mr-2 text-rose-500" size={20} /> Choose Styles</h3>
          <div className="space-y-6">
            {['short', 'medium', 'long', 'bangs'].map((category) => (
              <div key={category}>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">{category} {category === 'bangs' ? '' : 'Haircuts'}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {hairStyles.filter(style => style.category === category).map((style) => (
                    <button key={style.id} onClick={() => toggleStyle(style.id)} className={`px-4 py-3 rounded-xl text-sm font-medium transition-all border-2 text-left ${selectedStyles.includes(style.id) ? 'border-rose-500 bg-rose-50 text-rose-700 shadow-sm' : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{style.label}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-between"><div className="flex items-center"><Palette className="mr-2 text-rose-500" size={20} /> Professional Color Bar</div></h3>
          <div className="space-y-6 min-h-[300px]">
             {Object.keys(groupedColors).length === 0 ? <div className="text-center py-10 text-gray-400 text-sm">No colors found.</div> : Object.entries(groupedColors).map(([category, colors]) => (
                <div key={category}>
                   <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">{category}</h4>
                   <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                      {colors.map((color) => (
                         <button key={color.id} onClick={() => toggleColor(color.id)} className={`group relative flex flex-col items-center space-y-2 p-2 rounded-xl transition-all border-2 text-center h-full ${selectedColors.includes(color.id) ? 'border-rose-500 bg-rose-50' : 'border-transparent hover:bg-gray-100'}`} title={color.prompt}>
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full shadow-sm ring-2 ring-white shrink-0" style={{ background: color.color }}></div>
                            <span className={`text-[10px] font-medium leading-tight w-full line-clamp-2 ${selectedColors.includes(color.id) ? 'text-rose-700' : 'text-gray-500'}`}>{color.label}</span>
                            {selectedColors.includes(color.id) && <div className="absolute top-1 right-1 w-4 h-4 bg-rose-500 rounded-full flex items-center justify-center"><Check size={10} className="text-white" /></div>}
                         </button>
                      ))}
                   </div>
                </div>
             ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center"><Sparkles className="mr-2 text-rose-500" size={20} /> Custom Request</h3>
          <textarea value={customPrompt} onChange={(e) => setCustomPrompt(e.target.value)} placeholder="E.g., A messy bun with loose strands, or Cyberpunk neon green undercut..." className="w-full p-4 rounded-xl bg-gray-50 border-gray-200 focus:border-rose-500 focus:ring-rose-500 resize-none text-sm" rows="3" />
        </div>

        {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-start space-x-3"><AlertCircle size={20} className="shrink-0 mt-0.5" /><p className="text-sm">{error}</p></div>}

        <button onClick={handleGenerateClick} disabled={loading} className={`w-full py-4 px-6 rounded-2xl text-white font-bold text-lg shadow-lg transform transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center space-x-2 ${loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700'}`}>
          {loading ? <span>Generating...</span> : <> <Sparkles size={20} /> <span>Generate Look</span> </>}
        </button>
      </div>
    </div>
  </div>
);
};

const CutColorAI = () => {
  const [image, setImage] = useState(null);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [showCompare, setShowCompare] = useState(false);
  const [sliderPosition, setSliderPosition] = useState(50);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStyles, setSelectedStyles] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [customPrompt, setCustomPrompt] = useState('');
  const [mode, setMode] = useState('upload'); 
  const fileInputRef = useRef(null);
  
  const groupedColors = useMemo(() => {
    return hairColors.reduce((acc, color) => {
      if (!acc[color.category]) acc[color.category] = [];
      acc[color.category].push(color);
      return acc;
    }, {});
  }, []);

  const toggleStyle = useCallback((id) => {
    setSelectedStyles(prev => {
        if (prev.includes(id)) return prev.filter(s => s !== id);
        const clickedStyle = hairStyles.find(s => s.id === id);
        if (!clickedStyle) return [...prev, id];
        const filtered = prev.filter(existingId => {
            const existingStyle = hairStyles.find(s => s.id === existingId);
            return existingStyle?.category !== clickedStyle.category;
        });
        return [...filtered, id];
    });
  }, []);

  const toggleColor = useCallback((id) => {
    setSelectedColors(prev => prev.includes(id) ? [] : [id]);
  }, []);

  const resetApp = () => {
    setMode('upload'); 
    setImage(null); 
    setGeneratedImage(null); 
    setSelectedStyles([]); 
    setSelectedColors([]); 
    setCustomPrompt('');
    setSliderPosition(50);
  };

  const generateHairInternal = async (styles, colors, customTxt) => {
    if (!image) return null;

    const styleDescriptions = styles.map(id => hairStyles.find(s => s.id === id)?.prompt).filter(Boolean);
    const stylePrompt = styleDescriptions.join(' combined with ');
    const selectedColorObjs = colors.map(id => hairColors.find(c => c.id === id)).filter(Boolean);
    
    let colorPrompt = '';
    if (selectedColorObjs.length > 0) {
      const colorNames = selectedColorObjs.map(c => c.prompt).join(' and ');
      colorPrompt = `dyed ${colorNames}`;
    }
    
    let fullPrompt = `Photorealistic image editing. Transform the person's hair to match the following specific styling instructions. It is critical to change the hair length, cut, and texture to match the description. `;
    
    let changeRequest = '';
    if (stylePrompt) changeRequest += stylePrompt;
    if (stylePrompt && colorPrompt) changeRequest += ` ${colorPrompt} `;
    else if (colorPrompt) changeRequest += colorPrompt;

    if (changeRequest && customTxt) fullPrompt += `Change hair to ${changeRequest}. Details: ${customTxt}. `;
    else if (changeRequest) fullPrompt += `Change hair to ${changeRequest}. `;
    else if (customTxt) fullPrompt += `Change hair to: ${customTxt}. `;
    
    try {
      const response = await fetch(
        '/api/generate', // REPLICATE PROXY
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt: fullPrompt,
            image: image // Base64 Data URI
          })
        }
      );

      if (!response.ok) throw new Error(`API Error: ${response.status}`);
      const result = await response.json();
      
      // Replicate returns a URL
      return result.output;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleGenerateClick = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    const result = await generateHairInternal(selectedStyles, selectedColors, customPrompt);
    if (result) {
      setGeneratedImage(result);
    } else {
      setError("Generation failed. Please try again.");
    }
    setLoading(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        // Use Worker for Resizing
        const blob = new Blob([workerCode], { type: 'application/javascript' });
        const worker = new Worker(URL.createObjectURL(blob));
        
        worker.onmessage = (event) => {
            if (event.data.type === 'resize_result') {
                setImage(event.data.result);
                setMode('editor');
                setGeneratedImage(null);
                setSliderPosition(50);
                worker.terminate();
            }
        };
        worker.postMessage({ type: 'resize', payload: { dataUrl: e.target.result, maxWidth: 1024, maxHeight: 1024 } });
      };
      reader.readAsDataURL(file);
    }
  };

  const downloadImage = (imgUrl) => {
    const link = document.createElement('a');
    link.href = imgUrl;
    link.download = 'cutcolor-ai-makeover.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-rose-100 selection:text-rose-900">
      <Header resetApp={resetApp} />
      <main>
        {mode === 'upload' && <UploadView fileInputRef={fileInputRef} onFileChange={handleFileChange} />}
        {mode === 'editor' && (
          <EditorView 
            image={image} 
            generatedImage={generatedImage} 
            loading={loading} 
            sliderPosition={sliderPosition}
            setSliderPosition={setSliderPosition}
            showCompare={showCompare} 
            setShowCompare={setShowCompare}
            setMode={setMode}
            setImage={setImage}
            downloadImage={downloadImage}
            suggestedLooks={[]}
            predicting={false}
            applySuggestion={() => {}}
            selectedStyles={selectedStyles}
            toggleStyle={toggleStyle}
            groupedColors={groupedColors}
            selectedColors={selectedColors}
            toggleColor={toggleColor}
            customPrompt={customPrompt}
            setCustomPrompt={setCustomPrompt}
            error={error}
            handleGenerateClick={handleGenerateClick}
          />
        )}
      </main>
    </div>
  );
};

export default CutColorAI;