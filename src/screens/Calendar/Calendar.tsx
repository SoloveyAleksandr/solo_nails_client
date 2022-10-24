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
import { Icon, useToast } from '@chakra-ui/react';

import styles from './Calendar.module.scss';
import { NavLink } from 'react-router-dom';
import { useService } from '../../firebase/controllers/serviceController';
import Container from '../../components/Container/Container';
import { PhoneIcon } from '@chakra-ui/icons';

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
              to={'/my-reserves'}>
              мои записи
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
            className={styles.menuItem}>
            <a
              className={styles.menuLink}
              href={'tel: +375257128767'}>
              <span>
                позвонить
              </span>
              <PhoneIcon
                w={'18px'}
                h={'18px'}
                className={styles.menuIcon} />
            </a>
          </li>
          <li
            className={styles.menuItem}>
            <a
              className={styles.menuLink}
              target={'_blank'}
              href={'https://www.instagram.com/solo_nails_minsk/'}>
              <span>
                instagram
              </span>
              <Icon
                w={'25px'}
                h={'25px'}
                className={styles.menuIcon}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.8 0H14.2C17.4 0 20 2.6 20 5.8V14.2C20 15.7383 19.3889 17.2135 18.3012 18.3012C17.2135 19.3889 15.7383 20 14.2 20H5.8C2.6 20 0 17.4 0 14.2V5.8C0 4.26174 0.61107 2.78649 1.69878 1.69878C2.78649 0.61107 4.26174 0 5.8 0ZM5.6 2C4.64522 2 3.72955 2.37928 3.05442 3.05442C2.37928 3.72955 2 4.64522 2 5.6V14.4C2 16.39 3.61 18 5.6 18H14.4C15.3548 18 16.2705 17.6207 16.9456 16.9456C17.6207 16.2705 18 15.3548 18 14.4V5.6C18 3.61 16.39 2 14.4 2H5.6ZM15.25 3.5C15.5815 3.5 15.8995 3.6317 16.1339 3.86612C16.3683 4.10054 16.5 4.41848 16.5 4.75C16.5 5.08152 16.3683 5.39946 16.1339 5.63388C15.8995 5.8683 15.5815 6 15.25 6C14.9185 6 14.6005 5.8683 14.3661 5.63388C14.1317 5.39946 14 5.08152 14 4.75C14 4.41848 14.1317 4.10054 14.3661 3.86612C14.6005 3.6317 14.9185 3.5 15.25 3.5ZM10 5C11.3261 5 12.5979 5.52678 13.5355 6.46447C14.4732 7.40215 15 8.67392 15 10C15 11.3261 14.4732 12.5979 13.5355 13.5355C12.5979 14.4732 11.3261 15 10 15C8.67392 15 7.40215 14.4732 6.46447 13.5355C5.52678 12.5979 5 11.3261 5 10C5 8.67392 5.52678 7.40215 6.46447 6.46447C7.40215 5.52678 8.67392 5 10 5ZM10 7C9.20435 7 8.44129 7.31607 7.87868 7.87868C7.31607 8.44129 7 9.20435 7 10C7 10.7956 7.31607 11.5587 7.87868 12.1213C8.44129 12.6839 9.20435 13 10 13C10.7956 13 11.5587 12.6839 12.1213 12.1213C12.6839 11.5587 13 10.7956 13 10C13 9.20435 12.6839 8.44129 12.1213 7.87868C11.5587 7.31607 10.7956 7 10 7Z" fill="white" />
                </svg>
              </Icon>
            </a>
          </li>
          <li
            className={`${styles.menuItem} ${styles.signOut}`}
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

            <Container>
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
            </Container>
          </>
          :
          <h1>Попробуйте позже</h1>
      }

    </div >
  );
}

export default Calendar;
