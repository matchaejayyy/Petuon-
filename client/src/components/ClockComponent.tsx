import React, { useEffect, useState } from "react";

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  // Extract parts of the time and date
  const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const day = days[time.getDay()];
  const hours = time.getHours().toString().padStart(2, "0");
  const minutes = time.getMinutes().toString().padStart(2, "0");
  const seconds = time.getSeconds().toString().padStart(2, "0");

  return (
    <div className="ml-[54rem] mt-[-4em] flex">
      <div
        style={{ fontFamily: '"Crimson Pro", serif' }}
        className="mt-[1rem] flex items-center rounded-lg px-8 py-4 text-[#354F52]"
      >
        {/* Day */}
        <div className="mx-4 text-center">
          <div className="text-4xl">{day}</div>
          <div className="mt-1 text-sm uppercase">Day</div>
        </div>

        {/* Divider */}
        <div
          className="mx-4 h-12 w-0.5 bg-white"
          style={{ backgroundColor: "#354F52" }}
        ></div>

        {/* Hours */}
        <div className="mx-4 text-center">
          <div className="text-4xl">{hours}</div>
          <div className="mt-1 text-sm uppercase">Hours</div>
        </div>

        {/* Divider */}
        <div
          className="mx-4 h-12 w-0.5"
          style={{ backgroundColor: "#354F52" }}
        ></div>

        {/* Minutes */}
        <div className="mx-4 text-center">
          <div className="text-4xl">{minutes}</div>
          <div className="mt-1 text-sm uppercase">Minutes</div>
        </div>

        {/* Divider */}
        <div
          className="mx-4 h-12 w-0.5 bg-white"
          style={{ backgroundColor: "#354F52" }}
        ></div>

        {/* Seconds */}
        <div className="mx-4 text-center">
          <div className="text-4xl">{seconds}</div>
          <div className="mt-1 text-sm uppercase">Seconds</div>
        </div>
      </div>
    </div>
  );
};

export default Clock;
