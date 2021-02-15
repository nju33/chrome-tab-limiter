import { VoV4Options } from './models/options'

export const DEFAULT_VALUES: VoV4Options['v4']['options'] = {
  behaviorWhenANotificationClicks: 'reopen',
  upperLimitOfTheTab: 15,
  useNotification: true,
  useGroupTab: true,
  tabGroupName: '🪃',
  urlToCloseWithPriority: [],
  tabGroupColor: 'yellow',
  restoreWithBlankPage: true
}
