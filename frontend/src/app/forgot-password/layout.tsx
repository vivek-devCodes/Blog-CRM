import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ForgotPasswordLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto p-4">{children}</main>
      <Footer />
    </div>
  );
};

export default ForgotPasswordLayout;
