'use client';
import React from 'react';
import { Activity } from 'react';

export default function Topbar({ title }: { title: string }){
  const [open, setOpen] = React.useState(false);
  return (
    <header className="flex items-center justify-between border-b bg-white p-3">
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="flex items-center gap-3">
        <button aria-label="Avatar menu" onClick={()=>setOpen(v=>!v)} className="cursor-pointer h-8 w-8 rounded bg-gray-200" />
        <Activity mode={open ? 'visible' : 'hidden'}>
          <div role="menu" className="rounded border bg-white p-2 shadow">
            <button role="menuitem" className="cursor-pointer block w-full text-left p-2">Logout</button>
          </div>
        </Activity>
      </div>
    </header>
  );
}
