import { DateTime } from 'luxon';
import { getNewProject } from '../store/store';
import {
  isPast,
  isToday,
  isTomorrow,
  isWithinNextTwoWeeks,
  isPeakTime,
  isTroughTime,
} from '../helpers/dates';
import {
  PROJECT_ACTIVE,
  PROJECT_PENDING,
  PROJECT_PAUSED,
  PROJECT_COMPLETED,
} from '../helpers/constants';
import { nonEmptyArrayOrNull } from '../helpers/common';

const PROJECT_REGEX = /\+(\w+(?:-\w+)*)$/;

const isItemDone = ({ dates }) => !!dates.done;

const isItemStartFuture = ({ dates }) => dates.start !== null && DateTime.fromISO(dates.start) > DateTime.local().startOf('day');

const isItemActionable = ({ dates }) => !isItemDone({ dates }) && !isItemStartFuture({ dates });

const isItemEligible = ({ dates, category }) => isItemActionable({ dates }) && category.name !== 'inbox';

const isItemFuture = ({ dates }) => !isItemDone({ dates }) && isItemStartFuture({ dates });

const isItemWithinProject = ({ value }, { name }) => {
  const projectRegex = new RegExp(`\\+${name}$`);
  return projectRegex.test(value);
};

const getItemsOverdue = eligibleItems => eligibleItems.filter(item => isPast(item.dates.due));

const getItemsDueTodayTomorrow = eligibleItems => eligibleItems.filter(item => isToday(item.dates.due) || isTomorrow(item.dates.due));

const getItemsDueNextTwoWeeks = eligibleItems => eligibleItems.filter(item => isWithinNextTwoWeeks(item.dates.due));

const getProjectNameFromItem = ({ value }) => {
  const project = value.match(PROJECT_REGEX);
  return project !== null ? project[1] : null;
};

const getProjectsInfo = (focusItems) => {
  const projectsInfo = [];
  focusItems.forEach((item) => {
    const projectName = getProjectNameFromItem(item);
    if (projectName) {
      const projectInfo = projectsInfo.find(pInfo => pInfo.name === projectName);
      if (projectInfo) {
        if (!projectInfo.hasActionableItems) {
          projectInfo.hasActionableItems = isItemActionable(item);
        }
      } else {
        projectsInfo.push({ name: projectName, hasActionableItems: isItemActionable(item) });
      }
    }
  });

  return projectsInfo;
};

const getUpdatedProjects = (currentProjects, focusItems) => {
  const projectsInfo = getProjectsInfo(focusItems);
  const updatedProjects = projectsInfo
    .map((projectInfo) => {
      // eslint-disable-next-line max-len
      const project = currentProjects.find(p => p.name === projectInfo.name) || getNewProject(projectInfo.name);
      if (projectInfo.hasActionableItems) {
        project.status = PROJECT_ACTIVE;
      } else if (project.status !== PROJECT_PAUSED && project.status !== PROJECT_COMPLETED) {
        project.status = PROJECT_PENDING;
      }
      return project;
    })
    .sort((p1, p2) => {
      if (p2.frequency - p1.frequency !== 0) {
        return p2.frequency - p1.frequency;
      }
      return p2.name < p1.name ? 1 : -1;
    });
  return updatedProjects;
};

const getNextContractItems = (focusItems, projects) => {
  const nextFocusProject = projects
    .map(project => ({
      name: project.name,
      remaining:
        project.frequency
        - focusItems.filter(item => isToday(item.dates.done) && isItemWithinProject(item, project))
          .length,
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
    return focusItems.filter(
      item => isItemActionable(item) && isItemWithinProject(item, nextFocusProject),
    );
  }
  return [];
};

const getChronoItems = (items) => {
  let currentChronoCategoryName = null;
  if (isPeakTime()) {
    currentChronoCategoryName = 'peak';
  } else if (isTroughTime()) {
    currentChronoCategoryName = 'trough';
  } else {
    currentChronoCategoryName = 'recovery';
  }

  return items.filter(
    item => item.category.name === currentChronoCategoryName && isItemActionable(item),
  );
};

const getNextEligibleItems = (focusItems, projects) => {
  const contractItems = getNextContractItems(focusItems, projects);
  const chronoItems = getChronoItems(contractItems);
  const items = chronoItems.length !== 0 ? chronoItems : contractItems;

  const nextEligibleItems = nonEmptyArrayOrNull(getItemsOverdue(items))
    || nonEmptyArrayOrNull(getItemsDueTodayTomorrow(items))
    || nonEmptyArrayOrNull(getItemsDueNextTwoWeeks(items))
    || nonEmptyArrayOrNull(items);

  return nextEligibleItems !== null ? nextEligibleItems : [];
};

const areProjectsPending = (projects, focusItems) => {
  const updatedProjects = getUpdatedProjects(projects, focusItems);
  return updatedProjects.some(project => project.status === PROJECT_PENDING);
};

export {
  getItemsOverdue,
  getItemsDueTodayTomorrow,
  getItemsDueNextTwoWeeks,
  isItemEligible,
  isItemDone,
  isItemActionable,
  isItemFuture,
  getUpdatedProjects,
  getProjectsInfo,
  getProjectNameFromItem,
  getNextContractItems,
  getChronoItems,
  isItemWithinProject,
  getNextEligibleItems,
  areProjectsPending,
};
