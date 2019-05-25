import { DateTime } from 'luxon';
import { setFocus } from './reducer';

it('Turns focus ON', () => {
  const app = {};
  const focusItemId = DateTime.local().toMillis();
  setFocus(true, focusItemId, app);

  expect(app.isFocusOn).toEqual(true);
});

it('Keeps focus ON', () => {
  const app = { isFocusOn: true };
  const focusItemId = DateTime.local().toMillis();
  setFocus(undefined, focusItemId, app);

  expect(app.isFocusOn).toEqual(true);
});

it('Turns focus OFF (isFocusOn === false)', () => {
  const app = {};
  const focusItemId = DateTime.local().toMillis();
  setFocus(false, focusItemId, app);

  expect(app.isFocusOn).toEqual(false);
});

it('Turns focus OFF (focusItemId === null)', () => {
  const app = { isFocusOn: true };
  setFocus(undefined, null, app);

  expect(app.isFocusOn).toEqual(false);
});

it('Turns focus OFF (isFocusOn === true, focusItemId === null)', () => {
  const app = { isFocusOn: true };
  setFocus(true, null, app);

  expect(app.isFocusOn).toEqual(false);
});
