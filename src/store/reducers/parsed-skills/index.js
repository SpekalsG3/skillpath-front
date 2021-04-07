import { handleActions } from 'redux-actions'
import api from 'config/api'

export const storeKey = '@redux/parsed-skills'

const SET_PARSED_SKILLS = '@loans/SET_PARSED_SKILLS'

const initialState = {
  parsedSkills: [],
}

export const reducer = handleActions(
  {
    [SET_PARSED_SKILLS]: (state, { parsedSkills }) => ({ ...state, parsedSkills }),
  },
  initialState,
)

export const getParsedSkills = (state) => state[storeKey].parsedSkills

export const _fetchParsedSkills = async (query) => {
  try {
    const { data } = await api.get(`v1/parsed-skills${query}`)
    return data?.response || []
  } catch (ignore) {
    return []
  }
}

export const setParsedSkills = ({ parsedSkills }) => dispatch => {
  dispatch({
    type: SET_PARSED_SKILLS,
    parsedSkills: parsedSkills,
  })
}

export const fetchParsedSkills = (query) => async dispatch => {
  try {
    const data = await _fetchParsedSkills(query)
    await dispatch(setParsedSkills({ parsedSkills: data }))
    return data.response
  } catch (ignore) {
    return null
  }
}
