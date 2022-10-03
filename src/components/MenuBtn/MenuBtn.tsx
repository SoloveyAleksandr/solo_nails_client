import { FC } from "react";

import styles from './MenuBtn.module.scss';

interface IMenuBtn {
  isActive: boolean,
  handleClick(): void,
}

const MenuBtn: FC<IMenuBtn> = ({
  isActive,
  handleClick }) => {
  return (
    <div className={styles.btn}
      onClick={handleClick}>
      <span className={isActive ? `${styles.burger} ${styles.active}` : styles.burger}></span>
    </div>
  );
};

export default MenuBtn;
