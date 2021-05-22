import { handleActions } from 'redux-actions';
import api from 'config/api';

export const storeKey = '@redux/user';

const SET_USER = '@loans/SET_USER';
const SET_PREFERENCES = '@loans/SET_PREFERENCES';
const ADD_PREFERENCE = '@loans/ADD_PREFERENCE';
const DELETE_PREFERENCE = '@loans/DELETE_PREFERENCE';
const ADD_LOCAL_PREFERENCE = '@loans/ADD_LOCAL_PREFERENCE';
const DELETE_LOCAL_PREFERENCE = '@loans/DELETE_LOCAL_PREFERENCE';
const FLUSH_USER = '@loans/FLUSH_USER';

const initialState = {
  user: null,
  signature: '',
  preferences: {},
  localPreferences: {},
};

export const reducer = handleActions(
  {
    [SET_USER]: (state, { user, signature }) => ({ ...state, user, signature }),
    [SET_PREFERENCES]: (state, { preferences }) => ({ ...state, preferences }),
    [ADD_PREFERENCE]: (state, { skillId }) => ({
      ...state,
      preferences: {
        ...state.preferences,
        [skillId]: {
          id: skillId,
        },
      },
    }),
    [DELETE_PREFERENCE]: (state, { skillId }) => {
      const { [skillId]: _, ...newPreferences } = state.preferences;
      return {
        ...state,
        preferences: newPreferences,
      };
    },
    [ADD_LOCAL_PREFERENCE]: (state, { skillId }) => ({
      ...state,
      localPreferences: {
        ...state.localPreferences,
        [skillId]: {
          id: skillId,
        },
      },
    }),
    [DELETE_LOCAL_PREFERENCE]: (state, { skillId }) => {
      const { [skillId]: _, ...newLocalPreferences } = state.localPreferences;
      return {
        ...state,
        localPreferences: newLocalPreferences,
      };
    },
    [FLUSH_USER]: (state) => ({
      ...state,
      user: null,
      signature: '',
    }),
  },
  initialState,
);

// Getters

export const getUser = (state) => state[storeKey].user;

const getSignature = (state) => state[storeKey].signature;

export const getPreferences = (state) => state[storeKey].preferences;

export const getLocalPreferences = (state) => state[storeKey].localPreferences;

// Fetchers

export const _signUp = async ({ username, email, password }) => {
  const { data } = await api.post('/sign-up', {
    username,
    email,
    password,
  });
  return data;
};

export const _signIn = async ({ username, password }) => {
  const { data } = await api.post('/sign-in', {
    username,
    password,
  });
  return data;
};

export const _fetchPreferences = async ({ signature }) => {
  const { data } = await api.post('/preferences/get', {
    signature,
  });

  return data;
};

// Setters

export const setUser = ({ user, signature }) => dispatch => {
  dispatch({
    type: SET_USER,
    user,
    signature,
  });
};

export const setPreferences = ({ preferences }) => dispatch => {
  dispatch({
    type: SET_PREFERENCES,
    preferences,
  });
};

export const addLocalPreference = (skillId) => async (dispatch) => {
  await dispatch({
    type: ADD_LOCAL_PREFERENCE,
    skillId,
  });
};

export const deleteLocalPreference = (skillId) => async (dispatch) => {
  await dispatch({
    type: DELETE_LOCAL_PREFERENCE,
    skillId,
  });
};

export const flushUser = async (dispatch) => {
  await dispatch({
    type: FLUSH_USER,
  });
};

// Selectors

export const requestSignUp = async (userData) => {
  try {
    const { result, message } = await _signUp(userData);
    return { result, message };
  } catch (error) {
    return {
      result: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const requestSignIn = (userData) => async dispatch => {
  try {
    const { result, response, message } = await _signIn(userData);
    const { user, signature } = response;
    await dispatch(setUser({ user, signature }));

    return { result, message };
  } catch (error) {
    return {
      result: false,
      message: error.response?.data?.message || error.message,
    };
  }
};

export const fetchPreferences = async (dispatch, getState) => {
  const state = getState();
  const preferences = getPreferences(state);

  if (preferences) {
    return preferences;
  }

  try {
    const { response } = await _fetchPreferences({
      signature: getSignature(state),
    });

    await dispatch(setPreferences({
      preferences: response,
    }));

    return response;
  } catch (error) {
    return {};
  }
};

export const addToUserPreferences = (skillId) => async (dispatch, getState) => {
  try {
    const state = getState();

    const { data } = await api.post('/preferences', {
      id: skillId,
      action: 'add',
      signature: getSignature(state),
    });

    await dispatch({
      type: ADD_PREFERENCE,
      skillId,
    });

    return data.result;
  } catch (e) {
    return false;
  }
};

export const deleteUserPreference = (skillId) => async (dispatch, getState) => {
  try {
    const state = getState();

    const { data } = await api.post('/preferences', {
      id: skillId,
      action: 'delete',
      signature: getSignature(state),
    });

    await dispatch({
      type: DELETE_PREFERENCE,
      skillId,
    });

    return data.result;
  } catch (e) {
    return false;
  }
};
