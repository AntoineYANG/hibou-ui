/*
 * @Author: Kanata You 
 * @Date: 2022-06-24 19:22:57 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-06-24 23:05:17
 */

import React from 'react';
import styled from 'styled-components';

import colors from '@colors';


const Icon = styled.svg({
  position: 'absolute',
  zIndex: 4,
  borderRadius: '25%',
  cursor: 'move',

  '&:hover': {
    boxShadow: `
      1px 1.2px 1.5px 0 ${colors.shadow}88,
      inset 1px 1.2px 2px 0 ${colors.shadow}36
    `,
  },
  '> g': {
    transformOrigin: 'center',
  },
  '& *': {
    stroke: 'none',
    fill: colors.iconColor,
    pointerEvents: 'none',
  },
  '& .shadow': {
    transform: 'scale(1.05) translate(0.8%, 1%)',
    fill: colors.shadow,
    opacity: 0.25,
  },
});

export interface DragIconProps {
  direction: 'column' | 'row';
  size: number;
  x: number;
  y: number;
  setDragging: (isDragging: false | [number, number]) => void;
}

const DragIcon: React.FC<DragIconProps> = React.memo(function DragIcon ({
  direction,
  size,
  x,
  y,
  setDragging,
}) {
  const draggingRef = React.useRef(false);

  const offsetRef = React.useRef<[number, number]>([0, 0]);

  /** 监听开始 */
  const handleStart = React.useCallback((ev: React.MouseEvent<Element, MouseEvent> | React.TouchEvent<Element>) => {
    draggingRef.current = true;
    
    if (ev.target instanceof SVGElement && ev.target.parentElement) {
      const pos: [number, number] = ev.type === 'mousedown' ? [
        (ev as React.MouseEvent).clientX,
        (ev as React.MouseEvent).clientY,
      ] : [
        (ev as React.TouchEvent).changedTouches[0]?.clientX ?? NaN,
        (ev as React.TouchEvent).changedTouches[0]?.clientY ?? NaN,
      ];
      
      const bcr = ev.target.parentElement.getBoundingClientRect();
      offsetRef.current = [pos[0] - bcr.x, pos[1] - bcr.y];
      
      setDragging([pos[0] - offsetRef.current[0], pos[1] - offsetRef.current[1]]);

      ev.stopPropagation();
    }
  }, [setDragging]);

  /** 监听移动 */
  const handleMove = React.useCallback((ev: MouseEvent | TouchEvent) => {
    if (draggingRef.current) {
      const pos: [number, number] = ev.type === 'mousemove' ? [
        (ev as MouseEvent).clientX,
        (ev as MouseEvent).clientY,
      ] : [
        (ev as TouchEvent).changedTouches[0]?.clientX ?? NaN,
        (ev as TouchEvent).changedTouches[0]?.clientY ?? NaN,
      ];
        
      setDragging([pos[0] - offsetRef.current[0], pos[1] - offsetRef.current[1]]);
    }
  }, [setDragging]);

  /** 监听抬起 */
  const handleTouchEnd = React.useCallback(() => {
    if (draggingRef.current) {
      // 拖拽中：结束拖拽
      draggingRef.current = false;
      offsetRef.current = [0, 0];
      setDragging(false);
    }
  }, [setDragging]);

  // 挂载移动&抬起监听到全局
  React.useEffect(() => {
    document.body.addEventListener('mousemove', handleMove);
    document.body.addEventListener('touchmove', handleMove);
    document.body.addEventListener('mouseup', handleTouchEnd);
    document.body.addEventListener('touchend', handleTouchEnd);
    document.body.addEventListener('touchcancel', handleTouchEnd);
    document.addEventListener('visibilitychange', handleTouchEnd);

    return () => {
      document.body.removeEventListener('mousemove', handleMove);
      document.body.removeEventListener('touchmove', handleMove);
      document.body.removeEventListener('mouseup', handleTouchEnd);
      document.body.removeEventListener('touchend', handleTouchEnd);
      document.body.removeEventListener('touchcancel', handleTouchEnd);
      document.removeEventListener('visibilitychange', handleTouchEnd);
    };
  }, [handleMove, handleTouchEnd]);
  
  return (
    <Icon
      viewBox="0 0 20 20"
      width={size}
      height={size}
      style={{
        left: x,
        top: y,
      }}
      onMouseDown={handleStart}
      onTouchStart={handleStart}
      role="button"
    >
      <g
        style={{
          transform: direction === 'column' ? 'rotate(90deg)' : undefined,
        }}
      >
        <circle
          className="shadow"
          cx="7"
          cy="5"
          r="1.5"
        />
        <circle
          className="shadow"
          cx="13"
          cy="5"
          r="1.5"
        />
        <circle
          className="shadow"
          cx="7"
          cy="10"
          r="1.5"
        />
        <circle
          className="shadow"
          cx="13"
          cy="10"
          r="1.5"
        />
        <circle
          className="shadow"
          cx="7"
          cy="15"
          r="1.5"
        />
        <circle
          className="shadow"
          cx="13"
          cy="15"
          r="1.5"
        />
        <circle
          cx="7"
          cy="5"
          r="1.5"
        />
        <circle
          cx="13"
          cy="5"
          r="1.5"
        />
        <circle
          cx="7"
          cy="10"
          r="1.5"
        />
        <circle
          cx="13"
          cy="10"
          r="1.5"
        />
        <circle
          cx="7"
          cy="15"
          r="1.5"
        />
        <circle
          cx="13"
          cy="15"
          r="1.5"
        />
      </g>
    </Icon>
  );
});


export default DragIcon;
