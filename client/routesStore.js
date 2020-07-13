import { createStore } from '@scripty/react-store';

export default createStore({
    name: 'routesStore',
    model: {
        fields: [
            { name: 'Top Navi', type: 'array' }
        ]
    },
    proxy: {
        rootProperty: 'entries',
        api: {
            findRoutes: {
                url: '/routes/findRoutes',
                method: 'get'
            }
        }
    }
});
