import { DateTime } from 'luxon';
import { areProjectsPending, getNextEligibleItems } from '../../selectors/selectors';
import { updateProjects } from '../projects/actionCreators';
import { getRandomElement } from '../../helpers/common';

export const pickNextFocusItemId = (history, focusItems) => (dispatch, getState) => {
  const now = DateTime.local();
  dispatch(updateProjects(now, focusItems));

  const { projects } = getState();

  if (areProjectsPending(projects)) {
    history.push('/projects');
    return null;
  }
  history.push('/');
  const nextEligibleItems = getNextEligibleItems(now, focusItems, projects);
  return nextEligibleItems.length !== 0 ? getRandomElement(nextEligibleItems).id : null;
};

export default pickNextFocusItemId;
