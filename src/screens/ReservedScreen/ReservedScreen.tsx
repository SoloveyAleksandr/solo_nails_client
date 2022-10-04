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
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverHeader,
  PopoverTrigger,
  useToast,
} from '@chakra-ui/react';
import DefaultBtn from '../../components/DefaultBtn/DefaultBtn';
import ModalConteiner from '../../components/ModalContainer/ModalContainer';
import FormInput from '../../components/FormInput/FormInput';
import { CheckIcon, CloseIcon, ExternalLinkIcon, InfoIcon, PhoneIcon } from '@chakra-ui/icons';
import { setLoading, setSelectedDate } from '../../store';
import useAuth from '../../firebase/controllers/userController';
import { IReserveItem, ITimeItem } from '../../interfaces';
import useTime from '../../firebase/controllers/timeController';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import styles from './ReservedScreen.module.scss';
import moment from 'moment';
import { NavLink } from 'react-router-dom';
import { Time } from '../../firebase/services/timeService';

const ReservedScreen: FC = () => {
  const appState = useAppSelector(store => store.AppStore);
  const reduxDispatch = useAppDispatch();
  const toast = useToast();
  const {
    getAllReserves,
    setTimeToDay,
    setTimeToFreeTime,
    removeTimeFromReserves
  } = useTime();

  const [reservedList, setReservedList] = useState<IReserveItem[]>([]);
  const [userModal, setUserModal] = useState(false);
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

  const [cancelModal, setCancelModal] = useState(false);

  useEffect(() => {
    (async () => {
      await getReserves();
    })();
  }, []);

  async function getReserves() {
    try {
      reduxDispatch(setLoading(true));
      const data = await getAllReserves();
      if (data) {
        const filteredData = data.filter(item => Object.keys(item.timeList).length > 0)
          .sort((a, b) => Number(a.date.full) - Number(b.date.full))
        setReservedList(filteredData)
      }
    } catch (e) {
      console.log(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  }

  const openUserInfo = (item: ITimeItem) => {
    setTimeItem(item);
    setUserModal(true);
  };

  const openCancelModal = (item: ITimeItem) => {
    setTimeItem(item);
    setCancelModal(true);
  };

  const cancelReserve = async () => {
    try {
      reduxDispatch(setLoading(true));
      setCancelModal(false);
      const newTimeItem = new Time({
        id: timeItem.id,
        date: timeItem.date,
        time: timeItem.time,
      });
      await setTimeToDay({ ...newTimeItem });
      await setTimeToFreeTime({ ...newTimeItem });
      await removeTimeFromReserves({ ...timeItem });
      await getReserves();
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
        title='подтвержденные записи' />

      <Container>

        <Accordion
          as={'ul'}
          allowToggle
          className={styles.daysList}>
          {reservedList.map(day => (
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
                        <div className={styles.btnWrapper}>
                          <IconButton
                            onClick={() => openUserInfo(item)}
                            className={styles.btn}
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
                          <IconButton
                            onClick={() => console.log('finish', item.date.formate, item.time)}
                            className={styles.btn}
                            variant='outline'
                            colorScheme='whiteAlpha'
                            aria-label='btn'
                            size={'xs'}
                            color="#fff"
                            icon={<CheckIcon />}
                          />
                          <IconButton
                            onClick={() => openCancelModal(item)}
                            className={styles.btn}
                            variant='outline'
                            colorScheme='whiteAlpha'
                            aria-label='btn'
                            size={'xs'}
                            color="#fff"
                            icon={<CloseIcon />}
                          />
                        </div>
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

      <ModalConteiner
        isOpen={cancelModal}
        onClose={() => setCancelModal(false)}>
        <div className={styles.cancelWrapper}>
          {
            timeItem.client.uid &&
            <div className={styles.cancelBtn}>
              <div className={styles.cancelTitle}>
                <span>отменить с пометкой</span>
                <Popover placement='auto-start'>
                  <PopoverTrigger>
                    <button
                      type="button">
                      <InfoIcon />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverBody
                      className={styles.popover}>
                      <p className={styles.cancelBody}>
                        Запись удалится, а пометка о отмененной записи будет занесена в историю клиента
                      </p>
                    </PopoverBody>
                  </PopoverContent>
                </Popover>
              </div>
              <DefaultBtn
                handleClick={() => setCancelModal(false)}
                dark={true}
                type='button'
                value='отменить' />
            </div>
          }
          <div className={styles.cancelBtn}>
            <div className={styles.cancelTitle}>
              <span>отменить без пометки</span>
              <Popover
                placement='auto-start' >
                <PopoverTrigger>
                  <button
                    type="button"
                    className={styles.infoBtn}>
                    <InfoIcon />
                  </button>
                </PopoverTrigger>
                <PopoverContent>
                  <PopoverArrow />
                  <PopoverCloseButton />
                  <PopoverBody
                    className={styles.popover} >
                    <p className={styles.cancelBody}>
                      Запись вернется в статус свободной, а пометка о отмененной записи не будет занесена в историю клиента
                    </p>
                  </PopoverBody>
                </PopoverContent>
              </Popover>
            </div>
            <DefaultBtn
              handleClick={cancelReserve}
              dark={true}
              type='button'
              value='отменить' />
          </div>
          <div className={styles.cancelClose}>
            <DefaultBtn
              handleClick={() => setCancelModal(false)}
              dark={true}
              type='button'
              value='закрыть' />
          </div>
        </div>
      </ModalConteiner>

    </div>
  );
};

export default ReservedScreen;
