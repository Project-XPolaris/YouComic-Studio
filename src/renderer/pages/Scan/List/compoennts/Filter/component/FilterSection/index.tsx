import React from 'react';
import { Divider, Tag, Typography, Radio } from 'antd';
import styles from './style.less';
import { FilterItem } from '@/pages/Scan/List/compoennts/Filter/item';
import { RadioChangeEvent } from 'antd/es/radio';

const { Text } = Typography;

interface FilterSectionPropsType {
  items: FilterItem[]
  title: string
  activeFilters: { [key: string]: string }
  onFilterChange:(filter : { [key: string]: string }) => void
}


export default function FilterSection({ items = [],title, activeFilters,onFilterChange }: FilterSectionPropsType) {

  return (
    <div>
      <div className={styles.title}>
        <Text>{title}</Text>
      </div>
      <div>
        {
          items.map(item => {
            let value = item.value;
            if (activeFilters[item.key]) {
              value = activeFilters[item.key];
            }

            const onChange = (e: RadioChangeEvent) => {
              onFilterChange({
                ...activeFilters,
                [item.key]:e.target.value
              })
            };
            return (
              <div className={styles.item} key={item.key}>
                <div className={styles.itemTitle}>
                  {item.name}
                </div>
                <div>
                  <Radio.Group value={value} size="small" style={{ marginTop: 8 }} onChange={onChange}>
                    {item.options.map(option => (
                      <Radio.Button value={option.key} key={option.key}>{option.name}</Radio.Button>
                    ))}
                  </Radio.Group>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
}
