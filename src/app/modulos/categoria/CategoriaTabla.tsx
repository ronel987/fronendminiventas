import React, { Component } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { ICategoria } from './../../interfaces/ICategoria';
import Tabla from './../../shared/Tabla';

interface CategoriaTablaState {
    categorias: ICategoria[];
}

class CategoriaTabla extends Component<RouteComponentProps, CategoriaTablaState> {
    constructor(props: RouteComponentProps) {
        super(props);

        this.state = {
            categorias: [],
        };
    }

    componentDidMount() {
        axios.get<ICategoria[]>('http://localhost:8090/api/categorias').then((response) => {
            this.setState({
                categorias: response.data,
            });
        });
    }

    eliminarCategoria = (id: number) => {
        axios.delete(`http://localhost:8090/api/categorias/${id}`).then(() => {
            this.setState((prevState) => ({
                categorias: prevState.categorias.filter((categoria) => categoria.id !== id),
            }));
        });
    };

    render() {
        return (
            <div className="categoria-tabla">
                <header>
                    <div className="row">
                        <div className="col">
                            <h1 className="display-6">Categorias</h1>
                        </div>
                        <div className="col-auto">
                            <Link className="btn btn-primary" to={`${this.props.match.url}/registrar`}>
                                Registrar
                            </Link>
                        </div>
                    </div>
                </header>
                <Tabla
                    cabeceras={['ID', 'Nombre', 'F.Registro', 'Opciones']}
                    filas={this.state.categorias}
                    onRenderFila={(fila: ICategoria) => (
                        <tr key={fila.id}>
                            <td>{fila.id}</td>
                            <td>{fila.nombre}</td>
                            <td>{new Date(fila.fechaRegistro).toDateString()}</td>
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
                                            onClick={() => this.eliminarCategoria(fila.id)}
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

export default CategoriaTabla;
