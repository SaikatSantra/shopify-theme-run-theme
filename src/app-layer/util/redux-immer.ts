import { IProduce } from 'immer/dist/internal';

export const combineReducers = (produce: IProduce, reducers = {}): any => {
  const keys = Object.keys(reducers);
  const initialState = keys.reduce((a, k) => {
    a[k] = reducers[k](undefined, {}); // eslint-disable-line no-undefined
    return a;
  }, {});

  return produce((draft, action) => {
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      draft[key] = reducers[key](draft[key], action);
    }
    return draft;
  }, initialState);
};
