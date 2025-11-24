import { useState } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

interface EventCalendarProps {
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  events?: Array<{ startTime: string | Date }>;
}

const EventCalendar: React.FC<EventCalendarProps> = ({ selectedDate, onDateSelect, events = [] }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  const monthEnd = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  const startDate = new Date(monthStart);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const endDate = new Date(monthEnd);
  endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

  const days: Date[] = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventDate = new Date(event.startTime);
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.toISOString().split('T')[0] === dateStr;
    });
  };

  const isToday = (date: Date) => {
    return date.toISOString().split('T')[0] === today.toISOString().split('T')[0];
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return date.toISOString().split('T')[0] === selectedDate.toISOString().split('T')[0];
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(new Date(today.getFullYear(), today.getMonth(), 1));
    onDateSelect(today);
  };

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronLeftIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <ChevronRightIcon className="h-5 w-5 text-slate-600 dark:text-slate-400" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {weekDays.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-slate-500 dark:text-slate-400 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, idx) => {
          const dayEvents = getEventsForDate(day);
          const isTodayDate = isToday(day);
          const isSelectedDate = isSelected(day);
          const isCurrentMonthDate = isCurrentMonth(day);

          return (
            <button
              key={idx}
              onClick={() => handleDateClick(day)}
              className={`
                aspect-square p-1 rounded-lg text-sm transition-all
                ${!isCurrentMonthDate ? 'text-slate-300 dark:text-slate-600' : 'text-slate-700 dark:text-slate-300'}
                ${isTodayDate ? 'bg-primary-100 dark:bg-primary-900/30 font-bold' : ''}
                ${isSelectedDate ? 'bg-primary-600 text-white dark:bg-primary-500' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}
                ${dayEvents.length > 0 && !isSelectedDate ? 'ring-2 ring-primary-400 dark:ring-primary-600' : ''}
              `}
            >
              <div className="flex flex-col items-center justify-center h-full">
                <span>{day.getDate()}</span>
                {dayEvents.length > 0 && (
                  <span className="text-xs mt-0.5">
                    {dayEvents.length}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={goToToday}
        className="mt-4 w-full py-2 text-sm font-medium text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-colors"
      >
        Ir a hoy
      </button>
    </div>
  );
};

export default EventCalendar;



