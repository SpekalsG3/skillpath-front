import styles from './styles.module.scss';

export default function Button ({ label, onClick }) {
  return (
    <button
      className={styles.button}
      type="submit"
      onClick={onClick}
    >
      {label}
    </button>
  );
}
