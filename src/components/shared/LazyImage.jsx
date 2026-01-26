import React, { useState } from 'react';
import { motion } from 'framer-motion';

export default function LazyImage({ 
  src, 
  alt, 
  className = "", 
  width, 
  height,
  priority = false,
  ...props 
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative ${className}`} style={{ width, height }}>
      {!loaded && !error && (
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 animate-pulse rounded" />
      )}
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`${className} ${loaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        {...props}
      />
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/50 rounded text-xs text-gray-400">
          Failed to load
        </div>
      )}
    </div>
  );
}