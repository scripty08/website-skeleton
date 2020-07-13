import React from 'react';

import { hot } from 'react-hot-loader/root';
import { Layout } from './Layout';
import { StoreProvider } from '@scripty/react-store';
import usersStore from './usersStore';
import routesStore from './routesStore';

let defaultStores = {
    usersStore,
    routesStore
};

const App = () => {
    return (
        <StoreProvider defaultStores={defaultStores}>
            <Layout />
        </StoreProvider>
    );
};

export default hot(App);
