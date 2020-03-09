import React from 'react';
import TextInputSection from '@/pages/Setting/sections/TextInputSection';
import { connect } from 'dva';
import { SettingModelStateType } from '@/pages/Setting/model';
import { YOUCOMIC_SERVER_URL_KEY } from '@/pages/Setting/settings';


interface YouComicPanelPropsType {
  setting: SettingModelStateType
  dispatch: any
}

const YouComicPanel = ({ setting, dispatch }: YouComicPanelPropsType) => {
  const onYouComicUrlChange = (value) => {
    dispatch({
      type: 'setting/changeOption',
      payload: {
        key: YOUCOMIC_SERVER_URL_KEY,
        value,
      },
    });
  };
  return (
    <div>
      <TextInputSection
        title={'YouComic服务地址'}
        onValueChane={onYouComicUrlChange}
        value={setting.options.find(option => option.key === YOUCOMIC_SERVER_URL_KEY)?.value}
      />
    </div>
  );
};

export default connect(({ setting }) => ({ setting }))(YouComicPanel);
