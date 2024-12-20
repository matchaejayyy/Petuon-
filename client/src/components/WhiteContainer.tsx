import React from "react";

interface WhiteContainerProps {
  children: React.ReactNode;
}

const WhiteContainer: React.FC<WhiteContainerProps> = ({ children }) => {
  return (
    <div className="fixed h-[calc(100vh-4rem)] w-screen max-w-full overflow-y-hidden overflow-x-hidden bg-[#f6f6f6] bg-cover px-4 md:px-8 lg:z-10 lg:ml-[8rem] lg:min-h-screen lg:overflow-y-hidden lg:rounded-l-[40px] lg:pr-[156px]">
      {children}
    </div>
  );
};

export default WhiteContainer;
