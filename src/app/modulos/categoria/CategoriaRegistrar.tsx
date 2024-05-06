import React, { Component, FormEventHandler, ChangeEventHandler } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { ICategoriaRegistrar } from './../../interfaces/ICategoria';

interface CategoriaRegistrarState {
    categoria: ICategoriaRegistrar;
    errors: {
        [key: string]: string | null;
    };
    submitted: boolean;
}

class CategoriaRegistrar extends Component<RouteComponentProps, CategoriaRegistrarState> {
    constructor(props: RouteComponentProps) {
        super(props);

        this.state = {
            categoria: {
                nombre: '',
            },
            errors: {},
            submitted: false,
        };
    }

    componentDidMount() {
        this.validarFormulario();
    }

    handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        if (Object.values(this.state.errors).some((error) => error !== null)) {
            this.setState((prevState) => ({
                ...prevState,
                submitted: true,
            }));
        } else {
            axios.post('http://localhost:8090/api/categorias', this.state.categoria).then(() => {
                this.props.history.push('/categorias');
            });
        }
    };

    handleChange: ChangeEventHandler<HTMLInputElement> = ({ target: { name, value } }) => {
        if (name === 'nombre') {
            this.setState((prevState) => ({
                categoria: {
                    ...prevState.categoria,
                    nombre: value,
                },
                errors: {
                    ...prevState.errors,
                    nombre: this.isNombreValid(value),
                },
            }));
        }
    };

    validarFormulario(): void {
        this.setState((prevState) => ({
            ...prevState,
            errors: {
                nombre: this.isNombreValid(this.state.categoria.nombre),
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
            <div className="categoria-registrar">
                <header>
                    <h1 className="display-6">
                        <div className="row">
                            <div className="col">Registrar categoria</div>
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
                    </div>
                    <div>
                        <button className="btn btn-block btn-primary" type="submit">
                            Registrar
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default CategoriaRegistrar;
