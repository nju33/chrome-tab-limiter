import { getOrElse, none, Option } from 'fp-ts/Option'
import { Record } from 'immutable'
import { TraitTabGroup, VoTabGroup } from './i-tab-group'

export class TabGroup
  extends Record<VoTabGroup>({
    id: none,
    title: none,
    color: none
  })
  implements TraitTabGroup {
  getId(): Option<number> {
    return this.id
  }

  getValues(): { color: chrome.tabGroups.Color; title: string } {
    return {
      color: getOrElse<chrome.tabGroups.Color>(() => 'yellow')(this.color),
      title: getOrElse(() => '🪃')(this.title)
    }
  }
}
