import Link from 'next/link';
import cn from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import { flushUser, getUser } from 'store/reducers/users';

import HandleClickOutside from 'utils/click-outside';

import styles from './styles.module.scss';
import { useState } from 'react';

export default function Header () {
  const dispatch = useDispatch();
  const user = useSelector(getUser);
  const [isOpened, setIsOpened] = useState(false);

  function handleClose () {
    setIsOpened(false);
  }

  function handleToggle () {
    setIsOpened(!isOpened);
  }

  function handleFlushUser () {
    dispatch(flushUser);
  }

  return (
    <div className={styles.header}>
      <Link href="/">
        <a className={styles.headerLogo}>SkillPath</a>
      </Link>
      {
        user
          ? (
            <div className={cn(styles.profileWrapper, { [styles.profileDropdownOpened]: isOpened })}>
              <div className={styles.profile} onClick={handleToggle}>
                <div>{user.username}</div>
                <div className={styles.profileDropdownTooltip}/>
              </div>
              <HandleClickOutside visible={isOpened} onClose={handleClose}>
                <div className={styles.profileDropdown}>
                  <div
                    onClick={handleFlushUser}
                    className={styles.profileDropdownItem}
                  >
                    Log out
                  </div>
                </div>
              </HandleClickOutside>
            </div>
          )
          : (
            <div>
              <Link href="/sign-in">
                <a className={styles.headerButton}>Sign in</a>
              </Link>
              <Link href="/sign-up">
                <a className={cn(styles.headerButton, styles.headerSignUp)}>Sign up</a>
              </Link>
            </div>
          )
      }
    </div>
  );
}
