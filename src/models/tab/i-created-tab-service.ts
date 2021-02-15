import { IO } from 'fp-ts/IO'
import { TaskEither } from 'fp-ts/TaskEither'

export interface TraitCreatedTabService {
  handle: IO<TaskEither<Error, any>>
}
