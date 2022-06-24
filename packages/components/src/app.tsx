/*
 * @Author: Kanata You 
 * @Date: 2022-06-13 16:54:52 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-06-25 03:26:23
 */

import React from 'react';

import List from '@components/list';

const { ListItem } = List;


const App: React.FC = React.memo(function App () {
  const [d1, setD1] = React.useState<number[]>([1, 2, 3, 4]);
  const [d2, setD2] = React.useState<number[]>([1, 2, 3, 4]);

  return (
    <main
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <List
        data={d1}
        handleUpdate={setD1}
      >
        {
          d => (
            <ListItem>
              {`${d} 号卡片`}
            </ListItem>
          )
        }
      </List>
      <List
        data={d2}
        handleUpdate={setD2}
        direction="row"
        dragMode="swap"
      >
        {
          d => (
            <ListItem>
              {`${d} 号卡片`}
            </ListItem>
          )
        }
      </List>
    </main>
  );
});


export default App;
