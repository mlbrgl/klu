import React, { PureComponent } from 'react';
import debounce from 'lodash.debounce';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { DateTime } from 'luxon';
import styled from 'styled-components/macro';
import ProjectFilter from '../ProjectFilter/ProjectFilter';
import * as actionCreatorsFocusItems from '../../store/focusItems/actionCreators';
import * as actionCreatorsApp from '../../store/app/actionCreators';
import { getNewFocusItem } from '../../store/store';


const StyledQuickEntry = styled.div`
  display: flex;
  flex-shrink: 0;
  max-width: 960px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 4rem;
  font-size: 2rem;
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
`;

const Input = styled.input`
  display: block;
  flex-grow: 1;
  font-family: 'Lato';
  font-size: 2rem;
  color: inherit;
  background-color: transparent;
  border: none;
  outline: none;
`;

class QuickEntry extends PureComponent {
  refInput = React.createRef();

  onSearchHandler = debounce(() => {
    const { searching } = this.props;
    // When the user creates an item (validates the input) before the end of the debounce timeout,
    // the search will return after the creation of the item and leave the UI in an inconsistent
    // state, with the search input field empty but the list filtered by the search query.
    // To prevent this, we grab the field value from the DOM before starting the search, which
    // in this case will be empty. If we were to pass it through the function params, the last
    // non empty search will be run instead, leading to the inconsistent state mentioned before.
    // Is the field still in the DOM? (might be unmounted by the time we try and reach it, e.g.
    // by focusing on an item. Only really happens in high speed e2e tests)
    if (this.refInput.current !== null) {
      searching(this.refInput.current.value);
    }
  }, 250);

  onKeyDownHandler = (event) => {
    if (event.key === 'Enter') {
      const { setProjectFilter, resetSearch, projectFilter } = this.props;
      const { value } = this.refInput.current;
      if (event.metaKey || event.ctrlKey) {
        setProjectFilter(value.split(' ')[0]);
      } else {
        const { addFocusItem } = this.props;
        const itemValue = projectFilter ? `${value} +${projectFilter}` : value;
        const newItem = getNewFocusItem(DateTime.local(), itemValue);
        addFocusItem(newItem);
      }
      this.refInput.current.value = '';
      resetSearch();
    }
  };

  render() {
    const { searchQuery } = this.props;
    return (
      <StyledQuickEntry>
        <Input
          type="text"
          defaultValue={searchQuery}
          onKeyDown={this.onKeyDownHandler}
          onChange={this.onSearchHandler}
          ref={this.refInput}
          data-test="quick-entry"
        />
        <ProjectFilter />
      </StyledQuickEntry>
    );
  }
}

QuickEntry.defaultProps = {
  projectFilter: null,
};

QuickEntry.propTypes = {
  addFocusItem: PropTypes.func.isRequired,
  projectFilter: PropTypes.string,
  resetSearch: PropTypes.PropTypes.func.isRequired,
  searching: PropTypes.PropTypes.func.isRequired,
  setProjectFilter: PropTypes.func.isRequired,
  searchQuery: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  projectFilter: state.app.projectFilter,
  searchQuery: state.app.searchQuery,
});

export default connect(
  mapStateToProps,
  { ...actionCreatorsFocusItems, ...actionCreatorsApp },
)(QuickEntry);
