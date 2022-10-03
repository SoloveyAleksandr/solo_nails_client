import React, { FC } from 'react';
import Container from '../Container/Container';

import styles from './Header.module.scss';

interface IHeader {
  children: React.ReactNode
};

const Header: FC<IHeader> = ({
  children
}) => {
  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.container}>
          {children}
        </div>
      </Container>
    </header>
  )
};

export default Header;
