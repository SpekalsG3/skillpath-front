import Logger from 'libs/logger'

const logger = new Logger({ name: 'REDUX-ACTION' })

export default function loggerMiddleware () {
  return function nextMiddleware (next) {
    return async function actionMiddleWare (action) {
      logger.log(action.type)
      return next(action)
    }
  }
}
