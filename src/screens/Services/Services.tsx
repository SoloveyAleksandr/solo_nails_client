import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { IconButton, Input } from "@chakra-ui/react";
import { FC, useEffect, useState } from "react";
import BackBtn from "../../components/BackBtn/BackBtn";
import Container from "../../components/Container/Container";
import DefaultBtn from "../../components/DefaultBtn/DefaultBtn";
import FormInput from "../../components/FormInput/FormInput";
import Header from "../../components/Header/Header";
import Logo from "../../components/Logo/Logo";
import ModalConteiner from "../../components/ModalContainer/ModalContainer";
import ScreenTitle from "../../components/ScreenTitle/ScreenTitle";
import { useService } from "../../firebase/controllers/serviceController";
import { IService } from "../../interfaces";
import { setLoading } from "../../store";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { v4 as uuid } from 'uuid';

import styles from './Services.module.scss';

const Services: FC = () => {
  const appState = useAppSelector(store => store.AppStore);
  const reduxDispatch = useAppDispatch();
  const {
    setService,
    removeService,
    getServices,
  } = useService();

  const [priceList, setPriceList] = useState<IService[]>([]);
  const [priceModal, setPriceModal] = useState(false);
  const [servicesList, setServicesList] = useState<{
    id: string,
    value: string,
  }[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [id, setId] = useState('');
  const [priceItem, setPriceItem] = useState<IService>({
    id,
    price,
    title,
    servicesList,
  });
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    (async () => await getServicesList())()
  }, []);

  async function getServicesList() {
    try {
      reduxDispatch(setLoading(true));
      const data = await getServices();
      const list = Object.values(data).sort((a, b) => Number(b.price) - Number(a.price))
      setPriceList(list);
    } catch (e) {

    } finally {
      reduxDispatch(setLoading(false));
    }
  }

  const addServiceItem = () => {
    const id = uuid().slice(0, 5);
    setServicesList([
      ...servicesList,
      {
        id,
        value: ''
      }
    ])
  };

  const closeModal = () => {
    setPriceModal(false);
    setTitle('');
    setPrice('');
    setId('');
    setServicesList([]);
  };

  const changeService = (index: number, value: string) => {
    const newList = [...servicesList];
    newList[index].value = value;
    setServicesList(newList);
  };

  const deleteService = (id: string) => {
    const newList = servicesList.filter(el => el.id !== id);
    setServicesList(newList);
  };

  const savePrice = async () => {
    try {
      const item = {
        id: id || uuid().slice(0, 8),
        title,
        price,
        servicesList,
      }
      closeModal();
      reduxDispatch(setLoading(true));
      await setService(item);
      await getServicesList();
    } catch (e) {
      console.log(e);
    }
  };

  const setEditItem = (item: IService) => {
    setTitle(item.title);
    setPrice(item.price);
    setId(item.id);
    setServicesList(item.servicesList);
    setPriceModal(true);
  };

  const deleteItem = async (item: IService) => {
    try {
      setDeleteConfirm(false);
      reduxDispatch(setLoading(true));
      await removeService(item);
      await getServicesList();
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className={styles.day}>
      <Header>
        <BackBtn />
        <Logo />
      </Header>

      <ScreenTitle
        title={'услуги и цены'} />

      <Container>

        <ul className={styles.priceList}>
          {
            priceList.map(item => (
              <li key={item.id}
                className={styles.priceItem}>
                <div className={styles.priceHeader}>
                  <h3 className={styles.priceTitle}>{item.title}</h3>
                  <div className={styles.headerBtns}>
                    <IconButton
                      className={styles.headerBtn}
                      onClick={() => setEditItem(item)}
                      aria-label="edit btn"
                      size={'xs'}
                      color={'#fff'}
                      variant={'outline'}
                      colorScheme={'whiteAlpha'}
                      icon={
                        <svg width="16" height="16" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
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
                    <IconButton
                      className={styles.headerBtn}
                      onClick={() => deleteItem(item)}
                      aria-label="edit btn"
                      size={'xs'}
                      color={'#fff'}
                      variant={'outline'}
                      colorScheme={'whiteAlpha'}
                      icon={<CloseIcon />} />
                  </div>
                </div>
                {
                  item.servicesList.length > 0 &&
                  <ul className={styles.serviceList}>
                    {
                      item.servicesList.map(el => (
                        <li key={el.id}
                          className={styles.serviceItem}>
                          {el.value}
                        </li>
                      ))
                    }
                  </ul>
                }
                <span className={styles.priceCount}>
                  {item.price}
                  <span className={styles.priceValue}>руб.</span>
                </span>
              </li>
            ))
          }
        </ul>

      </Container>

      <div className={styles.plusBtnWrapper}>
        <IconButton
          onClick={() => setPriceModal(true)}
          w={'60px'}
          h={'60px'}
          borderRadius={'50%'}
          colorScheme='whiteAlpha'
          aria-label='add time'
          icon={<AddIcon />}
        />
      </div>

      <ModalConteiner
        isOpen={priceModal}
        onClose={closeModal}>

        <div className={styles.modal}>
          <div className={styles.modalTitle}>
            <FormInput
              title="название"
              placeholder="пакет №1"
              value={title}
              info={'название пакета услуг'}
              onChange={(e) => setTitle(e.target.value)} />
          </div>

          <div className={styles.modalAddBtn}>
            <span className={styles.boxTitle}>
              включенные услуги
            </span>
            <IconButton
              onClick={() => addServiceItem()}
              borderRadius={'50%'}
              size={'xs'}
              colorScheme='blackAlpha'
              aria-label='add time'
              icon={<AddIcon />} />
          </div>

          <ul className={styles.modalList}>
            {
              Object.values(servicesList).map((el, index) => (
                <li
                  key={el.id}
                  className={styles.modalListItem}>
                  <input
                    className={styles.modalInput}
                    value={el.value}
                    onChange={(e) => changeService(index, e.target.value)} />
                  <IconButton
                    className={styles.modalInputBtn}
                    onClick={() => deleteService(el.id)}
                    borderRadius={'50%'}
                    size={'xs'}
                    color={'#000'}
                    colorScheme='blackAlpha'
                    variant={'outline'}
                    aria-label='add time'
                    icon={<CloseIcon />} />
                </li>
              ))
            }
          </ul>

          <div className={styles.modalPrice}>
            <FormInput
              title="стоимость"
              placeholder="30"
              value={price}
              info={'стоимость пакета услуг'}
              onChange={(e) => setPrice(e.target.value)} />
          </div>

          <div className={styles.modalBtnWrapper}>
            <DefaultBtn
              type='button'
              value={'добавить'}
              dark={true}
              handleClick={savePrice} />

            <DefaultBtn
              type='button'
              value='отмена'
              dark={true}
              handleClick={closeModal} />
          </div>
        </div>
      </ModalConteiner>

      <ModalConteiner
        isOpen={deleteConfirm}
        onClose={() => setDeleteConfirm(false)}>

        <div className={styles.modal}>

          <span className={styles.modalTitle}>
            {`Удалить ${priceItem.title}?`}
          </span>

          <div className={styles.modalBtnWrapper}>
            <DefaultBtn
              type='button'
              value='удалить'
              dark={true}
              handleClick={() => removeService(priceItem)} />

            <DefaultBtn
              type='button'
              value='отмена'
              dark={true}
              handleClick={() => setDeleteConfirm(false)} />
          </div>
        </div>
      </ModalConteiner>

    </div >
  );
};

export default Services;
