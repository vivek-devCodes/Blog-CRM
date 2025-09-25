'use client';
import React, { createContext, useContext, useState, ReactNode } from 'react';
import Loader from '../components/ui/Loader';

interface LoadingContextType {
  isLoading: boolean;
  loadingText: string;
  setLoading: (loading: boolean, text?: string) => void;
  showLoader: (text?: string) => void;
  hideLoader: () => void;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const setLoading = (loading: boolean, text: string = '') => {
    setIsLoading(loading);
    setLoadingText(text);
  };

  const showLoader = (text: string = 'Loading...') => {
    setIsLoading(true);
    setLoadingText(text);
  };

  const hideLoader = () => {
    setIsLoading(false);
    setLoadingText('');
  };

  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        loadingText,
        setLoading,
        showLoader,
        hideLoader
      }}
    >
      {children}
      {isLoading && (
        <Loader
          fullScreen
          text={loadingText}
          variant="spinner"
          size="lg"
          color="primary"
        />
      )}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
};
