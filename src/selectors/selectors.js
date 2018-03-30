import { DateTime } from 'luxon';
import { isPast, isToday, isTomorrow, isWithinNextTwoWeeks } from '../helpers/dates'
import { getRandomElement } from '../helpers/common'

const PROJECT_REGEX = /\+(\w+(?:-\w+)*)$/

const isNurtureDoneToday = (focusItems) => {
  return focusItems.filter((item) => isToday(item.dates.done) && item.category.name === 'nurture').length ? true : false;
}

const pickNurtureItem = (eligibleItems) => {
  let nurtureItems = eligibleItems.filter((item) => item.category.name === 'nurture').map((item) => item.id);
  return getRandomElement(nurtureItems);
}

const pickOverdue = (eligibleItems) => {
  let overdueIds = eligibleItems.filter((item) => isPast(item.dates.due)).map((item) => item.id);
  return getRandomElement(overdueIds);
}

const pickDueTodayTomorrow = (eligibleItems) => {
  let dueTodayTomorrowIds = eligibleItems.filter((item) => isToday(item.dates.due) || isTomorrow(item.dates.due)).map((item) => item.id);
  return getRandomElement(dueTodayTomorrowIds);
}

const pickDueNextTwoWeeks = (eligibleItems) => {
  let dueNextTwoWeeksIds = eligibleItems.filter((item) => isWithinNextTwoWeeks(item.dates.due)).map((item) => item.id);
  return getRandomElement(dueNextTwoWeeksIds);
}

const getProjectsInfo = (focusItems) => {
  const projectsInfo = [];
  focusItems
    .forEach((item) => {
      let projectName = getProjectNameFromItem(item)
      if(projectName) {
        let projectInfo = projectsInfo.find((pInfo) => pInfo.name === projectName)
        if(projectInfo) {
          if(!projectInfo.hasWork) projectInfo.hasWork = isItemNotDone(item)
        } else {
          projectsInfo.push({name: projectName, hasWork: isItemNotDone(item)})
        }
      }
    })

  return projectsInfo
}

const getProjectNameFromItem = ({value}) => {
  let project = value.match(PROJECT_REGEX)
  return project !== null ? project[1] : null
}

const getNextActionableItems = (focusItems, projects) => {
  const nextFocusProject = projects.map((project, index) => {
    return {
      name: project.name,
      remaining: project.frequency - focusItems.filter((item) => isToday(item.dates.done) && isItemWithinProject(item, project)).length
    }
  }).reduce((maxRemainingInProject, project) => {
    if(project.remaining > maxRemainingInProject.remaining){
      return project
    } else {
      return maxRemainingInProject
    }
  }, {remaining: 0})

  if(nextFocusProject.remaining > 0) {
    return {
      projectName: nextFocusProject.name,
      items: focusItems.filter((item) => isItemActionable(item) && isItemWithinProject(item, nextFocusProject))
    }
  } else {
    return {
      projectName: null,
      items: focusItems.filter((item) => isItemActionable(item))
    }
  }
}

const isItemEligible = ({dates, category}) => {
  if (isItemActionable({dates}) && category.name !== 'inbox'){
    return true;
  } else {
    return false;
  }
}

const isItemActionable = ({dates}) => {
  if (
      dates.done === null &&
      (dates.start === null || DateTime.fromISO(dates.start) <= DateTime.local().startOf('day'))) {
    return true;
  } else {
    return false;
  }
}

const isItemNotDone = ({dates}) => {
  return dates.done === null
}

const isItemWithinProject = ({ value }, { name }) => {
  let projectRegex = new RegExp('\\+' + name + '$');
  return projectRegex.test(value)
}

export {
  isNurtureDoneToday,
  pickNurtureItem,
  pickOverdue,
  pickDueTodayTomorrow,
  pickDueNextTwoWeeks,
  isItemEligible,
  getNextActionableItems,
  getProjectsInfo,
  isItemWithinProject
}
