import { FC, useEffect, useState } from "react";
import BackBtn from "../../components/BackBtn/BackBtn";
import Header from "../../components/Header/Header";
import Logo from "../../components/Logo/Logo";
import ScreenTitle from "../../components/ScreenTitle/ScreenTitle";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  IconButton,
  Input,
  Switch,
  useToast,
} from '@chakra-ui/react';
import { AddIcon, CheckIcon, CloseIcon, PhoneIcon } from '@chakra-ui/icons';
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
import { ITimeItem } from "../../interfaces";

const DayScreen: FC = () => {
  const {
    setTimeToDay,
    setTimeToFreeTime,
    setTimeToReserves,

    removeTimeFromDay,
    removeTimeFromFreeTime,
    removeTimeFromReserves,

  } = useTime();
  const { getDay } = useDay();
  const toast = useToast();
  const appState = useAppSelector(store => store.AppStore);
  const reduxDispatch = useAppDispatch();

  const [timeForm, setTimeForm] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [userModal, setUserModal] = useState(false);
  const [timeItem, setTimeItem] = useState<ITimeItem>({
    id: '',
    isReserved: false,
    time: '',
    date: {
      full: '',
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

  const [time, setTime] = useState('08:00');
  const [name, setName] = useState('');
  const [inst, setInst] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [comment, setComment] = useState('');
  const [isOffline, setIsOffline] = useState(false);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    (async () => {
      reduxDispatch(setLoading(true));
      await getDay();
      reduxDispatch(setLoading(false));
    })();
  }, []);

  const timeList = Object.values(appState.selectedDay.timeList).sort((a, b) => sortByTime(a, b));

  const closeModal = () => {
    setTimeForm(false);
    setName('');
    setInst('');
    setComment('');
    setPhoneNumber('');
    setIsOffline(false);
    setEdit(false);
  };

  const addNewTime = async () => {
    try {
      if (isOffline) {
        if (!name && !inst) {
          toast({
            title: 'Добавьте ИМЯ и КОНТАКТЫ клиента или уберите метку "оффлайн"',
            status: 'warning',
            isClosable: true,
            duration: 5000,
            position: 'top',
          });
          return;
        } else if (!name) {
          toast({
            title: 'Добавьте ИМЯ клиента или уберите метку "оффлайн"',
            status: 'warning',
            isClosable: true,
            duration: 5000,
            position: 'top',
          });
          return;
        } else if (!inst && !phoneNumber) {
          toast({
            title: 'Добавьте INSTAGRAM или НОМЕР ТЕЛЕФОНА клиента или уберите метку "оффлайн"',
            status: 'warning',
            isClosable: true,
            duration: 5000,
            position: 'top',
          });
          return;
        }
      }
      const newTimeItem = isOffline ?
        new Time({
          time: time,
          date: appState.selectedDate,
          isReserved: true,
          isOffline: {
            status: true,
            name: name,
            instagram: inst,
            phoneNumber: phoneNumber,
            comment: comment,
          }
        }) : new Time({
          time: time,
          date: appState.selectedDate,
        });
      reduxDispatch(setLoading(true));
      closeModal();
      await setTimeToDay({ ...newTimeItem });
      if (isOffline) {
        await setTimeToReserves({ ...newTimeItem });
      } else {
        await setTimeToFreeTime({ ...newTimeItem });
      }
      await getDay();
      toast({
        title: `Добавлена запись на ${newTimeItem.date.formate} ${newTimeItem.time}`,
        status: 'success',
        isClosable: true,
        duration: 5000,
        position: 'top',
      });
    } catch (e) {
      console.log(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  };

  const editTimeItem = (item: ITimeItem) => {
    setEdit(true);
    setTimeItem(item);
    setTime(item.time)
    setName(item.isOffline.name);
    setInst(item.isOffline.instagram);
    setPhoneNumber(item.isOffline.phoneNumber);
    setComment(item.isOffline.comment);
    setIsOffline(item.isOffline.status);
    setTimeForm(true);
  }

  const saveEditTime = async () => {
    try {
      if (isOffline) {
        if (!name && !inst) {
          toast({
            title: 'Добавьте ИМЯ и КОНТАКТЫ клиента или уберите метку "оффлайн"',
            status: 'warning',
            isClosable: true,
            duration: 5000,
            position: 'top',
          });
          return;
        } else if (!name) {
          toast({
            title: 'Добавьте ИМЯ клиента или уберите метку "оффлайн"',
            status: 'warning',
            isClosable: true,
            duration: 5000,
            position: 'top',
          });
          return;
        } else if (!inst && !phoneNumber) {
          toast({
            title: 'Добавьте INSTAGRAM или НОМЕР ТЕЛЕФОНА клиента или уберите метку "оффлайн"',
            status: 'warning',
            isClosable: true,
            duration: 5000,
            position: 'top',
          });
          return;
        }
      }
      const newTimeItem = new Time({
        id: timeItem.id,
        time: time,
        date: timeItem.date,
        isReserved: isOffline,
        isOffline: isOffline ?
          {
            status: isOffline,
            name: name,
            instagram: inst,
            phoneNumber: phoneNumber,
            comment: comment,
          } :
          {
            status: isOffline,
            name: '',
            instagram: '',
            phoneNumber: '',
            comment: '',
          }
      });

      reduxDispatch(setLoading(true));
      closeModal();
      await setTimeToDay({ ...newTimeItem });

      if (timeItem.isReserved && newTimeItem.isReserved) {
        await setTimeToReserves({ ...newTimeItem });
      }
      if (timeItem.isReserved && !newTimeItem.isReserved) {
        //удалить из резервов
        await removeTimeFromReserves({ ...newTimeItem });
        // добавить в freeTime
        await setTimeToFreeTime({ ...newTimeItem });
      }
      if (!timeItem.isReserved && newTimeItem.isReserved) {
        //del from freeTime
        await removeTimeFromFreeTime({ ...newTimeItem });
        // add to reserves
        await setTimeToReserves({ ...newTimeItem });
      }
      if (!timeItem.isReserved && !newTimeItem.isReserved) {
        await setTimeToFreeTime({ ...newTimeItem });
      }

      await getDay();
      toast({
        title: `Запись успешно изменена`,
        status: 'success',
        isClosable: true,
        duration: 5000,
        position: 'top',
      });

    } catch (e) {
      console.log(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  }

  const getDeleteConfirm = (item: ITimeItem) => {
    setTimeItem(item);
    setDeleteConfirm(true);
  };

  const deleteTime = async () => {
    try {
      setDeleteConfirm(false);
      reduxDispatch(setLoading(true));
      await removeTimeFromDay(timeItem);
      if (timeItem.isReserved) {
        await removeTimeFromReserves(timeItem);
      } else {
        await removeTimeFromFreeTime(timeItem);
      }
      await getDay();
      reduxDispatch(setLoading(false));
      toast({
        title: `Запись на ${timeItem?.time} удалена`,
        status: 'success',
        isClosable: true,
        duration: 5000,
        position: 'top',
      });
    } catch (e) {
      console.log(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  }

  const openUserInfo = (item: ITimeItem) => {
    setTimeItem(item);
    setUserModal(true);
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
        <ul className={styles.timeList}>
          {
            timeList.map(item => (
              <li
                key={item.id}
                className={
                  (item.client.uid || item.isOffline.status) ?
                    `${styles.timeItem} ${styles.reserved}` : styles.timeItem}>
                <span className={styles.timeItemTime}>
                  {item.time}
                </span>
                <ul className={styles.btnList}>

                  {/* клиент записан через приложение */}
                  {item.client.uid &&
                    <li className={styles.btnListItem}>
                      <NavLink
                        to={'/user'}>
                        <IconButton
                          onClick={() => console.log('установить данные пользователя')}
                          variant='outline'
                          colorScheme='whiteAlpha'
                          aria-label='btn'
                          size={'xs'}
                          color="#fff"
                          icon={
                            <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                              <rect x="3" width="6" height="6" rx="3" fill="white" />
                              <path d="M0 10.5V10.5C0.939219 8.67374 2.71599 7.4257 4.75256 7.1617L4.82655 7.15211C5.60557 7.05113 6.39436 7.05113 7.17338 7.15211L7.24745 7.16171C9.28402 7.42571 11.0608 8.67374 12 10.5V10.5V10.5C10.7728 12.6476 8.47348 14 5.99996 14V14V14C3.80354 14 1.74233 12.9393 0.465688 11.152L0 10.5Z" fill="white" />
                            </svg>
                          }
                        />
                      </NavLink>
                    </li>
                  }

                  {/* клиент записан оффлайн */}
                  {item.isOffline.status &&
                    <li className={styles.btnListItem}>
                      <IconButton
                        onClick={() => openUserInfo(item)}
                        variant='outline'
                        colorScheme='whiteAlpha'
                        aria-label='btn'
                        size={'xs'}
                        color="#fff"
                        icon={
                          <svg width="12" height="14" viewBox="0 0 12 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" width="6" height="6" rx="3" fill="white" />
                            <path d="M0 10.5V10.5C0.939219 8.67374 2.71599 7.4257 4.75256 7.1617L4.82655 7.15211C5.60557 7.05113 6.39436 7.05113 7.17338 7.15211L7.24745 7.16171C9.28402 7.42571 11.0608 8.67374 12 10.5V10.5V10.5C10.7728 12.6476 8.47348 14 5.99996 14V14V14C3.80354 14 1.74233 12.9393 0.465688 11.152L0 10.5Z" fill="white" />
                          </svg>
                        }
                      />
                    </li>
                  }

                  {/* подтверждение записи если клиент записан */}
                  {(item.client.uid && !item.client.confirmed) &&
                    <li className={styles.btnListItem}>
                      <IconButton
                        onClick={() => console.log('подтвердить запись')}
                        variant='outline'
                        colorScheme='whiteAlpha'
                        aria-label='btn'
                        size={'xs'}
                        color="#fff"
                        icon={<CheckIcon />}
                      />
                    </li>
                  }

                  {/* блок редактирования записи с клиентом */}
                  {!item.client.uid &&
                    <li className={styles.btnListItem}>
                      <IconButton
                        onClick={() => editTimeItem(item)}
                        variant='outline'
                        colorScheme='whiteAlpha'
                        aria-label='btn'
                        size={'xs'}
                        color="#fff"
                        icon={
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g clipPath="url(#clip0_219_638)">
                              <path d="M0.54481 7.42478L2.52475 9.40472L2.47558 9.50307L0.001297 10L0.495635 7.52572L0.54481 7.42478ZM0.8968 7.05985L2.89227 9.05532L8.49305 3.45457L6.49755 1.4591L0.8968 7.05985ZM9.70172 0.88968L9.10644 0.296991C8.71045 -0.0989971 8.11779 -0.0989971 7.72178 0.296991L6.88062 1.13814L8.86057 3.11808L9.70172 2.27693C10.0977 1.88094 10.0977 1.23649 9.70172 0.88968Z" fill="white" />
                            </g>
                            <defs>
                              <clipPath id="clip0_219_638">
                                <rect width="10" height="10" fill="white" />
                              </clipPath>
                            </defs>
                          </svg>
                        }
                      />
                    </li>
                  }

                  <li className={styles.btnListItem}>
                    <IconButton
                      onClick={() => getDeleteConfirm(item)}
                      variant='outline'
                      colorScheme='whiteAlpha'
                      aria-label='btn'
                      size={'xs'}
                      color="#fff"
                      icon={<CloseIcon />}
                    />
                  </li>
                </ul>
              </li>
            ))
          }
        </ul>
      </Container >

      <div className={styles.plusBtnWrapper}>
        <IconButton
          onClick={() => setTimeForm(true)}
          w={'60px'}
          h={'60px'}
          borderRadius={'50%'}
          colorScheme='whiteAlpha'
          aria-label='add time'
          icon={<AddIcon />}
        />
      </div>

      {/* добавление и редактирование записи */}
      <ModalConteiner
        isOpen={timeForm}
        onClose={() => closeModal()}>

        <div className={styles.modal}>
          <ul className={styles.modalList}>
            <li className={styles.modalListItem}>
              <label className={styles.modalItemLabel}>Время
                <Input
                  className={styles.timeInp}
                  borderWidth={'2px'}
                  borderColor={'rgba(15, 15, 15, 1)'}
                  type='time'
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                />
              </label>
            </li>

            <li className={styles.modalListItem}>
              <label className={`${styles.modalItemLabel} ${styles.switchWrapper}`}>запись оффлайн
                <Switch
                  colorScheme='blackAlpha'
                  outline={'none'}
                  isChecked={isOffline}
                  onChange={() => setIsOffline(!isOffline)} />
              </label>
            </li>
            <li>
              <ul className={isOffline ?
                `${styles.oflineInfoList} ${styles.open}` :
                styles.oflineInfoList}>
                <li className={styles.modalListItem}>
                  <FormInput
                    title="имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={'Кристина'} />
                </li>
                <li className={styles.modalListItem}>
                  <FormInput
                    title="instagram"
                    value={inst}
                    onChange={(e) => setInst(e.target.value)}
                    placeholder={'https://www.instagram.com/аккаунт'} />
                </li>
                <li className={styles.modalListItem}>
                  <FormInput
                    title="телефон"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder={'80291232323'} />
                </li>
                <li className={styles.modalListItem}>
                  <FormInput
                    title="комментарий"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder={'Кристина'} />
                </li>
              </ul>
            </li>
          </ul>

          <div className={styles.modalBtnWrapper}>
            <DefaultBtn
              type='button'
              value={edit ? 'сохранить' : 'добавить'}
              dark={true}
              handleClick={() => edit ? saveEditTime() : addNewTime()} />

            <DefaultBtn
              type='button'
              value='отмена'
              dark={true}
              handleClick={closeModal} />
          </div>
        </div>
      </ModalConteiner>

      {/* подтверждение удаления записи */}
      <ModalConteiner
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}>

        <div className={styles.modal}>

          <span className={styles.modalTitle}>
            {`Удалить запись на ${timeItem?.time}`}
          </span>

          <div className={styles.modalBtnWrapper}>
            <DefaultBtn
              type='button'
              value='удалить'
              dark={true}
              handleClick={deleteTime} />

            <DefaultBtn
              type='button'
              value='отмена'
              dark={true}
              handleClick={() => setDeleteConfirm(false)} />
          </div>
        </div>
      </ModalConteiner>

      {/* информация пользователя офлайн записи */}
      <ModalConteiner
        isOpen={userModal}
        onClose={() => setUserModal(false)}>

        <div className={styles.modal}>

          <ul className={styles.infoList}>
            <li className={styles.infoItem}>
              <span className={styles.infoTitle}>имя</span>
              <span>{timeItem.isOffline.name}</span>
            </li>
            {
              timeItem.isOffline.instagram &&
              <li className={styles.infoItem}>
                <span className={styles.infoTitle}>instagram</span>
                <a target={'_blank'} href={timeItem.isOffline.instagram}>
                  <IconButton
                    variant='link'
                    colorScheme='blackAlpha'
                    aria-label='btn'
                    size={'xs'}
                    color="#000"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.8 0H14.2C17.4 0 20 2.6 20 5.8V14.2C20 15.7383 19.3889 17.2135 18.3012 18.3012C17.2135 19.3889 15.7383 20 14.2 20H5.8C2.6 20 0 17.4 0 14.2V5.8C0 4.26174 0.61107 2.78649 1.69878 1.69878C2.78649 0.61107 4.26174 0 5.8 0ZM5.6 2C4.64522 2 3.72955 2.37928 3.05442 3.05442C2.37928 3.72955 2 4.64522 2 5.6V14.4C2 16.39 3.61 18 5.6 18H14.4C15.3548 18 16.2705 17.6207 16.9456 16.9456C17.6207 16.2705 18 15.3548 18 14.4V5.6C18 3.61 16.39 2 14.4 2H5.6ZM15.25 3.5C15.5815 3.5 15.8995 3.6317 16.1339 3.86612C16.3683 4.10054 16.5 4.41848 16.5 4.75C16.5 5.08152 16.3683 5.39946 16.1339 5.63388C15.8995 5.8683 15.5815 6 15.25 6C14.9185 6 14.6005 5.8683 14.3661 5.63388C14.1317 5.39946 14 5.08152 14 4.75C14 4.41848 14.1317 4.10054 14.3661 3.86612C14.6005 3.6317 14.9185 3.5 15.25 3.5ZM10 5C11.3261 5 12.5979 5.52678 13.5355 6.46447C14.4732 7.40215 15 8.67392 15 10C15 11.3261 14.4732 12.5979 13.5355 13.5355C12.5979 14.4732 11.3261 15 10 15C8.67392 15 7.40215 14.4732 6.46447 13.5355C5.52678 12.5979 5 11.3261 5 10C5 8.67392 5.52678 7.40215 6.46447 6.46447C7.40215 5.52678 8.67392 5 10 5ZM10 7C9.20435 7 8.44129 7.31607 7.87868 7.87868C7.31607 8.44129 7 9.20435 7 10C7 10.7956 7.31607 11.5587 7.87868 12.1213C8.44129 12.6839 9.20435 13 10 13C10.7956 13 11.5587 12.6839 12.1213 12.1213C12.6839 11.5587 13 10.7956 13 10C13 9.20435 12.6839 8.44129 12.1213 7.87868C11.5587 7.31607 10.7956 7 10 7Z" fill="#000" />
                      </svg>
                    }
                  />
                </a>
              </li>
            }
            {
              timeItem.isOffline.phoneNumber &&
              <li className={styles.infoItem}>
                <span className={styles.infoTitle}>телефон</span>
                <a href={`tel: ${timeItem.isOffline.phoneNumber}`}>
                  <IconButton
                    variant='link'
                    colorScheme='blackAlpha'
                    aria-label='btn'
                    size={'xs'}
                    color="#000"
                    icon={<PhoneIcon />}
                  />
                </a>
              </li>
            }
            <li className={styles.infoComment}>
              <span className={styles.infoTitle}>комментарий</span>
              <div>{timeItem.isOffline.comment}</div>
            </li>
          </ul>
          <div className={styles.btnWrapper}>
            <DefaultBtn
              type='button'
              value='закрыть'
              dark={true}
              handleClick={() => setUserModal(false)} />
          </div>
        </div>
      </ModalConteiner>
    </div >
  );
};

export default DayScreen;
