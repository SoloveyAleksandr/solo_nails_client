import { FC, useEffect, useState } from 'react';
import Header from '../../components/Header/Header';
import MonthSwitch from '../../components/MonthSwitch/MonthSwitch';
import WeekDays from '../../components/WeekDays/WeekDays';
import { resetCurrentUserInfo, setLoading, setMonth, setNextMonth, setPrevMonth, setSelectedDate, setSelectedMonth, setSelectedUserUID, setYear } from '../../store';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import MenuBtn from '../../components/MenuBtn/MenuBtn';
import Logo from '../../components/Logo/Logo';
import Menu from '../../components/Menu/Menu';
import { ISelectedDate } from '../../interfaces';
import { getMonth } from './CalendarService';
import CalendarDay from '../../components/CalendarDay/CalendarDay';
import useAuth from '../../firebase/controllers/userController';
import { useToast } from '@chakra-ui/react';

import styles from './Calendar.module.scss';
import { NavLink } from 'react-router-dom';
import { useService } from '../../firebase/controllers/serviceController';

const Calendar: FC = () => {
  const { userSignOut } = useAuth();
  const toast = useToast();

  const reduxDispatch = useAppDispatch();
  const appState = useAppSelector(state => state.AppStore);

  const [prevMonthState, setPrevMonthState] = useState(0);
  const [menuIsActive, setMenuIsActive] = useState(false);



  useEffect(() => {
    const dateInfo = getMonth(appState.month, appState.year);
    setPrevMonthState(dateInfo.month);
    reduxDispatch(setMonth(dateInfo.month));
    reduxDispatch(setYear(dateInfo.year));
    reduxDispatch(setSelectedMonth(dateInfo.calendarDays));
  }, []);

  useEffect(() => {
    if (appState.month !== prevMonthState) {
      const dateInfo = getMonth(appState.month, appState.year);
      reduxDispatch(setSelectedMonth(dateInfo.calendarDays));
      setPrevMonthState(dateInfo.month);
    }
  }, [appState.month]);

  const setDate = (date: ISelectedDate) => reduxDispatch(setSelectedDate(date));

  const signOut = async () => {
    reduxDispatch(setLoading(true));
    await userSignOut();
    reduxDispatch(resetCurrentUserInfo());
    toast({
      title: 'Вы вышли из аккаунта',
      status: 'success',
      isClosable: true,
      duration: 5000,
      position: 'top',
    });
    reduxDispatch(setLoading(false));
  }

  return (
    <div className={styles.Calendar}>

      <Menu isActive={menuIsActive}>
        <ul className={styles.menuList}>
          <li
            className={styles.menuItem}>
            <NavLink
              to={'/reserved'}>
              подтвержднные записи
            </NavLink>
          </li>
          <li
            className={styles.menuItem}>
            <NavLink
              to={'/free-time'}>
              свободные записи
            </NavLink>
          </li>
          <li
            className={styles.menuItem}>
            <NavLink
              to={'/services'}>
              услуги и цены
            </NavLink>
          </li>
          <li
            className={styles.menuItem}>
            <NavLink
              onClick={() => reduxDispatch(setSelectedUserUID(appState.currentUserInfo.uid))}
              to={'/my-account'}>
              мой аккаунт
            </NavLink>
          </li>
          <li
            className={styles.menuItem}
            onClick={() => signOut()}>
            выход
          </li>
        </ul>
      </Menu>

      <Header>
        <MenuBtn
          isActive={menuIsActive}
          handleClick={() => setMenuIsActive(!menuIsActive)} />
        <Logo />
      </Header>

      {
        appState.selectedMonth.length > 0 ?
          <>
            <MonthSwitch
              prevMonth={() => { reduxDispatch(setPrevMonth()) }}
              nextMonth={() => { reduxDispatch(setNextMonth()) }}
              month={appState.month}
              year={appState.year} />
            <WeekDays />

            <div className={styles.calendarGrid}>
              {appState.selectedMonth.map(day =>
                <CalendarDay
                  key={day.date.full}
                  day={day}
                  selectDay={() => setDate(day.date)}
                  prevMonth={() => reduxDispatch(setPrevMonth())}
                  nextMonth={() => reduxDispatch(setNextMonth())} />
              )}
            </div>
          </>
          :
          <h1>Попробуйте позже</h1>
      }

    </div >
  );
}

export default Calendar;
