export interface VoV3Options {
  setting: {
    items: string[] | string
    notify: boolean
    tabNum: string
  }
}

export interface VoV4Options {
  v4: {
    options: {
      behaviorWhenANotificationClicks: 'reopen' | 'doNothing'
      restoreWithBlankPage: boolean
      tabGroupColor:
        | 'grey'
        | 'blue'
        | 'red'
        | 'yellow'
        | 'green'
        | 'pink'
        | 'purple'
        | 'cyan'
      tabGroupName: string
      upperLimitOfTheTab: number
      urlToCloseWithPriority: Array<{ value: string }>
      useGroupTab: boolean
      useNotification: boolean
    }
  }
}

export type VoOptions = VoV3Options | VoV4Options
