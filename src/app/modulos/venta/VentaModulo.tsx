import React, { Component } from 'react';
import VentaRouting from './VentaRouting';

class VentaModulo extends Component {
    render() {
        return (
            <div className="venta-modulo" data-testid="venta-modulo">
                <VentaRouting />
            </div>
        );
    }
}

export default VentaModulo;
