/*
 * @Author: Kanata You 
 * @Date: 2022-06-24 19:16:15 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-06-25 03:05:25
 */

import React from 'react';
import styled from 'styled-components';

import LongTouchable, { useLongTouchHandlers } from '@abilities/long-touchable';
import DragIcon from './drag-icon';
import colors from '@colors';

import './index.css';
import { ListItemContainer, ListItemProps } from '.';


const ListItemElement = styled.div<{ isDragging: boolean }>(({ isDragging }) => ({
  position: isDragging ? 'fixed' : 'relative',
  paddingBlock: '2em',
  paddingInline: '2em',
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.background,
  boxShadow: isDragging
    ? `1px 2px 3px 2px ${colors.shadow}aa`
    : `0 0.5px 1.5px 0 ${colors.shadow}`,
  opacity: isDragging ? 0.75 : 1,
  userSelect: isDragging ? 'none' : undefined,
  pointerEvents: isDragging ? 'none' : undefined,
  transformOrigin: '100% 100%',
  zIndex: isDragging ? 3 : 1,
  transition: 'box-shadow 200ms, opacity 200ms, transform 200ms',
}));

const ListItemElementShadow = styled.div({
  position: 'relative',
  backgroundColor: colors.shadow,
  boxShadow: 'inset 1px 2px 4px 3px #0000008a',
  opacity: 0.4,
});

const ListItemElementDropArea = styled.div<{ direction: 'column' | 'row' }>(({ direction }) => ({
  position: 'relative',
  backgroundColor: `${colors.shadow}0a`,
  boxShadow: 'inset 1px 2px 4px 3px #888888aa',
  overflow: 'visible',
  animation: `stretch-${direction === 'column' ? 'ns' : 'ew'} 1500ms`,
}));

const ListItemElementDroppableBox = styled.div({
  position: 'absolute',
  left: 0,
  top: 0,
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'stretch',
  justifyContent: 'stretch',
  zIndex: 4,
});

const ListItemElementDroppable = styled.div({
  flexGrow: 1,
  flexShrink: 1,
  opacity: 0.001,
});

const _ListItem: React.FC<ListItemProps & LongTouchable> = React.memo(function ListItem ({
  direction,
  droppable,
  onDragStart,
  onDrag,
  onDragEnd,
  onDragCancel,
  onCanDropBefore,
  onCanDropAfter,
  onCanDropReplace,
  onCanDropOut,
  dragging,
  active,
  dropReady,
  canReplace,
  children,
  // ...props
}) {
  const ref = React.useRef<HTMLDivElement>();

  const bcrRef = React.useRef<[number, number, number, number]>([0, 0, 0, 0]);

  if (ref.current && !canReplace) {
    const bcr = ref.current.getBoundingClientRect();
    bcrRef.current = [
      bcr.x,
      bcr.y,
      bcr.width,
      bcr.height
    ];
  }

  // 监听拖拽元素在外部释放
  React.useEffect(() => {
    if (dragging) {
      const cb = () => onDragCancel();

      document.body.addEventListener('mouseup', cb);
      document.body.addEventListener('touchend', cb);
      document.body.addEventListener('touchcancel', cb);
      document.addEventListener('visibilitychange', cb);
  
      return () => {
        document.body.removeEventListener('mouseup', cb);
        document.body.removeEventListener('touchend', cb);
        document.body.removeEventListener('touchcancel', cb);
        document.removeEventListener('visibilitychange', cb);
      };
    }

    return () => {};
  }, [dragging, onDragCancel]);

  // const {
  //   handleMouseDown,
  //   handleTouchStart,
  //   handleMouseMove,
  //   handleTouchMove,
  // } = useLongTouchHandlers(props);
  
  return (
    <ListItemContainer>
      {
        dragging && (
          <ListItemElementShadow
            onMouseOver={onCanDropOut}
            onTouchMove={onCanDropOut}
            style={{
              width: bcrRef.current[2],
              height: bcrRef.current[3],
            }}
          />
        )
      }
      {
        canReplace && (
          <ListItemContainer
            style={{
              paddingBlock: 0,
              paddingInline: 0,
            }}
          >
            <ListItemElementDropArea
              direction={direction}
              style={{
                position: 'absolute',
                width: active[2],
                height: active[3],
                animation: 'none',
              }}
            />
          </ListItemContainer>
        )
      }
      <ListItemElement
        ref={e => {
          if (e) {
            ref.current = e;
            const bcr = ref.current.getBoundingClientRect();
            bcrRef.current = [
              bcr.x,
              bcr.y,
              bcr.width,
              bcr.height
            ];
          }
        }}
        // onMouseDown={handleMouseDown}
        // onTouchStart={handleTouchStart}
        // onMouseMove={handleMouseMove}
        // onTouchMove={handleTouchMove}
        isDragging={dragging}
        style={{
          left: dragging ? active[0] : undefined,
          top: dragging ? active[1] : undefined,
          transform: canReplace ? 'rotate(110deg)' : undefined,
          pointerEvents: dropReady ? 'none' : undefined,
          userSelect: dropReady ? 'none' : undefined,
          opacity: canReplace ? 0.75 : undefined,
        }}
      >
        <DragIcon
          size={20}
          x={4}
          y={4}
          setDragging={d => {
            if (dropReady) {
              return;
            }

            if (d) {
              if (!dragging) {
                // 开始
                onDragStart([d[0], d[1], bcrRef.current[2], bcrRef.current[3]]);
              } else {
                // 更新
                onDrag([d[0], d[1], active[2], active[3]]);
              }
            } else {
              onDragEnd();
            }
          }}
        />
        {children}
      </ListItemElement>
      {/* 拖拽终点检测 */}
      {
        dropReady && droppable !== 'none' && (
          <ListItemElementDroppableBox
            style={{
              visibility: dropReady ? 'visible' : 'hidden',
              flexDirection: direction,
            }}
          >
            {/* 前方 */}
            {
              ['all', 'insert'].includes(droppable) && (
                <ListItemElementDroppable
                  onMouseOver={onCanDropBefore}
                  onTouchMove={onCanDropBefore}
                />
              )
            }
            {/* 元素所在位置 */}
            {
              ['all', 'replace'].includes(droppable) && (
                <ListItemElementDroppable
                  onMouseOver={onCanDropReplace}
                  onTouchMove={onCanDropReplace}
                  style={{
                    flexGrow: 3,
                  }}
                />
              )
            }
            {/* 后方 */}
            {
              ['all', 'insert'].includes(droppable) && (
                <ListItemElementDroppable
                  onMouseOver={onCanDropAfter}
                  onTouchMove={onCanDropAfter}
                />
              )
            }
          </ListItemElementDroppableBox>
        )
      }
    </ListItemContainer>
  );
});


const ListItem = _ListItem as React.FC<{
  children: any;
} & LongTouchable>;

export default ListItem;
