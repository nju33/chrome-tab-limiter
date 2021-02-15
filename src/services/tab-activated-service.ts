import { TaskEither, throwError } from 'fp-ts/TaskEither'
import { inject, injectable } from 'inversify'
import qs from 'query-string'
import type * as IChrome from '../models/chrome'
import type * as ITab from '../models/tab'
import { TYPES } from '../types'

@injectable()
export class TabActivatedService implements ITab.TraitTabActivatedService {
  constructor(
    @inject(TYPES.ChromeAdaptor)
    private readonly chromeAdaptor: IChrome.TraitAdaptor
  ) {}

  handle(tab: chrome.tabs.Tab): TaskEither<Error, any> {
    const url = tab.url ?? ''

    const query = (qs.parse(url.replace(/[^?]+\?/, '')) as unknown) as {
      id?: number
      title?: string
      url?: string
    }

    if (typeof query.url === 'string') {
      return this.chromeAdaptor.updateTab({
        url: decodeURIComponent(query.url)
      })
    }

    return throwError(new Error('invalid url of query'))
  }
}
