import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import styled from 'styled-components/macro';
import Button from '../Button/Button';
import * as actionCreatorsProjects from '../../store/projects/actionCreators';
import * as actionCreatorsApp from '../../store/app/actionCreators';
import {
  PROJECT_ACTIVE,
  PROJECT_PENDING,
  PROJECT_PAUSED,
  PROJECT_COMPLETED,
} from '../../helpers/constants';
import StyledListItem from '../StyledListItem/StyledListItem';

const Info = styled.div`
  font-size: 1rem;
  display: flex;
`;

const Label = styled.div`
  & span {
    font-style: italic;
  }
`;

const ActionButton = styled(Button)`
  margin-left: 1rem;
  padding: 0;
  color: yellow;
  opacity: 0.6;
  font-size: inherit;
  border: none;

  &:hover {
    opacity: 1;
  }
`;

const FrequencyButtonsWrapper = styled.div`
  float: right;
`;

const FrequencyButton = styled(Button)`
  padding: 0 0.2rem;
  font-size: 1.5rem;
  line-height: 3rem;
  color: gray;
  border: none;

  &:hover {
    color: white;
  }
`;

const StyledProjects = styled(StyledListItem)`
  color: white;

  &:hover {
    cursor: pointer;
    background-color: rgba(255, 255, 255, 0.1);
  }

  ${(props) => {
    switch (props.status) {
      case PROJECT_PENDING: {
        return 'color: yellow;';
      }
      case PROJECT_PAUSED:
        return 'color: grey;';
      case PROJECT_COMPLETED:
        return `
          color: grey;
          text-decoration: line-through;
        `;
      default:
        return '';
    }
  }}
`;

class Project extends Component {
  onSetProjectFilter = () => {
    const { name, history, setProjectFilter } = this.props;
    history.push('/');
    setProjectFilter(name);
  };

  onUpProjectFrequencyHandler = (event) => {
    event.stopPropagation();
    const { upFrequency, name } = this.props;
    upFrequency(name);
  };

  onDownProjectFrequencyHandler = (event) => {
    event.stopPropagation();
    const { downFrequency, name } = this.props;
    downFrequency(name);
  };

  onPauseProjectHandler = (event) => {
    event.stopPropagation();
    const { setStatus, name } = this.props;
    setStatus(name, PROJECT_PAUSED);
  };

  onCompleteProjectHandler = (event) => {
    event.stopPropagation();
    const { setStatus, name } = this.props;
    setStatus(name, PROJECT_COMPLETED);
  };

  renderInfo() {
    let label;
    let actions = null;
    const { status, frequency } = this.props;

    if (status === PROJECT_PENDING) {
      label = <span>anything left?</span>;
      actions = this.renderActions();
    } else if (status === PROJECT_PAUSED) {
      label = 'paused';
    } else if (frequency > 0) {
      label = `${frequency}X a day`;
    }

    return label ? (
      <Info>
        <Label>{label}</Label>
        {actions}
      </Info>
    ) : null;
  }

  renderActions() {
    return (
      <>
        <ActionButton onClick={this.onSetProjectFilter}>yep</ActionButton>
        <ActionButton onClick={this.onPauseProjectHandler}>nothing for now</ActionButton>
        <ActionButton onClick={this.onCompleteProjectHandler}>nothing at all</ActionButton>
      </>
    );
  }

  render() {
    const { status, name } = this.props;

    return (
      <StyledProjects
        status={status}
        onClick={this.onSetProjectFilter}
        onKeyPress={this.onSetProjectFilter}
        role="link"
        tabIndex="0"
        data-test="project"
      >
        {name}

        {status === PROJECT_ACTIVE ? (
          <FrequencyButtonsWrapper>
            <FrequencyButton
              className="icon-circle-with-plus"
              onClick={this.onUpProjectFrequencyHandler}
            />
            <FrequencyButton
              className="icon-circle-with-minus"
              onClick={this.onDownProjectFrequencyHandler}
            />
          </FrequencyButtonsWrapper>
        ) : null}

        {this.renderInfo()}
      </StyledProjects>
    );
  }
}

Project.propTypes = {
  downFrequency: PropTypes.func.isRequired,
  frequency: PropTypes.number.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
  location: PropTypes.shape({
    search: PropTypes.string,
  }).isRequired,
  name: PropTypes.string.isRequired,
  setProjectFilter: PropTypes.func.isRequired,
  setStatus: PropTypes.func.isRequired,
  status: PropTypes.number.isRequired,
  upFrequency: PropTypes.func.isRequired,
};

export default withRouter(
  connect(
    null,
    { ...actionCreatorsProjects, ...actionCreatorsApp },
  )(Project),
);
