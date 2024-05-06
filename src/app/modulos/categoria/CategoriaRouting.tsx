import React, { Component } from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';
import CategoriaTabla from './CategoriaTabla';
import CategoriaRegistrar from './CategoriaRegistrar';
import CategoriaEditar from './CategoriaEditar';

class CategoriaRouting extends Component<RouteComponentProps> {
    render() {
        return (
            <Switch>
                <Route path={this.props.match.url} component={CategoriaTabla} exact />
                <Route path={`${this.props.match.url}/registrar`} component={CategoriaRegistrar} exact />
                <Route path={`${this.props.match.url}/:id/editar`} component={CategoriaEditar} exact />
            </Switch>
        );
    }
}

export default withRouter(CategoriaRouting);
