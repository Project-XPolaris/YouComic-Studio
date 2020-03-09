import React from 'react';
import { connect, Dispatch } from 'dva';
import ScanOptionDrawer from '@/pages/Scan/List/compoennts/ScanOptionDrawer';
import { ScanModelStateType } from '@/pages/Scan/List/model';




interface DirectoryScanOptionDrawerPropsType {
  dispatch: Dispatch,
  scan:ScanModelStateType
}

function DirectoryScanOptionDrawer({ dispatch,scan }: DirectoryScanOptionDrawerPropsType) {

  const closeDrawer = () => {
    dispatch({
      type:"scan/closeScanOptionDrawer"
    })
  }
  return (
    <ScanOptionDrawer onClose={closeDrawer} isOpen={scan.scanOption.isOpen}/>
  );
}

export default connect(({scan}) => ({scan}))(DirectoryScanOptionDrawer);
