import React from 'react';
import MainLayout from './MainLayout';

interface LayoutWrapperProps {
  children: React.ReactNode;
}

const LayoutWrapper: React.FC<LayoutWrapperProps> = ({ children }) => {
  return (
    <>
      <MainLayout>
        {children}
      </MainLayout>
    </>
  );
};

export default LayoutWrapper;