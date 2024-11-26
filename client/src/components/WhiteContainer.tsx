import React from "react";

interface WhiteContainerProps {
  children: React.ReactNode;
}

const WhiteContainer: React.FC<WhiteContainerProps> = ({ children }) => {
  return (
    <div className="bg-cover p-4 md:px-8 flex flex-col items-center justify-center lg:rounded-l-xl lg:px-5">
      {children}
    </div>
  );
};

export default WhiteContainer;
