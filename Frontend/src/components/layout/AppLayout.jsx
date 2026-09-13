import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const AppLayout = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface">
      <Sidebar mobileMenuOpen={mobileMenuOpen} setMobileMenuOpen={setMobileMenuOpen} />
      <div className="lg:pl-64 transition-all duration-300">
        <Header setMobileMenuOpen={setMobileMenuOpen} />
        <main className="relative pt-16 bg-surface min-h-screen">
          <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 w-full overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
