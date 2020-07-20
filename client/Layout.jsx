import React, { useState, useEffect } from 'react';
import './Layout.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header, getSelectedKeys } from '@scripty/react-header';
import { useStore } from '@scripty/react-store';
import { getNewItemId, Modules } from '@scripty/react-modules';
import { Article } from '@scripty/react-articles';
import { Login } from '@scripty/react-login';
import placementsStore from './placementsStore';

export const Layout = () => {

    const [ selectedKeys, setSelectedKeys ] = useState([])
    const { routesStore } = useStore('routesStore');
    const { loginStore } = useStore('loginStore');
    const { modulesStore } = useStore('modulesStore');
    const { placementsStore } = useStore('placementsStore');
    const records = modulesStore.getAt(0);
    const placementsRecords = placementsStore.getAt(0);
    const user = loginStore.getAt(0);
    const routes = routesStore.getAt(0);
    const topNaviRoutes = routes.get('Top Navi');
    const userMenuRoutes = routes.get('Login');
    const activeRoutes = getSelectedKeys(routes['Top Navi'], window.location, '');
    const key = activeRoutes.slice(-1).pop();

    useEffect(() => {
        user.set(window.__INITIAL_STATE__);
    }, []);

    useEffect(() => {
        routesStore.proxy.findRoutes();
    }, []);

    useEffect(() => {
        modulesStore.proxy.findModules({ assignment: key });
    }, [routes]);

    useEffect(() => {
        placementsStore.proxy.findPlacements({ assignment: key });
    }, [modulesStore.data]);

    const onClick = async (key, selectedKeys) => {
        setSelectedKeys(selectedKeys);
        await modulesStore.proxy.findModules({ assignment: key });
        await placementsStore.proxy.findPlacements({ assignment: key });
    };

    const onSaveBtnClick = async () => {
        const dirtyModules = modulesStore.getDirtyRecords();
        const dirtyPlacements = placementsStore.getDirtyRecords();

        if (dirtyModules) {
            await modulesStore.proxy.updateModules(dirtyModules);
        }
        if (dirtyPlacements) {
            await placementsStore.proxy.updatePlacements(placementsStore.data);
        }
    };

    const onAddBtnClick = (type) => {
        const id = getNewItemId(placementsRecords.placements);
        let model = modulesStore.createModel({
            item_id: id,
            type: 'Article',
            assignment: {
                type: 'selected',
                value: [
                    'Dashboard'
                ]
            },
            plugin: [{
                title: '',
                html: '',
                edit: true
            }]
        });

        model.setDirty();
        modulesStore.setData(model);

        const record = placementsStore.data[0];
        record.placements[1].unshift({ id: id });
        record.set(record.placements);
        record.setDirty();
    }

    const onSubmit = (data) => {
        const { username, password } = data;
        console.log(username, password);
        loginStore.proxy.login(data)
    }

    const LoginComponent = () => {
        return <Login loginPath={'/'} onLoginSubmit={onSubmit} />
    }

    return (
        <Router>
            <Header
                routes={topNaviRoutes}
                userMenuRoutes={userMenuRoutes}
                user={user}
                selectedKeys={selectedKeys}
                onClick={onClick}
                showBreadcrumbs={true}
                logo={'Skeleton'}
                layout={'sized'}
            />
            <Modules
                style={{paddingTop: 30}}
                placements={placementsRecords.placements}
                setPlacements={(placements) => {
                    placementsRecords.set({ placements });
                    placementsRecords.setDirty();
                }}
                Components={{ Article, Login: LoginComponent}}
                onSaveBtnClick={onSaveBtnClick}
                onAddBtnClick={onAddBtnClick}
                editing={user.loggedIn}
                menuItems={['Article']}
                modules={modulesStore.data}
                records={records}
            />
        </Router>
    );
};
