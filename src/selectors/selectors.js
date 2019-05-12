import { DateTime } from 'luxon';
import {
  isPast,
  isToday,
  isTomorrow,
  isWithinNextTwoWeeks,
  isPeakTime,
  isTroughTime,
} from '../helpers/dates';
import { PROJECT_PENDING } from '../helpers/constants';
import { nonEmptyArrayOrNull } from '../helpers/common';

const PROJECT_REGEX = /\+(\w+(?:-\w+)*)$/;

const isItemDone = ({ dates }) => !!dates.done;

const isItemStartFuture = (now, { dates }) => dates.start !== null && DateTime.fromISO(dates.start) > now.startOf('day');

const isItemActionable = (now, { dates }) => !isItemDone({ dates }) && !isItemStartFuture(now, { dates });

const isItemEligible = (now, { dates, category }) => isItemActionable(now, { dates }) && category.name !== 'inbox';

const isItemFuture = (now, { dates }) => !isItemDone({ dates }) && isItemStartFuture(now, { dates });

const isItemWithinProject = ({ value }, { name }) => {
  const projectRegex = new RegExp(`\\+${name}$`);
  return projectRegex.test(value);
};

const getItemsOverdue = (now, eligibleItems) => eligibleItems.filter(item => isPast(now, item.dates.due));

const getItemsDueTodayTomorrow = (now, eligibleItems) => eligibleItems.filter(item => isToday(now, item.dates.due) || isTomorrow(now, item.dates.due));

const getItemsDueNextTwoWeeks = (now, eligibleItems) => eligibleItems.filter(item => isWithinNextTwoWeeks(now, item.dates.due));

const getProjectNameFromItem = ({ value }) => {
  const project = value.match(PROJECT_REGEX);
  return project !== null ? project[1] : null;
};

const getProjectsInfo = (now, focusItems) => {
  const projectsInfo = [];
  focusItems.forEach((item) => {
    const projectName = getProjectNameFromItem(item);
    if (projectName) {
      const projectInfo = projectsInfo.find(pInfo => pInfo.name === projectName);
      if (projectInfo) {
        if (!projectInfo.hasActionableItems) {
          projectInfo.hasActionableItems = isItemActionable(now, item);
        }
      } else {
        projectsInfo.push({
          name: projectName,
          hasActionableItems: isItemActionable(now, item),
        });
      }
    }
  });

  return projectsInfo;
};

const getNextContractItems = (now, focusItems, projects) => {
  const nextFocusProject = projects
    .map(project => ({
      name: project.name,
      remaining:
        project.frequency
        - focusItems.filter(
          item => isToday(now, item.dates.done) && isItemWithinProject(item, project),
        ).length,
    }))
    .reduce(
      (maxRemainingInProject, project) => {
        if (project.remaining > maxRemainingInProject.remaining) {
          return project;
        }
        return maxRemainingInProject;
      },
      { remaining: 0 },
    );

  if (nextFocusProject.remaining > 0) {
    return focusItems.filter(item => isItemWithinProject(item, nextFocusProject));
  }
  return [];
};

const getChronoItems = (now, items) => {
  let currentChronoCategoryName = null;
  if (isPeakTime(now)) {
    currentChronoCategoryName = 'peak';
  } else if (isTroughTime(now)) {
    currentChronoCategoryName = 'trough';
  } else {
    currentChronoCategoryName = 'recovery';
  }

  return items.filter(item => item.category.name === currentChronoCategoryName);
};

const getActionableItems = (now, focusItems) => focusItems.filter(item => isItemActionable(now, item));

const getNextEligibleItems = (now, focusItems, projects) => {
  const actionableContractItems = getActionableItems(
    now,
    getNextContractItems(now, focusItems, projects),
  );
  const actionableChronoContractItems = getChronoItems(now, actionableContractItems);

  let items;
  if (actionableChronoContractItems.length !== 0) {
    items = actionableChronoContractItems;
  } else if (actionableContractItems.length !== 0) {
    items = actionableContractItems;
  } else {
    items = getActionableItems(now, focusItems);
  }

  const nextEligibleItems = nonEmptyArrayOrNull(getItemsOverdue(now, items))
    || nonEmptyArrayOrNull(getItemsDueTodayTomorrow(now, items))
    || nonEmptyArrayOrNull(getItemsDueNextTwoWeeks(now, items))
    || nonEmptyArrayOrNull(items);

  return nextEligibleItems !== null ? nextEligibleItems : [];
};

const areProjectsPending = projects => projects.some(project => project.status === PROJECT_PENDING);

export {
  getItemsOverdue,
  getItemsDueTodayTomorrow,
  getItemsDueNextTwoWeeks,
  isItemEligible,
  isItemDone,
  isItemActionable,
  isItemFuture,
  getProjectsInfo,
  getProjectNameFromItem,
  getNextContractItems,
  getChronoItems,
  isItemWithinProject,
  getNextEligibleItems,
  areProjectsPending,
};
