import React, { useState } from "react";
import { LifeDebugReport } from "../types";

interface AnalysisResultProps {
  report: LifeDebugReport;
  onReset: () => void;
}

const SectionCard: React.FC<{
  title: string;
  icon: string;
  children: React.ReactNode;
  colorClass: string;
  iconColor: string;
}> = ({ title, icon, children, colorClass, iconColor }) => (
  <div className={`bg-debug-card border border-slate-800 rounded-xl p-6 shadow-xl hover:border-slate-700 transition-all duration-300 group ${colorClass}`}>
    <div className="flex items-center gap-3 mb-5 border-b border-slate-800 pb-4">
      <i className={`fa-solid ${icon} text-xl ${iconColor}`}></i>
      <h3 className="text-lg font-bold uppercase tracking-wider text-slate-200">{title}</h3>
    </div>
    <div className="text-slate-400 leading-relaxed font-light">{children}</div>
  </div>
);

const AnalysisResult: React.FC<AnalysisResultProps> = ({ report, onReset }) => {
  const [checkedSteps, setCheckedSteps] = useState<boolean[]>(
    new Array(report.step_by_step_fix.length).fill(false)
  );

  const toggleStep = (index: number) => {
    const newChecked = [...checkedSteps];
    newChecked[index] = !newChecked[index];
    setCheckedSteps(newChecked);
  };

  const progress = Math.round((checkedSteps.filter(Boolean).length / report.step_by_step_fix.length) * 100);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* AI Reaction Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-y border-debug-blue/30 p-6 flex items-start gap-4 shadow-[0_0_30px_rgba(59,130,246,0.1)] rounded-xl">
        <div className="bg-debug-blue/10 p-3 rounded-lg">
          <i className="fa-solid fa-robot text-2xl text-debug-blue"></i>
        </div>
        <div className="flex-1">
          <span className="text-xs font-bold text-debug-blue tracking-widest uppercase mb-1 block">System Comment</span>
          <p className="text-white text-lg md:text-xl font-medium italic">"{report.ai_reaction}"</p>
        </div>
      </div>

      {/* Header Summary Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Broken State - Keeping Red as semantic color for error/broken, but darkened */}
        <div className="bg-slate-900 border border-red-900/40 rounded-2xl p-8 relative overflow-hidden group hover:border-red-900/80 transition-colors">
          <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <i className="fa-solid fa-triangle-exclamation text-9xl text-red-500"></i>
          </div>
          <h2 className="text-red-500 font-black text-2xl mb-4 flex items-center gap-3 uppercase tracking-widest">
            <i className="fa-solid fa-bug"></i> System Failure
          </h2>
          <p className="text-xl font-medium text-slate-200 mb-6 leading-relaxed">{report.whats_broken}</p>
          <div className="bg-black/40 p-4 rounded-lg border-l-4 border-red-600">
            <span className="text-red-400 text-xs font-bold uppercase tracking-widest block mb-2">Impact Analysis</span>
            <p className="text-slate-400 italic">"{report.why_it_matters}"</p>
          </div>
        </div>

        {/* Optimized State - Using the new Primary Blue */}
        <div className="bg-slate-900 border border-debug-blue/30 rounded-2xl p-8 relative overflow-hidden group hover:border-debug-blue/60 transition-colors">
          <div className="absolute -top-6 -right-6 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
            <i className="fa-solid fa-crosshairs text-9xl text-debug-blue"></i>
          </div>
          <h2 className="text-debug-blue font-black text-2xl mb-4 flex items-center gap-3 uppercase tracking-widest">
            <i className="fa-solid fa-check-double"></i> Optimal State
          </h2>
          <p className="text-xl font-medium text-slate-200 mb-6 leading-relaxed">{report.optimized_version}</p>
          <div className="bg-black/40 p-4 rounded-lg border-l-4 border-debug-blue">
             <span className="text-blue-400 text-xs font-bold uppercase tracking-widest block mb-2">Target Protocol</span>
            <p className="text-slate-400">System architecture optimized for maximum efficiency.</p>
          </div>
        </div>
      </div>

      {/* Action Plan Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Priority Tasks - Orange for visibility/importance */}
        <SectionCard 
          title="Critical Path" 
          icon="fa-list-check" 
          colorClass="hover:shadow-[0_0_20px_rgba(249,115,22,0.1)]"
          iconColor="text-debug-orange"
        >
          <ul className="space-y-4">
            {report.priority_tasks.map((task, idx) => (
              <li key={idx} className="flex items-start gap-4 bg-black/20 p-3 rounded-lg border border-slate-800/50">
                <span className="bg-debug-orange text-black text-[10px] font-black px-2 py-1 rounded flex items-center">P{idx + 1}</span>
                <span className="text-slate-200 font-medium text-sm">{task}</span>
              </li>
            ))}
          </ul>
        </SectionCard>

        {/* Step by Step Fix - Blue for logic/process */}
        <SectionCard 
          title="Patch Sequence" 
          icon="fa-code-branch" 
          colorClass="hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]"
          iconColor="text-debug-blue"
        >
          <div className="mb-4 flex items-center justify-between text-xs uppercase tracking-widest text-slate-500 font-bold">
             <span>Completion Status</span>
             <span className="text-debug-blue">{progress}%</span>
          </div>
          <div className="w-full bg-slate-800 h-1 rounded-full mb-6 overflow-hidden">
             <div 
               className="bg-debug-blue h-full transition-all duration-500 ease-out" 
               style={{ width: `${progress}%` }}
             ></div>
          </div>

          <div className="relative border-l border-slate-700 ml-3 space-y-6 pl-8 py-2">
            {report.step_by_step_fix.map((step, idx) => {
              const isDone = checkedSteps[idx];
              return (
                <div 
                  key={idx} 
                  className="relative group cursor-pointer"
                  onClick={() => toggleStep(idx)}
                >
                   {/* Timeline dot / Checkbox */}
                  <span className={`absolute -left-[39px] w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 border
                    ${isDone 
                      ? 'bg-debug-blue border-debug-blue text-white shadow-[0_0_10px_rgba(59,130,246,0.5)] scale-110' 
                      : 'bg-slate-900 border-slate-700 text-slate-500 group-hover:border-debug-blue group-hover:text-debug-blue'
                    }`}
                  >
                    {isDone ? <i className="fa-solid fa-check"></i> : idx + 1}
                  </span>
                  
                  {/* Text content */}
                  <div className={`transition-all duration-300 ${isDone ? 'opacity-50' : ''}`}>
                    <p className={`text-sm transition-colors select-none ${isDone ? 'text-slate-500 line-through decoration-slate-600' : 'text-slate-300 group-hover:text-white'}`}>
                      {step}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>

        {/* Future Prevention - Cyan/Teal for "cool" factor */}
        <SectionCard 
          title="Firewall Rules" 
          icon="fa-shield-cat" 
          colorClass="hover:shadow-[0_0_20px_rgba(45,212,191,0.1)]"
          iconColor="text-teal-400"
        >
           <ul className="space-y-4">
            {report.future_prevention_plan.map((plan, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <i className="fa-solid fa-angle-right text-teal-500 mt-1 text-xs"></i>
                <span className="text-slate-300 text-sm">{plan}</span>
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={onReset}
          className="bg-slate-900 border border-slate-800 hover:border-debug-orange text-slate-300 hover:text-white font-bold py-4 px-10 rounded-full shadow-xl hover:shadow-2xl transition-all flex items-center gap-3 group tracking-widest uppercase text-sm"
        >
          <i className="fa-solid fa-rotate-left group-hover:-rotate-90 transition-transform text-debug-orange"></i>
          Analyze New Target
        </button>
      </div>
    </div>
  );
};

export default AnalysisResult;