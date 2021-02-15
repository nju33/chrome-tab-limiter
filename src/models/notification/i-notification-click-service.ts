import { ReaderTaskEither } from 'fp-ts/ReaderTaskEither'
import { NotificationClickPayload } from '../../observers'

export interface TraitNotificationClickService {
  handle: ReaderTaskEither<NotificationClickPayload, Error, any>
}
