import { FC, useState, useEffect } from 'react';
import BackBtn from '../../components/BackBtn/BackBtn';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import InfoContainer from '../../components/InfoContainer/InfoContainer';
import Logo from '../../components/Logo/Logo';
import ScreenTitle from '../../components/ScreenTitle/ScreenTitle';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setLoading, setSelectedDate } from '../../store';
import { IUserReserve } from '../../interfaces';
import { sortByDate } from '../../firebase/services/dayService';
import useAuth from '../../firebase/controllers/userController';

import styles from './MyReserves.module.scss';
import { NavLink } from 'react-router-dom';
import { ExternalLinkIcon } from '@chakra-ui/icons';

const MyReserves: FC = () => {
  const appState = useAppSelector(store => store.AppStore);
  const reduxDispatch = useAppDispatch();
  const { getAllUserReserves } = useAuth();

  const [reserveList, setReserveList] = useState<IUserReserve[]>([]);

  const getReserves = async () => {
    try {
      reduxDispatch(setLoading(true));
      const list = await getAllUserReserves(appState.currentUserInfo.uid)
      if (list) {
        const sortList = list.sort((a, b) => sortByDate(a.time, b.time));
        setReserveList(sortList);
      }
    } catch (e) {
      console.log(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  }

  useEffect(() => {
    (async () => await getReserves())()
  }, []);

  return (
    <div className={styles.reserved}>
      <Header>
        <BackBtn />
        <Logo />
      </Header>

      <ScreenTitle
        title='мои записи' />

      <Container>

        <ul className={styles.list}>
          {
            reserveList.map(item => (
              <li
                key={item.id}
                className={styles.listItem}>
                <InfoContainer>
                  <span className={styles.listInfo}>
                    {item.time.date.formate}
                  </span>
                  <div className={styles.listBox}>
                    <span className={styles.listInfo}>
                      {
                        item.isConfirmed ?
                          'вы записаны'
                          :
                          'ожидайте подтверждения'
                      }
                    </span>
                    <NavLink
                      className={styles.listLink}
                      onClick={() => reduxDispatch(setSelectedDate(item.time.date))}
                      to={'/day'}>
                      <ExternalLinkIcon color={'#fff'} fontSize={'20px'} />
                    </NavLink>
                  </div>
                </InfoContainer>
              </li>
            ))
          }
        </ul>

      </Container>

    </div>
  );
};

export default MyReserves;
