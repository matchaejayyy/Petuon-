import React from "react";

interface WhiteContainerProps {
  children: React.ReactNode;
}

const WhiteContainer: React.FC<WhiteContainerProps> = ({ children }) => {
  return (
    <div className="xl:ml-[8rem] xl:bg-white xl:bg-cover xl:h-screen xl:w-screen xl:rounded-tl-[3rem] xl:rounded-bl-[3rem] xl:fixed xl:z-10">
      {children}
    </div>
  );
};

export default WhiteContainer;