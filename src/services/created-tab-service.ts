import { getOrElse } from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'
import { chain, fromOption, map, of, TaskEither } from 'fp-ts/TaskEither'
import { inject, injectable } from 'inversify'
import type * as IChrome from '../models/chrome'
import { ChromeError } from '../models/chrome'
import type * as IOptions from '../models/options'
import type * as ITab from '../models/tab'
import { TYPES } from '../types'
import { sequenceSTaskEither } from '../utils'

@injectable()
export class CreatedTabService implements ITab.TraitCreatedTabService {
  constructor(
    @inject(TYPES.ChromeAdaptor)
    private readonly chromeAdaptor: IChrome.TraitAdaptor,
    @inject(TYPES.OptionsAdaptor)
    private readonly optionsAdaptor: IOptions.TraitAdaptor
  ) {}

  handle(): TaskEither<Error, any> {
    // eslint-disable-next-line no-void
    return pipe(
      sequenceSTaskEither({
        tabs: this.chromeAdaptor.getTabs,
        options: this.optionsAdaptor.load
      }),
      chain(({ options, tabs }) => {
        const {
          upperLimitOfTheTab,
          urlToCloseWithPriority
        } = options.v4.options

        const priorityTab = tabs.find((tab) => {
          return urlToCloseWithPriority.some(({ value }) => {
            return getOrElse(() => 'IGNORE')(tab.getUrl()).startsWith(value)
          })
        })

        if (tabs.length > upperLimitOfTheTab) {
          return pipe(
            this.chromeAdaptor.removeTab(priorityTab ?? tabs[0]),
            chain((tab) => {
              return fromOption(() => new ChromeError('incoming invalid tab'))(
                tab.toNotifier()
              )
            }),
            chain((notifier) => {
              return pipe(
                this.optionsAdaptor.load,
                map(async (options) => {
                  if (options.v4.options.useNotification) {
                    return await notifier.show({
                      title: 'Close the tab'
                      // The below is not work strangly
                      // title: this.chromeAdaptor.getI18nMessage(
                      //   'notification__closedTheTab'
                      // )
                    })()
                  }
                })
              )
            })
          )
        }

        return of({})
      })
    )
  }
}
