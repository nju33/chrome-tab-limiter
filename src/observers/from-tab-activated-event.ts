import { Observable } from 'rxjs'
import { tabActivated } from './actions'
import { Actions, FromChromeEvent } from './interfaces'

export const fromTabActivatedEvent: FromChromeEvent = (): Observable<Actions> => {
  return new Observable<Actions>((observer) => {
    chrome.tabs.onActivated.addListener(({ tabId }) => {
      chrome.tabs.get(tabId, (tab) => {
        observer.next(tabActivated({ tab }))
      })
    })
  })
}
