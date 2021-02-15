export const TYPES = Object.freeze({
  CreatedTabService: Symbol.for('CreatedTabService'),
  TabActivatedService: Symbol.for('TabActivatedService'),
  NotificationClickService: Symbol.for('NotificationClickService'),
  ChromeAdaptor: Symbol.for('ChromeAdaptor'),
  OptionsAdaptor: Symbol.for('OptionsAdaptor')
} as const)
