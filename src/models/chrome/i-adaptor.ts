import { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
import { TaskEither } from 'fp-ts/TaskEither'
import type * as INotification from '../notification'
import type * as ITab from '../tab'
import type * as ITabGroup from '../tab-group'
import type { ChromeError } from './errors'

export interface VoUpdateTab {
  url: string
}

export interface TraitAdaptor {
  createTab: ReaderTaskEither<
    [ITab.TraitTab & INotification.TraitToNotifier, { pinned?: boolean }],
    ChromeError,
    ITab.TraitTab & INotification.TraitToNotifier
  >
  getI18nMessage: (messageName: string) => string
  getId: () => string
  getTabs: TaskEither<
    ChromeError,
    Array<ITab.TraitTab & INotification.TraitToNotifier>
  >
  getUrl: (path: string) => string
  groupTab: ReaderTaskEither<
    [ITab.TraitTab & INotification.TraitToNotifier, ITabGroup.TraitTabGroup],
    ChromeError,
    ITab.TraitTab & INotification.TraitToNotifier
  >
  pinTab: ReaderTaskEither<
    ITab.TraitTab & INotification.TraitToNotifier,
    ChromeError,
    ITab.TraitTab & INotification.TraitToNotifier
  >
  removeTab: ReaderTaskEither<
    ITab.TraitTab & INotification.TraitToNotifier,
    ChromeError,
    ITab.TraitTab & INotification.TraitToNotifier
  >
  updateTab: ReaderTaskEither<
    VoUpdateTab,
    ChromeError,
    ITab.TraitTab & INotification.TraitToNotifier
  >
}
