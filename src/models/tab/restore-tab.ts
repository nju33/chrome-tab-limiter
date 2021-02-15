import { fromNullable, map, none, Option } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'
import { Record } from 'immutable'
import qs from 'query-string'
import { map as ramdaMap } from 'ramda'
import { sequenceSOption } from '../../utils'
import type * as INotification from '../notification'
import { Notifier } from '../notification/notifier'
import { TraitTab, VoRestoreTab } from './i-tab'

export class RestoreTab
  extends Record<VoRestoreTab>({
    id: none,
    url: none,
    faviconUrl: none,
    blankPageUrl: none,
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
    return pipe(
      sequenceSOption({
        id: this.id,
        title: this.title,
        faviconUrl: this.faviconUrl,
        blankPageUrl: this.blankPageUrl,
        url: this.url
      }),
      map(({ blankPageUrl, ...tab }) => {
        return [
          blankPageUrl,
          '?',
          qs.stringify(ramdaMap((value) => encodeURIComponent(value), tab))
        ].join('')
      })
    )
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
