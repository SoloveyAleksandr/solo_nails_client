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
      <Container>
        <div className={styles.contentWrapper}>
          <h4 className={styles.title}>{title}</h4>
        </div>
      </Container>
    </div>
  );
};

export default ScreenTitle;
