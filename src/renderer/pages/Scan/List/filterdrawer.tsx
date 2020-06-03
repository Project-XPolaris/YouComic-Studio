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
    name:"标题",
    key:"title",
    value:"notSet",
    options:[
      {
        name:"未设置",
        key:"notSet"
      },
      {
        name:"存在",
        key:"exist"
      },
      {
        name:"不存在",
        key:"notExist"
      }
    ],
  },

  {
    name:"作者",
    key:"artist",
    value:"notSet",
    options:[
      {
        name:"未设置",
        key:"notSet"
      },
      {
        name:"存在",
        key:"exist"
      },
      {
        name:"不存在",
        key:"notExist"
      }
    ],
  },
  {
    name:"系列",
    key:"series",
    value:"notSet",
    options:[
      {
        name:"未设置",
        key:"notSet"
      },
      {
        name:"存在",
        key:"exist"
      },
      {
        name:"不存在",
        key:"notExist"
      }
    ],
  },

  {
    name:"主题",
    key:"theme",
    value:"notSet",
    options:[
      {
        name:"未设置",
        key:"notSet"
      },
      {
        name:"存在",
        key:"exist"
      },
      {
        name:"不存在",
        key:"notExist"
      }
    ],
  },
]
export const YouComicFilter : FilterItem[] =[
  {
    name:"在库",
    key:"inLibrary",
    value:"notSet",
    options:[
      {
        name:"未设置",
        key:"notSet"
      },
      {
        name:"存在",
        key:"exist"
      },
      {
        name:"不存在",
        key:"notExist"
      }
    ],
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
  const onFilterUpdate = (filter:{ [key: string]: string }) => {
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
