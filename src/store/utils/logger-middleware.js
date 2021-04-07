import Logger from '../../utils/logger'

const logger = new Logger('REDUX-ACTION')

export default function loggerMiddleware () {
  return function nextMiddleware (next) {
    return async function actionMiddleWare (action) {
      logger.log(action.type)
      return next(action)
    }
  }
}
