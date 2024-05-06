import React, { Component } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { IVenta } from './../../interfaces/IVenta';
import Tabla from './../../shared/Tabla';

interface VentaTablaState {
    ventas: IVenta[];
}

class VentaTabla extends Component<RouteComponentProps, VentaTablaState> {
    constructor(props: RouteComponentProps) {
        super(props);

        this.state = {
            ventas: [],
        };
    }

    componentDidMount() {
        axios.get<IVenta[]>('http://localhost:8090/api/ventas').then((response) => {
            this.setState({ ventas: response.data });
        });
    }

    eliminarVenta = (id: number) => {
        axios.delete(`http://localhost:8090/api/ventas/${id}`).then(() => {
            this.setState((prevState) => ({
                ventas: prevState.ventas.filter((venta) => venta.id !== id),
            }));
        });
    };

    render() {
        return (
            <div className="venta-tabla">
                <header>
                    <h1 className="display-6">Ventas</h1>
                </header>
                <Tabla
                    cabeceras={['ID', 'Empleado ID', 'Total', 'F.Registro', 'Estado', 'Opciones']}
                    filas={this.state.ventas}
                    onRenderFila={(fila: IVenta) => (
                        <tr key={fila.id}>
                            <td>{fila.id}</td>
                            <td>{fila.empleado.id}</td>
                            <td>S/. {fila.total}</td>
                            <td>{new Date(fila.fechaRegistro).toDateString()}</td>
                            <td>{fila.estado ? 'HABILITADO' : 'DESHABILITADO'}</td>
                            <td>
                                <Link className="btn btn-primary" to={`${this.props.match.url}/${fila.id}/detalle`}>
                                    Detalle
                                </Link>
                            </td>
                        </tr>
                    )}
                />
            </div>
        );
    }
}

export default VentaTabla;
