import { FC } from "react";

import styles from './Menu.module.scss';

interface IMenu {
    children: React.ReactNode,
    isActive: boolean,
}

const Menu: FC<IMenu> = ({ children, isActive }) => {
    return (
        <nav className={isActive ? `${styles.menu} ${styles.active}` : styles.menu}>
            {children}
        </nav>
    );
};

export default Menu;
