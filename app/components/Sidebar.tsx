'use client';
import React from 'react';

export default function Sidebar({ collapsed, onToggle, view, setView }: { collapsed: boolean; onToggle: ()=>void; view: 'carros' | 'marcas' | 'modelos'; setView: (v:'carros' | 'marcas' | 'modelos')=>void }){
  return (
    <aside className={`h-full bg-white border-r p-3 ${collapsed? 'w-16':'w-64'} transition-width`} aria-label="Menu lateral">
      <div className="flex items-center justify-between">
        <button aria-label="Toggle menu" onClick={onToggle} className="cursor-pointer p-2">☰</button>
        {!collapsed && <span className="font-semibold"></span>}
      </div>
      <nav className="mt-4" role="navigation">
        <ul className="space-y-2">
          <li>
            <button onClick={()=>setView('carros')} className={`cursor-pointer w-full text-left p-2 rounded ${view==='carros'?'bg-sky-100':''}`}>Carros</button>
          </li>
          <li>
            <button onClick={()=>setView('marcas')} className={`cursor-pointer w-full text-left p-2 rounded ${view==='marcas'?'bg-sky-100':''}`}>Marcas</button>
          </li>
          <li>
            <button onClick={()=>setView('modelos')} className={`cursor-pointer w-full text-left p-2 rounded ${view==='modelos'?'bg-sky-100':''}`}>Modelos</button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
