import React, { Component } from 'react';
import {
    Switch,
    Route,
    withRouter,
    RouteComponentProps,
} from 'react-router-dom';
import Caja from './Caja';

class CajaRouting extends Component<RouteComponentProps> {
    render() {
        return (
            <Switch>
                <Route path="/caja" component={Caja} exact />
            </Switch>
        );
    }
}

export default withRouter(CajaRouting);
