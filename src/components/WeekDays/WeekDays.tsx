import { FC } from 'react';

import styles from './WeekDays.module.scss';

interface IWeekDays { };

const WeekDays: FC<IWeekDays> = () => {
  return (
    <ul className={styles.WeekDaysList}>
      <li className={styles.WeekDaysItem}>пн</li>
      <li className={styles.WeekDaysItem}>вт</li>
      <li className={styles.WeekDaysItem}>ср</li>
      <li className={styles.WeekDaysItem}>чт</li>
      <li className={styles.WeekDaysItem}>пт</li>
      <li className={styles.WeekDaysItem}>сб</li>
      <li className={styles.WeekDaysItem}>вс</li>
    </ul>
  );
};

export default WeekDays;