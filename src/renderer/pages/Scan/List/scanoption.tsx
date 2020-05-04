import React from 'react';
import { connect } from 'umi';
import ScanOptionDrawer from '@/pages/Scan/List/compoennts/ScanOptionDrawer';
import { ScanModelStateType } from '@/pages/Scan/List/model';


interface DirectoryScanOptionDrawerPropsType {
  dispatch: any,
  scan: ScanModelStateType
}

function DirectoryScanOptionDrawer({ dispatch, scan }: DirectoryScanOptionDrawerPropsType) {

  const closeDrawer = () => {
    dispatch({
      type: 'scan/closeScanOptionDrawer',
    });
  };
  return (
    <ScanOptionDrawer onClose={closeDrawer} isOpen={scan.scanOption.isOpen}/>
  );
}

export default connect(({ scan }: any) => ({ scan }))(DirectoryScanOptionDrawer);
