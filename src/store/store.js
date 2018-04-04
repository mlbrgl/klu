import { PROJECT_ACTIVE } from '../helpers/constants'

const getInitialState = () => {
  return {
    focusItems: [getNewFocusItem()],
    isFocusOn: false,
    focusItemId: null,
    inputFocusItemId: null,
    deleteItemId: null,
    projects: []
  }
}

const getNewFocusItem = (value = '') => {
  const currentDate = Date.now()
  return {
    id: currentDate,
    value: value,
    category: {name: 'inbox', icon: 'inbox'},
    dates: {start: null, done: null, due: null, modified: currentDate}
  }
}

const getNewProject = (name) => {
  return {name: name, frequency: 0, status: PROJECT_ACTIVE}
}

export {
  getInitialState,
  getNewFocusItem,
  getNewProject
}
