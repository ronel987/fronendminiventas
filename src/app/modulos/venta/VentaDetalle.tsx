import React, { Component } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { IVenta } from './../../interfaces/IVenta';
import { IVentaDetalle } from './../../interfaces/IVentaDetalle';
import Tabla from './../../shared/Tabla';

interface VentaTablaState {
    venta: IVenta | null;
}

class VentaTabla extends Component<RouteComponentProps<{ id: string }>, VentaTablaState> {
    constructor(props: RouteComponentProps<{ id: string }>) {
        super(props);

        this.state = {
            venta: null,
        };
    }

    componentDidMount() {
        axios.get<IVenta>(`http://localhost:8090/api/ventas/${this.props.match.params.id}`).then((response) => {
            this.setState({ venta: response.data });
        });
    }

    render() {
        return (
            this.state.venta && (
                <div className="venta-detalle">
                    <header>
                        <span className="badge bg-primary">VENTA</span>{' '}
                        <span className="badge bg-success">{`${this.state.venta.empleado.nombre} ${this.state.venta.empleado.apellido}`}</span>
                        <h1 className="display-6">
                            <div className="row">
                                <div className="col">{new Date(this.state.venta.fechaRegistro).toDateString()}</div>
                                <div className="col-auto">
                                    <Link className="btn btn-outline-secondary" to="/ventas">
                                        Volver
                                    </Link>
                                </div>
                            </div>
                        </h1>
                    </header>
                    <div className="mb-3">
                        <Tabla
                            cabeceras={['ID', 'Producto', 'P.Unidad', 'Cantidad', 'Subtotal']}
                            filas={this.state.venta.detalles}
                            onRenderFila={(fila: IVentaDetalle) => (
                                <tr key={fila.id}>
                                    <td>{fila.id}</td>
                                    <td>{fila.producto.nombre}</td>
                                    <td>S/. {fila.precioUnidad}</td>
                                    <td>{fila.cantidad}</td>
                                    <td>S/. {fila.subTotal}</td>
                                </tr>
                            )}
                        />
                    </div>
                    <div className="card card-body mb-3">
                        <p className="text-end mb-0">TOTAL: S/. {this.state.venta.total}</p>
                    </div>
                </div>
            )
        );
    }
}

export default VentaTabla;
