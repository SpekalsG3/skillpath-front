import { handleActions } from 'redux-actions';
import api from 'config/api';

export const storeKey = '@redux/parsed-skills';

const SET_PARSED_SKILLS = '@loans/SET_PARSED_SKILLS';
const SET_ASSOCIATIONS = '@loans/SET_ASSOCIATIONS';

const initialState = {
  parsedSkills: [],
  associationsForSkills: {},
};

export const reducer = handleActions(
  {
    [SET_PARSED_SKILLS]: (state, { parsedSkills }) => ({ ...state, parsedSkills }),
    [SET_ASSOCIATIONS]: (state, { associationsForSkills }) => ({ ...state, associationsForSkills }),
  },
  initialState,
);

// Getters

export const getParsedSkills = (state) => state[storeKey].parsedSkills;

export const getAssociationsForSkills = (state) => state[storeKey].associationsForSkills;

// Fetchers

export const _fetchParsedSkills = async (query) => {
  try {
    const { data } = await api.get(`/parsed-skills${query}`);
    return data?.response || [];
  } catch (ignore) {
    return [];
  }
};

export const _fetchAssociationsSkills = async () => {
  try {
    const { data } = await api.get('/associations/for-skills');
    return data?.response || {};
  } catch (ignore) {
    return {};
  }
};

// Setters

export const setParsedSkills = ({ parsedSkills }) => dispatch => {
  dispatch({
    type: SET_PARSED_SKILLS,
    parsedSkills,
  });
};

export const setAssociationsForSkills = ({ associationsForSkills }) => dispatch => {
  dispatch({
    type: SET_ASSOCIATIONS,
    associationsForSkills,
  });
};

// Selectors

export const fetchParsedSkills = (query) => async dispatch => {
  try {
    const data = await _fetchParsedSkills(query);
    await dispatch(setParsedSkills({ parsedSkills: data }));
    return data.response;
  } catch (ignore) {
    return null;
  }
};

export const fetchAssociationsSkills = () => async dispatch => {
  try {
    const data = await _fetchAssociationsSkills();
    await dispatch(setAssociationsForSkills({ associationsForSkills: data }));
    return data.response;
  } catch (ignore) {
    return null;
  }
};
