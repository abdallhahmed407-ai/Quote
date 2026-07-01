import type { ReactNode } from 'react';
import styles from './styles.module.css';
import type { FieldValues } from './types';

export function Logo() {
  return (
    <div className={styles.logoWrap} aria-label="Ojoor HR Station">
      <strong>ojoor</strong>
      <span>HR STATION&nbsp;&nbsp;|&nbsp;&nbsp;محطة الموارد البشرية</span>
    </div>
  );
}

export function PageHeader({ label }: { label: string }) {
  return <header className={styles.pageHeader}><span>{label}</span><Logo /></header>;
}

export function PageFooter({ fieldValues }: { fieldValues: FieldValues }) {
  return (
    <footer className={styles.pageFooter}>
      <span>{fieldValues.companyWebsite}</span>
      <span>منصة أجور للموارد البشرية والرواتب - سري وخاص</span>
    </footer>
  );
}

export function PageTitle({ children }: { children: ReactNode }) {
  return <h1 className={styles.pageTitle}>{children}</h1>;
}
