/*
 * @Author: Kanata You 
 * @Date: 2022-06-24 13:38:15 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-06-24 19:21:29
 */

import React from 'react';
import styled from 'styled-components';

import LongTouchable, { useLongTouchHandlers } from '@abilities/long-touchable';


const CardElement = styled.div({
  paddingBlock: '2em',
  paddingInline: '2em',
  border: '1px solid',
  borderRadius: '1em',
});

export interface CardProps {
  children?: any;
}

const Card: React.FC<CardProps & LongTouchable> = React.memo(function Card ({
  ...props
}) {
  const {
    handleMouseDown,
    handleTouchStart,
    handleMouseMove,
    handleTouchMove,
    style: longTouchStyle,
  } = useLongTouchHandlers(props);

  return (
    <CardElement
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
      style={{
        ...longTouchStyle,
      }}
    >
      
    </CardElement>
  );
});


export default Card;
