import { TaskEither } from 'fp-ts/TaskEither'
import { OptionsError } from './errors'

export interface TraitService<T extends object> {
  get: () => TaskEither<OptionsError, T>
}
