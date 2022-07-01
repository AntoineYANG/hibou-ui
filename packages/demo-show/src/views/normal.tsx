/*
 * @Author: Kanata You 
 * @Date: 2022-06-30 17:27:55 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-06-30 17:32:16
 */

import styled from 'styled-components';


export const PageHeader = styled.nav({
  flexGrow: 0,
  flexShrink: 0,
  height: '60px',
  border: '1px solid #888',
  display: 'flex',
});

export const PageBody = styled.div({
  flexGrow: 1,
  flexShrink: 1,
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'stretch',
  justifyContent: 'stretch',
});

export const PageAside = styled.aside({
  flexGrow: 0,
  flexShrink: 0,
  width: '140px',
  border: '1px solid #888',
  display: 'flex',
});

export const PageContent = styled.main({
  flexGrow: 1,
  flexShrink: 1,
  border: '1px solid #888',
  display: 'flex',
});
