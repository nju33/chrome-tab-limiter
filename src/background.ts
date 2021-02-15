import 'reflect-metadata'
import { pipe } from 'fp-ts/pipeable'
import { mapLeft } from 'fp-ts/TaskEither'
import { Subject } from 'rxjs'
import { DEFAULT_VALUES } from './constants'
import { container } from './container'
import type * as INotification from './models/notification'
import type * as ITab from './models/tab'
import {
  Actions,
  fromNotificationClickEvent,
  fromRuntimeInstalledEvent,
  fromTabActivatedEvent,
  fromTabCreatedEvent
} from './observers'
import { TYPES } from './types'
import {
  isBlankPage,
  isGroupTab,
  isPinnedTab,
  isV3Options,
  isV4Options
} from './utils'

self.addEventListener('install', (_event: unknown) => {})

async function init(): Promise<void> {
  const v3data = await new Promise((resolve, reject) => {
    chrome.storage.local.get(null, (data) => {
      if (typeof chrome.runtime.lastError?.message === 'string') {
        reject(new Error(chrome.runtime.lastError?.message))
        return
      }

      resolve(data)
    })
  })

  const v4data = await new Promise((resolve, reject) => {
    chrome.storage.sync.get(null, (v4data) => {
      if (typeof chrome.runtime.lastError?.message === 'string') {
        reject(new Error(chrome.runtime.lastError?.message))
        return
      }

      resolve(v4data)
    })
  })

  // Used from before
  if (isV3Options(v3data) && !isV4Options(v4data)) {
    await new Promise<void>((resolve, reject) => {
      chrome.storage.sync.set(
        {
          v4: {
            options: {
              ...DEFAULT_VALUES,
              upperLimitOfTheTab: v3data.setting.tabNum,
              useNotification: v3data.setting.notify,
              urlToCloseWithPriority:
                typeof v3data.setting.items === 'string'
                  ? []
                  : v3data.setting.items.map((item) => {
                      return { value: item }
                    })
            }
          }
        },
        () => {
          if (typeof chrome.runtime.lastError?.message === 'string') {
            reject(new Error(chrome.runtime.lastError?.message))
            return
          }

          resolve()
        }
      )
    })
  }

  // Install v4 for the first time
  if (!isV3Options(v3data) && !isV4Options(v4data)) {
    await new Promise<void>((resolve, reject) => {
      chrome.storage.sync.set(
        {
          v4: {
            options: {
              ...DEFAULT_VALUES
            }
          }
        },
        () => {
          if (typeof chrome.runtime.lastError?.message === 'string') {
            reject(new Error(chrome.runtime.lastError?.message))
            return
          }

          resolve()
        }
      )
    })
  }
}

function main(): void {
  const subject = new Subject<Actions>()
  subject.subscribe((action) => {
    switch (action.type) {
      case 'runtimeInstalled': {
        // eslint-disable-next-line no-void
        void init()
        break
      }
      case 'tabCreated': {
        if (
          !isBlankPage(action.payload.tab.url ?? '') &&
          !isGroupTab((action.payload.tab as unknown) as { groupId: number }) &&
          !isPinnedTab(action.payload.tab)
        ) {
          const createdTabService = container.get<ITab.TraitCreatedTabService>(
            TYPES.CreatedTabService
          )

          // eslint-disable-next-line no-void
          void pipe(
            createdTabService.handle(),
            mapLeft((error) => {
              console.error(error)
              return error
            })
          )()
        }
        break
      }
      case 'notificationClick': {
        const notificationClickService = container.get<INotification.TraitNotificationClickService>(
          TYPES.NotificationClickService
        )

        // eslint-disable-next-line no-void
        void pipe(
          notificationClickService.handle(action.payload),
          mapLeft((error) => {
            console.error(error)
            return error
          })
        )()
        break
      }
      case 'tabActivated': {
        if (isBlankPage(action.payload.tab.url ?? '')) {
          const tabActivatedService = container.get<ITab.TraitTabActivatedService>(
            TYPES.TabActivatedService
          )

          // eslint-disable-next-line no-void
          void pipe(
            tabActivatedService.handle(action.payload.tab),
            mapLeft((error) => {
              console.error(error)
              return error
            })
          )()
        }
      }
    }
  })

  fromRuntimeInstalledEvent().subscribe(subject)
  fromTabCreatedEvent().subscribe(subject)
  fromNotificationClickEvent().subscribe(subject)
  fromTabActivatedEvent().subscribe(subject)
}

main()
