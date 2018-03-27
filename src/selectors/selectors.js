import { DateTime } from 'luxon';
import { isPast, isToday, isTomorrow, isWithinNextTwoWeeks } from '../helpers/dates'
import { getRandomElementId } from '../helpers/common'


const isNurtureDoneToday = (focusItems) => {
  return focusItems.filter((item) => isToday(item.dates.done) && item.category.name === 'nurture').length ? true : false;
}

const pickNurtureItem = (eligibleItems) => {
  let nurtureItems = eligibleItems.filter((item) => item.category.name === 'nurture');
  return getRandomElementId(nurtureItems);
}

const pickOverdue = (eligibleItems) => {
  let overdueIds = eligibleItems.filter((item) => isPast(item.dates.due)).map((item) => item.id);
  return getRandomElementId(overdueIds);
}

const pickDueTodayTomorrow = (eligibleItems) => {
  let dueTodayTomorrowIds = eligibleItems.filter((item) => isToday(item.dates.due) || isTomorrow(item.dates.due)).map((item) => item.id);
  return getRandomElementId(dueTodayTomorrowIds);
}

const pickDueNextTwoWeeks = (eligibleItems) => {
  let dueNextTwoWeeksIds = eligibleItems.filter((item) => isWithinNextTwoWeeks(item.dates.due)).map((item) => item.id);
  return getRandomElementId(dueNextTwoWeeksIds);
}

const getNameProjectsWithRemainingWork = (focusItems) => {
  let projectRegex = /\+(\w+(?:-\w+)*)$/;
  let projects = focusItems
    .filter((item) => item.dates.done === null)
    .map((item, index) => {
      let project = item.value.match(projectRegex)
      return project !== null ? project[1] : null
    })
    .filter((item) => item !== null)

  return [...new Set(projects)]
}

const getNameNonEmptyProjects = (focusItems) => {
  let projectRegex = /\+(\w+(?:-\w+)*)$/;
  let projects = focusItems
    .map((item, index) => {
      let project = item.value.match(projectRegex)
      return project !== null ? project[1] : null
    })
    .filter((item) => item !== null)

  return [...new Set(projects)]
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

const isItemWithinProject = (item, project) => {
  let projectRegex = new RegExp('\\+' + project.name + '$');
  return projectRegex.test(item.value)
}

export {
  isNurtureDoneToday,
  pickNurtureItem,
  pickOverdue,
  pickDueTodayTomorrow,
  pickDueNextTwoWeeks,
  isItemEligible,
  getNextActionableItems,
  getNameProjectsWithRemainingWork,
  getNameNonEmptyProjects
}
