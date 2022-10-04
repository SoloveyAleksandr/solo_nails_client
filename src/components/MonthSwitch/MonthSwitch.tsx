import { FC } from 'react';
import Container from '../Container/Container';

import styles from './MonthSwitch.module.scss';

interface IMonthSwitch {
  prevMonth(): void,
  nextMonth(): void,
  month: number,
  year: number,
}

const MonthSwitch: FC<IMonthSwitch> = ({
  prevMonth,
  nextMonth,
  month,
  year,
}) => {
  const monthNames: string[] = ['январь', 'февраль', 'март', 'апрель', 'май', 'июнь', 'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь',];

  return (
    <div className={styles.monthSwitchWrapper}>
      <Container>
        <div className={styles.monthSwitch}>
          <div className={styles.month}>
            <span
              onClick={prevMonth}>
              {month === 1 ? monthNames[11] : monthNames[month - 2]}
            </span>
          </div>
          <div className={`${styles.month} ${styles.current}`}>
            <span>
              {monthNames[month - 1]}
            </span>
          </div>
          <div className={styles.month}>
            <span
              onClick={nextMonth}>
              {month === 12 ? monthNames[0] : monthNames[month]}
            </span>
          </div>

          <div className={styles.year}>
            <span>
              {year}
            </span>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default MonthSwitch;