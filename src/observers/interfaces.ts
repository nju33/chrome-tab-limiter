import { Observable } from 'rxjs'
import type * as ITab from '../models/tab'

export type Act<
  Type extends string,
  Payload extends object | undefined = undefined
> = Payload extends object
  ? (payload: Payload) => { payload: Payload; type: Type }
  : () => { type: Type }

export type RuntimeInstalledAct = Act<'runtimeInstalled'>
export type RuntimeInstalledAction = ReturnType<RuntimeInstalledAct>

export type TabCreatedAct = Act<'tabCreated', { tab: chrome.tabs.Tab }>
export type TabCreatedAction = ReturnType<TabCreatedAct>

export interface NotificationClickPayload {
  action: 'reopen' | 'close' | ''
  tab: ITab.VoTab
}
export type NotificationClickAct = Act<
  'notificationClick',
  NotificationClickPayload
>
export type NotificationClickAction = ReturnType<NotificationClickAct>

export type TabActivatedAct = Act<'tabActivated', { tab: chrome.tabs.Tab }>
export type TabActivatedAction = ReturnType<TabActivatedAct>

export type Actions =
  | RuntimeInstalledAction
  | TabCreatedAction
  | NotificationClickAction
  | TabActivatedAction

export type FromChromeEvent = () => Observable<Actions>
