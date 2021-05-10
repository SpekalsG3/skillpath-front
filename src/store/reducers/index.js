import * as fetchedSkills from './parsed-skills';
import * as specializations from './specializations';

export const reducers = {
  [fetchedSkills.storeKey]: fetchedSkills.reducer,
  [specializations.storeKey]: specializations.reducer,
};
