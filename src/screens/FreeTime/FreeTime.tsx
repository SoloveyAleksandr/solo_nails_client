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
  Input,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Switch,
  useToast,
} from '@chakra-ui/react';
import DefaultBtn from '../../components/DefaultBtn/DefaultBtn';
import ModalConteiner from '../../components/ModalContainer/ModalContainer';
import { CheckIcon, CloseIcon, ExternalLinkIcon, InfoIcon, PhoneIcon } from '@chakra-ui/icons';
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
import FormInput from '../../components/FormInput/FormInput';

const FreeTime: FC = () => {
  const appState = useAppSelector(store => store.AppStore);
  const reduxDispatch = useAppDispatch();
  const toast = useToast();
  const {
    getFreeTime,

    setTimeToDay,
    setTimeToFreeTime,
    setTimeToReserves,

    removeTimeFromDay,
    removeTimeFromFreeTime,
    removeTimeFromReserves,
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
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  const [time, setTime] = useState('08:00');
  const [name, setName] = useState('');
  const [inst, setInst] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [comment, setComment] = useState('');
  const [isOffline, setIsOffline] = useState(false);

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
          .sort((a, b) => Number(a.date.full) - Number(b.date.full))
        setFreeTimeList(filteredData)
      }
    } catch (e) {
      console.log(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  }

  const closeModal = () => {
    setTimeForm(false);
    setName('');
    setInst('');
    setComment('');
    setPhoneNumber('');
    setIsOffline(false);
  };

  const editTimeItem = (item: ITimeItem) => {
    setTimeItem(item);
    setTime(item.time)
    setName(item.isOffline.name);
    setInst(item.isOffline.instagram);
    setPhoneNumber(item.isOffline.phoneNumber);
    setComment(item.isOffline.comment);
    setIsOffline(item.isOffline.status);
    setTimeForm(true);
  };

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
      if (!timeItem.isReserved && newTimeItem.isReserved) {
        await removeTimeFromFreeTime({ ...newTimeItem });
        await setTimeToReserves({ ...newTimeItem });
        toast({
          title: `Запись зарезервирована`,
          status: 'success',
          isClosable: true,
          duration: 5000,
          position: 'top',
        });
      }
      if (!timeItem.isReserved && !newTimeItem.isReserved) {
        await setTimeToFreeTime({ ...newTimeItem });
        toast({
          title: `Запись изменена`,
          status: 'success',
          isClosable: true,
          duration: 5000,
          position: 'top',
        });
      }
      await getFreeTimeList();
    } catch (e) {
      console.log(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  };

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
      await getFreeTimeList();

      toast({
        title: `Запись на ${timeItem.time} удалена`,
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
                          <li className={styles.btnItem}>
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
                      </InfoContainer>
                    </li>
                  ))
                }
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>

      </Container>

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
              value={'сохранить'}
              dark={true}
              handleClick={saveEditTime} />

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

    </div>
  );
};

export default FreeTime;
