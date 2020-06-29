import BookQuickViewDrawer from '@/components/BookQuickViewDrawer';
import { connect } from '@@/plugin-dva/exports';
import { DialogsModelStateType } from '@/models/dialog';
import { ExploreLibraryModelStateType } from '@/pages/Library/Explore/model';
import React from 'react';

export const LIBRARY_BOOK_QUICK_VIEW_KEY = 'exploreLibrary/quickView';
const BookQuickView =
  ({
     dialogs,
     dispatch,
     exploreLibrary,
   }: {
    dialogs: DialogsModelStateType,
    dispatch: any,
    exploreLibrary: ExploreLibraryModelStateType
  }) => {
    const onClose = () => {
      dispatch({
        type: 'dialogs/setDialogActive',
        payload: {
          key: LIBRARY_BOOK_QUICK_VIEW_KEY,
          isActive: false,
        },
      });
    };
    const displayBook = exploreLibrary.books.find(item => item.path === exploreLibrary.quickViewBookPath);
    return (
      <div>
        <BookQuickViewDrawer
          onClose={onClose}
          visible={Boolean(dialogs.activeDialogs[LIBRARY_BOOK_QUICK_VIEW_KEY])}
          pages={[]}
          onInfoChange={() => {
          }}
          onSelectCoverAction={() => {
          }}
          onAddTag={() => []}
          extraTags={displayBook?.tags.filter(item => ['series', 'artist', 'theme', 'translator'].find(keyword => keyword === item.type) === undefined)}
          title={displayBook?.name}
          coverURL={displayBook?.cover}
          dirname={displayBook?.path}
          series={displayBook?.tags.find(item => item.type === 'series')?.name}
          artist={displayBook?.tags.find(item => item.type === 'artist')?.name}
          theme={displayBook?.tags.find(item => item.type === 'theme')?.name}
          translator={displayBook?.tags.find(item => item.type === 'translator')?.name}
        />
      </div>
    );
  };

export default connect(({ dialogs, exploreLibrary }: any) => ({ dialogs, exploreLibrary }))(BookQuickView);