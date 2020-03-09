import React, { useEffect, useState } from 'react';
import { GridContextProvider, GridDropZone, GridItem, swap } from 'react-grid-dnd';

import PageItem from '@/pages/Create/components/PageItem';
import { Page } from '@/pages/Create/model';

interface PageCollectionPropsType {
  pages?: Page[]
  onPagesChange: (newPages: Page[]) => void
  onItemClick: (page: Page) => void
  onItemSelect: (page: Page) => void
  selectedPages: Page[]
}

function useWindowSize() {
  const isClient = typeof window === 'object';

  function getSize() {
    return {
      width: isClient ? window.innerWidth : undefined,
      height: isClient ? window.innerHeight : undefined,
    };
  }

  const [windowSize, setWindowSize] = useState(getSize);

  useEffect(() => {
    if (!isClient) {
      return;
    }

    function handleResize() {
      setWindowSize(getSize());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount and unmount

  return windowSize;
}

export default function PageCollection({ pages, onPagesChange, onItemClick, onItemSelect, selectedPages }: PageCollectionPropsType) {
  const size = useWindowSize();

  // target id will only be set if dragging from one dropzone to another.
  function onChange(sourceId, sourceIndex, targetIndex, targetId) {
    const newPages = swap(pages, sourceIndex, targetIndex);
    onPagesChange(newPages);
  }

  return (
    <GridContextProvider onChange={onChange}>
      <GridDropZone
        id="items"
        boxesPerRow={Math.ceil(size.width / 120)}
        rowHeight={240}
        style={{ height: '400px' }}
      >
        {pages.map((item, idx) => (
          <div key={item.name}>
            <GridItem>
              <PageItem
                page={item}
                order={idx + 1}
                onClick={onItemClick}
                onSelect={onItemSelect}
                isSelected={selectedPages.find(selectedPage => selectedPage.name === item.name) !== undefined}
              />
            </GridItem>
          </div>
        ))}

      </GridDropZone>
    </GridContextProvider>
  );
}
