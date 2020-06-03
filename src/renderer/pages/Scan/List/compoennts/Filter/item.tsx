import { DirFilter } from '@/pages/Scan/List/model';

export interface FilterItem {
  name: string,
  key: string,
  value: string,
  options: Array<{
    name: string
    key: string
  }>
}
