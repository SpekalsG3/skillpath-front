import { handleActions } from 'redux-actions';
import api from 'config/api';

export const storeKey = '@redux/user';

const SET_USER = '@loans/SET_USER';

const initialState = {
  user: {},
  signature: '',
};

export const reducer = handleActions(
  {
    [SET_USER]: (state, { user, signature }) => ({ ...state, user, signature }),
  },
  initialState,
);

// Getters

export const getUser = (state) => state[storeKey].user;

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

// Setters

export const setUser = ({ user, signature }) => dispatch => {
  dispatch({
    type: SET_USER,
    user,
    signature,
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

    console.log(user, signature);
    return { result, message };
  } catch (error) {
    return {
      result: false,
      message: error.response?.data?.message || error.message,
    };
  }
};
