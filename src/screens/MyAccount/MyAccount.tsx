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

import styles from './MyAccount.module.scss';
import DefaultBtn from '../../components/DefaultBtn/DefaultBtn';
import ModalConteiner from '../../components/ModalContainer/ModalContainer';
import FormInput from '../../components/FormInput/FormInput';
import { PhoneIcon } from '@chakra-ui/icons';
import { setLoading } from '../../store';
import useAuth from '../../firebase/controllers/userController';
import { IHistoryItem } from '../../interfaces';

const MyAccount: FC = () => {
  const appState = useAppSelector(store => store.AppStore);
  const reduxDispatch = useAppDispatch();
  const { setName, setInst, getCurrentUser } = useAuth();
  const toast = useToast();

  const [editModal, setEditModal] = useState(false);
  const [editModalValue, setEditModalValue] = useState('');
  const [editModalTitle, setEditModalTitle] = useState('');
  const [editModalPlaceholder, setEditModalPlaceholder] = useState('');
  const [history, setHistory] = useState<IHistoryItem[]>([]);

  const getUser = async () => {
    try {
      reduxDispatch(setLoading(true));
      const user = await getCurrentUser();
      setHistory(Object.values(appState.currentUserInfo.history));
    } catch (e) {
      console.log(e);
    } finally {
      reduxDispatch(setLoading(false));
    }
  }

  useEffect(() => {
    (async () => {
      await getUser();
    })();
  }, []);

  const saveEditProp = async () => {
    try {
      reduxDispatch(setLoading(true));
      const uid = appState.currentUserInfo.uid
      const type = editModalTitle;
      if (type === 'имя') {
        await setName(uid, editModalValue);
      } else if (type === 'instagram') {
        await setInst(uid, editModalValue);
      }
      await getCurrentUser();
      setEditModal(false);
      toast({
        title: 'Данные успешно изменены',
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
    <div className={styles.myAccount}>
      <Header>
        <BackBtn />
        <Logo />
      </Header>

      <ScreenTitle
        title='мой аккаунт' />

      <Container>
        <ul className={styles.infoList}>
          <li className={styles.infoItem}>
            <InfoContainer>
              <span className={styles.infoItemTitle}>Имя</span>
              <div className={styles.infoListBox}>
                <span className={styles.infoItemText}>{appState.currentUserInfo.name || 'имя не указано'}</span>
                <IconButton
                  onClick={() => {
                    setEditModalTitle('имя');
                    setEditModalValue(appState.currentUserInfo.name);
                    setEditModalPlaceholder('Кристина');
                    setEditModal(true);
                  }}
                  variant='outline'
                  colorScheme='whiteAlpha'
                  aria-label='editbtn'
                  size='xs'
                  color='#fff'
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
                  } />
              </div>
            </InfoContainer>
          </li>
          <li className={styles.infoItem}>
            <InfoContainer>
              <span className={styles.infoItemTitle}>instagram</span>
              <div className={styles.infoListBox}>
                {
                  appState.currentUserInfo.instagram ?
                    <a className={styles.infoItemText} target={'_blank'} href={appState.currentUserInfo.instagram}>
                      <IconButton
                        variant='ghost'
                        colorScheme='whiteAlpha'
                        aria-label='editbtn'
                        size='xs'
                        color='#fff'
                        icon={
                          <svg width="23" height="23" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5.8 0H14.2C17.4 0 20 2.6 20 5.8V14.2C20 15.7383 19.3889 17.2135 18.3012 18.3012C17.2135 19.3889 15.7383 20 14.2 20H5.8C2.6 20 0 17.4 0 14.2V5.8C0 4.26174 0.61107 2.78649 1.69878 1.69878C2.78649 0.61107 4.26174 0 5.8 0ZM5.6 2C4.64522 2 3.72955 2.37928 3.05442 3.05442C2.37928 3.72955 2 4.64522 2 5.6V14.4C2 16.39 3.61 18 5.6 18H14.4C15.3548 18 16.2705 17.6207 16.9456 16.9456C17.6207 16.2705 18 15.3548 18 14.4V5.6C18 3.61 16.39 2 14.4 2H5.6ZM15.25 3.5C15.5815 3.5 15.8995 3.6317 16.1339 3.86612C16.3683 4.10054 16.5 4.41848 16.5 4.75C16.5 5.08152 16.3683 5.39946 16.1339 5.63388C15.8995 5.8683 15.5815 6 15.25 6C14.9185 6 14.6005 5.8683 14.3661 5.63388C14.1317 5.39946 14 5.08152 14 4.75C14 4.41848 14.1317 4.10054 14.3661 3.86612C14.6005 3.6317 14.9185 3.5 15.25 3.5ZM10 5C11.3261 5 12.5979 5.52678 13.5355 6.46447C14.4732 7.40215 15 8.67392 15 10C15 11.3261 14.4732 12.5979 13.5355 13.5355C12.5979 14.4732 11.3261 15 10 15C8.67392 15 7.40215 14.4732 6.46447 13.5355C5.52678 12.5979 5 11.3261 5 10C5 8.67392 5.52678 7.40215 6.46447 6.46447C7.40215 5.52678 8.67392 5 10 5ZM10 7C9.20435 7 8.44129 7.31607 7.87868 7.87868C7.31607 8.44129 7 9.20435 7 10C7 10.7956 7.31607 11.5587 7.87868 12.1213C8.44129 12.6839 9.20435 13 10 13C10.7956 13 11.5587 12.6839 12.1213 12.1213C12.6839 11.5587 13 10.7956 13 10C13 9.20435 12.6839 8.44129 12.1213 7.87868C11.5587 7.31607 10.7956 7 10 7Z" fill="white" />
                          </svg>
                        } />
                    </a>
                    :
                    <span className={styles.infoItemText}>instagram не указан</span>
                }
                <IconButton
                  onClick={() => {
                    setEditModalTitle('instagram');
                    setEditModalValue(appState.currentUserInfo.instagram);
                    setEditModalPlaceholder('https://www.instagram.com/');
                    setEditModal(true);
                  }}
                  variant='outline'
                  colorScheme='whiteAlpha'
                  aria-label='editbtn'
                  size='xs'
                  color='#fff'
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
                  } />
              </div>
            </InfoContainer>
          </li>
          <li className={styles.infoItem}>
            <InfoContainer>
              <span className={styles.infoItemTitle}>телефон</span>
              <div className={styles.infoListBox}>
                <span className={styles.infoItemText}>{appState.currentUserInfo.phone}</span>
                <a href={`tel: ${appState.currentUserInfo.phone}`}>
                  <IconButton
                    variant='outline'
                    colorScheme='whiteAlpha'
                    aria-label='editbtn'
                    size='xs'
                    color='#fff'
                    icon={<PhoneIcon />} />
                </a>
              </div>
            </InfoContainer>
          </li>
        </ul>

        <div className={styles.keyWrapper}>
          <span className={styles.keyTitle}>Реферальный ключ:</span>
          <span className={styles.key}>{appState.currentUserInfo.privateKey}</span>
        </div>

        <div className={styles.history}>
          <span className={styles.historyTitle}>
            <span>История</span>
            <span>({history.length})</span>
          </span>
          <ul className={styles.historyList}>
            {history.map(item => (
              <li className={styles.historyItem}>
                <InfoContainer>
                  <span>{item.time.date.formate}</span>
                  <span>{item.status}</span>
                </InfoContainer>
              </li>
            ))}
          </ul>
        </div>

        <div className={styles.history}>
          <span className={styles.historyTitle}>
            <span>Рефералы</span>
            <span>({appState.currentUserInfo.refferals.length})</span>
          </span>
          <ul className={styles.historyList}>
            {appState.currentUserInfo.refferals.map(item => (
              <li className={styles.historyItem}>
                <InfoContainer>
                  <span>{item}</span>
                  <span>{item}</span>
                </InfoContainer>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <ModalConteiner
        isOpen={editModal}
        onClose={() => setEditModal(false)}>
        <FormInput
          placeholder={editModalPlaceholder}
          title={editModalTitle}
          value={editModalValue}
          onChange={(e) => setEditModalValue(e.target.value)} />
        <div className={styles.editModalBtn}>
          <DefaultBtn
            handleClick={saveEditProp}
            dark={true}
            type='button'
            value='сохранить' />

          <DefaultBtn
            handleClick={() => setEditModal(false)}
            dark={true}
            type='button'
            value='отмена' />
        </div>
      </ModalConteiner>

    </div>
  );
};

export default MyAccount;
