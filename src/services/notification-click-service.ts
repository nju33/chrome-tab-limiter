import { fromNullable, some } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'
import { chain, of, TaskEither } from 'fp-ts/TaskEither'
import { inject, injectable } from 'inversify'
import type * as IChrome from '../models/chrome'
import type * as INotification from '../models/notification'
import type * as IOptions from '../models/options'
import type * as ITab from '../models/tab'
import { RestoreTab, Tab } from '../models/tab'
import { TabGroup } from '../models/tab-group'
import { NotificationClickPayload } from '../observers'
import { TYPES } from '../types'
import { existsTabGroups } from '../utils'

@injectable()
export class NotificationClickService
  implements INotification.TraitNotificationClickService {
  constructor(
    @inject(TYPES.ChromeAdaptor)
    private readonly chromeAdaptor: IChrome.TraitAdaptor,
    @inject(TYPES.OptionsAdaptor)
    private readonly optionsAdaptor: IOptions.TraitAdaptor
  ) {}

  handle({ action, tab }: NotificationClickPayload): TaskEither<Error, any> {
    if (action === 'close') {
      return of({})
    }

    return pipe(
      this.optionsAdaptor.load,
      chain((options) => {
        if (
          action === '' &&
          options.v4.options.behaviorWhenANotificationClicks === 'doNothing'
        ) {
          return of({})
        }

        let newTab: ITab.TraitTab & INotification.TraitToNotifier

        const vo = {
          id: tab.id,
          title: tab.title,
          url: tab.url,
          faviconUrl: tab.faviconUrl
        }
        if (options.v4.options.restoreWithBlankPage) {
          newTab = new RestoreTab({
            ...vo,
            blankPageUrl: some(this.chromeAdaptor.getUrl('blankpage.html'))
          })
        } else {
          newTab = new Tab(vo)
        }

        const tabGroup = new TabGroup({
          color: fromNullable(options.v4.options.tabGroupColor),
          title: fromNullable(options.v4.options.tabGroupName)
        })

        if (existsTabGroups() && options.v4.options.useGroupTab) {
          return pipe(
            this.chromeAdaptor.createTab([newTab, { pinned: false }]),
            chain((current) => {
              return this.chromeAdaptor.groupTab([current, tabGroup])
            })
          )
        }

        return pipe(this.chromeAdaptor.createTab([newTab, { pinned: true }]))
      })
    )
  }
}
