import { FC, useState, useEffect } from 'react';
import BackBtn from '../../components/BackBtn/BackBtn';
import Container from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import InfoContainer from '../../components/InfoContainer/InfoContainer';
import Logo from '../../components/Logo/Logo';
import ScreenTitle from '../../components/ScreenTitle/ScreenTitle';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  IconButton,
  useToast,
} from '@chakra-ui/react';
import DefaultBtn from '../../components/DefaultBtn/DefaultBtn';
import ModalConteiner from '../../components/ModalContainer/ModalContainer';
import { CheckIcon, CloseIcon, ExternalLinkIcon } from '@chakra-ui/icons';
import { setLoading, setSelectedDate } from '../../store';
import { IReserveItem, ITimeItem } from '../../interfaces';
import useTime from '../../firebase/controllers/timeController';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { NavLink } from 'react-router-dom';
import { Time } from '../../firebase/services/timeService';

import styles from './FreeTime.module.scss';

const FreeTime: FC = () => {
  const appState = useAppSelector(store => store.AppStore);
  const reduxDispatch = useAppDispatch();
  const toast = useToast();
  const {
    getFreeTime,
    bookATime,
  } = useTime();

  const [freeTimeList, setFreeTimeList] = useState<IReserveItem[]>([]);
  const [timeItem, setTimeItem] = useState<ITimeItem>({
    id: '',
    isReserved: false,
    time: '',
    date: {
      full: 0,
      formate: '',
    },
    client: {
      uid: '',
      confirmed: false,
    },
    isOffline: {
      status: false,
      name: '',
      instagram: '',
      phoneNumber: '',
      comment: '',
    }
  });

  const [timeForm, setTimeForm] = useState(false);

  useEffect(() => {
    (async () => {
      await getFreeTimeList();
    })();
  }, []);

  async function getFreeTimeList() {
    try {
      reduxDispatch(setLoading(true));
      const data = await getFreeTime();
      if (data) {
        const filteredData = data.filter(item => Object.keys(item.timeList).length > 0)
          .sort((a, b) => Number(a.date.full) - Number(b.date.full));
        setFreeTimeList(filteredData)
      }
    } catch (e) {
      console.log(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  }

  const reserveTime = (time: ITimeItem) => {
    setTimeItem(time);
    setTimeForm(true);
  };

  const setReserve = async () => {
    try {
      setTimeForm(false);
      reduxDispatch(setLoading(true));
      const newTimeItem = new Time({
        id: timeItem.id,
        time: timeItem.time,
        date: timeItem.date,
        client: {
          uid: appState.currentUserInfo.uid,
          confirmed: false,
        },
        isReserved: true,
      });
      await bookATime({ ...newTimeItem });
      await getFreeTimeList();
    } catch (e) {
      console.log(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  };

  return (
    <div className={styles.reserved}>
      <Header>
        <BackBtn />
        <Logo />
      </Header>

      <ScreenTitle
        title='свободные записи' />

      <Container>

        <Accordion
          as={'ul'}
          allowToggle
          className={styles.daysList}>
          {freeTimeList.map(day => (
            <AccordionItem
              key={day.date.full}
              as={'li'}
              className={styles.daysItem} >
              <AccordionButton className={styles.daysItemHeader}>
                <h6 className={styles.daysItemTitle}>{day.date.formate}</h6>
                <div className={styles.daysBtns}>
                  <NavLink
                    className={styles.daysLink}
                    onClick={() => reduxDispatch(setSelectedDate(day.date))}
                    to={'/day'}
                  >
                    <ExternalLinkIcon color={'#fff'} fontSize={'20px'} />
                  </NavLink>
                  <AccordionIcon />
                </div>
              </AccordionButton>
              <AccordionPanel
                p={'10px'}
                as={'ul'}
                className={styles.timeList} >
                {
                  Object.values(day.timeList).sort((a, b) => Number(a.date.full) - Number(b.date.full)).map(item => (
                    <li
                      key={item.id}
                      className={styles.timeItem}>
                      <InfoContainer>
                        <span className={styles.timeItemTitle}>{item.time}</span>
                        <ul className={styles.btnList}>
                          <li className={styles.btnItem}>
                            <IconButton
                              onClick={() => reserveTime(item)}
                              variant='outline'
                              colorScheme='whiteAlpha'
                              aria-label='btn'
                              size={'xs'}
                              color="#fff"
                              icon={<CheckIcon />} />
                          </li>
                        </ul>
                      </InfoContainer>
                    </li>
                  ))
                }
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

      </Container>

      <ModalConteiner
        isOpen={timeForm}
        onClose={() => setTimeForm(false)}>

        <span className={styles.formTitle}>
          Забронировать запись на {`${timeItem.date.formate} в ${timeItem.time}`}?
        </span>
        <div className={styles.formBtns}>
          <DefaultBtn
            dark={true}
            value={'подтвердить'}
            handleClick={setReserve} />
          <DefaultBtn
            dark={true}
            value={'отмена'}
            handleClick={() => setTimeForm(false)} />
        </div>
      </ModalConteiner>

    </div>
  );
};

export default FreeTime;
