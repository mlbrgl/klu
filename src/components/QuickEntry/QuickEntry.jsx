import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import Button from '../Button/Button';

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
        onToggleFilterProjectHandler,
        onResetSearchHandler,
        onEnterHandler,
        projectName,
        location,
        history,
      } = this.props;
      if (event.metaKey || event.ctrlKey) {
        onToggleFilterProjectHandler(value.split(' ')[0], location, history);
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
    const { initValue, projectName, onRemoveProjectFilterHandler } = this.props;
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
        {projectName ? (
          <Button className={styles.project} onClick={onRemoveProjectFilterHandler}>
            {`+${projectName}`}
          </Button>
        ) : null}
      </div>
    );
  }
}

QuickEntry.defaultProps = {
  projectName: null,
};

QuickEntry.propTypes = {
  onSearchHandler: PropTypes.func.isRequired,
  onToggleFilterProjectHandler: PropTypes.func.isRequired,
  onResetSearchHandler: PropTypes.func.isRequired,
  onEnterHandler: PropTypes.func.isRequired,
  onRemoveProjectFilterHandler: PropTypes.func.isRequired,
  projectName: PropTypes.string,
  initValue: PropTypes.string.isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
};

export default withRouter(QuickEntry);
