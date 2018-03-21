import React, { Component } from 'react';
import { getRandomIntInclusive } from '../../helpers/common'
import styles from './Frame.module.css'

class Frame extends Component {

  componentWillMount() {
    this.style = {backgroundImage: "url('" + process.env.PUBLIC_URL + "/images/" + getRandomIntInclusive(1,45) + ".jpg')"}
  }

  render() {
    return (
      <div className={styles.frame} style={this.style}>
      <div className={styles.inner}>
      {this.props.children}
      </div>
      </div>
    )
  }
}

export default Frame;