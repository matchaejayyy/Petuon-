/* eslint-disable react-hooks/rules-of-hooks */
import { ChevronLeft, ChevronRight } from "lucide-react";
import React, { useState, useEffect, useCallback } from "react";
import {
  format,
  startOfMonth,
  startOfWeek,
  endOfMonth,
  addDays,
  isSameDay,
  getMonth,
  getYear,
  addMonths,
  subMonths,
} from "date-fns";
import { useNavigate } from "react-router-dom"; // Import for navigation
import { useToDoList } from "../hooks/useToDoList";

const CalendarComponent: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(getMonth(currentMonth));
  const [selectedYear, setSelectedYear] = useState(getYear(currentMonth));
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const {tasks, setTasks} = useToDoList();


  const navigate = useNavigate(); // For navigation to ToDoListPage

  // Navigate to the previous or next month
  const prevMonth = () => {
    const newDate = subMonths(currentMonth, 1);
    setCurrentMonth(newDate);
    setSelectedMonth(getMonth(newDate));
    setSelectedYear(getYear(newDate));
  };

  const nextMonth = () => {
    const newDate = addMonths(currentMonth, 1);
    setCurrentMonth(newDate);
    setSelectedMonth(getMonth(newDate));
    setSelectedYear(getYear(newDate));
  };

  const toggleDropdown = () => {
    setDropdownVisible(!dropdownVisible);
  };

  const handleMonthChange = (month: number) => {
    const newDate = new Date(selectedYear, month, 1);
    setCurrentMonth(newDate);
    setSelectedMonth(month);
    setDropdownVisible(false);
  };

  const handleYearChange = (year: number) => {
    const newDate = new Date(year, selectedMonth, 1);
    setCurrentMonth(newDate);
    setSelectedYear(year);
    setDropdownVisible(false);
  };

  const renderHeader = () => (
    <div className="mb-3 flex items-center justify-between">
      <button
        onClick={prevMonth}
        className="ml-[29rem] mt-[-7rem] flex items-center justify-center rounded-full p-2 text-[#354F52] transition-all duration-300 hover:bg-[#52796f]"
      >
        <ChevronLeft size={24} />
      </button>

      <div
        className="relative mt-[-7rem] transform cursor-pointer font-serif text-4xl font-bold text-[#354F52] transition-transform duration-200 hover:scale-105"
        onClick={toggleDropdown}
      >
        <span>{format(currentMonth, "MMMM yyyy")}</span>
        {dropdownVisible && (
          <div className="absolute left-1/2 z-10 mt-1 w-[800px] -translate-x-1/2 transform rounded-md bg-white bg-opacity-100 p-4 shadow-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  className="text-lg"
                >
                  Select Month
                </h3>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {[
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                  ].map((month, index) => (
                    <button
                      key={index}
                      onClick={() => handleMonthChange(index)}
                      style={{ fontFamily: '"Signika Negative", sans-serif' }}
                      className="rounded-md p-2 text-sm transition-colors hover:bg-[#354F52] hover:text-white"
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3
                  style={{ fontFamily: '"Signika Negative", sans-serif' }}
                  className="text-lg font-semibold"
                >
                  Select Year
                </h3>
                <div className="mt-2 max-h-64 overflow-y-auto">
                  {[...Array(21)].map((_, idx) => {
                    const year = selectedYear + idx - 10; // Showing 10 years before and 10 years after current year
                    return (
                      <button
                        key={year}
                        onClick={() => handleYearChange(year)}
                        style={{ fontFamily: '"Signika Negative", sans-serif' }}
                        className="block w-full rounded-md p-2 text-left text-sm transition-colors hover:bg-[#354F52] hover:text-white"
                      >
                        {year}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <button
        onClick={nextMonth}
        className="mr-[29rem] mt-[-7rem] flex items-center justify-center rounded-full p-2 text-[#354F52] transition-all duration-300 hover:bg-[#52796f]"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );

  const renderDaysOfWeek = () => (
    <div className="mb-2 mt-[-1.4rem] grid grid-cols-7 text-center font-serif text-lg font-semibold text-[#354F52]">
      {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="p-1">
          {day}
        </div>
      ))}
    </div>
  );

  const updateTasks = useCallback(() => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        return task;
      }),
    );
  }, []);

  useEffect(() => {
    const interval = setInterval(updateTasks, 1000);

    return () => clearInterval(interval);
  }, [updateTasks]);

  const displayStatus = (date: Date) => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
  
    const formattedDate = date.toLocaleDateString();
    const todayString = today.toLocaleDateString();
    const tomorrowString = tomorrow.toLocaleDateString();
  
    switch (formattedDate) {
      case "1/1/1970":

        return "NoDue";
      case todayString:

        return "Today";
      case tomorrowString:

        return "Tomorrow";
      default:
      
        return "Upcoming";
    }

  };
  const renderCells = () => {
    const [expandedDay, setExpandedDay] = useState<string | null>(null); // Track which day is expanded

    const toggleExpand = (date: string) => {
      setExpandedDay(expandedDay === date ? null : date); // Toggle dropdown visibility
    };

    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfMonth(currentMonth);

    const dateCells = [];
    let day = startDate;

    while (day <= endDate) {
      const formattedDate = format(day, "d"); // e.g., "29"
      const formattedFullDate = format(day, "yyyy-MM-dd"); // e.g., "2024-11-29"
      const isToday = isSameDay(day, new Date()); // Highlight if today
      const isCurrentMonth = getMonth(day) === selectedMonth; // Check if in the current month

      // Filter tasks for this specific day
      const tasksForDay = tasks.filter(
        (task) =>
          format(new Date(task.dueAt), "yyyy-MM-dd") === formattedFullDate,
      );

      // Styling for day cells
      const dayClasses = `flex flex-col border p-2 h-20 w-full rounded-lg cursor-pointer  hover:shadow-lg transition-shadow transition-all duration-300 
      ${isCurrentMonth ? "" : "text-gray-400"
      } ${isToday ? "text-black border-green-500 bg-[#D1FAE5]" : ""}`

      dateCells.push(
        <div
          key={day.toString()}
          className={dayClasses}
          onClick={() => toggleExpand(formattedFullDate)} // Toggle dropdown on click
        >
          <div className="text-right text-sm font-semibold">
          {formattedDate}
          </div>
           {tasksForDay.length > 0 && (
            <div>
              {expandedDay !== formattedFullDate &&
                tasksForDay.slice(0, 2).map((task) => (
                  <ul key={task.task_id} className="pl-5 ml-[-1.3rem] w-[10rem]" style={{ listStyleType: "disc" }}>
                    <li
                      style={{
                        fontFamily: '"Signika Negative", sans-serif',
                        color:
                          displayStatus(task.dueAt) === "Today"
                            ? "green"
                            : displayStatus(task.dueAt) === "Upcoming"
                            ? "#3B82F6"
                            : displayStatus(task.dueAt) === "Tomorrow"
                            ? "#F59E0B"
                            : "#6B7280",
                      }}
                      className={`flex flex-col gap-2 ml-[0.5rem] mt-[-0.6rem] truncate text-sm ${
                        displayStatus(task.dueAt) === "Today"
                          ? "bg-green-400 mt-[0.1rem] rounded ml-[-1rem] pl-2"
                          : displayStatus(task.dueAt) === "Upcoming"
                          ? "bg-blue-100  mt-[0.1rem] rounded ml-[-1rem] pl-2"
                          : displayStatus(task.dueAt) === "Tomorrow"
                          ? "bg-orange-100 mt-[0.1rem] rounded ml-[-1rem] pl-2 "
                          : "bg-gray-100 mt-[0.1rem] rounded ml-[-1rem] pl-2"
                      }`}
                      >
                      {task.text}
                    </li>
                  </ul>
                
                ))}
                {/* {tasksForDay.length > 2 &&  !expandedDay && (
                  <div className=" text-[#151515] mt-[-0.8rem] ml-[8rem]">
                    + {tasksForDay.length - 2}
                  </div>
                )} */}
              {expandedDay === formattedFullDate && (
                <div className="absolute z-10 mt-2 max-h-20 w-[10rem] overflow-y-auto rounded-md border bg-white p-2 shadow-lg [&::-webkit-scrollbar]:w-2">
                  {tasksForDay.map((task) => (
                    <div
                      key={task.task_id}
                      onClick={() =>
                        navigate(`/ToDoList?taskId=${task.task_id}`)
                      }
                      className="text-md cursor-pointer truncate rounded p-1 text-black hover:bg-gray-200"
                      style={{ fontFamily: '"Signika Negative", serif' }}
                    >
                      {task.text}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>,
      );

      day = addDays(day, 1);
    }

    return <div className="grid grid-cols-7 gap-3">{dateCells}</div>;
  };

  return (
    <div>
      <h1
        style={{ fontFamily: '"Crimson Pro", serif' }}
        className="ftracking-normal mb-4 mt-7 text-[3rem] text-[#354F52]"
      >
        Calendar
      </h1>
      <div
        style={{ fontFamily: '"Signika Negative", sans-serif' }}
        className="mx-auto max-w-[1340px] p-3"
      >
        {renderHeader()}
        {renderDaysOfWeek()}
        {renderCells()}
      </div>
    </div>
  );
};
export default CalendarComponent;
