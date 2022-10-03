import { FC } from "react";
import { useNavigate } from 'react-router-dom';

import styles from './BackBtn.module.scss';

const BackBtn: FC = () => {
  const navigate = useNavigate();
  return (
    <button
      className={styles.buttonWrapper}
      onClick={() => navigate(-1)}>
      <span className={styles.button}></span>
    </button>
  );
};

export default BackBtn;