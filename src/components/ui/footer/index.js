import Link from 'next/link';
import styles from './styles.module.scss';

export default function Footer () {
  return (
    <div className={styles.footer}>
      <div>
        <Link href="/">
          <a className={styles.footerLogo}>SkillPath</a>
        </Link>
        <div className={styles.footerCopyright}>
          {new Date().getFullYear()} SkillPath © All rights reserved
        </div>
      </div>

      <div className={styles.footerDescription}>
        Follow up on a path of you favourite coding skills
      </div>
    </div>
  );
}
