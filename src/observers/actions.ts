import {
  NotificationClickAct,
  RuntimeInstalledAct,
  TabActivatedAct,
  TabCreatedAct
} from './interfaces'

export const runtimeInstalled: RuntimeInstalledAct = () => {
  return {
    type: 'runtimeInstalled'
  }
}

export const tabCreated: TabCreatedAct = (payload) => {
  return {
    type: 'tabCreated',
    payload
  }
}

export const notificationClick: NotificationClickAct = (payload) => {
  return {
    type: 'notificationClick',
    payload
  }
}

export const tabActivated: TabActivatedAct = (payload) => {
  return {
    type: 'tabActivated',
    payload
  }
}
