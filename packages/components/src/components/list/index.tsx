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
  width: '100%',
  height: '100%',
  flexGrow: 1,
  flexShrink: 1,
  overflow: direction === 'column' ? 'hidden auto' : 'auto hidden',
  display: 'flex',
  flexDirection: direction,
  border: `1px solid ${colors.border}`,
}));

export const ListItemContainer = styled.div({
  flexGrow: 0,
  flexShrink: 0,
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
   * 拖拽模式，默认为 `"none"`
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
  droppable: 'none' | 'insert' | 'replace';
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
    setDragging: (draggingCbr: [number, number, number, number] | null) => void;
    setWillDrop: (hasWillDrop: {
      pos: number;
      type: 'insert' | 'replace';
    } | null) => void;
    setSharedItem: (item: any, submit: boolean, getReplacer: (d: any) => void) => void;
  }[];
} = {};

const List: React.FC<ListProps> = React.memo(function List ({
  direction = 'column',
  dragMode = 'none',
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
  const [externalDragging, setExternalDragging] = React.useState(false);
  const [externalWillDrop, setExternalWillDrop] = React.useState<{
    pos: number;
    type: 'insert' | 'replace';
  } | null>(null);

  // 组监听
  React.useEffect(() => {
    if (typeof group === 'string') {
      const updater = {
        setDragging: (
          sharedDraggingCbr: [number, number, number, number] | null
        ) => {
          setExternalDragging(Boolean(sharedDraggingCbr));

          if (sharedDraggingCbr) {
            setDraggingCbr(sharedDraggingCbr);
          }
        },
        setWillDrop: (hasWillDrop: {
          pos: number;
          type: 'insert' | 'replace';
        } | null) => {
          setExternalWillDrop(hasWillDrop);

          if (!hasWillDrop) {
            setWillDrop(null);
          }
        },
        setSharedItem: (item: any, submit: boolean, getReplacer: (d: any) => void) => {
          if (submit && willDrop) {
            const tmp = [...data];
            const what = item;

            if (dragMode === 'insert') {
              const res = [
                ...tmp.slice(0, willDrop.pos),
                what,
                ...tmp.slice(willDrop.pos),
              ];

              handleUpdate?.(res);
            } else {
              const res = [
                ...tmp.slice(0, willDrop.pos),
                what,
                ...tmp.slice(willDrop.pos + 1),
              ];

              getReplacer(tmp[willDrop.pos]);

              handleUpdate?.(res);
            }
          }
        }
      };
      
      shared[group] = [
        ...(shared[group] ?? []),
        updater,
      ];

      return () => {
        shared[group] = (shared[group] ?? []).filter(d => d !== updater);
      };
    }

    return;
  }, [data, dragMode, group, handleUpdate, willDrop]);

  const emitGroupSharing = React.useCallback((
    item: any | null, submit: boolean, getReplacer: (d: any) => void
  ) => {
    if (typeof group === 'string') {
      shared[group]?.forEach(cb => cb.setSharedItem(item, submit, getReplacer));
    }
  }, [group]);

  const emitGroupDragging = React.useCallback((cbr: [number, number, number, number] | null) => {
    if (typeof group === 'string') {
      shared[group]?.forEach(cb => cb.setDragging(cbr));
    }
  }, [group]);

  const emitGroupWillDrop = React.useCallback((pos: typeof externalWillDrop) => {
    if (typeof group === 'string') {
      shared[group]?.forEach(cb => cb.setWillDrop(pos));
    }
  }, [group]);

  if (willDrop && externalWillDrop && externalWillDrop !== willDrop) {
    setWillDrop(null);
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
              emitGroupDragging(cbr);
              setDraggingCbr(cbr);
              emitGroupSharing(d, false, () => {});
            }}
            onDrag={cbr => {
              setDraggingCbr(cbr);
              emitGroupDragging(cbr);
            }}
            onDragEnd={() => {
              if (dragging === willDrop?.pos || (!willDrop && !externalWillDrop)) {
                setDragging(null);
                setWillDrop(null);
                emitGroupDragging(null);
                emitGroupWillDrop(null);
                emitGroupSharing(null, false, () => {});
                
                return;
              }
              
              let res: any[] = [...data];

              if (dragging !== null) {
                if (willDrop) {
                  if (dragMode === 'insert') {
                    const tmp = [...data];
                    const what = tmp[dragging];
                    res = [
                      ...tmp.slice(0, willDrop.pos),
                      what,
                      ...tmp.slice(willDrop.pos),
                    ];
                    
                    res.splice(dragging + (willDrop.pos < dragging ? 1 : 0), 1);
                  } else {
                    const tmp = [...data];
                    const a = tmp[dragging];
                    const b = tmp[willDrop.pos];
                    tmp[dragging] = b;
                    tmp[willDrop.pos] = a;
                    res = tmp;
                  }
                } else if (externalDragging) {
                  const tmp = [...data];
                  
                  tmp.splice(dragging, 1);

                  res = tmp;
                }
              }
             
              setDragging(null);
              setWillDrop(null);
              emitGroupDragging(null);
              emitGroupWillDrop(null);
              emitGroupSharing(d, true, rpl => {
                if (externalDragging && !willDrop && dragging !== null) {
                  res = [
                    ...res.slice(0, dragging),
                    rpl,
                    ...res.slice(dragging),
                  ];
  
                  handleUpdate?.(res);
                }
              });

              handleUpdate?.(res);
            }}
            onDragCancel={() => {
              setDragging(null);
              setWillDrop(null);
              emitGroupDragging(null);
              emitGroupWillDrop(null);
              emitGroupSharing(null, false, () => {});
            }}
            onCanDropBefore={() => {
              const wd: typeof willDrop = {
                pos: i,
                type: 'insert',
              };
              setWillDrop(wd);
              emitGroupWillDrop(wd);
            }}
            onCanDropAfter={() => {
              const wd: typeof willDrop = {
                pos: i + 1,
                type: 'insert',
              };
              setWillDrop(wd);
              emitGroupWillDrop(wd);
            }}
            onCanDropReplace={() => {
              const wd: typeof willDrop = {
                pos: i,
                type: 'replace',
              };
              setWillDrop(wd);
              emitGroupWillDrop(wd);
            }}
            onCanDropOut={() => {
              setWillDrop(null);
              emitGroupWillDrop(null);
            }}
            dragging={dragging === i}
            active={draggingCbr}
            dropReady={(
              dragging !== null && dragging !== i
            ) || (
              dragging === null && externalDragging
            )}
            canReplace={willDrop?.type === 'replace' && willDrop.pos === i}
          />
        );

        return (
          <React.Fragment key={i}>
            {
              (dragging !== null || externalDragging) && dragMode === 'insert' && (
                willDrop?.pos === i
              ) && (
                dragging === null || (
                  i !== dragging && i !== dragging + 1 // 这两种情况并未真实移动
                )
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
        (dragging !== null || externalDragging) && dragMode === 'insert' && (
          willDrop?.pos === data.length || data.length === 0
        ) && (
          <ListItemContainer>
            <ListItemElementDropArea
              direction={direction}
              onMouseOver={() => {
                const wd: typeof willDrop = {
                  pos: data.length,
                  type: 'insert',
                };
                setWillDrop(wd);
                emitGroupWillDrop(wd);
              }}
              onTouchMove={() => {
                const wd: typeof willDrop = {
                  pos: data.length,
                  type: 'insert',
                };
                setWillDrop(wd);
                emitGroupWillDrop(wd);
              }}
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
