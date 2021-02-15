import { Observable } from 'rxjs'
import { runtimeInstalled } from './actions'
import { Actions, FromChromeEvent } from './interfaces'

export const fromRuntimeInstalledEvent: FromChromeEvent = (): Observable<Actions> => {
  return new Observable<Actions>((observer) => {
    chrome.runtime.onInstalled.addListener(() => {
      observer.next(runtimeInstalled())
    })
  })
}
