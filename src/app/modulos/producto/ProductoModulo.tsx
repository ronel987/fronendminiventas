import React, { Component } from 'react';
import ProductoRouting from './ProductoRouting';

class ProductoModulo extends Component {
    render() {
        return (
            <div className="producto-modulo" data-testid="producto-modulo">
                <ProductoRouting />
            </div>
        );
    }
}

export default ProductoModulo;
