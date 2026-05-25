'use client';
import React from 'react';

export default function Topbar({ title }: { title: string }){
  return (
    <header className="flex items-center justify-between border-b bg-white p-3">
      <h1 className="text-lg font-semibold">{title}</h1>
    </header>
  );
}
