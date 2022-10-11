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
  const reduxDispatch = useAppDispatch();
  const {
    getServices,
  } = useService();

  const [priceList, setPriceList] = useState<IService[]>([]);

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
    </div >
  );
};

export default Services;
