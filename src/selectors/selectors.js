import { DateTime } from 'luxon';
import { getNewProject } from '../store/store'
import { isPast, isToday, isTomorrow, isWithinNextTwoWeeks, isPeakTime, isTroughTime } from '../helpers/dates'
import { getRandomElement } from '../helpers/common'
import { PROJECT_ACTIVE, PROJECT_PENDING, PROJECT_PAUSED, PROJECT_COMPLETED} from '../helpers/constants'

const PROJECT_REGEX = /\+(\w+(?:-\w+)*)$/

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
      if(projectInfo.hasActionableItems) {
        project.status = PROJECT_ACTIVE
      } else {
        if(project.status !== PROJECT_PAUSED && project.status !== PROJECT_COMPLETED) {
          project.status = PROJECT_PENDING
        }
      }
      return project
    })
    .sort((p1, p2) => {
      if (p2.frequency - p1.frequency !== 0) {
        return p2.frequency - p1.frequency
      } else {
        return p2.name < p1.name ? 1 : -1
      }
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
          if(!projectInfo.hasActionableItems) projectInfo.hasActionableItems = isItemActionable(item)
        } else {
          projectsInfo.push({name: projectName, hasActionableItems: isItemActionable(item)})
        }
      }
    })

  return projectsInfo
}

const getProjectNameFromItem = ({value}) => {
  let project = value.match(PROJECT_REGEX)
  return project !== null ? project[1] : null
}

const getNextContractItems = (focusItems, projects) => {
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

const getChronoItems = (items) => {
  let currentChronoCategoryName = null
  if (isPeakTime()) {
    currentChronoCategoryName = 'peak'
  } else if (isTroughTime()) {
    currentChronoCategoryName = 'trough'
  } else {
    currentChronoCategoryName = 'recovery'
  }

  return items.filter((item) => item.category.name === currentChronoCategoryName)
}

const areProjectsPending = (projects, focusItems) => {
  const updatedProjects = getUpdatedProjects(projects, focusItems)
  return updatedProjects.some((project) => project.status === PROJECT_PENDING)
}

const isItemEligible = ({dates, category}) => {
  return isItemActionable({dates}) && category.name !== 'inbox'
}

const isItemDone = ({dates}) => {
  return !!dates.done
}

const isItemStartFuture = ({dates}) => {
  return dates.start !== null && DateTime.fromISO(dates.start) > DateTime.local().startOf('day')
}

const isItemActionable = ({dates}) => {
  return !isItemDone({dates}) && !isItemStartFuture({dates})
}

const isItemFuture = ({dates}) => {
  return !isItemDone({dates}) && isItemStartFuture({dates})
}

const isItemWithinProject = ({ value }, { name }) => {
  let projectRegex = new RegExp('\\+' + name + '$');
  return projectRegex.test(value)
}

export {
  pickOverdue,
  pickDueTodayTomorrow,
  pickDueNextTwoWeeks,
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
  areProjectsPending
}
