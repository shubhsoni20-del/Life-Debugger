import React, { useState, useEffect } from "react";
import ImageUploader from "./components/ImageUploader";
import AnalysisResult from "./components/AnalysisResult";
import ChatInterface from "./components/ChatInterface";
import { ImageFile, LifeDebugReport, AnalysisVibe } from "./types";
import { analyzeLifeSnapshot } from "./services/geminiService";

const LOADING_QUOTES = [
  "Judging your life choices...",
  "Trying to understand this mess...",
  "Consulting the Oracle of Order...",
  "Wait, I need my glasses for this...",
  "Buffering your reality...",
  "Is that a sock or a cat? Analyzing...",
  "Calculating the optimal path to happiness...",
  "Wait harder...",
  "If this takes long, blame the clutter...",
  "Loading 99%... just kidding...",
  "Converting chaos to JSON...",
  "Deep breathing initiated...",
  "Untangling your decisions… might take a minute.",
  "Hold on… deciphering human behavior is hard.",
 "Searching for common sense… not found.",
 "Calibrating emotional stability… low battery.",
 "Googling 'How to fix your life'…",
 "Crunching numbers you should’ve crunched earlier…",
 "Your mess is loading… please stand by.",
 "Trying not to judge… trying really hard…",
 "Optimizing your questionable choices…",
 "Patching your life with duct tape…",
 "Refactoring your chaos…",
 "Running fix_my_life.exe…",
 "Debugging your reality… found 42 bugs.",
 "Locating motivation… still searching…",
 "Breaking the laws of physics to help you…",
 "Loading your excuses…",
 "Scanning for solutions… found memes instead.",
 "Reading your mind… please think slower.",
 "Finding the root cause… root cause is you.",
 "Running emotional diagnostics… results unclear.",
 "Updating your common sense to version 2.0…",
 "Syncing with your past mistakes… this may take long.",
 "Sorting your priorities… they were upside down.",
 "Checking your vibe score… error 404.",
 "Organizing your chaos alphabetically…",
 "Trying to make sense of your schedule… failing.",
 "Downloading sanity… low bandwidth.",
 "Rebooting your life… please wait.",
 "Upgrading your mindset… progress: 0%.",
 "Translating your chaos to English…",
 "Resisting urge to scream internally…",
 "Trying to remain optimistic…",
 "Scanning for intelligent life…",
 "Plot twist detected… recalibrating.",
 "Your life is buffering… hold tight.",
 "Loading patience… this will take a while.",
 "Trying to be supportive…",
 "Compressing your emotional baggage…",
 "Sorting problems by size… all XL.",
 "Enabling 'Fix Everything' mode…",
 "Running away… kidding… maybe.",
 "Charging creativity… low power mode active.",
 "Reconstructing your shattered focus…",
 "Checking system integrity… questionable.",
 "Downloading motivation from the cloud…",
 "Aligning chakras… installing updates…",
 "Bringing order to your natural disaster…",
 "Trying to ignore the chaos… can't.",
 "Detecting procrastination… confirmed.",
 "Fixing what you broke… again.",
 "Scanning for signs of adulthood… none found.",
 "Consulting ancient wisdom… even they confused.",
 "Attempting to 'unmess' your mess…",
 "Generating solutions… at least one should work.",
 "Hunting dust bunnies…",
 "Staring at your problems… they stare back.",
 "Calculating how bad this really is…",
 "Asking the universe for help… voicemail.",
 "Trying to stay calm… deep breaths.",
 "Untangling the headphone wires of your life…",
 "Bringing structure to chaos… architect mode.",
 "Calling tech support… they hung up.",
 "Measuring disaster radius… it's wide.",
 "Manifesting clarity… slowly.",
 "Removing unnecessary stress… found too much.",
 "Collecting spare brain cells…",
 "Updating your reality drivers…",
 "Connecting loose wires in your plan…",
 "Balancing your timeline… unstable.",
 "Sweeping nonsense under the rug…",
 "Trying to understand your handwriting… nope.",
 "Stitching together your scattered thoughts…",
 "Testing your patience… please don't break.",
 "Reconstructing your to-do list… it's crying.",
 "Engaging logic mode… may malfunction.",
 "Transferring chaos to the recycle bin…",
 "Backing up your sanity…",
 "Folding your life neatly… finding wrinkles.",
 "Reading your aura… blurry.",
 "Your tasks are plotting against you… investigating.",
 "Attempting to find a good decision…",
 "Mental defragmentation in progress…",
 "Analyzing future mistakes…",
 "Adding 10% extra productivity…",
 "Resisting urge to judge your folder names…",
 "Inspecting your priorities… they need therapy.",
 "Checking for motivation leaks… found several.",
 "Preparing inspirational speech… loading.",
 "Searching for missing socks… and logic.",
 "Summoning focus… arriving soon.",
 "Checking your emotional RAM… overloaded.",
 "Attempting to optimize your vibe…",
 "Downloading brain update… failed.",
 "Balancing chaos-to-order ratio…",
 "Trying to stay positive… battery low.",
 "Reviewing your life patch notes…",
 "Tightening loose bolts in your routine…",
 "Casting spell of productivity… fizzled.",
 "Attempting to resurrect motivation…",
 "Stabilizing your timeline… please don't move.",
];

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<ImageFile | null>(null);
  const [report, setReport] = useState<LifeDebugReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingQuote, setLoadingQuote] = useState(LOADING_QUOTES[0]);
  const [vibe, setVibe] = useState<AnalysisVibe>('constructive');
  const [userPrompt, setUserPrompt] = useState("");

  useEffect(() => {
    let interval: any;
    if (loading) {
      // Randomize start
      const randomStart = Math.floor(Math.random() * LOADING_QUOTES.length);
      setLoadingQuote(LOADING_QUOTES[randomStart]);
      
      let index = randomStart + 1;
      interval = setInterval(() => {
        setLoadingQuote(LOADING_QUOTES[index % LOADING_QUOTES.length]);
        index++;
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const handleImageSelect = (file: ImageFile) => {
    setImageFile(file);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;

    setLoading(true);
    setError(null);

    try {
      const result = await analyzeLifeSnapshot(imageFile.base64, imageFile.mimeType, vibe, userPrompt);
      setReport(result);
    } catch (err: any) {
      console.error(err);
      setError("Analysis failed. Please ensure your API Key is valid and the image is clear.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setImageFile(null);
    setReport(null);
    setError(null);
    setVibe('constructive'); // Reset vibe to default
    setUserPrompt("");
  };

  const vibes: { id: AnalysisVibe; icon: string; label: string; desc: string }[] = [
    { id: 'roast', icon: 'fa-fire', label: 'Roast Me', desc: 'Ruthless & Funny' },
    { id: 'constructive', icon: 'fa-screwdriver-wrench', label: 'Fix It', desc: 'Direct & Actionable' },
    { id: 'gentle', icon: 'fa-hand-holding-heart', label: 'Gentle', desc: 'Kind & Supportive' },
    { id: 'efficient', icon: 'fa-stopwatch', label: 'Efficient', desc: 'Just Facts & Data' },
  ];

  return (
    <div className="min-h-screen bg-debug-dark text-slate-200 font-sans selection:bg-debug-orange selection:text-white">
      
      {/* Navigation / Header */}
      <nav className="border-b border-slate-900/50 bg-debug-dark/95 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Logo Container */}
            <div className="relative w-10 h-10 flex items-center justify-center group">
              <div className="absolute inset-0 bg-gradient-to-tr from-debug-blue to-debug-orange rounded-xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="relative w-full h-full bg-slate-900 border border-slate-700 group-hover:border-slate-500 rounded-xl flex items-center justify-center transition-colors">
                 <i className="fa-solid fa-dna text-transparent bg-clip-text bg-gradient-to-tr from-debug-blue to-debug-orange text-lg"></i>
              </div>
            </div>
            
            {/* Logo Text */}
            <h1 className="text-2xl font-black tracking-tighter uppercase italic select-none">
              <span className="text-slate-100">Life</span>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-debug-blue to-debug-orange">Debugger</span>
            </h1>
          </div>
          
          <div className="text-xs font-mono text-slate-600 hidden sm:block border border-slate-800 px-3 py-1 rounded-full">
            <span className="text-debug-orange">●</span> Powered by Gemini 3 Pro
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Intro Section (only show if no report) */}
        {!report && (
          <div className="text-center mb-16 space-y-6">
            <h2 className="text-5xl md:text-7xl font-black text-white tracking-tight">
              OPTIMIZE <span className="text-transparent bg-clip-text bg-gradient-to-r from-debug-blue to-debug-orange">REALITY</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto font-light leading-relaxed">
              Upload a snapshot of your chaos. We extract the data, detect the bugs, and compile a patch for your daily life.
            </p>
          </div>
        )}

        {/* State: Error */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 bg-red-950/30 border border-red-500/50 text-red-200 p-4 rounded-lg flex items-center gap-3 animate-pulse">
            <i className="fa-solid fa-circle-exclamation text-red-500"></i>
            {error}
          </div>
        )}

        {/* State: Result Display */}
        {report && imageFile ? (
          <>
            <AnalysisResult report={report} onReset={handleReset} />
            <ChatInterface 
              initialQuestion={report.follow_up_question}
              imageBase64={imageFile.base64}
              mimeType={imageFile.mimeType}
              vibe={vibe}
              initialUserPrompt={userPrompt}
            />
          </>
        ) : (
          /* State: Upload & Preview */
          <div className="flex flex-col items-center">
            
            {imageFile ? (
               // Image Preview Card
              <div className="w-full max-w-lg bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 animate-fade-in-up">
                <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden group">
                  <img 
                    src={imageFile.previewUrl} 
                    alt="Preview" 
                    className="w-full h-full object-contain opacity-80"
                  />
                  {/* Tech overlay grid */}
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,11,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 pointer-events-none bg-[length:100%_2px,3px_100%]"></div>
                  
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                      <button onClick={handleReset} className="text-white bg-red-600/90 hover:bg-red-600 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide backdrop-blur-sm transition-all">
                        Abort Upload
                      </button>
                   </div>
                </div>
                
                <div className="p-6 border-t border-slate-800">
                  {loading ? (
                    <div className="space-y-5">
                      <div className="flex items-center gap-3 text-debug-blue animate-pulse">
                        <i className="fa-solid fa-circle-notch fa-spin text-2xl text-debug-orange"></i>
                        <span className="font-bold text-lg tracking-wide uppercase text-white">Running Diagnostics...</span>
                      </div>
                      <div className="h-1 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-debug-blue to-debug-orange w-1/2 animate-[shimmer_1.5s_infinite]"></div>
                      </div>
                      <div className="font-mono text-xs text-slate-500 flex flex-col gap-2 items-center justify-center pt-2">
                         <span className="text-debug-orange italic text-center animate-[pulse_1s_infinite]">{loadingQuote}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      
                      {/* Vibe Selector */}
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 text-center">Select Mode</p>
                        <div className="grid grid-cols-2 gap-3">
                          {vibes.map((v) => (
                            <button
                              key={v.id}
                              onClick={() => setVibe(v.id)}
                              className={`p-3 rounded-xl border transition-all flex flex-col items-center gap-2
                                ${vibe === v.id 
                                  ? 'bg-debug-blue/10 border-debug-blue text-white shadow-[0_0_15px_rgba(59,130,246,0.2)]' 
                                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600 hover:bg-slate-800'
                                }
                              `}
                            >
                              <i className={`fa-solid ${v.icon} ${vibe === v.id ? 'text-debug-blue' : ''}`}></i>
                              <div className="text-center leading-none">
                                <div className="text-xs font-bold uppercase">{v.label}</div>
                                <div className="text-[10px] opacity-70 mt-1">{v.desc}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* User Prompt Input */}
                      <div>
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 ml-1">Additional Context (Optional)</p>
                        <textarea
                          value={userPrompt}
                          onChange={(e) => setUserPrompt(e.target.value)}
                          placeholder="E.g. I need to clear this desk by 5PM..."
                          className="w-full bg-slate-900 border border-slate-800 text-sm text-slate-200 rounded-xl p-3 focus:outline-none focus:border-debug-blue focus:ring-1 focus:ring-debug-blue transition-all resize-none"
                          rows={2}
                        />
                      </div>

                      <button
                        onClick={handleAnalyze}
                        className="w-full bg-gradient-to-r from-debug-blue to-debug-orange hover:from-blue-500 hover:to-orange-400 text-white font-black text-lg py-4 rounded-xl shadow-lg shadow-debug-blue/20 transition-all transform hover:scale-[1.01] flex items-center justify-center gap-3 tracking-wide uppercase border border-white/10"
                      >
                        <i className="fa-solid fa-bolt"></i>
                        Initialize Debug
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              // Empty State Uploader
              <ImageUploader onImageSelected={handleImageSelect} isLoading={false} />
            )}

            {!imageFile && (
              <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 w-full max-w-4xl">
                {[
                  { icon: 'fa-receipt', label: 'FINANCE', color: 'text-emerald-500' },
                  { icon: 'fa-calendar-check', label: 'SCHEDULE', color: 'text-debug-blue' },
                  { icon: 'fa-bed', label: 'HABITAT', color: 'text-purple-500' },
                  { icon: 'fa-comments', label: 'SOCIAL', color: 'text-debug-orange' }
                ].map((item, i) => (
                  <div key={i} className="flex flex-col items-center gap-3 p-6 bg-slate-900/50 border border-slate-800/50 rounded-xl hover:bg-slate-800 hover:border-slate-700 transition-all duration-300 group cursor-default">
                    <i className={`fa-solid ${item.icon} text-3xl text-slate-600 group-hover:${item.color} transition-colors duration-300`}></i>
                    <span className="text-xs text-slate-500 font-bold tracking-widest group-hover:text-slate-300">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
      
      {/* Footer */}
      {!report && (
        <footer className="fixed bottom-6 w-full text-center text-slate-700 text-[10px] font-mono pointer-events-none uppercase tracking-widest">
          System v2.0 • Secure Environment
        </footer>
      )}
    </div>
  );
};

export default App;
