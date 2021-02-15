import { Option } from 'fp-ts/Option'

export interface VoTabGroup {
  color: Option<chrome.tabGroups.Color>
  id: Option<number>
  title: Option<string>
}

export interface TraitTabGroup {
  getId: () => Option<number>
  getValues: () => { color: chrome.tabGroups.Color; title: string }
}
