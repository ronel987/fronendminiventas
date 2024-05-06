import React, { Component, ReactElement, HTMLProps } from 'react';

interface TablaProps {
    cabeceras: string[];
    filas: any[];
    onRenderFila: (item: any) => ReactElement<HTMLProps<HTMLTableRowElement>>;
}

class Tabla extends Component<TablaProps> {
    render() {
        return (
            <table className="table table-bordered table-striped">
                <thead>
                    <tr>
                        {this.props.cabeceras.map((cabecera, i) => (
                            <th key={i} scope="col">
                                {cabecera}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {this.props.filas.map((fila) =>
                        this.props.onRenderFila(fila)
                    )}
                </tbody>
            </table>
        );
    }
}

export default Tabla;
