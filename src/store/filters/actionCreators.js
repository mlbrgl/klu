import { TOGGLE_DATE_FILTER } from '../actionTypes';

export const toggleDateFilter = type => ({ type: TOGGLE_DATE_FILTER, payload: { type } });

export default toggleDateFilter;
