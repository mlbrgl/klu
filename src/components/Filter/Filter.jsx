import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button/Button';

import styles from './Filter.module.css';

class Filter extends PureComponent {
  onToggleFilterDateHandler = () => {
    const { onToggleFilterDateHandler, type } = this.props;
    onToggleFilterDateHandler(type);
  };

  render() {
    const { active } = this.props;
    const stylesFilter = active ? styles.active : styles.filter;
    return <Button className={stylesFilter} onClick={this.onToggleFilterDateHandler} />;
  }
}

Filter.propTypes = {
  active: PropTypes.bool.isRequired,
  onToggleFilterDateHandler: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
};

export default Filter;
