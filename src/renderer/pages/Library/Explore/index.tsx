import React from 'react';
import { connect } from '@@/plugin-dva/exports';
import ExploreLibraryHeader from '@/pages/Library/Explore/parts/Header';
import { ExploreLibraryModelStateType } from '@/pages/Library/Explore/model';
import style from './style.less';
import { Card, List, Pagination } from 'antd';
import BookCard from '@/pages/Library/Explore/components/BookCard';
import { ExportLibraryBook } from '@/pages/Library/Explore/module/config';

const LibraryExplorePage =
  ({
     exploreLibrary,
     dispatch,
   }: {
    exploreLibrary: ExploreLibraryModelStateType,
    dispatch: any
  }) => {
    const onPaginationChange = (page: number, pageSize: number) => {
      dispatch({
        type: 'exploreLibrary/setPagination',
        payload: {
          page, pageSize,
        },
      });
    };
    const onBookItemSelect = (item: ExportLibraryBook) => {
      dispatch({
        type: 'exploreLibrary/switchSelectBook',
        payload: {
          books: [item],
        },
      });
    };
    return (
      <div className={style.root}>
        <ExploreLibraryHeader/>
        <div className={style.main}>
          <List
            grid={{
              xs: 1,
              sm: 2,
              md: 3,
              lg: 3,
              xl: 6,
              xxl: 6,
            }}
            dataSource={exploreLibrary.books.slice((exploreLibrary.page - 1) * exploreLibrary.pageSize, exploreLibrary.page * exploreLibrary.pageSize)}
            renderItem={item => (
              <List.Item>
                <div className={style.item}>
                  <BookCard item={item} onSelect={() => onBookItemSelect(item)}/>
                </div>
              </List.Item>
            )}
          />
          <div className={style.pagination}>
            <Pagination
              current={exploreLibrary.page}
              total={exploreLibrary.books.length}
              pageSize={exploreLibrary.pageSize}
              onChange={onPaginationChange}
            />
          </div>

        </div>
      </div>
    );
  };

export default connect(({ exploreLibrary }: any) => ({ exploreLibrary }))(LibraryExplorePage);