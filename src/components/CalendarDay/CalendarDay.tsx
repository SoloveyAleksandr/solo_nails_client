import { FC } from "react";
import { NavLink } from "react-router-dom";
import { IDayItem, ISelectedDate } from "../../interfaces";

import styles from './CalendarDay.module.scss';

interface ICalendarDay {
  day: IDayItem,
  selectDay(date: ISelectedDate): void,
  prevMonth(): void,
  nextMonth(): void,
};

const CalendarDay: FC<ICalendarDay> = ({
  day,
  selectDay,
  prevMonth,
  nextMonth,
}) => {
  const date = {
    full: day.date.full,
    formate: day.date.formate,
  }
  return (
    <>
      {
        day.isNextMonth || day.isPrevMonth ?
          <div
            onClick={() => day.isPrevMonth ? prevMonth() : nextMonth()}
            className={`${styles.calendarDay} ${styles.disabled}`} >
            <span className={styles.day}>
              {day.day}
            </span>
            {day.isToday && <span className={styles.marker}></span>}
          </div >
          :
          <NavLink
            to={'/day'}
            onClick={() => selectDay(date)}
            className={styles.calendarDay} >
            <span className={`${styles.day} ${day.isToday ? styles.isToday : ''}`}>
              {day.day}
            </span>
            {day.isToday && <span className={styles.marker}></span>}
          </NavLink >
      }
    </>
  );
};

export default CalendarDay;
