import React, { useState, useEffect } from 'react';
import './Layout.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header, getSelectedKeys } from '@scripty/react-header';
import { useStore } from '@scripty/react-store';
import { Board } from '@scripty/react-board';
import { Article } from '@scripty/react-articles';
import { Login } from '@scripty/react-login';
import { nanoid } from 'nanoid';
import { Toolbar } from '@scripty/react-toolbar';

export const Layout = () => {

    const { boardsStore } = useStore('boardsStore');
    const { routesStore } = useStore('routesStore');
    const { loginStore } = useStore('loginStore');

    const [key, setKey] = useState(null);
    const [editing, setEditing] = useState(false);
    const [ selectedKeys, setSelectedKeys ] = useState([])

    const routes = routesStore.getAt(0);
    const user = loginStore.getAt(0);
    const topNaviRoutes = routes.get('Top Navi');
    const userMenuRoutes = routes.get('Login');
    const data = boardsStore.getAt(0);

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
        key ? boardsStore.proxy.read({ assignment: key }) : null
    }, [key]);

    const onClick = async (key, selectedKeys) => {
        setSelectedKeys(selectedKeys);
        setKey(key);
    };

    const onSave = () => {
        boardsStore.proxy.update({ assignment: 'Dashboard', ...data });
        setEditing(!editing);
    }

    const onEdit = () => {
        setEditing(!editing);
    }

    const onAddBtnClick = (columnId, type) => {
        let id = nanoid();
        data.tasks[id] = {
            id: id,
            type: type,
            edit: true,
            content: {
                title: '',
                html: '',
            }
        };
        data.set({assignment: key})
        data.columns[columnId].taskIds.unshift(id);
        data.set(data);
        boardsStore.setData(data);
    }

    const onSubmit = (data) => {
        const { username, password } = data;
        console.log(username, password);
        loginStore.proxy.login(data)
    }

    const LoginComponent = () => {
        return <Login loginPath={'/'} onLoginSubmit={onSubmit} />
    }

    const onOkBtnClick = (id, article) => {
        data.tasks[id].content = article;
        delete data.tasks[id]['edit'];
        data.set(data);
        boardsStore.setData(data);
    }

    const onDeleteBtnClick = (id) => {
        delete data.tasks[id]
        data.set(data);
        boardsStore.setData(data);
    }

    const onCancelBtnClick = (id, article) => {
        if (article.title === '' && article.title === '') {
            delete data.tasks[id]
            data.set(data);
            boardsStore.setData(data);
        }
    }

    const ArticleCard = (props) => {
        const { edit, content, editing, id } = props;

        return (
            <Article
                edit={edit}
                {...content}
                id={id}
                showToolbar={editing}
                onOkBtnClick={onOkBtnClick.bind(null, id )}
                onCancelBtnClick={onCancelBtnClick.bind(null, id, content )}
                onDeleteBtnClick={onDeleteBtnClick.bind(null, id, content )}
            />
        );
    }

    return (
        <Router>
            <Toolbar
                visible={user.loggedIn}
                onSaveBtnClick={onSave}
                onEditBtnClick={onEdit}
            />
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
            <Board
                state={data}
                setState={state => data.set(state)}
                cards={{ Article: ArticleCard, Login: LoginComponent }}
                editing={editing}
                onAddBtnClick={onAddBtnClick}
                layout={'sized'}
            />
        </Router>
    );
};
