import { DateTime } from 'luxon';
import { getNewFocusItem } from '../store';
import {
  addFutureWaitingFocusItem,
  shiftDateFocusItem,
  editFocusItem,
  deleteFocusItem,
  markDoneFocusItem,
  removeDateFocusItem,
  nextCategoryFocusItem,
} from './reducer';
import { CATEGORIES } from '../../helpers/constants';

it('Adds a waiting future item', () => {
  const now = DateTime.local();
  const focusItems = [getNewFocusItem(now, 'value')];
  const newFocusItem = getNewFocusItem(now);
  addFutureWaitingFocusItem(now, newFocusItem, focusItems[0].id, focusItems);

  expect(focusItems[0].value).toEqual('@qw value');
  expect(focusItems[0].dates.start).toEqual(now.plus({ days: 3 }).toISODate());
  expect(focusItems[0].dates.due).toEqual(now.plus({ days: 3 }).toISODate());
});

it('Edits the focus item value', () => {
  const now = DateTime.local();
  const focusItems = [getNewFocusItem(now)];
  editFocusItem(now, 'new value', focusItems[0].id, focusItems);

  expect(focusItems[0].value).toEqual('new value');
});

it('Deletes the focus item', () => {
  const now = DateTime.local();
  const focusItems = [getNewFocusItem(now)];
  const itemId = focusItems[0].id;
  deleteFocusItem(itemId, focusItems);
  expect(focusItems.findIndex(item => item.id === itemId)).toEqual(-1);
});

it('Increments the start date by 1 day from given date', () => {
  const now = DateTime.local();
  const focusItems = [getNewFocusItem(now)];
  focusItems[0].dates.start = '1970-01-01';
  shiftDateFocusItem('start', 'plus', now, { days: 1 }, focusItems[0].id, focusItems);

  expect(focusItems[0].dates.start).toEqual('1970-01-02');
});

it('Marks focus item done', () => {
  const now = DateTime.local();
  const focusItems = [getNewFocusItem(now)];
  const itemId = focusItems[0].id;
  markDoneFocusItem(now, itemId, focusItems);

  expect(focusItems[0].dates.done).toEqual(now.toISODate());
});

it('Increments the due date by 1 day from given date', () => {
  const now = DateTime.local();
  const focusItems = [getNewFocusItem(now)];
  focusItems[0].dates.due = '1970-01-01';
  shiftDateFocusItem('due', 'plus', now, { days: 1 }, focusItems[0].id, focusItems);

  expect(focusItems[0].dates.due).toEqual('1970-01-02');
});

it('Increments the start date by 1 day from null date', () => {
  const now = DateTime.local();
  const focusItems = [getNewFocusItem(now)];
  const tomorrow = now.plus({ days: 1 });
  shiftDateFocusItem('start', 'plus', now, { days: 1 }, focusItems[0].id, focusItems);

  expect(focusItems[0].dates.start).toEqual(tomorrow.toISODate());
});

it('Increments the due date by 1 day from null date', () => {
  const now = DateTime.local();
  const focusItems = [getNewFocusItem(now)];
  const tomorrow = now.plus({ days: 1 });
  shiftDateFocusItem('due', 'plus', now, { days: 1 }, focusItems[0].id, focusItems);

  expect(focusItems[0].dates.due).toEqual(tomorrow.toISODate());
});

it('Decrements the start date by 1 day from given date', () => {
  const now = DateTime.local();
  const focusItems = [getNewFocusItem(now)];
  focusItems[0].dates.start = '1970-01-02';
  shiftDateFocusItem('start', 'minus', now, { days: 1 }, focusItems[0].id, focusItems);

  expect(focusItems[0].dates.start).toEqual('1970-01-01');
});

it('Decrements the due date by 1 day from given date', () => {
  const now = DateTime.local();
  const focusItems = [getNewFocusItem(now)];
  focusItems[0].dates.due = '1970-01-02';
  shiftDateFocusItem('due', 'minus', now, { days: 1 }, focusItems[0].id, focusItems);

  expect(focusItems[0].dates.due).toEqual('1970-01-01');
});

it('Decrements the start date by 1 day from null date', () => {
  const now = DateTime.local();
  const focusItems = [getNewFocusItem(now)];
  const yesterday = now.minus({ days: 1 });
  shiftDateFocusItem('start', 'minus', now, { days: 1 }, focusItems[0].id, focusItems);

  expect(focusItems[0].dates.start).toEqual(yesterday.toISODate());
});

it('Decrements the due date by 1 day from null date', () => {
  const now = DateTime.local();
  const focusItems = [getNewFocusItem(now)];
  const yesterday = now.minus({ days: 1 });
  shiftDateFocusItem('due', 'minus', now, { days: 1 }, focusItems[0].id, focusItems);

  expect(focusItems[0].dates.due).toEqual(yesterday.toISODate());
});

it('Removes the specified dates', () => {
  const now = DateTime.local();
  const focusItems = [getNewFocusItem(now)];
  focusItems[0].dates.start = now.toISODate();
  focusItems[0].dates.due = now.toISODate();
  removeDateFocusItem(now, 'start', focusItems[0].id, focusItems);
  removeDateFocusItem(now, 'due', focusItems[0].id, focusItems);

  expect(focusItems[0].dates.start).toEqual(null);
  expect(focusItems[0].dates.due).toEqual(null);
});

it('Cycles through the categories', () => {
  const now = DateTime.local();
  const focusItems = [getNewFocusItem(now)];
  nextCategoryFocusItem(now, focusItems[0].id, CATEGORIES, focusItems);
  nextCategoryFocusItem(now, focusItems[0].id, CATEGORIES, focusItems);
  expect(focusItems[0].category.name).toEqual(CATEGORIES[2].name);
});
