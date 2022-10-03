import React, { FC } from "react";

import styles from './BGContainer.module.scss';

interface IBGContainer {
  children: React.ReactNode
}

const BGContainer: FC<IBGContainer> = ({ children }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.background}></div>
      <div className={styles.container}>
        {children}
      </div>
    </div>
  );
};

export default BGContainer;
