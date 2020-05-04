import React from 'react';
import { connect } from 'dva';
import FilterDrawer from '@/pages/Scan/List/compoennts/Filter';
import { ScanModelStateType } from '@/pages/Scan/List/model';
import { FilterItem } from '@/pages/Scan/List/compoennts/Filter/item';


interface DirFilterDrawerPropsType {
  dispatch: any,
  scan: ScanModelStateType
}
export const InfoFilter : FilterItem[] =[
  {
    name:"无标题",
    key:"noTitle",
  },
  {
    name:"有标题",
    key:"title",
  },
  {
    name:"无作者",
    key:"noArtist",
  },
  {
    name:"有作者",
    key:"artist",
  },
  {
    name:"无系列",
    key:"noSeries",
  },
  {
    name:"有系列",
    key:"series",
  },
  {
    name:"无主题",
    key:"noTheme",
  },
  {
    name:"有主题",
    key:"theme",
  },
]
export const YouComicFilter : FilterItem[] =[
  {
    name:"已存在",
    key:"exist",
  },
  {
    name:"不存在",
    key:"notexist",
  },
]
function DirFilterDrawer({ dispatch, scan: { filterDrawer: { isShow },filter } }: DirFilterDrawerPropsType) {
  const onClose = () => {
    dispatch({
      type:"scan/setFilterDrawerVisible",
      payload:{
        isShow:false
      }
    })
  }
  const onFilterUpdate = (filter:string[]) => {
    dispatch({
      type:"scan/setDirFilter",
      payload:{
        filter
      }
    })
  }
  return (
    <div>
      <FilterDrawer
        visible={isShow}
        onClose={onClose}
        activeFilters={filter}
        onFilterUpdate={onFilterUpdate}
      />
    </div>
  );
}

export default connect(({ scan }:any) => ({ scan }))(DirFilterDrawer);
