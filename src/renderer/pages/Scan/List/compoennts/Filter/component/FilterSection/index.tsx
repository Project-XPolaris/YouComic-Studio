import React from 'react';
import { Tag, Typography } from 'antd';
import styles from './style.less';
import { FilterItem } from '@/pages/Scan/List/compoennts/Filter/item';

const { Text } = Typography;

interface FilterSectionPropsType {
  items: FilterItem[]
  onClick: (key: String) => void
  title: string
  activeFilters:string[]
}


export default function FilterSection({ items, onClick,title,activeFilters }: FilterSectionPropsType) {
  return (
    <div>
      <div className={styles.title}>
      <Text>{title}</Text>
      </div>
      <div>
        {items.map((item: FilterItem) => {
          const isActive =  activeFilters.find(active => active === item.key) === undefined
          return (
            <Tag key={item.key} onClick={() => onClick(item.key)} className={styles.tag} color={isActive?"blue":undefined}>
              {item.name}
            </Tag>
          )
        })}
      </div>
    </div>
  );
}
