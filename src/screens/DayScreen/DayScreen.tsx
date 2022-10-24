import { FC, useEffect, useState } from "react";
import BackBtn from "../../components/BackBtn/BackBtn";
import Header from "../../components/Header/Header";
import Logo from "../../components/Logo/Logo";
import ScreenTitle from "../../components/ScreenTitle/ScreenTitle";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  IconButton,
  Input,
  Radio,
  RadioGroup,
  Select,
  Switch,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, CheckIcon, CloseIcon, MinusIcon, PhoneIcon } from '@chakra-ui/icons';
import { setLoading } from "../../store";
import useDay from "../../firebase/controllers/dayController";
import ModalConteiner from "../../components/ModalContainer/ModalContainer";
import DefaultBtn from "../../components/DefaultBtn/DefaultBtn";
import FormInput from "../../components/FormInput/FormInput";
import useTime from "../../firebase/controllers/timeController";
import { Time } from "../../firebase/services/timeService";
import { sortByTime } from "../../firebase/services/dayService";
import Container from "../../components/Container/Container";
import { NavLink } from "react-router-dom";

import styles from './DayScreen.module.scss';
import { IService, ITimeItem } from "../../interfaces";
import { useService } from "../../firebase/controllers/serviceController";
import InfoContainer from "../../components/InfoContainer/InfoContainer";

const DayScreen: FC = () => {
  const {
    bookATime
  } = useTime();
  const { getDay } = useDay();
  const { getServices } = useService();
  const toast = useToast();
  const appState = useAppSelector(store => store.AppStore);
  const reduxDispatch = useAppDispatch();

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

  const [hasFree, setHasFree] = useState(false);
  const [hasReserve, setHasReserve] = useState(false);
  const [services, setServices] = useState<IService[]>([]);
  const [selectedService, setSelectedService] = useState<string>('service');

  useEffect(() => {
    (async () => {
      reduxDispatch(setLoading(true));
      await getDay();
      await getServicesList()
      reduxDispatch(setLoading(false));
    })();
  }, []);

  const timeList = Object.values(appState.selectedDay.timeList).sort((a, b) => sortByTime(a, b));

  useEffect(() => {
    const result = timeList.filter((el) => !el.isReserved);
    const reserves = timeList.filter((el) => el.client.uid === appState.currentUserInfo.uid);
    setHasFree(result.length > 0);
    setHasReserve(reserves.length > 0);
  }, [timeList]);

  const reserveTime = (time: ITimeItem) => {
    setTimeItem(time);
    setTimeForm(true);
  }

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
      await getDay();
    } catch (e) {
      console.log(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  };

  const getServicesList = async () => {
    try {
      const list = await getServices();
      setServices(Object.values(list).sort((a, b) => Number(b.price) - Number(a.price)));
      setSelectedService(services[0].id)
    } catch (e) {
      console.log(e);
    }
  };

  const closeTimeForm = () => {
    setTimeForm(false);
    setSelectedService('service');
  }

  return (
    <div className={styles.day}>
      <Header>
        <BackBtn />
        <Logo />
      </Header>

      <ScreenTitle
        title={appState.selectedDate.formate} />

      <Container>
        {
          timeList.length < 1 &&
          <h6 className={styles.timeTitle}>
            Доступного для записи времени пока нет, но вы можете уточнить о возможности записи вас на удобное вам время
          </h6>
        }
        <ul className={styles.timeList}>
          {
            timeList.map(item => (
              <li
                key={item.id}
                // className={
                //   (item.client.uid || item.isOffline.status) ?
                //     `${styles.timeItem} ${styles.reserved} ${item.client.uid === appState.currentUserInfo.uid && styles.userReserve}` : styles.timeItem}
                className={`
                  ${styles.timeItem}
                  ${item.client.uid !== appState.currentUserInfo.uid && hasReserve ? styles.close : ''}
                  ${item.client.uid || item.isOffline.status ? `${styles.timeItem} ${styles.reserved} ${item.client.uid === appState.currentUserInfo.uid && styles.userReserve}` : ''}
                `}
              >
                <span className={styles.timeItemTime}>
                  {item.time}
                </span>
                {
                  item.client.uid === appState.currentUserInfo.uid &&
                  <span className={styles.timeItemStatus}>
                    {
                      item.client.confirmed ?
                        <>вы записаны</>
                        :
                        <>ожидайте подтверждения</>
                    }
                  </span>
                }
                <ul className={styles.btnList}>
                  {(!item.isReserved && !item.client.uid) &&
                    <li className={styles.btnListItem}>
                      <IconButton
                        onClick={() => reserveTime(item)}
                        variant='outline'
                        colorScheme='whiteAlpha'
                        aria-label='btn'
                        size={'xs'}
                        color="#fff"
                        icon={<CheckIcon />}
                      />
                    </li>
                  }
                </ul>
              </li>
            ))
          }
        </ul>
      </Container >

      <ModalConteiner
        isOpen={timeForm}
        onClose={closeTimeForm}>

        <span className={styles.formTitle}>
          выберете нужные услуги
        </span>

        <div className={styles.formLinkContainer}>
          <span className={styles.formLinkText}>
            ознакомиться с услугами можно
          </span>
          <NavLink
            to={'/services'}
            className={styles.formLink}>
            тут
          </NavLink>
        </div>

        <div className={styles.service}>
          <Select
            onChange={(e) => setSelectedService(e.target.value)}
            value={selectedService}
            className={styles.serviceSelect}>
            {
              services.map(item => (
                <option
                  key={item.id}
                  value={item.id}>
                  {item.title}
                </option>
              ))
            }
          </Select>

          <div className={styles.serviceInfo}>
            <h6 className={styles.serviceTitle}>в услугу входит:</h6>
            <ul className={styles.serviceList}>
              {
                services.find(el => el.id === selectedService)?.servicesList.map(item => (
                  <li
                    key={item.id}
                    className={styles.serviceItem}>
                    {item.value}
                  </li>
                ))
              }
            </ul>
          </div>
        </div>

        <div className={styles.formBtns}>
          <DefaultBtn
            dark={true}
            value={'подтвердить'}
            handleClick={setReserve} />
          <DefaultBtn
            dark={true}
            value={'отмена'}
            handleClick={closeTimeForm} />
        </div>
      </ModalConteiner>

      {/* {!hasFree &&
        <div className={styles.plusBtnWrapper}>
          <button className={styles.plusBtn}>
            попросить запись
          </button>
        </div>
      } */}

    </div >
  );
};

export default DayScreen;
