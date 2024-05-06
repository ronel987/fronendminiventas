import React, { Component } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { IEmpleado } from './../../interfaces/IEmpleado';
import Tabla from './../../shared/Tabla';

interface EmpleadoTablaState {
    empleados: IEmpleado[];
}

class EmpleadoTabla extends Component<RouteComponentProps, EmpleadoTablaState> {
    constructor(props: RouteComponentProps) {
        super(props);

        this.state = {
            empleados: [],
        };
    }

    componentDidMount() {
        axios.get<IEmpleado[]>('http://localhost:8090/api/empleados').then((response) => {
            this.setState({ empleados: response.data });
        });
    }

    eliminarEmpleado = (id: string) => {
        axios.delete(`http://localhost:8090/api/empleados/${id}`).then(() => {
            this.setState((prevState) => ({
                empleados: prevState.empleados.filter((empleado) => empleado.id !== id),
            }));
        });
    };

    render() {
        return (
            <div className="empleado-tabla">
                <header>
                    <div className="row">
                        <div className="col">
                            <h1 className="display-6">Empleados</h1>
                        </div>
                        <div className="col-auto">
                            <Link className="btn btn-primary" to={`${this.props.match.url}/registrar`}>
                                Registrar
                            </Link>
                        </div>
                    </div>
                </header>
                <Tabla
                    cabeceras={['ID', 'Nombre', 'Apellido', 'Telefono', 'Correo', 'F.Registro', 'Estado', 'Opciones']}
                    filas={this.state.empleados}
                    onRenderFila={(fila: IEmpleado) => (
                        <tr key={fila.id}>
                            <td>{fila.id}</td>
                            <td>{fila.nombre}</td>
                            <td>{fila.apellido}</td>
                            <td>{fila.telefono}</td>
                            <td>{fila.correo}</td>
                            <td>{new Date(fila.fechaRegistro).toDateString()}</td>
                            <td>{fila.estado ? 'HABILITADO' : 'DESHABILITADO'}</td>
                            <td>
                                <div className="row gx-2">
                                    <div className="col-auto">
                                        <Link
                                            className="btn btn-success"
                                            to={`${this.props.match.url}/${fila.id}/editar`}
                                        >
                                            Editar
                                        </Link>
                                    </div>
                                    <div className="col-auto">
                                        <button
                                            className="btn btn-outline-danger"
                                            type="button"
                                            onClick={() => this.eliminarEmpleado(fila.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    )}
                />
            </div>
        );
    }
}

export default EmpleadoTabla;
