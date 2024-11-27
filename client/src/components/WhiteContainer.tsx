import React from "react";

interface WhiteContainerProps {
  children: React.ReactNode;
}

const WhiteContainer: React.FC<WhiteContainerProps> = ({ children }) => {
  return (
    <div className="bg-[#ffffff] bg-cover h-[calc(100vh-4rem)] overflow-y-auto w-screen fixed px-4 lg:ml-[8rem] ">
      {children}
    </div>
  );
};

export default WhiteContainer;  