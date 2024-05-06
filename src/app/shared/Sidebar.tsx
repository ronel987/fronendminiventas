import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class Sidebar extends Component {
    render() {
        return (
            <nav className="sidebar">
                <ul className="list-group">
                    <li className="list-group-item list-group-item-light">
                        <h3 className="mb-0">Modulos</h3>
                    </li>
                    <NavLink
                        className="list-group-item list-group-item-action"
                        activeClassName="active"
                        to="/caja"
                    >
                        Caja
                    </NavLink>
                    <NavLink
                        className="list-group-item list-group-item-action"
                        activeClassName="active"
                        to="/ventas"
                    >
                        Ventas
                    </NavLink>
                    <NavLink
                        className="list-group-item list-group-item-action"
                        activeClassName="active"
                        to="/productos"
                    >
                        Productos
                    </NavLink>
                    <NavLink
                        className="list-group-item list-group-item-action"
                        activeClassName="active"
                        to="/categorias"
                    >
                        Categorias
                    </NavLink>
                    <NavLink
                        className="list-group-item list-group-item-action"
                        activeClassName="active"
                        to="/empleados"
                    >
                        Empleados
                    </NavLink>
                </ul>
            </nav>
        );
    }
}

export default Sidebar;
