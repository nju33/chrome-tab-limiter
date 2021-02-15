import { Either, left, right } from 'fp-ts/Either'
import { injectable } from 'inversify'
import type * as IOptions from '../models/options'
import { OptionsError } from '../models/options'

@injectable()
export class OptionsAdaptor implements IOptions.TraitAdaptor {
  async load(): Promise<Either<IOptions.OptionsError, IOptions.VoV4Options>> {
    return await new Promise((resolve) => {
      chrome.storage.sync.get(null, (items) => {
        if (typeof chrome.runtime.lastError?.message === 'string') {
          resolve(left(new OptionsError(chrome.runtime.lastError?.message)))
          return
        }

        resolve(right(items as IOptions.VoV4Options))
      })
    })
  }
}
