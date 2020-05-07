import React from 'react';
import { connect, Dispatch } from 'dva';
import CropDialog from '@/pages/Create/components/CropDialog';
import { CreateBookModelStateType } from '@/pages/Create/model';


interface CreateBookCoverCropPropsType {
  dispatch: Dispatch,
  create: CreateBookModelStateType
}

function CreateBookCoverCrop({ dispatch, create }: CreateBookCoverCropPropsType) {
  const onOk = (x, y, width, height, cropWidth, cropHeight) => {
    if (create.cropImageDialog.mode === "cover"){
      dispatch({
        type: 'create/cropCover',
        payload: {
          width, x, y, height, cropWidth, cropHeight,
        },
      });
    }else {
      dispatch({
        type: 'create/cropPage',
        payload: {
          width, x, y, height, cropWidth, cropHeight,
        },
      });
    }
  };
  const onClose = () => {
    dispatch({
      type:"create/closeImageCropDialog",
    })
  }
  return (
    <div>
      <CropDialog onOk={onOk} src={create?.cropImageDialog?.src} isOpen={create?.cropImageDialog?.isOpen} onCancel={onClose}/>
    </div>
  );
}

export default connect(({ create }: any) => ({ create }))(CreateBookCoverCrop);
