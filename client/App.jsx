import React from 'react';

import { hot } from 'react-hot-loader/root';
import { Layout } from './Layout';
import { StoreProvider } from '@scripty/react-store';
import usersStore from './usersStore';
import routesStore from './routesStore';
import modulesStore from './modulesStore';
import loginStore from './loginStore';
import placementsStore from './placementsStore';

let defaultStores = {
    usersStore,
    routesStore,
    modulesStore,
    placementsStore,
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
