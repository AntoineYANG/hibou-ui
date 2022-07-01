/*
 * @Author: Kanata You 
 * @Date: 2022-06-13 16:54:52 
 * @Last Modified by: Kanata You
 * @Last Modified time: 2022-06-30 18:24:29
 */

import React from 'react';

import List from '@components/list';
import Button from '@components/button';

const { ListItem } = List;


const App: React.FC = React.memo(function App () {
  const [d1, setD1] = React.useState<number[]>([1, 2, 3]);
  const [d2, setD2] = React.useState<number[]>([4, 5, 6]);

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
        overflow: 'hidden',
      }}
    >
      {/* <List
        data={d1}
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
        data={d1}
        handleUpdate={setD1}
        dragMode="swap"
        group="a"
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
        group="a"
      >
        {
          d => (
            <ListItem>
              {`${d} 号卡片`}
            </ListItem>
          )
        }
      </List> */}
      <div>
        <Button
          type="primary"
          callback={() => {
            console.log('p');
          }}
        >
          首要
        </Button>
        <Button
          callback={async () => {
            await new Promise(res => setTimeout(() => 0, 6000));
            console.log('a');
          }}
        >
          按钮
        </Button>
        <Button
          type="danger"
          callback={() => {
            console.log('aaaa');
          }}
        >
          危险
        </Button>
        <Button
          disabled
          callback={() => {
            console.log('u');
          }}
        >
          禁用
        </Button>
        <Button
          size="big"
          callback={() => {
            console.log('u');
          }}
        >
          大
        </Button>
        <Button
          size="normal"
          callback={() => {
            console.log('u');
          }}
        >
          中
        </Button>
        <Button
          size="small"
          callback={() => {
            console.log('u');
          }}
        >
          小
        </Button>
      </div>
      <div>
        <Button
          type="primary"
          rounded
          callback={() => {
            console.log('p');
          }}
        >
          首要
        </Button>
        <Button
          rounded
          callback={async () => {
            await new Promise(res => setTimeout(() => 0, 6000));
            console.log('a');
          }}
        >
          按钮
        </Button>
        <Button
          rounded
          type="danger"
          callback={() => {
            console.log('aaaa');
          }}
        >
          危险
        </Button>
        <Button
          disabled
          rounded
          callback={() => {
            console.log('u');
          }}
        >
          禁用
        </Button>
        <Button
          size="big"
          rounded
          callback={() => {
            console.log('u');
          }}
        >
          大
        </Button>
        <Button
          size="normal"
          rounded
          callback={() => {
            console.log('u');
          }}
        >
          中
        </Button>
        <Button
          size="small"
          rounded
          callback={() => {
            console.log('u');
          }}
        >
          小
        </Button>
      </div>
    </main>
  );
});


export default App;
