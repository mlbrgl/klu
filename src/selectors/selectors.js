import { DateTime } from 'luxon';
import { getNewProject } from '../store/store'
import { isPast, isToday, isTomorrow, isWithinNextTwoWeeks } from '../helpers/dates'
import { getRandomElement } from '../helpers/common'
import { PROJECT_ACTIVE, PROJECT_PENDING, PROJECT_PAUSED, PROJECT_COMPLETED} from '../helpers/constants'

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

const getUpdatedProjects = (currentProjects, focusItems) => {
  const projectsInfo = getProjectsInfo(focusItems)
  const updatedProjects = projectsInfo
    .map((projectInfo) => {
      const project = currentProjects.find((p) => p.name === projectInfo.name) || getNewProject(projectInfo.name)
      if(projectInfo.hasWork) {
        project.status = PROJECT_ACTIVE
      } else {
        if(project.status !== PROJECT_PAUSED && project.status !== PROJECT_COMPLETED) {
          project.status = PROJECT_PENDING
        }
      }
      return project
    }).sort((p1, p2) => {
    return p2.frequency - p1.frequency
  })
  return updatedProjects;
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

const getNextContract = (focusItems, projects) => {
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
    return focusItems.filter((item) => isItemActionable(item) && isItemWithinProject(item, nextFocusProject))
  } else {
    return focusItems.filter((item) => isItemActionable(item))
  }
}

const areProjectsPending = (projects, focusItems) => {
  const updatedProjects = getUpdatedProjects(projects, focusItems)
  return updatedProjects.some((project) => project.status === PROJECT_PENDING)
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
  getUpdatedProjects,
  getProjectsInfo,
  getNextContract,
  isItemWithinProject,
  areProjectsPending
}
