import React from 'react';
import styles from './Filters.module.css';
import Filter from '../../components/Filter/Filter';

const Filters = () => (
  <div className={styles.filters}>
    <Filter type="done" />
    <Filter type="actionable" />
    <Filter type="future" />
  </div>
);

export default Filters;
