import React from "react";
import { useNavigate } from "react-router-dom";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Navigation Bar */}
      <header className="absolute left-0 top-0 z-10 flex w-full items-center justify-between bg-transparent px-8 py-4">
        {/* Logo */}
        <div className="flex items-center">
        <img
          src="/src/assets/landingpageLogo.png" // Adjust the path to your logo
          alt="PETUON Logo"
          className="w-80 mt-1 h-44 object-contain"
        />
        </div>
        {/* Navigation Links */}
        <nav className="mr-10 flex space-x-12 -mt-16">
          <a href="#about" className="text-2xl text-white hover:underline">
            About
          </a>
          <a href="#team" className="text-2xl text-white hover:underline">
            Team
          </a>
          <a href="#contact" className="text-2xl text-white hover:underline">
            Contact Us
          </a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative flex h-screen flex-col items-start justify-center bg-[url('/src/assets/landingpagebg.png')] bg-cover bg-center text-white">
        {/* Text Content */}
        <div className="ml-16 p-8 md:ml-24">
          <h2 className="mb-4 text-5xl font-bold sm:text-5xl">
            Your Student Study Buddy
          </h2>
          <p className="mb-6 text-lg sm:text-2xl">
            This web app helps students be more <br />
            productive by implementing study tools.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="rounded-3xl border-2 border-white bg-[#6e8080] px-6 py-2 text-lg font-semibold text-white shadow-md hover:bg-[#0d6767]"
          >
            Get Started
          </button>
        </div>

        {/* Penguin Image */}
        <img
          src="/src/assets/landingpagePenguin.png" // Adjust path if necessary
          alt="Study Buddy Penguin"
          className="bottom-15 w-70 absolute right-40 h-auto object-contain p-4 sm:w-80 md:right-56 md:w-96"
        />
      </section>

      {/* Services Section */}
      <section className="bg-white px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h3 className="mb-6 text-center text-2xl font-semibold">
            Features
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {/* Placeholder for a service card */}
            <div className="rounded-lg bg-gray-100 p-6 text-center shadow-md">
              <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-300"></div>
              <h4 className="mb-2 text-xl font-semibold">Service Title</h4>
              <p className="text-gray-600">Brief description of the service.</p>
            </div>
            <div className="rounded-lg bg-gray-100 p-6 text-center shadow-md">
              <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-300"></div>
              <h4 className="mb-2 text-xl font-semibold">Service Title</h4>
              <p className="text-gray-600">Brief description of the service.</p>
            </div>
            <div className="rounded-lg bg-gray-100 p-6 text-center shadow-md">
              <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gray-300"></div>
              <h4 className="mb-2 text-xl font-semibold">Service Title</h4>
              <p className="text-gray-600">Brief description of the service.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 py-4 text-white">
        <div className="mx-auto max-w-6xl text-center">
          <p>&copy; 2024 PETUON. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
