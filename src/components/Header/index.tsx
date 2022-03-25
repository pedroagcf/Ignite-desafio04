import Image from 'next/image';
import Link from 'next/link';

import styles from './header.module.scss';

export default function Header(): JSX.Element {
  return (
    <header className={styles.headerContainer}>
      <Link href="/">
        <a className={styles.headerContent}>
          <Image src="/images/logo.svg" width="238" height="25" alt="logo" />
        </a>
      </Link>
    </header>
  );
}
