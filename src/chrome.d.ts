declare namespace chrome.tabs {
  const group:
    | ((
        options: {
          tabIds: number | number[];
          groupId?: number;
          createProperties?: object;
        },
        callback: (groupId: number) => void
      ) => void)
    | undefined;
}

declare namespace chrome {
  const tabGroups: {
    TAB_GROUP_ID_NONE: number // = -1
    query: (
      queryInfo: {
        collapsed?: boolean;
        title?: string;
        color?: Color;
        windowId?: number;
      },
      callback: (groups: TabGroup[]) => void
    ) => void;
    update: (
      groupId: number,
      updateProperties: {
        collapsed?: boolean
        color?: Color,
        title?: string
      },
      callback: (group: TabGroup) => void
    ) => void 
  } | undefined

  type Color =
    | "grey"
    | "blue"
    | "red"
    | "yellow"
    | "green"
    | "pink"
    | "purple"
    | "cyan";

  interface TabGroup {
    collapsed: boolean
    color: Color
    id: number
    title?: string
    windowId: number
  }
}
