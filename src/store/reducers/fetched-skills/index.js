import { handleActions } from 'redux-actions'
import api from 'config/api'

export const storeKey = '@redux/loans'

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

export const _fetchParsedSkills = async () => {
  try {
    const { data } = await api.get('/v1/parsed-skills')
    return data?.response || []
  } catch (ignore) {
    return []
  }
}

export const setParsedSkills = ({ parsedSkills }) => dispatch => {
  dispatch({
    type: SET_PARSED_SKILLS,
    parsedSkills,
  })
}

export const fetchParsedSkills = () => async dispatch => {
  try {
    const data = await _fetchParsedSkills()
    await dispatch(setParsedSkills({ parsedSkills: data }))
    return data
  } catch (ignore) {
    return null
  }
}
