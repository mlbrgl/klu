import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ProjectFilter from '../ProjectFilter/ProjectFilter';
import * as actionCreators from '../../store/projectFilter/actionCreators';

import styles from './QuickEntry.module.css';

class QuickEntry extends PureComponent {
  onChangeHandler = (event) => {
    const { onInputHandler } = this.props;
    onInputHandler(event.target.value);
    this.onSearchHandler();
  };

  onSearchHandler = debounce(() => {
    const { onSearchHandler } = this.props;
    onSearchHandler();
  }, 250);

  onKeyDownHandler = (event) => {
    if (event.key === 'Enter') {
      const {
        setProjectFilter,
        onResetSearchHandler,
        onEnterHandler,
        projectName,
        value,
      } = this.props;
      if (event.metaKey || event.ctrlKey) {
        setProjectFilter(value.split(' ')[0]);
        onResetSearchHandler();
      } else {
        const itemValue = projectName ? `${value} +${projectName}` : value;
        onEnterHandler(itemValue);
      }
    }
  };

  render() {
    const { value } = this.props;
    return (
      <div className={styles.wrapper}>
        <input
          className={styles.input}
          type="text"
          value={value}
          onKeyDown={this.onKeyDownHandler}
          onChange={this.onChangeHandler}
          data-test="quick-entry"
        />
        <ProjectFilter />
      </div>
    );
  }
}

QuickEntry.defaultProps = {
  projectName: null,
  value: '',
};

QuickEntry.propTypes = {
  onSearchHandler: PropTypes.func.isRequired,
  setProjectFilter: PropTypes.func.isRequired,
  onResetSearchHandler: PropTypes.func.isRequired,
  onEnterHandler: PropTypes.func.isRequired,
  onInputHandler: PropTypes.func.isRequired,
  projectName: PropTypes.string,
  value: PropTypes.string,
};

const mapStateToProps = state => ({
  projectName: state.projectFilter,
});

export default connect(
  mapStateToProps,
  actionCreators,
)(QuickEntry);
