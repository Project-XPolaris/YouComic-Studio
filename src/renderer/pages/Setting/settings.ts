export const YOUCOMIC_SERVER_URL_KEY = 'youcomic.url';
export interface Option {
  key: string
  value: any
  read: () => any
  save: ({value}) => void
}
export const ApplicationSettingOptions: Option[] = [
  {
    key: YOUCOMIC_SERVER_URL_KEY,
    value: '',
    read: () => {
      return localStorage.getItem(YOUCOMIC_SERVER_URL_KEY);
    },
    save: ({value}) => {
      localStorage.setItem(YOUCOMIC_SERVER_URL_KEY, value);
    },
  },
];


