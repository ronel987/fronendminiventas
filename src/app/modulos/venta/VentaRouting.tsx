import React, { Component } from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';
import VentaTabla from './VentaTabla';
import VentaDetalle from './VentaDetalle';

class VentaRouting extends Component<RouteComponentProps> {
    render() {
        return (
            <Switch>
                <Route path={this.props.match.url} component={VentaTabla} exact />
                <Route path={`${this.props.match.url}/:id/detalle`} component={VentaDetalle} exact />
            </Switch>
        );
    }
}

export default withRouter(VentaRouting);
