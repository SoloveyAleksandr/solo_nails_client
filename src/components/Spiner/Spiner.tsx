import React, { FC } from "react";
import { useAppSelector } from "../../store/hooks";

import styles from './Spiner.module.scss';

interface ISpiner {
}

const Spiner: FC<ISpiner> = () => {
  const isLoading = useAppSelector(state => state.AppStore.isLoading);

  return (
    <div className={`${styles.spinerWrapper} ${isLoading && styles.active}`}>
    </div>
  );
};

export default Spiner;
