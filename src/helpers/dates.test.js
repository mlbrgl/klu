import { DateTime } from 'luxon';
import { formatRelativeTimeFromNow } from './dates';

const now = DateTime.fromISO('1970-01-01');

it('Formats relative time: tomorrow', () => {
  const distantDate = now.plus({ days: 1 }).startOf('day');
  expect(formatRelativeTimeFromNow(now, distantDate)).toEqual('tomorrow');
});

it('Formats relative time: yesterday', () => {
  const distantDate = now.minus({ days: 1 }).startOf('day');
  expect(formatRelativeTimeFromNow(now, distantDate)).toEqual('yesterday');
});

it('Formats relative time: in 3 days', () => {
  const distantDate = now.plus({ days: 3 }).startOf('day');
  expect(formatRelativeTimeFromNow(now, distantDate)).toEqual('in 3 days');
});

it('Formats relative time: 3 days ago', () => {
  const distantDate = now.minus({ days: 3 }).startOf('day');
  expect(formatRelativeTimeFromNow(now, distantDate)).toEqual('3 days ago');
});

it('Formats relative time: in about 1 week', () => {
  const distantDate = now.plus({ days: 7 }).startOf('day');
  expect(formatRelativeTimeFromNow(now, distantDate)).toEqual('in about 1 week');
});

it('Formats relative time: about 1 week ago', () => {
  const distantDate = now.minus({ days: 7 }).startOf('day');
  expect(formatRelativeTimeFromNow(now, distantDate)).toEqual('about 1 week ago');
});

it('Formats relative time: in about 2 weeks', () => {
  const distantDate = now.plus({ days: 14 }).startOf('day');
  expect(formatRelativeTimeFromNow(now, distantDate)).toEqual('in about 2 weeks');
});

it('Formats relative time: about 2 weeks ago', () => {
  const distantDate = now.minus({ days: 14 }).startOf('day');
  expect(formatRelativeTimeFromNow(now, distantDate)).toEqual('about 2 weeks ago');
});

it('Formats relative time: in about 1 month', () => {
  const distantDate = now.plus({ days: 31 }).startOf('day');
  expect(formatRelativeTimeFromNow(now, distantDate)).toEqual('in about 1 month');
});

it('Formats relative time: about 1 month ago', () => {
  const distantDate = now.minus({ days: 31 }).startOf('day');
  expect(formatRelativeTimeFromNow(now, distantDate)).toEqual('about 1 month ago');
});

it('Formats relative time: in about 2 months', () => {
  const distantDate = now.plus({ days: 70 }).startOf('day');
  expect(formatRelativeTimeFromNow(now, distantDate)).toEqual('in about 2 months');
});

it('Formats relative time: about 2 months ago', () => {
  const distantDate = now.minus({ days: 70 }).startOf('day');
  expect(formatRelativeTimeFromNow(now, distantDate)).toEqual('about 2 months ago');
});
