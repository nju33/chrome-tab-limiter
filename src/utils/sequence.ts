import { sequenceS } from 'fp-ts/Apply'
import { option } from 'fp-ts/Option'
import { taskEither } from 'fp-ts/TaskEither'

export const sequenceSOption = sequenceS(option)
export const sequenceSTaskEither = sequenceS(taskEither)
