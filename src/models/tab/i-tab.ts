import { Option } from 'fp-ts/Option'

export interface VoTab {
  faviconUrl: Option<string>
  id: Option<number>
  title: Option<string>
  url: Option<string>
}

export interface VoRestoreTab extends VoTab {
  blankPageUrl: Option<string>
}

export interface TraitTab {
  getId: () => VoTab['id']
  getRestoreDestination: () => Option<string>
  getUrl: () => VoTab['url']
}
