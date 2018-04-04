import React from 'react';
import { Link, withRouter } from 'react-router-dom';

import styles from './ContentWrapper.module.css';

const contentWrapper = (props) => {
  return (
    <div className={styles.contentWrapper}>
      { props.children }
      { !props.isFocusOn ?
        renderViewLinks(props.location.pathname)
        : null
      }
    </div>
  )
}

const renderViewLinks = (pathname) => {
  return (
    pathname === "/projects" ?
      <Link className={styles.viewLink} to="/">Items</Link>
      :
      <Link className={styles.viewLink} to="/projects">Projects</Link>
  )
}

export default withRouter(contentWrapper);
