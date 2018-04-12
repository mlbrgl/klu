import { PROJECT_ACTIVE } from '../helpers/constants'

const getInitialState = () => {
  return {
    focusItems: [getNewFocusItem()],
    isFocusOn: false,
    focusItemId: null,
    inputFocusItemId: null,
    deleteItemId: null,
    projects: [],
    filters: {done: false, actionable: true, future: false}
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

const buildIndex = (searchApi, focusItems) => {
  focusItems.forEach((item) => {
    searchApi.indexDocument(item.id, item.value)
  })
}

export {
  getInitialState,
  getNewFocusItem,
  getNewProject,
  buildIndex,
}
