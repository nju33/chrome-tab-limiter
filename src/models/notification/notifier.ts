import { map, none } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'
import { Record } from 'immutable'
import { sequenceSOption } from '../../utils'
import { TraitNotifier, VoNotifierRecord } from './i-notifier'

const StructNotifier = Record<VoNotifierRecord>({
  url: none,
  tab: none
})

export class Notifier extends StructNotifier implements TraitNotifier {
  show({ title }: { title: string }): () => Promise<void> {
    return async () => {
      pipe(
        sequenceSOption({
          url: this.url,
          tab: this.tab
        }),
        map(async ({ tab, url }) => {
          await registration.showNotification(title, {
            body: `It had ${url} open`,
            data: tab,
            icon: chrome.runtime.getURL('./icon/icon_48.png'),
            actions: [
              { action: 'reopen', title: 'Reopen' },
              { action: 'close', title: 'Close' }
            ]
          })
        })
      )
    }
  }
}
