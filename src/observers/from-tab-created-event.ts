import { Observable } from 'rxjs'
import { tabCreated } from './actions'
import { FromChromeEvent, TabCreatedAction } from './interfaces'

export const fromTabCreatedEvent: FromChromeEvent = (): Observable<TabCreatedAction> => {
  return new Observable((observer) => {
    chrome.tabs.onCreated.addListener((tab) => {
      observer.next(tabCreated({ tab }))
    })
  })
}
