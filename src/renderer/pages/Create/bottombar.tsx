import React from 'react';
import { connect, Dispatch } from 'umi';
import styles from './bottombar.less';
import BottomBar from '@/pages/Create/components/BottomBar';
import { ZoomMode, ZoomToolPropsType } from '@/pages/Create/components/BottomBar/components/ZoomTool';
import { CreateBookModelStateType } from '@/pages/Create/model';
import { PageInfoPropsType } from '@/pages/Create/components/BottomBar/components/PageInfo';

interface CreateBookBottomBarPropsType {
  dispatch: Dispatch,
  create: CreateBookModelStateType
}

function CreateBookBottomBar({ dispatch, create }: CreateBookBottomBarPropsType) {
  const zoomProps: ZoomToolPropsType = {
    onZoomModeChange: (mode: ZoomMode) => {
      dispatch({
        type: 'create/setZoomRation',
        payload: {
          ratio: {
            [ZoomMode.Fit]: 0.6,
            [ZoomMode.Original]: 1,
            [ZoomMode.Small]: 0.4,
          }[mode],
        },
      });
    },
  };
  const getPageInfoPros = (): PageInfoPropsType => {
    const props: PageInfoPropsType = {};
    if (
      create.currentImageName === undefined ||
      create.currentImageName.length === 0 ||
      create.pages === undefined
    ) {
      return props;
    }
    const page = create.pages.find(page => page.name === create.currentImageName);
    if (page === undefined) {
      return props;
    }
    props.infoItems = [
      {
        name: 'Width',
        value: `${page.meta?.width} px`,
      },
      {
        name: 'Height',
        value: `${page.meta?.height} px`,
      },
    ];
    return props;
  };
  return (
    <BottomBar zoomTool={zoomProps} pageInfo={getPageInfoPros()}/>
  );
}

export default connect(({ create }: any) => ({ create }))(CreateBookBottomBar);
