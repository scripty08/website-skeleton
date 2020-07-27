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

    const onDelete = (task) => {
        delete data.tasks[task.id]
        data.set(data);
        boardsStore.setData(data);
    }

    const onCancel = (task) => {
        if (task.content.title === '' && task.content.title === '') {
            delete data.tasks[task.id]
            data.set(data);
            boardsStore.setData(data);
        }
    }

    const onAddBtnClick = (columnId) => {
        let id = nanoid();
        data.tasks[id] = {
            id: id,
            type: 'Article',
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

    const onOkBtnClick = (task, content) => {
        content.tasks[task.id].content = content;
        delete content.tasks[task.id]['edit'];
        content.set(content);
        boardsStore.setData(content);
    }

    const ArticleCard = (props) => {
        return (
            <Article
                edit={props.edit}
                {...props.content}
                showToolbar={props.editing}
                onOkBtnClick={onOkBtnClick.bind(null, props)}
                onCancelBtnClick={onCancel.bind(null, props)}
                onDeleteBtnClick={onDelete.bind(null, props)}
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
