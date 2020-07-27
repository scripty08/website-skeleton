import React from 'react';
import '@scripty/styles';
import { hot } from 'react-hot-loader/root';
import { Layout } from './Layout';
import { StoreProvider } from '@scripty/react-store';
import usersStore from './usersStore';
import routesStore from './routesStore';
import loginStore from './loginStore';
import boardsStore from './boardsStore';

let defaultStores = {
    usersStore,
    routesStore,
    boardsStore,
    loginStore
};

const App = () => {
    return (
        <StoreProvider defaultStores={defaultStores}>
            <Layout />
        </StoreProvider>
    );
};

export default hot(App);
