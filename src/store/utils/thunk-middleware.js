export default function ThunkMiddleware (store) {
  return (next) => (action) =>
    typeof action === 'function' ? action(store.dispatch, store.getState) : next(action)
}
