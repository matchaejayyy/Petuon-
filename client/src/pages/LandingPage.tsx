import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ejImage from "../assets/teamPicture/ej.png";
import nelImage from "../assets/teamPicture/nel.png";
import dainzImage from "../assets/teamPicture/dainz.png";
import floydImage from "../assets/teamPicture/floyd.png";
import nikImage from "../assets/teamPicture/nik.png";

const LandingPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<"landing" | "about" | "team">(
    "landing"
  );

  // Scroll animation logic using Intersection Observer
  const observer = useRef<IntersectionObserver | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isFeaturesVisible, setIsFeaturesVisible] = useState<boolean>(false);
  const [hasExited, setHasExited] = useState<boolean>(false);


  const observeRef = useRef<HTMLDivElement | null>(null);
  const featuresRef = useRef<HTMLDivElement | null>(null);  // Reference for Features section

  useEffect(() => {
    const currentObserveRef = observeRef.current;
    const currentFeaturesRef = featuresRef.current;
  
    if (currentObserveRef) {
      observer.current = new IntersectionObserver(
        ([entry]) => {
          setIsVisible(entry.isIntersecting); // Set visibility for landing section
        },
        { threshold: 0.2 }
      );
      observer.current.observe(currentObserveRef); // Observe landing section
    }``
  
    if (currentFeaturesRef) {
      observer.current = new IntersectionObserver(
        ([entry]) => {
          setIsFeaturesVisible(entry.isIntersecting); // Set visibility for Features section
          // Trigger exit animation when leaving the landing section and entering features section
          if (!entry.isIntersecting && !hasExited) {
            setHasExited(true); // Set exit animation state when exiting
          }
        },
        { threshold: 0.1 }
      );
      observer.current.observe(currentFeaturesRef); // Observe Features section
    }
  
    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [hasExited]);

  

  return (
    <div className="flex flex-col">
      {/* Persistent Navigation Bar with Dynamic Background Color */}
      <header
        className={`absolute left-0 top-0 z-10 flex w-full h-20 items-center justify-between px-8 py-4 mx-auto ${
          currentPage === "landing" ? "bg-transparent" : "bg-[#719191]"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center">
          <img
            src="/src/assets/landingpageLogo.png"
            alt="PETUON Logo"
            className="w-64 mt-11 h-40 object-contain"
          />
        </div>
        {/* Navigation Links */}
        <nav className="mr-10 flex space-x-12 -mt-3">
          <a
            onClick={() => setCurrentPage("landing")}
            className="text-2xl text-white hover:underline cursor-pointer"
          >
            Home
          </a>
          <a
            onClick={() => setCurrentPage("about")}
            className="text-2xl text-white hover:underline cursor-pointer"
          >
            About
          </a>
          <a
            onClick={() => setCurrentPage("team")}
            className="text-2xl text-white hover:underline cursor-pointer"
          >
            Team
          </a>
          <a href="#contact" className="text-2xl text-white hover:underline">
            Contact Us
          </a>
        </nav>
      </header>

      {currentPage === "about" && (
        // About page content goes here
        <section className="min-h-screen bg-cover bg-center px-8 py-16 text-gray-800 bg-[url('/src/assets/landingPagebg2.png')]">
          <h1 className="mb-6 text-5xl font-bold text-start mt-28">About</h1>
          <p
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="text-lg max-w-lg leading-relaxed text-start"
          >
            This website was created by Carmine's Team to help students plan
            their study schedules, track habits, and boost productivity with
            fun virtual pet features.
            <br />
            <br />
            The team’s goal was to keep students motivated and engaged while
            studying by combining useful tools like flashcards, notes, to-do
            lists, and a calendar with a rewarding pet system.
            <br />
            <br />
            Thank you for using PETUON! We hope it makes your study journey
            more productive and enjoyable.
          </p>
        </section>
      )}

      {/* Home page content */}
      {currentPage === "landing" && (
        <section
        ref={observeRef} // Attach the observer to this section
        className="relative flex h-screen flex-col items-start justify-center bg-[url('/src/assets/landingpagebg.png')] bg-cover bg-center text-white"
      >
        {/* Text Content */}
        <motion.div
            className="ml-16 p-8 md:ml-24"
            initial={{ opacity: 0, x: -100 }} // Start with off-screen and invisible
            animate={{
              opacity: isVisible ? 1 : 0, // Fade in when in view
              x: isVisible ? 0 : -100, // Slide in when in view
            }}
            exit={{
              opacity: 0, // Fade out on exit
              x: 100, // Slide out to the right on exit
            }}
            transition={{ duration: 1 }} // Smooth transition for animations
          >
            <h2 className="mb-4 text-5xl font-bold sm:text-5xl">
              Your Student Study Buddy
            </h2>
            <p className="mb-6 text-lg sm:text-2xl">
              This web app helps students be more <br />
              productive by implementing study tools.
            </p>
            <button
              onClick={() => {}}
              className="rounded-3xl border-2 border-white bg-[#6e8080] px-6 py-2 text-lg font-semibold text-white shadow-md hover:bg-[#0d6767]"
            >
              Get Started
            </button>
          </motion.div>

          <motion.img
            src="/src/assets/landingpagePenguin.png" // Adjust path if necessary
            alt="Study Buddy Penguin"
            className="bottom-15 w-70 absolute right-40 h-auto object-contain p-4 sm:w-80 md:right-56 md:w-96"
            initial={{ opacity: 0, x: 100 }} // Start off-screen and invisible
            animate={{
              opacity: isVisible ? 1 : 0, // Fade in when in view
              x: isVisible ? 0 : 100, // Slide in when in view
            }}
            exit={{
              opacity: 0, // Fade out on exit
              x: -100, // Slide out to the left on exit
            }}
            transition={{ duration: 1 }} // Smooth transition for animations
          />
        </section>
      )}


      {/* Team page content */}
      {currentPage === "team" && (
        <section className="min-h-screen bg-cover bg-center px-8 py-16 text-gray-800 bg-[url('/src/assets/landingPagebg2.png')]">
          <h1
            style={{ fontFamily: '"Signika Negative", sans-serif' }}
            className="mb-8 mt-24 text-5xl font-bold text-center"
          >
            Our Team
          </h1>
          <div className="flex flex-wrap justify-center gap-6">
            {/* Team Members */}
            {[{
                name: "Elmor John Cortez",
                role: "Development Team",
                image: ejImage,
                description: "Elmor is a front-end specialist with a passion for creating smooth user experiences."
              },
              {
                name: "Nelissa Tuden",
                role: "Development Team",
                image: nelImage,
                description: "Nelissa focuses on back-end development, ensuring our app is fast and secure."
              },
              {
                name: "Dainz Andrei Trasadas",
                role: "Scrum Master",
                image: dainzImage,
                description: "Dainz keeps the team organized and ensures we meet our sprint goals."
              },
              {
                name: "Floyd Matthew Torrechilla",
                role: "Development Team",
                image: floydImage,
                description: "Floyd specializes in database management and optimizing app performance."
              },
              {
                name: "Nicholae Sara",
                role: "Development Team",
                image: nikImage,
                description: "Nicholae is a versatile developer who contributes to both front-end and back-end tasks."
              }].map((member) => (
                <div
                  key={member.name}
                  className="group relative flex flex-col items-center bg-gray-100 rounded-lg shadow-md p-4 w-64 overflow-hidden transition-all duration-300 ease-in-out"
                >
                  <div className="w-full h-64 overflow-hidden rounded-2xl mb-4">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <h3
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}
                    className="text-lg font-semibold mt-4"
                  >
                    {member.name}
                  </h3>
                  <p
                    style={{ fontFamily: '"Signika Negative", sans-serif' }}
                    className="italic text-gray-600"
                  >
                    {member.role}
                  </p>

                  {/* Description Panel on Hover */}
                  <div className="absolute bottom-0 left-0 w-full h-0 bg-black bg-opacity-80 opacity-0 group-hover:h-40 group-hover:opacity-100 transition-all duration-300 ease-in-out">
                    <p className="text-white p-4 text-lg">{member.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Features Section at the bottom of the Home Page */}
      {currentPage === "landing" && (
        <section className="bg-white px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <h3 className="mb-12 text-center text-3xl font-bold">Features</h3>

            {/* Pets Feature */}
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="w-full md:w-1/2 h-48 rounded-lg bg-gray-100"></div>
              <div className="ml-0 mt-4 text-center md:ml-6 md:mt-0 md:text-left">
                <h4 className="text-xl font-semibold">Pets</h4>
              </div>
            </div>

            {/* Todo-list Feature */}
            <div className="flex flex-col md:flex-row-reverse items-center mb-8">
              <div className="w-full md:w-1/2 h-48 rounded-lg bg-gray-100"></div>
              <div className="mr-0 mt-4 text-center md:mr-6 md:mt-0 md:text-right">
                <h4 className="text-xl font-semibold">Todo-list</h4>
              </div>
            </div>

            {/* Flashcard Feature */}
            <div className="flex flex-col md:flex-row items-center mb-8">
              <div className="w-full md:w-1/2 h-48 rounded-lg bg-gray-100"></div>
              <div className="ml-0 mt-4 text-center md:ml-6 md:mt-0 md:text-left">
                <h4 className="text-xl font-semibold">Flashcard</h4>
              </div>
            </div>

            {/* Notes Feature */}
            <div className="flex flex-col md:flex-row-reverse items-center">
              <div className="w-full md:w-1/2 h-48 rounded-lg bg-gray-100"></div>
              <div className="mr-0 mt-4 text-center md:mr-6 md:mt-0 md:text-right">
                <h4 className="text-xl font-semibold">Notes</h4>
              </div>
            </div>
          </div>
        </section>
      )}

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
