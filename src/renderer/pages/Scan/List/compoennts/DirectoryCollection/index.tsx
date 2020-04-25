import React from 'react';
import { Col, Empty, Row } from 'antd';
import style from './style.less';
import { Directory } from '@/pages/Scan/List/model';
import DirectoryCard from '@/pages/Scan/List/compoennts/DirectoryCard';
import { AutoSizer, List } from 'react-virtualized';

interface DirectoryCollectionPropsType {
  directoryList?: Directory[];
  onCardClick: (directory: Directory) => void;
  selectedDirectory?: string[];
  onSelectedDirectoryUpdate: (newSelectedDirectory: string[]) => void;
  existBookNames:string[],
  displayDirPath:string[]
}

export default function DirectoryCollection({
  directoryList = [],
  onCardClick,
  selectedDirectory,
  onSelectedDirectoryUpdate,
  existBookNames,
  displayDirPath
}: DirectoryCollectionPropsType) {
  const displayItem = directoryList.filter((dirItem) => displayDirPath.find(path => path === dirItem.path) !== undefined)
  console.log(displayItem)
  const empty = (
    <div className={style.emptyWrap}>
      <Empty />
    </div>
  );
  const renderCard =  (item:Directory) => {
    console.log(item)
    const isSelected = Boolean(selectedDirectory.find(selectItem => selectItem === item.path));
    const onCardSelect = (selectDirectory: Directory) => {
      if (isSelected) {
        onSelectedDirectoryUpdate(selectedDirectory.filter(path => path !== item.path));
      } else {
        onSelectedDirectoryUpdate([...selectedDirectory, item.path]);
      }
    };
    const isExist = item.title !== undefined && Boolean(existBookNames.find(name => name === item.title));

    return (
      <Col span={24} key={item.title}>
        <DirectoryCard
          directory={item}
          onClick={onCardClick}
          isSelected={isSelected}
          onCardSelect={onCardSelect}
          isExist={isExist}
        />
      </Col>
    );
  };
  function rowRenderer({
                         key, // Unique key within array of rows
                         index, // Index of row within collection
                         isScrolling, // The List is currently being scrolled
                         isVisible, // This row is visible within the List (eg it is not an overscanned row)
                         style, // Style object to be applied to row (to position it)
                       }) {
    if(index > displayItem.length - 1){
      return undefined;
    }
    return (
      <div key={key} style={style}>
        {renderCard(displayItem[index])}
      </div>
    );
  }
  return (
    <div className={style.main}>
      {directoryList.length === 0 ? empty :
        <AutoSizer>
          {({height, width}) => (
            <List
              style={{outline: 'none'}}
              rowCount={directoryList.length}
              rowHeight={150}
              rowRenderer={rowRenderer}
              height={height}
              width={width}
            />
          )}
        </AutoSizer>
      }
    </div>
  );
}
