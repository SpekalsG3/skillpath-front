import { setActiveLoanId, setParsedSkills } from 'store/reducers/fetched-skills'

export default function initialPageProps (store, pageProps) {
  if (pageProps?.loans) {
    store.dispatch(setParsedSkills({ loans: pageProps.loans }))
  }
  if (pageProps?.loan_id) {
    store.dispatch(setActiveLoanId({ loan_id: pageProps.loan_id }))
  }
}
