import React from "react";

interface WhiteContainerProps {
  children: React.ReactNode;
}

const WhiteContainer: React.FC<WhiteContainerProps> = ({ children }) => {
  return (
    <div className="ml-[6rem] bg-white bg-cover h-screen w-screen rounded-tl-[3rem] rounded-bl-[3rem] fixed z-10">
      {children}
    </div>
  );
};

export default WhiteContainer;