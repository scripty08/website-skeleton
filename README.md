# @scripty/website-skeleton

# Description

lightweight react header component. It has full working flyout navigation, user menu and breadcrumbs with
appropriate highlighting. Install and enjoy applying your styles to the header.

![alt text](./header1.png "@scripty/website-skeleton")

# Usage
```bash
npm install -s @scripty/website-skeleton
```

##### Client: Layout.jsx

```javascript
import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Header } from '@scripty/website-skeleton';

export const Layout = () => {

    const [ selectedKeys, setSelectedKeys ] = useState([])

    const onClick = (key, selectedKeys) => {
        setSelectedKeys(selectedKeys);
    }

    const routes = [
        {
            "key" : "Dashboard",
            "label" : "Dashboard",
            "icon" : "DashboardOutlined",
            "path" : "/",
            "exact" : true
        },
        {
            "key" : "Layout",
            "label" : "Layout",
            "icon" : "BankOutlined",
            "path" : "/example",
            "submenu" : [
                {
                    "key" : "Sub-1",
                    "label" : "Sub 1",
                    "path" : "/sub1",
                    "icon" : "CloudServerOutlined",
                    "submenu" : [
                        {
                            "key" : "Sub-1-1",
                            "label" : "Sub-1-1",
                            "path" : "/sub-1-1",
                            "icon" : "CreditCardFilled",
                        }
                    ]
                }
            ]
        }
    ];

    const userMenuRoutes = [
        {
            "key" : "UserMenu",
            "label" : "Login",
            "path" : "/login",
            "exact" : true,
            "submenu" : [
                {
                    "key" : "Profile",
                    "label" : "Profile",
                    "path" : "/profile",
                    "icon" : "UserOutlined",
                },
                {
                    "key" : "Settings",
                    "label" : "Settings",
                    "path" : "/settings",
                    "icon" : "SettingOutlined",
                }
            ]
        }
    ];

    const loggedOutUserMenuRoute = [
        {
            "key" : "UserMenu",
            "label" : "Login",
            "path" : "/login",
            "exact" : true
        }
    ];

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
            <h2>Fullpage Header</h2>
            <Header
                routes={routes}
                userMenuRoutes={userMenuRoutes}
                user={loggedInUser}
                selectedKeys={selectedKeys}
                onClick={onClick}
                showBreadcrumbs={true}
                logo={'Awsome Logo'}
            />
            <br /><br /><br /><br /><br />
            <h2>Sized Header</h2>
            <Header
                routes={routes}
                userMenuRoutes={userMenuRoutes}
                user={loggedInUser}
                selectedKeys={selectedKeys}
                onClick={onClick}
                layout={'sized'}
                showBreadcrumbs={true}
                logo={<div>Your Logo</div>}
            />
            <br /><br /><br /><br /><br />
            <h2>Sized Header without Breadcrumbs</h2>
            <Header
                routes={routes}
                userMenuRoutes={loggedOutUserMenuRoute}
                user={loggedOutUser}
                selectedKeys={selectedKeys}
                onClick={onClick}
                layout={'sized'}
                logo={'Logo'}
            />
        </Router>
    );
};
```
# Components

Name              | Description                                         |
----------------- |---------------------------------------------------- |
Header            | Header with 3 Level Flyout Navigation and usermenu  |

# Header Properties

Property           | Type     |  Default  |
------------------ |--------- |-----------
onClick            | Function | () => {}
routes             | Array    | []
userMenuRoutes     | Array    | []
selectedKeys       | Array    | []
user               | Object   | { loggedIn: false }
layout             | Array    | fullpage
showBreadcrumbs    | Boolean  | false
logo               | React.Component or String  | Logo

# Route Properties

Property           | Type     |  Description             |
------------------ |--------- |--------------------------|
key                | String   | unique id key (required) |
label              | String   | (required)               |
path               | String   | (required)               |
icon               | String   | (optional)               |


# What´s next?
- add offcanvas for smaller breakpoints
- bugfixes
