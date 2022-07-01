/*
 * @Author: Kanata You 
 * @Date: 2022-06-30 17:09:22 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-06-30 17:26:53
 */

import React from 'react';
import {
  Routes,
  Route,
} from 'react-router-dom';

import Button from './button';
import List from './list';


const Index: React.FC = React.memo(() => {
  return (
    <Routes>
      <Route path="/" element={ <></> } />
      <Route path="/button" element={ <Button /> } />
      <Route path="/list" element={ <List /> } />
    </Routes>
  );
});


export default Index;
