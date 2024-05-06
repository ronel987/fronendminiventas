import React, { Component } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { IProducto } from './../../interfaces/IProducto';
import Tabla from './../../shared/Tabla';

interface ProductoTablaState {
    productos: IProducto[];
}

class ProductoTabla extends Component<RouteComponentProps, ProductoTablaState> {
    constructor(props: RouteComponentProps) {
        super(props);

        this.state = {
            productos: [],
        };
    }

    componentDidMount() {
        axios.get<IProducto[]>('http://localhost:8090/api/productos').then((response) => {
            this.setState({ productos: response.data });
        });
    }

    eliminarProducto = (id: number) => {
        axios.delete(`http://localhost:8090/api/productos/${id}`).then(() => {
            this.setState((prevState) => ({
                productos: prevState.productos.filter((producto) => producto.id !== id),
            }));
        });
    };

    render() {
        return (
            <div className="producto-tabla">
                <header>
                    <div className="row">
                        <div className="col">
                            <h1 className="display-6">Productos</h1>
                        </div>
                        <div className="col-auto">
                            <Link className="btn btn-primary" to={`${this.props.match.url}/registrar`}>
                                Registrar
                            </Link>
                        </div>
                    </div>
                </header>
                <Tabla
                    cabeceras={['ID', 'Nombre', 'Descripción', 'Precio', 'F.Registro', 'Estado', 'Opciones']}
                    filas={this.state.productos}
                    onRenderFila={(fila: IProducto) => (
                        <tr key={fila.id}>
                            <td>{fila.id}</td>
                            <td>{fila.nombre}</td>
                            <td>{fila.descripcion}</td>
                            <td>S/. {fila.precio}</td>
                            <td>{new Date(fila.fechaRegistro).toDateString()}</td>
                            <td>{fila.estado ? 'HABILITADO' : 'DESHABILITADO'}</td>
                            <td>
                                <div className="row gx-2">
                                    <div className="col-auto">
                                        <Link
                                            className="btn btn-primary"
                                            to={`${this.props.match.url}/${fila.id}/categorias`}
                                        >
                                            Categorias
                                        </Link>
                                    </div>
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
                                            onClick={() => this.eliminarProducto(fila.id)}
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

export default ProductoTabla;
