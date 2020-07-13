import { createStore } from '@scripty/react-store';

export default createStore({
    name: 'usersStore',
    model: {
        fields: [
            { name: '_id', type: 'string' },
            { name: 'username', type: 'string' },
            { name: 'password', type: 'string' },
            { name: 'isLoggedIn', type: 'boolean' },
        ]
    },
    proxy: {
        rootProperty: 'entries',
        api: {
            login: {
                url: '/login',
                method: 'post'
            },
            logout: {
                url: '/logout',
                method: 'post'
            }
        }
    }
});
