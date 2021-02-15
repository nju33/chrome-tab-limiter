import { fromNullable } from 'fp-ts/lib/Option'
import { Observable } from 'rxjs'
import type * as ITab from '../models/tab'
import { notificationClick } from './actions'
import { Actions, FromChromeEvent } from './interfaces'

export const fromNotificationClickEvent: FromChromeEvent = (): Observable<Actions> => {
  return new Observable<Actions>((observer) => {
    self.addEventListener('notificationclick', (_event: unknown) => {
      const event = _event as NotificationEvent

      event.notification.close()

      const tab: ITab.VoTab = new Proxy(event.notification.data, {
        get(target, property) {
          return fromNullable(target[property])
        }
      })

      observer.next(
        notificationClick({
          action: event.action as 'reopen' | 'close' | '',
          tab
        })
      )
    })
  })
}
