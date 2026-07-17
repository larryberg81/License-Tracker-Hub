import React from 'react';
import { motion } from 'framer-motion';

export function LicenceCard({ className }: { className?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`relative w-full max-w-md aspect-[1.586/1] bg-gradient-to-br from-[#f8d7da] to-[#f4b5c1] rounded-xl shadow-xl overflow-hidden border border-white/40 p-4 sm:p-6 ${className || ''}`}
      style={{
        boxShadow: "0 20px 40px -10px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.8)"
      }}
    >
      <div className="absolute top-4 left-4 flex items-center gap-2">
        <div className="w-10 h-7 bg-blue-800 relative overflow-hidden rounded-sm flex items-center justify-center">
          <div className="w-full h-1 bg-white absolute"></div>
          <div className="w-1 h-full bg-white absolute"></div>
          <div className="w-full h-[2px] bg-red-600 absolute"></div>
          <div className="w-[2px] h-full bg-red-600 absolute"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] font-bold text-blue-900 leading-none tracking-widest uppercase">United Kingdom</span>
          <span className="text-[10px] font-black text-blue-900 leading-tight uppercase">Driving Licence</span>
        </div>
      </div>

      <div className="absolute top-4 right-4 w-10 h-12 rounded-md bg-gradient-to-br from-amber-200 via-yellow-400 to-amber-500 opacity-80 border border-amber-300 shadow-inner overflow-hidden flex items-center justify-center">
        <div className="w-full h-[1px] bg-amber-100/50 absolute top-1/4"></div>
        <div className="w-full h-[1px] bg-amber-100/50 absolute top-2/4"></div>
        <div className="w-full h-[1px] bg-amber-100/50 absolute top-3/4"></div>
      </div>

      <div className="absolute top-16 left-4 w-20 h-24 sm:w-24 sm:h-28 bg-white/50 border-2 border-white/70 rounded flex items-center justify-center shadow-sm">
        <svg className="w-12 h-12 text-blue-900/20" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>

      <div className="absolute top-16 left-28 sm:left-32 right-4 flex flex-col gap-1.5 sm:gap-2">
        <div className="flex flex-col">
          <span className="text-[8px] text-blue-900/60 font-bold leading-none">1. Surname</span>
          <span className="text-sm font-black text-slate-800 uppercase leading-none">DOE</span>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-blue-900/60 font-bold leading-none">2. First names</span>
          <span className="text-xs font-bold text-slate-800 leading-none mt-0.5">John</span>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col">
            <span className="text-[8px] text-blue-900/60 font-bold leading-none">3. Date of birth</span>
            <span className="text-xs font-bold text-slate-800 leading-none mt-0.5">01-01-1980</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[8px] text-blue-900/60 font-bold leading-none">4a. Valid from</span>
            <span className="text-xs font-bold text-slate-800 leading-none mt-0.5">15-05-2018</span>
          </div>
        </div>
        <div className="flex flex-col">
          <span className="text-[8px] text-blue-900/60 font-bold leading-none">5. Licence number</span>
          <span className="text-sm font-mono font-bold text-slate-800 leading-none mt-0.5 tracking-wider">DOEJ18001015B9</span>
        </div>
      </div>

      <div className="absolute bottom-4 left-28 sm:left-32 flex gap-2 items-center">
        <span className="text-[8px] text-blue-900/60 font-bold">9. Categories</span>
        <div className="flex gap-1 font-bold text-xs text-blue-900 bg-white/40 px-2 py-0.5 rounded">
          <span>AM</span>
          <span>A</span>
          <span>B</span>
        </div>
      </div>
      
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]" style={{
        backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'20\' height=\'20\' viewBox=\'0 0 20 20\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23000000\' fill-opacity=\'1\' fill-rule=\'evenodd\'%3E%3Ccircle cx=\'3\' cy=\'3\' r=\'3\'/%3E%3Ccircle cx=\'13\' cy=\'13\' r=\'3\'/%3E%3C/g%3E%3C/svg%3E")',
      }}></div>
    </motion.div>
  );
}
