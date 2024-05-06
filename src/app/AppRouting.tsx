import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import InicioPagina from './paginas/InicioPagina';
import CajaModulo from './modulos/caja/CajaModulo';
import VentaModulo from './modulos/venta/VentaModulo';
import ProductoModulo from './modulos/producto/ProductoModulo';
import CategoriaModulo from './modulos/categoria/CategoriaModulo';
import EmpleadoModulo from './modulos/empleado/EmpleadoModulo';

class AppRouting extends Component {
    render() {
        return (
            <Switch>
                <Route path="/" component={InicioPagina} exact />
                <Route path="/caja" component={CajaModulo} />
                <Route path="/ventas" component={VentaModulo} />
                <Route path="/productos" component={ProductoModulo} />
                <Route path="/categorias" component={CategoriaModulo} />
                <Route path="/empleados" component={EmpleadoModulo} />
            </Switch>
        );
    }
}

export default AppRouting;
