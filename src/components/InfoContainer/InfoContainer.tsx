import { FC } from 'react';

import styles from './InfoContainer.module.scss';

interface IInfoContainer {
  children: React.ReactNode
}

const InfoContainer: FC<IInfoContainer> = ({
  children
}) => {
  return (
    <div className={styles.wrapper}>
      {children}
    </div>
  );
};

export default InfoContainer;
