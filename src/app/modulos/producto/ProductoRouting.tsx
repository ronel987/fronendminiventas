import React, { Component } from 'react';
import { Switch, Route, withRouter, RouteComponentProps } from 'react-router-dom';
import ProductoTabla from './ProductoTabla';
import ProductoRegistrar from './ProductoRegistrar';
import ProductoEditar from './ProductoEditar';
import ProductoCategorias from './ProductoCategorias';

class ProductoRouting extends Component<RouteComponentProps> {
    render() {
        return (
            <Switch>
                <Route path={this.props.match.url} component={ProductoTabla} exact />
                <Route path={`${this.props.match.url}/registrar`} component={ProductoRegistrar} exact />
                <Route path={`${this.props.match.url}/:id/editar`} component={ProductoEditar} exact />
                <Route path={`${this.props.match.url}/:id/categorias`} component={ProductoCategorias} exact />
            </Switch>
        );
    }
}

export default withRouter(ProductoRouting);
