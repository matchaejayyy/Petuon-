import React from "react";

interface WhiteContainerProps {
  children: React.ReactNode;
}

const WhiteContainer: React.FC<WhiteContainerProps> = ({ children }) => {
  return (
    <div className="bg-[#f6f6f6] bg-cover h-[calc(100vh-4rem)] overflow-y-auto overflow-x-hidden w-screen max-w-full fixed px-4 md:px-8 lg:ml-[8rem] lg:pr-[126px] lg:z-10 lg:min-h-screen lg:rounded-l-[40px] lg:px-5">
      {children}
    </div>
  );
};

export default WhiteContainer;