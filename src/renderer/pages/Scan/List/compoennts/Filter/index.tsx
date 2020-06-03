import React from 'react';
import styles from './style.less';
import { Drawer, Tag, Typography } from 'antd';
import { DrawerProps } from 'antd/es/drawer';
import FilterSection from '@/pages/Scan/List/compoennts/Filter/component/FilterSection';
import { InfoFilter, YouComicFilter } from '@/pages/Scan/List/filterdrawer';

const { Text } = Typography;


interface FilterDrawerPropsType {
  activeFilters?: { [key: string]: string }
  onFilterUpdate:(filter:{ [key: string]: string }) => void
}


export default function FilterDrawer({ visible = false, activeFilters = {  },onFilterUpdate, ...drawerProps }: FilterDrawerPropsType & DrawerProps) {

  return (
    <Drawer className={styles.main} visible={visible} {...drawerProps} title={'过滤器'}>
      <FilterSection title={'信息'} items={InfoFilter}  activeFilters={activeFilters} onFilterChange={onFilterUpdate}/>
      <FilterSection title={'YouComic'} items={YouComicFilter}  activeFilters={activeFilters} onFilterChange={onFilterUpdate}/>
    </Drawer>
  );
}
