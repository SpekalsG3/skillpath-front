import { handleActions } from 'redux-actions'
import api from 'config/api'

export const storeKey = '@redux/specializations'

const SET_SPECIALIZATION_FOR_SKILLS = '@loans/SET_SPECIALIZATION_FOR_SKILLS'
const SET_SPECIALIZATIONS = '@loans/SET_SPECIALIZATIONS'

const initialState = {
  forSkill: {},
  specializations: [],
}

export const reducer = handleActions(
  {
    [SET_SPECIALIZATION_FOR_SKILLS]: (state, { forSkill }) => ({ ...state, forSkill }),
    [SET_SPECIALIZATIONS]: (state, { specializations }) => ({ ...state, specializations }),
  },
  initialState,
)

// Getters

export const getSpecializationsForSkills = (state) => state[storeKey].forSkill

export const getSpecializations = (state) => state[storeKey].specializations

// Fetchers

export const _fetchSpecializationsForSkills = async () => {
  try {
    const { data } = await api.get('v1/specializations/for-skills')
    return data?.response || {}
  } catch (ignore) {
    return {};
  }
}

export const _fetchSpecializations = async () => {
  try {
    const { data } = await api.get('v1/specializations')
    return data?.response || []
  } catch (ignore) {
    return [];
  }
}

// Setters

export const setSpecializationsForSkills = ({ forSkill }) => dispatch => {
  dispatch({
    type: SET_SPECIALIZATION_FOR_SKILLS,
    forSkill,
  })
}

export const setSpecializations = ({ specializations }) => dispatch => {
  dispatch({
    type: SET_SPECIALIZATIONS,
    specializations,
  })
}

// Selectors

export const fetchSpecializationsForSkills = () => async dispatch => {
  try {
    const data = await _fetchSpecializationsForSkills()
    await dispatch(setSpecializationsForSkills({ forSkill: data }))
    return data
  } catch (ignore) {
    return null
  }
}

export const fetchSpecializations = () => async dispatch => {
  try {
    const data = await _fetchSpecializations()
    await dispatch(setSpecializations({ specializations: data }))
    return data
  } catch (ignore) {
    return null
  }
}
