import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import ProjectFilter from '../ProjectFilter/ProjectFilter';
import * as actionCreators from '../../store/projectFilter/actionCreators';

import styles from './QuickEntry.module.css';

class QuickEntry extends PureComponent {
  onChangeHandler = () => {
    this.onSearchHandler();
  };

  onSearchHandler = debounce(() => {
    const { onSearchHandler } = this.props;
    onSearchHandler(this.el.value);
  }, 250);

  onKeyDownHandler = (event) => {
    if (event.key === 'Enter') {
      const { value } = this.el;
      const {
        setProjectFilter, onResetSearchHandler, onEnterHandler, projectName,
      } = this.props;
      if (event.metaKey || event.ctrlKey) {
        setProjectFilter(value.split(' ')[0]);
        onResetSearchHandler();
        this.el.value = null;
      } else {
        const itemValue = projectName ? `${value} +${projectName}` : value;
        onEnterHandler(itemValue);
        this.el.value = null;
      }
    }
  };

  render() {
    const { initValue } = this.props;
    return (
      <div className={styles.wrapper}>
        <input
          className={styles.input}
          type="text"
          defaultValue={initValue}
          ref={(el) => {
            this.el = el;
          }}
          onKeyDown={this.onKeyDownHandler}
          onChange={this.onChangeHandler}
        />
        <ProjectFilter />
      </div>
    );
  }
}

QuickEntry.defaultProps = {
  projectName: null,
};

QuickEntry.propTypes = {
  onSearchHandler: PropTypes.func.isRequired,
  setProjectFilter: PropTypes.func.isRequired,
  onResetSearchHandler: PropTypes.func.isRequired,
  onEnterHandler: PropTypes.func.isRequired,
  initValue: PropTypes.string.isRequired,
  projectName: PropTypes.string,
};

const mapStateToProps = state => ({
  projectName: state.projectFilter,
});

export default connect(
  mapStateToProps,
  actionCreators,
)(QuickEntry);
