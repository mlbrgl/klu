import React from 'react';
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom';

import styles from './ContentWrapper.module.css';

const contentWrapper = (props) => {
  return (
    <div className={styles.contentWrapper}>
      { props.location.pathname === "/projects" ?
        <Link className={styles.viewLink} to="/">Items</Link>
        :
        <Link className={styles.viewLink} to="/projects">Projects</Link>
      }
      {props.children}
    </div>
  )
}

export default withRouter(contentWrapper);
