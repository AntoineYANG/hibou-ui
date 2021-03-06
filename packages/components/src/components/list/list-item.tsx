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
  paddingBlock: '32px',
  paddingInline: '32px',
  border: `1px solid ${colors.border}`,
  backgroundColor: colors.background,
  boxShadow: isDragging
    ? `1px 2px 3px 2px ${colors.shadow}aa`
    : `0 0.5px 1.5px 0 ${colors.shadow}`,
  opacity: isDragging ? 0.75 : 1,
  userSelect: isDragging ? 'none' : undefined,
  pointerEvents: isDragging ? 'none' : undefined,
  zIndex: isDragging ? 3 : 1,
  transition: 'box-shadow 200ms, opacity 200ms, filter 200ms',
}));

const ListItemElementShadow = styled.div({
  position: 'relative',
  backgroundColor: colors.shadow,
  boxShadow: 'inset 1px 2px 4px 3px #0000008a',
  opacity: 0.4,
});

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
  ...props
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

  // ?????????????????????????????????
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

  const {
    handleMouseDown,
    handleTouchStart,
    handleMouseMove,
    handleTouchMove,
  } = useLongTouchHandlers(props);
  
  return (
    <ListItemContainer>
      {
        dragging && (
          <ListItemElementShadow
            onMouseOver={onCanDropOut}
            onTouchMove={onCanDropOut}
            style={{
              width: active[2],
              height: active[3],
            }}
          />
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
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        isDragging={dragging}
        style={{
          left: dragging ? active[0] : undefined,
          top: dragging ? active[1] : undefined,
          filter: canReplace ? 'grayscale(50%) brightness(50%)' : undefined,
          pointerEvents: dropReady ? 'none' : undefined,
          userSelect: dropReady ? 'none' : undefined,
          opacity: canReplace ? 0.75 : undefined,
        }}
      >
        {
          droppable !== 'none' && (
            <DragIcon
              size={24}
              x={4}
              y={4}
              direction={direction}
              setDragging={d => {
                if (dropReady) {
                  return;
                }
    
                if (d) {
                  if (!dragging) {
                    // ??????
                    onDragStart([d[0], d[1], bcrRef.current[2], bcrRef.current[3]]);
                  } else {
                    // ??????
                    onDrag([d[0], d[1], active[2], active[3]]);
                  }
                } else {
                  onDragEnd();
                }
              }}
            />
          )
        }
        {children}
      </ListItemElement>
      {/* ?????????????????? */}
      {
        dropReady && droppable !== 'none' && (
          <ListItemElementDroppableBox
            style={{
              visibility: dropReady ? 'visible' : 'hidden',
              flexDirection: direction,
            }}
          >
            {/* ?????? */}
            {
              droppable === 'insert' && (
                <ListItemElementDroppable
                  onMouseOver={onCanDropBefore}
                  onTouchMove={onCanDropBefore}
                />
              )
            }
            {/* ?????????????????? */}
            {
              droppable === 'replace' && (
                <ListItemElementDroppable
                  onMouseOver={onCanDropReplace}
                  onTouchMove={onCanDropReplace}
                  style={{
                    flexGrow: 3,
                  }}
                />
              )
            }
            {/* ?????? */}
            {
              droppable === 'insert' && (
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
