import React from 'react';

const Header = () => {
  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <a href="/">CRM</a>
        </h1>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <a href="/login" className="hover:text-gray-400">Login</a>
            </li>
            <li>
              <a href="/signup" className="hover:text-gray-400">Sign Up</a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
