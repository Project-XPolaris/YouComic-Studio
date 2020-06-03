import React from 'react';
import { connect } from 'umi';
import { CreateBookModelStateType, Page } from '@/pages/Create/model';
import SidePagesContainer from '@/pages/Create/components/SidePagesContainer';


interface CreateBookPagesSidePropsType {
  create: CreateBookModelStateType
  dispatch: any
}

function CreateBookPagesSide({ create, dispatch }: CreateBookPagesSidePropsType) {
  const onPageClick = (page: Page) => {
    dispatch({
      type:"create/changeDisplayPage",
      payload:{
        page
      }
    })
    if (create.selectPages.length !== 0){
      onSelectItem(page)
    }
  };
  const appendPage = () => {
    dispatch({
      type: 'create/generateThumbnails',
      payload:{
        index: create.pages.length
      }
    });
  };
  const deletePage = (page: Page) => {
    dispatch({
      type: 'create/onRemovePages',
      payload: {
        pagesToRemove: [page],
      },
    });
  };
  const onSelectItem = (page:Page) => {
    const isSelected = Boolean(create.selectPages.find(selectedPage => selectedPage.path === page.path))
    if (isSelected){
      dispatch({
        type:'create/setSelectPage',
        payload:{
          pages:create.selectPages.filter(selectedPage => selectedPage.path !== page.path)
        }
      })
    }else{
      dispatch({
        type:'create/setSelectPage',
        payload:{
          pages:[...create.selectPages,page]
        }
      })
    }

  }
  const insertPageWithIndex = (index:number) => {
    dispatch({
      type:"create/generateThumbnails",
      payload:{
        index
      }
    })
  }
  return (
    <SidePagesContainer
      onPageClick={onPageClick}
      pages={create.pages}
      onAppendPage={appendPage}
      onDeletePage={deletePage}
      onInsertPage={insertPageWithIndex}
      onAddSelect={onSelectItem}
      selectPagePath={create.selectPages}
    />
  );
}

export default connect(({ create }: any) => ({ create }))(CreateBookPagesSide);
