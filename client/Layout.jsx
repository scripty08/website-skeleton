import React, { useState, useEffect } from 'react';
import './Layout.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from '@scripty/react-header';
import { useStore } from '@scripty/react-store';

export const Layout = () => {

    const [ selectedKeys, setSelectedKeys ] = useState([])
    const { routesStore } = useStore('routesStore');

    useEffect(() => {
        routesStore.proxy.findRoutes();
    }, []);

    const onClick = (key, selectedKeys) => {
        setSelectedKeys(selectedKeys);
    };

    const routes = routesStore.getAt(0);
    const topNaviRoutes = routes.get('Top Navi');
    const userMenuRoutes = routes.get('Login');

    const loggedInUser = {
        username: 'Danijel',
        loggedIn: true,
        avatar: {
            url: 'https://s.gravatar.com/avatar/d363403799aa4b4de34c36bc290ebe12?size=50&default=retro'
        }
    };

    const loggedOutUser = {
        loggedIn: false,
    };

    return (
        <Router>
            <Header
                routes={topNaviRoutes}
                userMenuRoutes={userMenuRoutes}
                user={loggedInUser}
                selectedKeys={selectedKeys}
                onClick={onClick}
                showBreadcrumbs={true}
                logo={'Skeleton'}
                layout={'sized'}
            />
        </Router>
    );
};
