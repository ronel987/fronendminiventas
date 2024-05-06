import React, { Component } from 'react';
import { Link, NavLink } from 'react-router-dom';

class Navbar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand navbar-dark bg-dark">
                <div className="container">
                    <Link className="navbar-brand" to="/">
                        <img
                            className="d-inline-block align-top"
                            src="/imagenes/store.png"
                            alt="store-icon"
                            width="30"
                            height="30"
                        />{' '}
                        Mini Ventas
                    </Link>
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <NavLink className="nav-link" activeClassName="active" to="/" exact>
                                Inicio
                            </NavLink>
                        </li>
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Navbar;
