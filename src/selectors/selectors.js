import { isItemEligible, isPast, isToday, isTomorrow, isWithinNextTwoWeeks } from '../helpers/dates'
import { getRandomElement } from '../helpers/common'

const pickNextFocusItem = (focusItems, excludedItemId = null) => {
  let eligibleItems = focusItems.filter((item) => item.id !== excludedItemId && isItemEligible(item));
  if(eligibleItems.length) {
    return (
      (isNurtureDoneToday(focusItems) ? null : pickNurtureItem(eligibleItems)) ||
      pickOverdue(eligibleItems) ||
      pickDueTodayTorrow(eligibleItems) ||
      pickDueNextTwoWeeks(eligibleItems) ||
      getRandomElement(eligibleItems).id
    )
  } else {
    return null;
  }
}

const isNurtureDoneToday = (focusItems) => {
  return focusItems.filter((item) => isToday(item.dates.done) && item.category.name === 'nurture').length ? true : false;
}

const pickNurtureItem = (eligibleItems) => {
  let nurtureIds = eligibleItems.filter((item) => item.category.name === 'nurture').map((item) => item.id);
  return getRandomElement(nurtureIds);
}

const pickOverdue = (eligibleItems) => {
  let overdueIds = eligibleItems.filter((item) => isPast(item.dates.due)).map((item) => item.id);
  return getRandomElement(overdueIds);
}

const pickDueTodayTorrow = (eligibleItems) => {
  let dueTodayTomorrowIds = eligibleItems.filter((item) => isToday(item.dates.due) || isTomorrow(item.dates.due)).map((item) => item.id);
  return getRandomElement(dueTodayTomorrowIds);
}

const pickDueNextTwoWeeks = (eligibleItems) => {
  let dueNextTwoWeeksIds = eligibleItems.filter((item) => isWithinNextTwoWeeks(item.dates.due)).map((item) => item.id);
  return getRandomElement(dueNextTwoWeeksIds);
}

export { pickNextFocusItem }
