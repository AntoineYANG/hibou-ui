/*
 * @Author: Kanata You 
 * @Date: 2022-06-30 17:07:12 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-06-30 18:22:11
 */

import React from 'react';

import useTitle from '@utils/use-title';
import Button from '../../../../components/src/components/button';


const Index: React.FC = React.memo(() => {
  useTitle('按钮 Button - hibou-ui');

  return (
    <>
      <Button
        callback={() => {}}
      >
        按钮
      </Button>
    </>
  );
});


export default Index;
