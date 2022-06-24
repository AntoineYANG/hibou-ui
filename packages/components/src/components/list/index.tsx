/*
 * @Author: Kanata You 
 * @Date: 2022-06-24 19:17:40 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-06-25 03:29:27
 */

import React from 'react';
import styled from 'styled-components';

import colors from '@colors';
import ListItem from './list-item';


const ListElement = styled.div<{ direction: 'column' | 'row' }>(({ direction }) => ({
  display: 'flex',
  flexDirection: direction,
}));

export const ListItemContainer = styled.div({
  position: 'relative',
  margin: 0,
  paddingBlock: '4px',
  paddingInline: '4px',
});

const ListItemElementDropArea = styled.div<{ direction: 'column' | 'row' }>(({ direction }) => ({
  position: 'relative',
  backgroundColor: `${colors.shadow}0a`,
  boxShadow: 'inset 1px 2px 4px 3px #888888aa',
  overflow: 'visible',
  opacity: 0.5,
  animation: `stretch-${direction === 'column' ? 'ns' : 'ew'} 1500ms`,
}));

export interface ListProps<T = any> {
  /** 列表展开方向，默认为 `"column"` */
  direction?: 'column' | 'row';
  /**
   * 拖拽模式，默认为 `"insert"`
   * + `"none"` - 不支持拖拽
   * + `"insert"` - 重排元素顺序
   * + `"swap"` - 交换两个元素
   */
  dragMode?: 'none' | 'insert' | 'swap';
  /** 此字段相同的列表间可共享元素 */
  group?: string;
  /** 原始列表 */
  data: Readonly<T[]>;
  /** 拖拽交互触发更新 */
  handleUpdate?: (nextList: T[]) => void;
  /** 渲染函数 */
  children: (d: Readonly<T>) => any;
}

export interface ListItemProps {
  /** 列表展开方向 */
  direction: 'column' | 'row';
  /** 是否允许拖拽其他元素到这个位置 */
  droppable: 'none' | 'insert' | 'replace' | 'all';
  /** 元素开始被拖拽 */
  onDragStart: (cbr: [number, number, number, number]) => void;
  /** 元素正在被拖拽 */
  onDrag: (cbr: [number, number, number, number]) => void;
  /** 元素拖拽结束 */
  onDragEnd: () => void;
  /** 元素拖拽被打断 */
  onDragCancel: () => void;
  /** 当前拖拽元素可插入于这个位置之前 */
  onCanDropBefore: () => void;
  /** 当前拖拽元素可插入于这个位置之后 */
  onCanDropAfter: () => void;
  /** 当前拖拽元素可替换这个元素 */
  onCanDropReplace: () => void;
  /** 当前拖拽元素超出替换位置 */
  onCanDropOut: () => void;
  /** 当前元素是否正在被拖拽 */
  dragging: boolean;
  /** 被拖拽元素的盒信息 */
  active: [number, number, number, number];
  /** 当前元素所在列表是否可能接受正在被拖拽的元素 */
  dropReady: boolean;
  /** 当前拖拽元素是否即将替换这个元素 */
  canReplace: boolean;
  children: any;
}

const shared: {
  [group: string]: {
    draggingCbr: [number, number, number, number] | null;
    // TODO:
  };
} = {};

const List: React.FC<ListProps> = React.memo(function List ({
  direction = 'column',
  dragMode = 'insert',
  group,
  data,
  handleUpdate,
  children: renderer,
}) {
  const [dragging, setDragging] = React.useState<number | null>(null);
  const [draggingCbr, setDraggingCbr] = React.useState<
    [number, number, number, number]
  >([0, 0, 0, 0]);
  const [willDrop, setWillDrop] = React.useState<{
    pos: number;
    type: 'insert' | 'replace';
  } | null>(null);

  if (typeof group === 'string') {
    if (!shared[group]) {
      // TODO:
    }
  }

  return (
    <ListElement
      direction={direction}
    >
      {data.map((d, i) => {
        const e = renderer(d);

        const Component = e.type.type as React.FC<ListItemProps>;
        const props = e.props as { children: any };

        const item = (
          <Component
            {...props}
            direction={direction}
            droppable={({
              none: 'none',
              insert: 'insert',
              swap: 'replace',
            } as Record<typeof dragMode, ListItemProps['droppable']>)[dragMode]}
            onDragStart={cbr => {
              setDragging(i);
              setDraggingCbr(cbr);
            }}
            onDrag={cbr => {
              setDraggingCbr(cbr);
            }}
            onDragEnd={() => {
              if (willDrop && dragging !== null) {
                if (dragMode === 'insert') {
                  const tmp = [...data];
                  const what = tmp[dragging];
                  const res = [
                    ...tmp.slice(0, willDrop.pos),
                    what,
                    ...tmp.slice(willDrop.pos),
                  ];
                  
                  res.splice(dragging + (willDrop.pos < dragging ? 1 : 0), 1);

                  handleUpdate?.(res);
                } else {
                  const tmp = [...data];
                  const a = tmp[dragging];
                  const b = tmp[willDrop.pos];
                  tmp[dragging] = b;
                  tmp[willDrop.pos] = a;

                  handleUpdate?.(tmp);
                }
              }
             
              setDragging(null);
              setWillDrop(null);
            }}
            onDragCancel={() => {
              setDragging(null);
              setWillDrop(null);
            }}
            onCanDropBefore={() => setWillDrop({
              pos: i,
              type: 'insert',
            })}
            onCanDropAfter={() => setWillDrop({
              pos: i + 1,
              type: 'insert',
            })}
            onCanDropReplace={() => setWillDrop({
              pos: i,
              type: 'replace',
            })}
            onCanDropOut={() => setWillDrop(null)}
            dragging={dragging === i}
            active={draggingCbr}
            dropReady={(
              dragging !== null && dragging !== i // TODO:
            )}
            canReplace={willDrop?.type === 'replace' && willDrop.pos === i}
          />
        );

        return (
          <React.Fragment key={i}>
            {
              dragging !== null && willDrop?.type === 'insert' && willDrop.pos === i && (
                i !== dragging && i !== dragging + 1 // 这两种情况并未真实移动
              ) && (
                <ListItemContainer>
                  <ListItemElementDropArea
                    direction={direction}
                    style={{
                      width: draggingCbr[2],
                      height: draggingCbr[3],
                    }}
                  />
                </ListItemContainer>
              )
            }
            {item}
          </React.Fragment>
        );
      })}
      {
        dragging !== null && willDrop?.type === 'insert' && (
          willDrop.pos === data.length || data.length === 0
        ) && (
          <ListItemContainer>
            <ListItemElementDropArea
              direction={direction}
              style={{
                width: draggingCbr[2],
                height: draggingCbr[3],
              }}
            />
          </ListItemContainer>
        )
      }
    </ListElement>
  );
});


export default Object.assign({}, List, {
  ListItem,
});
