
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Heart, 
  Share2, 
  Copy, 
  Upload, 
  Link as LinkIcon, 
  Sparkles, 
  RefreshCcw, 
  Play, 
  Pause, 
  VolumeX, 
  Volume2,
  Trash2,
  Send
} from 'lucide-react';
import { Confetti } from './components/Confetti';
import { generateRomanticMessage } from './services/geminiService';
import { MessageTone, WishState } from './types';

const App: React.FC = () => {
  // --- State ---
  const [recipient, setRecipient] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [videoSrc, setVideoSrc] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects ---
  useEffect(() => {
    // Parse URL params for initial state
    const params = new URLSearchParams(window.location.search);
    const toParam = params.get('to');
    const msgParam = params.get('msg');
    const videoParam = params.get('video');

    if (toParam) setRecipient(toParam);
    if (msgParam) setMessage(msgParam);
    if (videoParam) setVideoSrc(videoParam);

    // Initial default values if empty
    if (!toParam && !recipient) setRecipient('My Love');
    if (!msgParam && !message) setMessage("Happy Valentine's Day! You make my world infinitely brighter. 💖");
  }, []);

  useEffect(() => {
    if (videoSrc && videoRef.current) {
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }
  }, [videoSrc]);

  // --- Handlers ---
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoSrc(url);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('video/')) {
        setVideoSrc(URL.createObjectURL(file));
      }
    }
  };

  const handleAISuggest = async (tone: MessageTone) => {
    setIsGenerating(true);
    const newMessage = await generateRomanticMessage(recipient || "My Love", tone);
    setMessage(newMessage);
    setIsGenerating(false);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const copyLink = () => {
    const params = new URLSearchParams();
    params.set('to', recipient);
    params.set('msg', message);
    if (videoSrc?.startsWith('http')) {
      params.set('video', videoSrc);
    }
    
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
    navigator.clipboard.writeText(url);
    alert('Magic link copied to clipboard! 💝');
  };

  const shareNative = () => {
    const params = new URLSearchParams();
    params.set('to', recipient);
    params.set('msg', message);
    if (videoSrc?.startsWith('http')) {
      params.set('video', videoSrc);
    }
    const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;

    if (navigator.share) {
      navigator.share({
        title: `A Valentine Wish for ${recipient}`,
        text: message,
        url: url,
      }).catch(console.error);
    } else {
      copyLink();
    }
  };

  const resetAll = () => {
    setRecipient('My Love');
    setMessage("Happy Valentine's Day! 💘");
    setVideoSrc(null);
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-white flex items-center justify-center p-4 md:p-8">
      <Confetti active={showConfetti} />
      
      {/* Background Decor */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-500 rounded-full blur-[128px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-rose-700 rounded-full blur-[128px] animate-pulse delay-1000"></div>
      </div>

      <main className="w-full max-w-6xl z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Section: Video Preview */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <div 
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative aspect-[16/9] bg-black/40 rounded-3xl overflow-hidden border-2 transition-all duration-500 group
              ${dragActive ? 'border-pink-500 scale-[1.02] shadow-[0_0_40px_rgba(236,72,153,0.3)]' : 'border-white/5'}
            `}
          >
            {videoSrc ? (
              <>
                <video 
                  ref={videoRef}
                  src={videoSrc}
                  className="w-full h-full object-cover"
                  loop
                  playsInline
                  muted={isMuted}
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                />
                
                {/* Overlay Contents */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none flex flex-col items-center justify-center p-8 text-center">
                  <div className="backdrop-blur-md bg-black/30 p-6 rounded-2xl border border-white/10 shadow-2xl max-w-lg transform transition-transform group-hover:scale-105 duration-500">
                    <h2 className="font-cursive text-3xl md:text-5xl text-pink-400 mb-4 drop-shadow-lg">
                      For {recipient || 'My Love'}
                    </h2>
                    <p className="text-lg md:text-xl font-light italic leading-relaxed text-white/90 drop-shadow-md">
                      "{message}"
                    </p>
                  </div>
                </div>

                {/* Video Controls */}
                <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <button 
                    onClick={togglePlay}
                    className="p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full border border-white/20 transition-colors"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button 
                    onClick={toggleMute}
                    className="p-3 bg-white/10 backdrop-blur-md hover:bg-white/20 rounded-full border border-white/20 transition-colors"
                  >
                    {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                  </button>
                </div>
              </>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 transition-colors p-8 text-center"
              >
                <div className="w-20 h-20 bg-pink-500/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
                  <Upload className="text-pink-400" size={32} />
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-pink-100">Add a Romantic Backdrop</h3>
                <p className="text-white/40 max-w-sm">
                  Drag & drop an MP4 video or click to upload. 
                  Live previews look best with cinematic shots!
                </p>
                <div className="mt-8 flex gap-4">
                  <button className="px-6 py-2 bg-pink-600 hover:bg-pink-500 rounded-full font-medium transition-all">
                    Choose Video
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const url = prompt("Enter a public video URL (mp4/webm):");
                      if (url) setVideoSrc(url);
                    }}
                    className="px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full font-medium transition-all"
                  >
                    Paste URL
                  </button>
                </div>
              </div>
            )}
            
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="video/*"
              onChange={handleFileChange} 
            />
          </div>

          {/* Action Footer */}
          <div className="flex justify-between items-center px-2">
            <div className="flex items-center gap-2 text-white/40 text-sm">
              <Sparkles size={14} className="text-pink-500" />
              <span>Personalized with AI Magic</span>
            </div>
            {videoSrc && (
              <button 
                onClick={() => setVideoSrc(null)}
                className="text-sm text-rose-400/60 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 size={14} /> Remove Video
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Configuration */}
        <div className="lg:col-span-5 bg-white/5 backdrop-blur-xl rounded-[2.5rem] border border-white/10 p-8 shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-pink-600/20">
              <Heart className="fill-white" size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold bg-gradient-to-r from-pink-300 to-rose-400 bg-clip-text text-transparent">
                Valentine Wish Maker
              </h1>
              <p className="text-white/40 text-xs tracking-widest uppercase">Love in Every Detail</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Recipient Field */}
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-3 px-1">
                For Someone Special
              </label>
              <input 
                type="text" 
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter their name..."
                className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all placeholder:text-white/10"
              />
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-xs font-bold text-white/60 uppercase tracking-widest mb-3 px-1 flex justify-between">
                Your Secret Message
                <span className={`${message.length > 140 ? 'text-rose-400' : 'text-white/20'}`}>
                  {message.length}/150
                </span>
              </label>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 150))}
                className="w-full h-32 bg-black/40 border border-white/10 rounded-2xl px-5 py-4 focus:outline-none focus:ring-2 focus:ring-pink-500/50 transition-all placeholder:text-white/10 resize-none text-lg italic"
                placeholder="Write something heartfelt..."
              />
              
              {/* AI Generation Tools */}
              <div className="mt-4 flex flex-wrap gap-2">
                <p className="w-full text-[10px] text-white/30 uppercase tracking-widest mb-1 px-1">AI Mood Assistance</p>
                {Object.values(MessageTone).map((tone) => (
                  <button
                    key={tone}
                    disabled={isGenerating}
                    onClick={() => handleAISuggest(tone)}
                    className="flex-1 min-w-[80px] py-2 px-3 bg-white/5 hover:bg-pink-600/20 border border-white/5 hover:border-pink-500/50 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                  >
                    {isGenerating ? <RefreshCcw size={12} className="animate-spin" /> : <Sparkles size={12} className="text-pink-400" />}
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            {/* Share Buttons */}
            <div className="pt-6 border-t border-white/5 flex flex-col gap-3">
               <button 
                onClick={shareNative}
                className="w-full py-4 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-pink-600/20 transition-all active:scale-95"
              >
                <Send size={18} />
                Share Secret Link
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={copyLink}
                  className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all"
                >
                  <Copy size={16} className="text-pink-400" />
                  Copy Link
                </button>
                <button 
                  onClick={resetAll}
                  className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-2 text-sm font-medium transition-all"
                >
                  <RefreshCcw size={16} className="text-white/40" />
                  Start Over
                </button>
              </div>
            </div>

            <p className="text-center text-[10px] text-white/20 uppercase tracking-[0.2em]">
              Created with love for 2024
            </p>
          </div>
        </div>
      </main>

      {/* Mobile Sticky CTA */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 lg:hidden z-50">
        <button 
          onClick={shareNative}
          className="px-8 py-4 bg-pink-600 rounded-full shadow-2xl flex items-center gap-2 font-bold animate-bounce hover:animate-none active:scale-95"
        >
          <Share2 size={20} />
          Send Now
        </button>
      </div>
    </div>
  );
};

export default App;
