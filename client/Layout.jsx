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
    const [key, setKey] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const placementsTemplate = [[], [], []];

    useEffect(() => {
        user.set(window.__INITIAL_STATE__);
    }, []);

    useEffect(() => {
        fetchRoutes();
    }, []);

    const fetchRoutes = async () => {
        let routes = await routesStore.proxy.findRoutes();
        const activeRoutes = getSelectedKeys(routes.entries[0]['Top Navi'], window.location, '');
        setKey(activeRoutes.slice(-1).pop());
    }

    useEffect(() => {
        key ? modulesStore.proxy.findModules({ assignment: key }) : null;
    }, [key, routes]);

    useEffect(() => {
        key ? placementsStore.proxy.findPlacements({ assignment: key }) : null
    }, [modulesStore.data]);

    const onClick = async (key, selectedKeys) => {
        setSelectedKeys(selectedKeys);
        setKey(key);
    };

    const onSaveBtnClick = async () => {
        const dirtyModules = modulesStore.getDirtyRecords();
        const dirtyPlacements = placementsStore.getDirtyRecords();

        if (dirtyModules) {
            await modulesStore.proxy.updateModules(dirtyModules);
        }
        if (dirtyPlacements) {
            placementsStore.getAt(0).set({assignment: key});
            await placementsStore.proxy.updatePlacements([placementsStore.getAt(0)]);
        }
    };

    const PluginConfigs = {
        Article: [{
            title: '',
            html: '',
            edit: true
        }],
        Login: [{
            title: '',
            loginPath: '/login'
        }]
    };

    const onAddBtnClick = (type) => {
        const id = getNewItemId(placementsRecords.placements);
        let model = modulesStore.createModel({
            item_id: id,
            type: type,
            new: true,
            assignment: {
                type: 'selected',
                value: [
                    key
                ]
            },
            plugin: PluginConfigs[type]
        });

        model.setDirty();
        modulesStore.setData(model);

        const record = placementsStore.getAt(0);


        if (record.placements.length === 0) {
            record.set({placements: placementsTemplate});
        }
        record.placements[1].unshift({ id: id });
        record.set(record);
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

    const onArticleOkBtnClick = (item_id, response) => {

        modulesStore.data.map(function (rec) {
            if (rec.item_id === item_id) {
                rec.plugin[0] = response;
                rec.setDirty();
                delete rec['callback']
                return rec;
            }
                return rec;
        });

        modulesStore.setData(modulesStore.data);
        setEditMode(false);
    }

    const ArticleComponent = (props) => {
        return <Article {...props} onOkBtnClick={onArticleOkBtnClick.bind(null, props.item_id)} showEditBtn={user.loggedIn} />
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

                    let pal = placements;
                    if (placements.length < 3) {
                        pal = pal.concat([[]])
                    }
                    if (placements.length < 2) {
                        pal = pal.concat([[], []])
                    }
                    placementsRecords.set({
                        placements: pal
                    });
                    placementsRecords.setDirty();


                }}
                Components={{ Article: ArticleComponent, Login: LoginComponent}}
                onSaveBtnClick={onSaveBtnClick}
                onAddBtnClick={onAddBtnClick}
                editing={user.loggedIn}
                menuItems={['Article', 'Login']}
                modules={modulesStore.data}
                records={records}
            />
        </Router>
    );
};
