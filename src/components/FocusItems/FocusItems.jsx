import React from 'react';
import PropTypes from 'prop-types';
import { DateTime } from 'luxon';
import { connect } from 'react-redux';
import {
  isItemDone,
  isItemActionable,
  isItemFuture,
  isItemWithinProject,
} from '../../selectors/selectors';
import FocusItem from '../FocusItem/FocusItem';

const FocusItems = (props) => {
  const {
    filters,
    isFocusOn,
    focusItemId,
    projectName,
    focusItems,
    history,
    searchQuery,
    searchResults,
  } = props;
  const now = DateTime.local();

  return focusItems
    .filter((item) => {
      if (isFocusOn) {
        return item.id === focusItemId;
      }
      if (!searchQuery || searchResults.find(res => item.id === res)) {
        return (
          (!projectName || isItemWithinProject(item, { name: projectName }))
          && ((filters.done && isItemDone(item))
            || (filters.actionable && isItemActionable(now, item))
            || (filters.future && isItemFuture(now, item)))
        );
      }
      return false;
    })
    .slice(0, projectName || searchQuery ? Infinity : 20)
    .map(item => <FocusItem key={item.id} item={item} history={history} />);
};

FocusItems.defaultProps = {
  projectName: null,
  focusItemId: null,
};

FocusItems.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  focusItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
    }),
  ).isRequired,
  focusItemId: PropTypes.number,
  projectName: PropTypes.string,
  isFocusOn: PropTypes.bool.isRequired,
  filters: PropTypes.shape({
    done: PropTypes.bool,
    actionable: PropTypes.bool,
    future: PropTypes.bool,
  }).isRequired,
  searchQuery: PropTypes.string.isRequired,
  searchResults: PropTypes.arrayOf(PropTypes.number).isRequired,
};

const mapStateToProps = state => ({
  focusItems: state.focusItems,
  isFocusOn: state.app.isFocusOn,
  focusItemId: state.app.focusItemId,
  filters: state.app.filters,
  projectName: state.projectFilter,
  searchQuery: state.app.searchQuery,
  searchResults: state.app.searchResults,
});

export default connect(mapStateToProps)(FocusItems);
