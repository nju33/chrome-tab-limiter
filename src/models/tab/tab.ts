import { fromNullable, map, none, Option } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'
import { Record } from 'immutable'
import { sequenceSOption } from '../../utils'
import type * as INotification from '../notification'
import { Notifier } from '../notification/notifier'
import { TraitTab, VoTab } from './i-tab'

export class Tab
  extends Record<VoTab>({
    id: none,
    url: none,
    faviconUrl: none,
    title: none
  })
  implements TraitTab, INotification.TraitToNotifier {
  getId(): Option<number> {
    return this.id
  }

  getUrl(): Option<string> {
    return this.url
  }

  getRestoreDestination(): Option<string> {
    return this.url
  }

  toNotifier(): Option<INotification.TraitNotifier> {
    return pipe(
      sequenceSOption({
        id: this.id,
        url: this.url,
        faviconUrl: this.faviconUrl,
        restoreDestination: this.getRestoreDestination(),
        title: this.title
      }),
      map((tab) => {
        return new Notifier({
          url: fromNullable(tab.url),
          tab: fromNullable(tab)
        })
      })
    )
  }
}
