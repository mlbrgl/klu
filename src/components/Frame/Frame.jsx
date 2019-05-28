import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { getRandomIntInclusive } from '../../helpers/common';
import styles from './Frame.module.css';

class Frame extends Component {
  componentWillMount() {
    this.style = {
      backgroundImage: `url('${process.env.PUBLIC_URL}/images/${getRandomIntInclusive(1, 8)}.jpg')`,
    };
  }

  render() {
    const { children } = this.props;
    return (
      <div className={styles.frame} style={this.style}>
        <div className={styles.inner}>{children}</div>
      </div>
    );
  }
}

Frame.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Frame;
