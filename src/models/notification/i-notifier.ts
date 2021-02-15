import { ReaderTask } from 'fp-ts/lib/ReaderTask'
import { Option } from 'fp-ts/Option'

export interface VoNotifierRecord {
  tab: Option<{
    faviconUrl: string
    title: string
    url: string
  }>
  url: Option<string>
}

export interface TraitToNotifier {
  toNotifier: () => Option<TraitNotifier>
}

export interface TraitNotifier {
  show: ReaderTask<{ title: string }, void>
}
