import React, { useState } from 'react';
import { format, startOfMonth, startOfWeek, endOfMonth, addDays, isSameDay, getMonth, getYear, addMonths, subMonths } from 'date-fns';
import SideBar from './SideBar';
import WhiteContainer from './WhiteContainer';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Calendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedMonth, setSelectedMonth] = useState(getMonth(currentMonth));
  const [selectedYear, setSelectedYear] = useState(getYear(currentMonth));
  const [dropdownVisible, setDropdownVisible] = useState(false);

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
    <div className="flex justify-between items-center mb-3">
      <button
        onClick={prevMonth}
        className="mt-[-6rem] flex items-center justify-center hover:bg-[#52796f] text-[#354F52] rounded-full p-2 transition-all duration-300 ml-[29rem]"
      >
        <ChevronLeft size={24} />
    
      </button>
      <div
        className="mt-[-6rem] relative font-serif font-bold text-[#354F52] text-4xl cursor-pointer"
        onClick={toggleDropdown}
      >
        <span>{format(currentMonth, 'MMMM yyyy')}</span>
        {dropdownVisible && (
          <div className="absolute bg-white bg-opacity-100 shadow-lg p-4 rounded-md mt-1 z-10 w-[800px] left-1/2 transform -translate-x-1/2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 style={{ fontFamily: '"Signika Negative", sans-serif' }}  className="text-lg ">Select Month</h3>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, index) => (
                    <button
                      key={index}
                      onClick={() => handleMonthChange(index)}
                      style={{ fontFamily: '"Signika Negative", sans-serif' }}  className="p-2 text-sm hover:bg-[#354F52] hover:text-white transition-colors rounded-md"
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontFamily: '"Signika Negative", sans-serif' }}  className="text-lg font-semibold">Select Year</h3>
                <div className="mt-2 max-h-64 overflow-y-auto">
                  {[...Array(21)].map((_, idx) => {
                    const year = selectedYear + idx - 10;  // Showing 10 years before and 10 years after current year
                    return (
                      <button
                        key={year}
                        onClick={() => handleYearChange(year)}
                        style={{ fontFamily: '"Signika Negative", sans-serif' }}  className="block p-2 text-sm hover:bg-[#354F52] hover:text-white w-full text-left transition-colors rounded-md"
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
        className="mt-[-6rem] flex items-center justify-center  hover:bg-[#52796f] text-[#354F52] rounded-full p-2 transition-all duration-300  mr-[29rem]"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );

  const renderDaysOfWeek = () => (
    <div className="text-[#354F52] grid grid-cols-7 font-serif text-center font-semibold text-lg mb-2 mt-4">
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <div key={day} className="p-1">{day}</div>
      ))}
    </div>
  );

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfMonth(currentMonth);

    const dateCells = [];
    let day = startDate;

    while (day <= endDate) {
      const formattedDate = format(day, 'd');
      const isToday = isSameDay(day, new Date());
      const isCurrentMonth = getMonth(day) === selectedMonth;

      const dayClasses = `flex flex-col border p-2 h-20 w-full rounded-lg cursor-pointer transition-all duration-300 ${
        isCurrentMonth ? '' : 'text-gray-400'
      } ${isToday ? 'bg-[#FE9B72] text-white border-[#E5EE91] shadow-lg' : ''}`; // Custom style for today's date

      dateCells.push(
        <div key={day.toString()} className={dayClasses}>
          <div className="text-right text-sm font-semibold">{formattedDate}</div>
        </div>
      );
      day = addDays(day, 1);
    }

    return <div className="grid grid-cols-7 gap-3">{dateCells}</div>;
  };

  return (
    <>
      <WhiteContainer>
        <div>
          <h1 style={{ fontFamily: '"Crimson Pro", serif' }} className="text-[3rem] text-[#354F52] ftracking-normal mb-4 ml-8 mt-7">Calendar</h1>
          <div style={{ fontFamily: '"Crimson Pro", serif' }} className="text-[3rem] text-[#354F52] ftracking-normal mb-4 ml-8 mt-[1rem]">
            {renderHeader()}
            {renderDaysOfWeek()}
            {renderCells()}
          </div>
        </div>
      </WhiteContainer>
      <SideBar />
    </>
  );
};

export default Calendar;