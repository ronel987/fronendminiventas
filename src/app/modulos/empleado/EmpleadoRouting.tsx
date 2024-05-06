import React, { Component } from 'react';
import {
    Switch,
    Route,
    withRouter,
    RouteComponentProps,
} from 'react-router-dom';
import EmpleadoTabla from './EmpleadoTabla';
import EmpleadoRegistrar from './EmpleadoRegistrar';

class EmpleadoRouting extends Component<RouteComponentProps> {
    render() {
        return (
            <Switch>
                <Route
                    path={this.props.match.url}
                    component={EmpleadoTabla}
                    exact
                />
                <Route
                    path={`${this.props.match.url}/registrar`}
                    component={EmpleadoRegistrar}
                    exact
                />
            </Switch>
        );
    }
}

export default withRouter(EmpleadoRouting);
