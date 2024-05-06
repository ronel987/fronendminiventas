import React, { Component } from 'react';
import EmpleadoRouting from './EmpleadoRouting';

class EmpleadoModulo extends Component {
    render() {
        return (
            <div className="empleado-modulo" data-testid="empleado-modulo">
                <EmpleadoRouting />
            </div>
        );
    }
}

export default EmpleadoModulo;
