import Link from 'next/link';
import cn from 'classnames';

import styles from './styles.module.scss';

export default function Header () {
  return (
    <div className={styles.header}>
      <Link href="/">
        <a className={styles.headerLogo}>SkillPath</a>
      </Link>
      <div>
        <Link href="/sign-in">
          <a className={styles.headerButton}>Sign in</a>
        </Link>
        <Link href="/sign-up">
          <a className={cn(styles.headerButton, styles.headerSignUp)}>Sign up</a>
        </Link>
      </div>
    </div>
  );
}
