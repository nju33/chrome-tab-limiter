import { allPass, has, hasPath, where } from 'ramda'
import { VoV3Options, VoV4Options } from '../models/options'

const _isV3Options = where({
  setting: allPass([has('items'), has('notify'), has('tabNum')])
})

const _isV4Options = where({
  v4: allPass([
    has('options'),
    hasPath(['options', 'behaviorWhenANotificationClicks']),
    hasPath(['options', 'restoreWithBlankPage']),
    hasPath(['options', 'tabGroupColor']),
    hasPath(['options', 'tabGroupName']),
    hasPath(['options', 'upperLimitOfTheTab']),
    hasPath(['options', 'urlToCloseWithPriority']),
    hasPath(['options', 'useGroupTab']),
    hasPath(['options', 'useNotification'])
  ])
})

export function isV3Options(obj: any): obj is VoV3Options {
  return _isV3Options(obj)
}

export function isV4Options(obj: any): obj is VoV4Options {
  return _isV4Options(obj)
}
