import React, { Component } from 'react';

class InicioPagina extends Component {
    render() {
        return (
            <div className="inicio-pagina">
                <header>
                    <h1 className="display-5">Bienvenido a Mini Ventas</h1>
                </header>
                <img className="img-thumbnail" src="/imagenes/homepage-img.webP" alt="store" />
            </div>
        );
    }
}

export default InicioPagina;
