import { Container } from 'inversify'
import { ChromeAdaptor, OptionsAdaptor } from './adaptors'
import type * as IChrome from './models/chrome'
import type * as INotification from './models/notification'
import type * as IOptions from './models/options'
import type * as ITab from './models/tab'
import { CreatedTabService } from './services/created-tab-service'
import { NotificationClickService } from './services/notification-click-service'
import { TabActivatedService } from './services/tab-activated-service'
import { TYPES } from './types'

const container = new Container()
container
  .bind<ITab.TraitCreatedTabService>(TYPES.CreatedTabService)
  .to(CreatedTabService)
container
  .bind<ITab.TraitTabActivatedService>(TYPES.TabActivatedService)
  .to(TabActivatedService)
container
  .bind<INotification.TraitNotificationClickService>(
    TYPES.NotificationClickService
  )
  .to(NotificationClickService)
container.bind<IOptions.TraitAdaptor>(TYPES.OptionsAdaptor).to(OptionsAdaptor)
container.bind<IChrome.TraitAdaptor>(TYPES.ChromeAdaptor).to(ChromeAdaptor)

export { container }
