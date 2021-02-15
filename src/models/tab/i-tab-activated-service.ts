import { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
export interface TraitTabActivatedService {
  handle: ReaderTaskEither<chrome.tabs.Tab, Error, any>
}
