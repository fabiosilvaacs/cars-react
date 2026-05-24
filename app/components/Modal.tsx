'use client';
import React from 'react';

export default function Modal({ open, onClose, title, children }: { open: boolean; onClose: ()=>void; title?: string; children?: React.ReactNode }){
  if(!open) return null;
  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-xl rounded bg-white p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{title}</h2>
          <button aria-label="Fechar" onClick={onClose} className="cursor-pointer text-gray-600">✕</button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
