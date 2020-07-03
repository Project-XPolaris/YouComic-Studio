import BookQuickViewDrawer from '@/components/BookQuickViewDrawer';
import { connect } from '@@/plugin-dva/exports';
import { DialogsModelStateType } from '@/models/dialog';
import { ExploreLibraryModelStateType } from '@/pages/Library/Explore/model';
import React from 'react';
import CreateTagDialog from '@/components/CreateTagDialog';
import { message } from 'antd';

export const LIBRARY_BOOK_QUICK_VIEW_KEY = 'exploreLibrary/quickView';
export const LIBRARY_BOOK_QUICK_VIEW_CREATE_TAG_KEY = 'exploreLibrary/quickViewCreateTag';
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
    const onAddTagClick = () => {
      dispatch({
        type: 'dialogs/setDialogActive',
        payload: {
          key: LIBRARY_BOOK_QUICK_VIEW_CREATE_TAG_KEY,
          isActive: true,
        },
      });
    };
    const onAddTagDialogCancel = () => {
      dispatch({
        type: 'dialogs/setDialogActive',
        payload: {
          key: LIBRARY_BOOK_QUICK_VIEW_CREATE_TAG_KEY,
          isActive: false,
        },
      });
    };
    return (
      <div>
        <CreateTagDialog
          onCreate={(name, type) => {
            if (displayBook.tags.find(tag => tag.type === type && tag.name === name) !== undefined) {
              message.error('标签已存在');
              onAddTagDialogCancel();
              return;
            }
            dispatch({
              type: 'exploreLibrary/addTag',
              payload: {
                book: displayBook,
                name,
                type,
              },
            });
          }}
          isOpen={Boolean(dialogs.activeDialogs[LIBRARY_BOOK_QUICK_VIEW_CREATE_TAG_KEY])}
          onClose={onAddTagDialogCancel}
        />
        <BookQuickViewDrawer
          onClose={onClose}
          visible={Boolean(dialogs.activeDialogs[LIBRARY_BOOK_QUICK_VIEW_KEY])}
          pages={[]}
          onInfoChange={(key: string, newValue: string) => {
            if (key === 'title') {
              if (newValue !== displayBook.name) {
                dispatch({
                  type: 'exploreLibrary/updateTitle',
                  payload: {
                    book: displayBook,
                    title: newValue,
                  },
                });
                return;
              }
            }
            const targetTag = displayBook.tags.find(it => it.type === key);
            if (targetTag) {
              if (newValue === ""){
                dispatch({
                  type: 'exploreLibrary/deleteTag',
                  payload: {
                    tag: targetTag,
                  },
                });
                return
              }
              dispatch({
                type: 'exploreLibrary/updateTag',
                payload: {
                  tag: {
                    ...targetTag,
                    name: newValue,
                  },
                },
              });
            } else {
              dispatch({
                type: 'exploreLibrary/addTag',
                payload: {
                  book: displayBook,
                  name: newValue,
                  type: key,
                },
              });
            }
          }}
          onSelectCoverAction={() => {
            dispatch({
              type: 'exploreLibrary/setCover',
              payload: {
                book: displayBook,
              },
            });
          }}
          onAddTag={onAddTagClick}
          extraTags={displayBook?.tags.filter(item => ['series', 'artist', 'theme', 'translator'].find(keyword => keyword === item.type) === undefined)}
          title={displayBook?.name}
          coverURL={displayBook?.cover}
          dirname={displayBook?.path}
          series={displayBook?.tags.find(item => item.type === 'series')?.name}
          artist={displayBook?.tags.find(item => item.type === 'artist')?.name}
          theme={displayBook?.tags.find(item => item.type === 'theme')?.name}
          translator={displayBook?.tags.find(item => item.type === 'translator')?.name}
          onDeleteTag={((name, type) => {
            const targetTag = displayBook.tags.find(it => it.name === name && it.type === type);
            if (targetTag === undefined) {
              return;
            }
            dispatch({
              type: 'exploreLibrary/deleteTag',
              payload: {
                tag: targetTag,
              },
            });
          })}
        />
      </div>
    );
  };

export default connect(({ dialogs, exploreLibrary }: any) => ({ dialogs, exploreLibrary }))(BookQuickView);