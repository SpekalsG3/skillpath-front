import Link from 'next/link'
import cn from 'classnames'

import styles from './styles.module.scss'

export default function Header () {
  return (
    <div className={styles.header}>
      <div className={styles.headerLogo}>SkillPath</div>
      <div>
        <Link href="/sign-in">
          <a className={styles.headerButton}>Sign-up</a>
        </Link>
        <Link href="/sign-up">
          <a className={cn(styles.headerButton, styles.headerSignUp)}>Sign-in</a>
        </Link>
      </div>
    </div>
  )
}
