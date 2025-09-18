import React from 'react';

const SignupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
};

export default SignupLayout;
