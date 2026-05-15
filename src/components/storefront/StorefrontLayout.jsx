import React from 'react';
import { Outlet } from 'react-router-dom';
import RatesTicker from './RatesTicker';
import Navbar from './Navbar';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

export default function StorefrontLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <RatesTicker />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}