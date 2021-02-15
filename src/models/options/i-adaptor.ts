import { TaskEither } from 'fp-ts/TaskEither'
import { OptionsError } from './errors'
import { VoV4Options } from './vos'

export interface TraitAdaptor {
  load: TaskEither<OptionsError, VoV4Options>
}
