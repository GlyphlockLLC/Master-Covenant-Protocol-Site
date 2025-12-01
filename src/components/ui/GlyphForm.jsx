import React, { useState } from 'react';

export default function GlyphForm({ 
  mode = 'login', // 'login', 'signup', or 'flip' for flippable
  onSubmit,
  onModeChange,
  children,
  className = ''
}) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    onModeChange?.(!isFlipped ? 'signup' : 'login');
  };

  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div 
        className="relative flex justify-center items-center"
        style={{ 
          transformStyle: 'preserve-3d',
          perspective: '1000px'
        }}
      >
        {/* Gradient Flash Overlay */}
        <div 
          className="absolute -inset-1 rounded-2xl opacity-60 blur-xl animate-pulse pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 25%, #3B82F6 50%, #1E40AF 75%, #7C3AED 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradientFlash 3s ease infinite'
          }}
        />
        
        <div
          className="relative transition-all duration-1000 ease-in-out"
          style={{
            transformStyle: 'preserve-3d',
            transform: isFlipped ? 'rotateY(-180deg)' : 'rotateY(0deg)'
          }}
        >
          {children ? children : (
            <>
              {/* Front - Login */}
              <div 
                className="flex flex-col justify-center items-center gap-5 px-12 py-16 rounded-2xl"
                style={{
                  backfaceVisibility: 'hidden',
                  background: 'rgba(15, 23, 42, 0.95)',
                  boxShadow: `
                    inset 2px 2px 10px rgba(0,0,0,0.8),
                    inset -1px -1px 5px rgba(255, 255, 255, 0.1),
                    0 0 40px rgba(59, 130, 246, 0.3),
                    0 0 80px rgba(124, 58, 237, 0.2)
                  `,
                  border: '2px solid rgba(59, 130, 246, 0.4)'
                }}
              >
                <div className="text-2xl font-black text-white pb-2 tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                  Login
                </div>
                <GlyphInput type="text" placeholder="Username" />
                <GlyphInput type="password" placeholder="Password" />
                <GlyphButton>Login</GlyphButton>
                <span className="text-sm text-white/70">
                  Don't have an account?{' '}
                  <button 
                    type="button"
                    onClick={handleFlip}
                    className="font-bold underline text-[#3B82F6] hover:text-[#60A5FA] transition-colors cursor-pointer"
                  >
                    Sign Up
                  </button>
                </span>
              </div>

              {/* Back - Signup */}
              <div 
                className="absolute top-0 left-0 flex flex-col justify-center items-center gap-5 px-12 py-16 rounded-2xl"
                style={{
                  backfaceVisibility: 'hidden',
                  transform: 'rotateY(-180deg)',
                  background: 'rgba(15, 23, 42, 0.95)',
                  boxShadow: `
                    inset 2px 2px 10px rgba(0,0,0,0.8),
                    inset -1px -1px 5px rgba(255, 255, 255, 0.1),
                    0 0 40px rgba(124, 58, 237, 0.3),
                    0 0 80px rgba(59, 130, 246, 0.2)
                  `,
                  border: '2px solid rgba(124, 58, 237, 0.4)'
                }}
              >
                <div className="text-2xl font-black text-white pb-2 tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                  Sign Up
                </div>
                <GlyphInput type="text" placeholder="First Name" />
                <GlyphInput type="text" placeholder="Username" />
                <GlyphInput type="password" placeholder="Password" />
                <GlyphInput type="password" placeholder="Confirm Password" />
                <GlyphButton variant="purple">Sign Up</GlyphButton>
                <span className="text-sm text-white/70">
                  Already have an account?{' '}
                  <button 
                    type="button"
                    onClick={handleFlip}
                    className="font-bold underline text-[#8B5CF6] hover:text-[#A78BFA] transition-colors cursor-pointer"
                  >
                    Sign In
                  </button>
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Gradient Flash Animation */}
      <style>{`
        @keyframes gradientFlash {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}

// Reusable Input Component
export function GlyphInput({ type = 'text', placeholder, value, onChange, className = '' }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={`
        w-60 min-h-[45px] text-white outline-none transition-all duration-300
        px-4 bg-slate-900 rounded-lg
        border-2 border-slate-800
        placeholder:text-slate-500
        focus:scale-105 focus:border-[#3B82F6]/60
        ${className}
      `}
      style={{
        boxShadow: `
          6px 6px 10px rgba(0,0,0,0.8),
          1px 1px 10px rgba(59, 130, 246, 0.2)
        `
      }}
      onFocus={(e) => {
        e.target.style.boxShadow = `
          6px 6px 10px rgba(0,0,0,0.8),
          1px 1px 10px rgba(59, 130, 246, 0.4),
          inset 2px 2px 10px rgba(0,0,0,0.6),
          inset -1px -1px 5px rgba(59, 130, 246, 0.2),
          0 0 20px rgba(59, 130, 246, 0.3)
        `;
      }}
      onBlur={(e) => {
        e.target.style.boxShadow = `
          6px 6px 10px rgba(0,0,0,0.8),
          1px 1px 10px rgba(59, 130, 246, 0.2)
        `;
      }}
    />
  );
}

// Reusable Button Component
export function GlyphButton({ children, onClick, variant = 'blue', className = '', type = 'button' }) {
  const gradients = {
    blue: 'from-[#1E40AF] to-[#3B82F6]',
    purple: 'from-[#5B21B6] to-[#8B5CF6]',
    mixed: 'from-[#5B21B6] via-[#3B82F6] to-[#1E40AF]'
  };

  const glowColors = {
    blue: 'rgba(59, 130, 246, 0.5)',
    purple: 'rgba(139, 92, 246, 0.5)',
    mixed: 'rgba(99, 102, 241, 0.5)'
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`
        px-10 py-3 cursor-pointer rounded-lg
        bg-gradient-to-r ${gradients[variant]}
        text-white text-base font-bold tracking-wide
        transition-all duration-300
        hover:scale-105 active:scale-100
        ${className}
      `}
      style={{
        boxShadow: `
          6px 6px 10px rgba(0,0,0,0.8),
          1px 1px 10px ${glowColors[variant]},
          0 0 25px ${glowColors[variant]}
        `
      }}
      onMouseEnter={(e) => {
        e.target.style.boxShadow = `
          6px 6px 10px rgba(0,0,0,0.8),
          1px 1px 10px ${glowColors[variant]},
          inset 2px 2px 10px rgba(0,0,0,0.4),
          inset -1px -1px 5px rgba(255, 255, 255, 0.1),
          0 0 40px ${glowColors[variant]}
        `;
      }}
      onMouseLeave={(e) => {
        e.target.style.boxShadow = `
          6px 6px 10px rgba(0,0,0,0.8),
          1px 1px 10px ${glowColors[variant]},
          0 0 25px ${glowColors[variant]}
        `;
      }}
    >
      {children}
    </button>
  );
}

// Single Form Panel (non-flippable)
export function GlyphFormPanel({ title, children, className = '' }) {
  return (
    <div className={`flex justify-center items-center ${className}`}>
      <div className="relative">
        {/* Gradient Flash Overlay */}
        <div 
          className="absolute -inset-1 rounded-2xl opacity-60 blur-xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 25%, #3B82F6 50%, #1E40AF 75%, #7C3AED 100%)',
            backgroundSize: '200% 200%',
            animation: 'gradientFlash 3s ease infinite'
          }}
        />
        
        <div 
          className="relative flex flex-col justify-center items-center gap-5 px-12 py-16 rounded-2xl"
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            boxShadow: `
              inset 2px 2px 10px rgba(0,0,0,0.8),
              inset -1px -1px 5px rgba(255, 255, 255, 0.1),
              0 0 40px rgba(59, 130, 246, 0.3),
              0 0 80px rgba(124, 58, 237, 0.2)
            `,
            border: '2px solid rgba(59, 130, 246, 0.4)'
          }}
        >
          {title && (
            <div className="text-2xl font-black text-white pb-2 tracking-wide drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              {title}
            </div>
          )}
          {children}
        </div>
      </div>

      <style>{`
        @keyframes gradientFlash {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}