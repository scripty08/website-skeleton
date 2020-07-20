import { createStore } from '@scripty/react-store';

export default createStore({
    name: 'loginStore',
    model: {
        fields: [
            { name: 'loggedIn', type: 'boolean' },
            { name: 'username', type: 'string'},
            { name: 'password', type: 'password'},
            { name: 'avatar', type: 'object'}
        ]
    },
    proxy: {
        rootProperty: 'entries',
        api: {
            login: {
                url: '/users/login',
                method: 'post'
            }
        }
    }
});
