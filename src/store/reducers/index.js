import * as users from './users';
import * as parsedSkills from './parsed-skills';
import * as specializations from './specializations';

export const reducers = {
  [parsedSkills.storeKey]: parsedSkills.reducer,
  [specializations.storeKey]: specializations.reducer,
  [users.storeKey]: users.reducer,
};
