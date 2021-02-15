import { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
import type { NotificationError } from './errors'
import type { VoOptions } from './vos'

export interface TraitAdaptor {
  /**
   * Subscribe to notification events that uses in the extension
   */
  update: ReaderTaskEither<VoOptions, NotificationError, void>
}
