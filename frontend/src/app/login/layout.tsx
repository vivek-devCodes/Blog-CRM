import React from 'react';

const LoginLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};

export default LoginLayout;
