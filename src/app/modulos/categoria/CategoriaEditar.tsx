import React, { Component, FormEventHandler, ChangeEventHandler } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { ICategoria } from './../../interfaces/ICategoria';

interface CategoriaEditarState {
    categoria: ICategoria | null;
    errors: {
        [key: string]: string | null;
    };
    submitted: boolean;
}

class CategoriaEditar extends Component<RouteComponentProps<{ id: string }>, CategoriaEditarState> {
    constructor(props: RouteComponentProps<{ id: string }>) {
        super(props);

        this.state = {
            categoria: null,
            errors: {},
            submitted: false,
        };
    }

    componentDidMount() {
        axios.get<ICategoria>(`http://localhost:8090/api/categorias/${this.props.match.params.id}`).then((response) => {
            this.setState((prevState) => ({
                ...prevState,
                categoria: response.data,
            }));
        });
    }

    componentDidUpdate(props: any, prevState: any) {
        if (this.state.categoria !== prevState.categoria) {
            this.validarFormulario();
        }
    }

    handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (Object.values(this.state.errors).some((error) => error !== null)) {
            this.setState((prevState) => ({
                ...prevState,
                submitted: true,
            }));
        } else {
            axios
                .put(`http://localhost:8090/api/categorias/${this.state.categoria!.id}`, this.state.categoria)
                .then(() => {
                    this.props.history.push('/categorias');
                });
        }
    };

    handleChange: ChangeEventHandler<HTMLInputElement> = ({ target: { name, value } }) => {
        if (name === 'nombre') {
            this.setState((prevState) => ({
                categoria: {
                    ...prevState.categoria!,
                    nombre: value,
                },
            }));
        }
    };

    validarFormulario(): void {
        this.setState((prevState) => ({
            ...prevState,
            errors: {
                nombre: this.isNombreValid(this.state.categoria!.nombre),
            },
        }));
    }

    isNombreValid(nombre: string): string | null {
        if (!nombre) {
            return 'Este campo es obligatario';
        } else if (nombre.trim().length > 50) {
            return 'Este campo debe contener 50 carácteres como máximo';
        }

        return null;
    }

    render() {
        return (
            this.state.categoria && (
                <div className="categoria-registrar">
                    <header>
                        <span className="badge bg-primary">CATEGORIA</span>
                        <h1 className="display-6">
                            <div className="row">
                                <div className="col">{this.state.categoria.id}</div>
                                <div className="col-auto">
                                    <Link className="btn btn-outline-secondary" to="/categorias">
                                        Volver
                                    </Link>
                                </div>
                            </div>
                        </h1>
                    </header>
                    <form autoComplete="off" onSubmit={this.handleSubmit} noValidate>
                        <div className="mb-3">
                            <label htmlFor="nombre">Nombre</label>
                            <input
                                id="nombre"
                                name="nombre"
                                className="form-control"
                                type="text"
                                value={this.state.categoria.nombre}
                                onChange={this.handleChange}
                            />
                            {this.state.errors.nombre && this.state.submitted && (
                                <small className="text-danger">{this.state.errors.nombre}</small>
                            )}
                        </div>
                        <div>
                            <button className="btn btn-block btn-success" type="submit">
                                Guardar cambios
                            </button>
                        </div>
                    </form>
                </div>
            )
        );
    }
}

export default CategoriaEditar;
