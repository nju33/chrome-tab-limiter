import { Either, left, right } from 'fp-ts/Either'
import {
  alt,
  chain as optionChain,
  fold,
  fromNullable,
  map,
  none,
  Option
} from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'
import { chain, fromOption, TaskEither } from 'fp-ts/TaskEither'
import { injectable } from 'inversify'
import type * as IChrome from '../models/chrome'
import { ChromeError } from '../models/chrome'
import { VoUpdateTab } from '../models/chrome/i-adaptor'
import type * as INotification from '../models/notification'
import type * as ITab from '../models/tab'
import { Tab } from '../models/tab'
import type * as ITabGroup from '../models/tab-group'
import { TabGroup } from '../models/tab-group'
import { getTabGroupIdNone, sequenceSOption } from '../utils'

@injectable()
export class ChromeAdaptor implements IChrome.TraitAdaptor {
  getId(): string {
    return chrome.runtime.id
  }

  getUrl(path: string): string {
    return chrome.runtime.getURL(path)
  }

  getI18nMessage(messageName: string): string {
    // TODO: ? chrome.i18n.getMessage === undefined
    return chrome.i18n.getMessage(messageName)
  }

  async getTabs(): Promise<
    Either<ChromeError, Array<ITab.TraitTab & INotification.TraitToNotifier>>
  > {
    return await new Promise((resolve) => {
      chrome.tabs.query(
        // ({
        //   pinned: false,
        //   groupId: chrome.tabGroups.TAB_GROUP_ID_NONE
        // } as unknown) as { pinned: boolean },
        // The upper query isn't work strangely
        {},
        (tabs) => {
          if (typeof chrome.runtime.lastError?.message === 'string') {
            return resolve(
              left(new ChromeError(chrome.runtime.lastError.message))
            )
          }

          return resolve(
            right(
              tabs
                .filter((tab) => {
                  return (
                    ((tab as unknown) as { groupId: number }).groupId ===
                      getTabGroupIdNone() && !tab.pinned
                  )
                })
                .map((tab) => {
                  return new Tab({
                    id: fromNullable(tab.id),
                    title: fromNullable(tab.title),
                    url: fromNullable(tab.url),
                    faviconUrl: fromNullable(tab.favIconUrl)
                  })
                })
            )
          )
        }
      )
    })
  }

  removeTab(
    tab: ITab.TraitTab & INotification.TraitToNotifier
  ): TaskEither<ChromeError, ITab.TraitTab & INotification.TraitToNotifier> {
    return pipe(
      sequenceSOption({ id: tab.getId() }),
      fromOption(
        () =>
          new ChromeError(
            'Tab removing fails because of the id of the tab is none'
          )
      ),
      chain(({ id }) => {
        return async () => {
          return await new Promise((resolve) => {
            chrome.tabs.remove([id], () => {
              if (typeof chrome.runtime.lastError?.message === 'string') {
                resolve(left(new ChromeError(chrome.runtime.lastError.message)))
                return
              }

              resolve(right(tab))
            })
          })
        }
      })
    )
  }

  createTab([tab, options]: [
    tab: ITab.TraitTab & INotification.TraitToNotifier,
    options: { pinned?: boolean }
  ]): TaskEither<ChromeError, ITab.TraitTab & INotification.TraitToNotifier> {
    return pipe(
      sequenceSOption({ url: tab.getRestoreDestination() }),
      fromOption(
        () =>
          new ChromeError(
            'Tab creating fails because of the url of the tab is none'
          )
      ),
      chain(({ url }) => {
        return async () => {
          return await new Promise((resolve) => {
            chrome.tabs.create(
              {
                url,
                active: false,
                pinned: options.pinned ?? false
              },
              (newTab) => {
                if (typeof chrome.runtime.lastError?.message === 'string') {
                  resolve(
                    left(new ChromeError(chrome.runtime.lastError.message))
                  )
                  return
                }

                const record = {
                  id: fromNullable(newTab.id),
                  title: fromNullable(newTab.title),
                  url: fromNullable(newTab.url),
                  faviconUrl: fromNullable(newTab.favIconUrl)
                }
                resolve(right(new Tab(record)))
              }
            )
          })
        }
      })
    )
  }

  pinTab(
    tab: ITab.TraitTab & INotification.TraitToNotifier
  ): TaskEither<ChromeError, ITab.TraitTab & INotification.TraitToNotifier> {
    return pipe(
      sequenceSOption({ id: tab.getId() }),
      fromOption(
        () =>
          new ChromeError(
            'Tab updating fails because of the id of the tab is none'
          )
      ),
      chain(({ id }) => {
        return async () => {
          return await new Promise((resolve) => {
            chrome.tabs.update(
              id,
              {
                pinned: true
              },
              () => {
                if (typeof chrome.runtime.lastError?.message === 'string') {
                  resolve(
                    left(new ChromeError(chrome.runtime.lastError.message))
                  )
                  return
                }

                resolve(right(tab))
              }
            )
          })
        }
      })
    )
  }

  updateTab(
    tab: VoUpdateTab
  ): TaskEither<ChromeError, ITab.TraitTab & INotification.TraitToNotifier> {
    return async () => {
      return await new Promise((resolve) => {
        chrome.tabs.update(tab, (newTab) => {
          if (typeof chrome.runtime.lastError?.message === 'string') {
            resolve(left(new ChromeError(chrome.runtime.lastError.message)))
            return
          }

          const record = {
            id: fromNullable(newTab?.id),
            title: fromNullable(newTab?.title),
            url: fromNullable(newTab?.url),
            faviconUrl: fromNullable(newTab?.favIconUrl)
          }
          resolve(right(new Tab(record)))
        })
      })
    }
  }

  /**
   * @returns group id if it already exist
   */
  getGroupTab(): TaskEither<ChromeError, Option<ITabGroup.TraitTabGroup>> {
    return async () => {
      return await new Promise((resolve) => {
        chrome.tabGroups?.query(
          {
            title: '🪃'
          },
          ([maybeGroup]) => {
            if (typeof chrome.runtime.lastError?.message === 'string') {
              resolve(left(new ChromeError(chrome.runtime.lastError.message)))
              return
            }

            return resolve(
              right(
                pipe(
                  fromNullable(maybeGroup),
                  map((group) => {
                    return new TabGroup({
                      id: fromNullable(group.id),
                      title: fromNullable(group.title),
                      color: fromNullable(group.color)
                    })
                  }),
                  alt(() => none as Option<ITabGroup.TraitTabGroup>)
                )
              )
            )
          }
        )
      })
    }
  }

  groupTab([tab, tabGroup]: [
    ITab.TraitTab & INotification.TraitToNotifier,
    ITabGroup.TraitTabGroup
  ]): TaskEither<ChromeError, ITab.TraitTab & INotification.TraitToNotifier> {
    return pipe(
      sequenceSOption({ id: tab.getId() }),
      fromOption(
        () =>
          new ChromeError(
            'Tab grouping fails because of the id of the tab is none'
          )
      ),
      chain(({ id }) => {
        return pipe(
          this.getGroupTab(),
          chain((maybeTabGroup) => {
            return async () => {
              return await new Promise<Either<IChrome.ChromeError, number>>(
                (resolve) => {
                  chrome.tabs.group?.(
                    pipe(
                      maybeTabGroup,
                      optionChain((tabGroup) => tabGroup.getId()),
                      fold(
                        () => {
                          return {
                            tabIds: [id]
                          }
                        },
                        (groupId) => {
                          return {
                            tabIds: [id],
                            groupId
                          }
                        }
                      )
                    ),
                    (groupId) => {
                      if (
                        typeof chrome.runtime.lastError?.message === 'string'
                      ) {
                        resolve(
                          left(
                            new ChromeError(chrome.runtime.lastError.message)
                          )
                        )
                        return
                      }

                      resolve(right(groupId))
                    }
                  )
                }
              )
            }
          }),
          chain((groupId) => {
            return async () => {
              return await new Promise((resolve) => {
                chrome.tabGroups?.update(groupId, tabGroup.getValues(), () => {
                  if (typeof chrome.runtime.lastError?.message === 'string') {
                    resolve(
                      left(new ChromeError(chrome.runtime.lastError.message))
                    )
                    return
                  }

                  resolve(right(tab))
                })
              })
            }
          })
        )
      })
    )
  }
}
