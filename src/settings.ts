interface ISettings {
  defaultPageSize:number
  defaultLanguage:string
  defaultSystemName:string
  defaultSize:string
  defaultStorageState:boolean
}

const settings: ISettings = {
  defaultPageSize: 10,
  defaultLanguage: 'zhchs',
  defaultSystemName: 'systemName',
  defaultSize: 'medium',
  defaultStorageState: true
}

export default settings
