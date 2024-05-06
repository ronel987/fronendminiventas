import React, { Component } from 'react';
import CategoriaRouting from './CategoriaRouting';

class CategoriaModulo extends Component {
    render() {
        return (
            <div className="categoria-modulo" data-testid="categoria-modulo">
                <CategoriaRouting />
            </div>
        );
    }
}

export default CategoriaModulo;
