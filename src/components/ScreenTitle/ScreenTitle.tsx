import { FC } from 'react';
import Container from '../Container/Container';

import styles from './ScreenTitle.module.scss';

interface IScreenTitle {
  title: string,
}

const ScreenTitle: FC<IScreenTitle> = ({
  title
}) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.contentWrapper}>
        <Container>
          <h4 className={styles.title}>{title}</h4>
        </Container>
      </div>
    </div>
  );
};

export default ScreenTitle;
