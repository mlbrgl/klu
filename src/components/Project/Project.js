import React from 'react'
import styles from './Project.module.css'

const project = (props) => {
  return (
    <div className={styles.project}>{props.children}</div>
  )
}

export default project
