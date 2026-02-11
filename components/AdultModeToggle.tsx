
import React, { useState } from 'react';

interface AdultModeToggleProps {
  isActive: boolean;
  onToggle: (state: boolean) => void;
}

const AdultModeToggle: React.FC<AdultModeToggleProps> = ({ isActive, onToggle }) => {
  const [showInput, setShowInput] = useState(false);
  const [pass, setPass] = useState('');
  const [error, setError] = useState(false);

  const handleToggle = () => {
    if (isActive) {
      onToggle(false);
    } else {
      setShowInput(true);
    }
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (pass === '11223344') {
      onToggle(true);
      setShowInput(false);
      setPass('');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={handleToggle}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all duration-300 border ${
          isActive 
            ? 'bg-red-600/20 text-red-500 border-red-500/40' 
            : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10'
        }`}
      >
        <div className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
        {isActive ? '18+ Unlocked' : 'Restricted'}
      </button>

      {showInput && (
        <div className="absolute top-full right-0 mt-2 z-[100] animate-in slide-in-from-top-2 fade-in duration-200">
          <form onSubmit={handleConfirm} className="bg-[#1c1d1e] border border-white/10 p-4 rounded-2xl shadow-2xl w-56">
            <h4 className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Enter Access Code</h4>
            <input 
              autoFocus
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="Code..."
              className={`w-full bg-black/50 border ${error ? 'border-red-500' : 'border-white/10'} rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500`}
            />
            <div className="flex gap-2 mt-3">
              <button 
                type="button" 
                onClick={() => setShowInput(false)}
                className="flex-1 text-[10px] font-bold text-gray-500 uppercase"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-500 py-2 rounded-lg text-[10px] font-black text-white uppercase shadow-lg"
              >
                Verify
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdultModeToggle;
