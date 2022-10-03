import { FC } from 'react';

import styles from './DefaultBtn.module.scss';

interface IDefaultBtn {
  type: "button" | "reset" | "submit";
  value: string;
  handleClick?: () => void;
  disabled?: boolean,
  dark?: boolean,
}

const DefaultBtn: FC<IDefaultBtn> = ({
  type = 'button',
  value,
  handleClick,
  disabled = false,
  dark,
}) => {
  return (
    <button
      className={disabled ?
        `${styles.btn} ${styles.disabled} ${dark ? styles.dark : ''}`
        : `${styles.btn} ${dark ? styles.dark : ''}`}
      type={type}
      onClick={handleClick}>
      {value}
    </button>
  )
};

export default DefaultBtn;
