import React, { useState, useEffect } from 'react';
import './Layout.scss';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header, getSelectedKeys } from '@scripty/react-header';
import { useStore } from '@scripty/react-store';
import { Board } from '@scripty/react-board';
import { EditButton, SaveButton } from '@scripty/react-buttons';
import { Article } from '@scripty/react-articles';
import { Login } from '@scripty/react-login';
import { nanoid } from 'nanoid';

export const Layout = () => {

    const [ selectedKeys, setSelectedKeys ] = useState([])
    const { routesStore } = useStore('routesStore');
    const { loginStore } = useStore('loginStore');
    const routes = routesStore.getAt(0);
    const user = loginStore.getAt(0);
    const topNaviRoutes = routes.get('Top Navi');
    const userMenuRoutes = routes.get('Login');
    const [key, setKey] = useState(null);
    const { boardsStore } = useStore('boardsStore');
    const data = boardsStore.getAt(0);
    const [editing, setEditing] = useState(false);

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
        delete data.tasks[task.id]
        data.set(data);
        boardsStore.setData(data);
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
        data.tasks[task.id].content = content;
        delete data.tasks[task.id]['edit'];
        data.set(data);
        boardsStore.setData(data);
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
            <SaveButton onClick={onSave}/>
            <EditButton onClick={onEdit}/>
            <Board
                state={data}
                setState={state => data.set(state)}
                cards={{ Article: ArticleCard, Login: LoginComponent }}
                editing={editing}
                onAddBtnClick={onAddBtnClick}
            />
        </Router>
    );
};
