import React, { Component, FormEventHandler, ChangeEventHandler } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { IEmpleadoRegistrar } from './../../interfaces/IEmpleado';

interface EmpleadoRegistrarState {
    empleado: IEmpleadoRegistrar;
    errors: {
        [key: string]: string | null;
    };
    submitted: boolean;
}

class EmpleadoRegistrar extends Component<RouteComponentProps, EmpleadoRegistrarState> {
    constructor(props: RouteComponentProps) {
        super(props);

        this.state = {
            empleado: {
                id: '',
                nombre: '',
                apellido: '',
                alias: '',
                clave: '',
                telefono: '',
                correo: '',
                estado: true,
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
            axios
                .post('http://localhost:8090/api/empleados', {
                    ...this.state.empleado,
                    nombre: this.state.empleado.nombre.trim(),
                    apellido: this.state.empleado.apellido.trim(),
                    telefono: this.state.empleado.telefono.trim(),
                    correo: this.state.empleado.correo.trim(),
                })
                .then(() => {
                    this.props.history.push('/empleados');
                });
        }
    };

    handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = ({ target: { name, value } }) => {
        if (name === 'id') {
            this.setState((prevState) => ({
                empleado: {
                    ...prevState.empleado,
                    id: value,
                },
                errors: {
                    ...prevState.errors,
                    id: this.isIdValid(value),
                },
            }));
        } else if (name === 'nombre') {
            this.setState((prevState) => ({
                empleado: {
                    ...prevState.empleado,
                    nombre: value,
                },
                errors: {
                    ...prevState.errors,
                    nombre: this.isNombreValid(value),
                },
            }));
        } else if (name === 'apellido') {
            this.setState((prevState) => ({
                empleado: {
                    ...prevState.empleado,
                    apellido: value,
                },
                errors: {
                    ...prevState.errors,
                    apellido: this.isApellidoValid(value),
                },
            }));
        } else if (name === 'alias') {
            this.setState((prevState) => ({
                empleado: {
                    ...prevState.empleado,
                    alias: value,
                },
                errors: {
                    ...prevState.errors,
                    alias: this.isAliasValid(value),
                },
            }));
        } else if (name === 'clave') {
            this.setState((prevState) => ({
                empleado: {
                    ...prevState.empleado,
                    clave: value,
                },
                errors: {
                    ...prevState.errors,
                    clave: this.isClaveValid(value),
                },
            }));
        } else if (name === 'telefono') {
            this.setState((prevState) => ({
                empleado: {
                    ...prevState.empleado,
                    telefono: value,
                },
                errors: {
                    ...prevState.errors,
                    telefono: this.isTelefonoValid(value),
                },
            }));
        } else if (name === 'correo') {
            this.setState((prevState) => ({
                empleado: {
                    ...prevState.empleado,
                    correo: value,
                },
                errors: {
                    ...prevState.errors,
                    correo: this.isCorreoValid(value),
                },
            }));
        } else if (name === 'estado') {
            this.setState((prevState) => ({
                empleado: {
                    ...prevState.empleado,
                    estado: Boolean(parseInt(value)),
                },
            }));
        }
    };

    validarFormulario(): void {
        this.setState((prevState) => ({
            ...prevState,
            errors: {
                id: this.isIdValid(this.state.empleado.id),
                nombre: this.isNombreValid(this.state.empleado.nombre),
                apellido: this.isApellidoValid(this.state.empleado.apellido),
                alias: this.isAliasValid(this.state.empleado.alias),
                clave: this.isClaveValid(this.state.empleado.clave),
                telefono: this.isTelefonoValid(this.state.empleado.telefono),
                correo: this.isCorreoValid(this.state.empleado.correo),
            },
        }));
    }

    isIdValid(id: string): string | null {
        if (!id) {
            return 'Este campo es obligatario';
        } else if (!/^\d{8}$/.test(id)) {
            return 'El número de DNI debe contener 8 dígitos';
        }

        return null;
    }

    isNombreValid(nombre: string): string | null {
        if (!nombre) {
            return 'Este campo es obligatario';
        } else if (!/^[A-Záéíóú\s]{3,50}$/i.test(nombre.trim())) {
            return 'El nombre debe contener carácteres alfabéticos y debe estar entre 3 y 50 carácteres';
        }

        return null;
    }

    isApellidoValid(nombre: string): string | null {
        if (!nombre) {
            return 'Este campo es obligatario';
        } else if (!/^[A-Záéíóú\s]{3,50}$/i.test(nombre.trim())) {
            return 'El apellido debe contener carácteres alfabéticos y debe estar entre 3 y 50 carácteres';
        }

        return null;
    }

    isAliasValid(alias: string): string | null {
        if (!alias) {
            return 'Este campo es obligatario';
        } else if (!/^\w{3,12}$/.test(alias)) {
            return 'El alias debe contener carácteres alfanuméricos y debe estar entre 3 y 12 carácteres';
        }

        return null;
    }

    isClaveValid(clave: string): string | null {
        if (!clave) {
            return 'Este campo es obligatario';
        } else if (!/^(?=.*[A-Za-z])(?=.*[0-9])[A-Z0-9]{8,20}$/i.test(clave)) {
            return 'La clave debe contener entre 8 y 20 carácteres, una letra y un número';
        }

        return null;
    }

    isTelefonoValid(telefono: string): string | null {
        if (!telefono) {
            return 'Este campo es obligatario';
        } else if (!/\d{9}$/.test(telefono)) {
            return 'El número de teléfono debe contener 9 dígitos';
        }

        return null;
    }

    isCorreoValid(correo: string): string | null {
        if (!correo) {
            return 'Este campo es obligatario';
        } else if (!/^(\w\.)*\w+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,3}$/.test(correo)) {
            return 'Ingrese un correo electrónico válido';
        }

        return null;
    }

    render() {
        return (
            <div className="empleado-registrar">
                <header>
                    <h1 className="display-6">
                        <div className="row">
                            <div className="col">Registrar empleado</div>
                            <div className="col-auto">
                                <Link className="btn btn-outline-secondary" to="/empleados">
                                    Volver
                                </Link>
                            </div>
                        </div>
                    </h1>
                </header>
                <form autoComplete="off" onSubmit={this.handleSubmit} noValidate>
                    <div className="mb-3">
                        <label htmlFor="id">DNI</label>
                        <input
                            id="id"
                            name="id"
                            className="form-control"
                            type="text"
                            value={this.state.empleado.id}
                            onChange={this.handleChange}
                        />
                        {this.state.errors.id && this.state.submitted && (
                            <small className="text-danger">{this.state.errors.id}</small>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="nombre">Nombre</label>
                        <input
                            id="nombre"
                            name="nombre"
                            className="form-control"
                            type="text"
                            value={this.state.empleado.nombre}
                            onChange={this.handleChange}
                        />
                        {this.state.errors.nombre && this.state.submitted && (
                            <small className="text-danger">{this.state.errors.nombre}</small>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="apellido">Apellido</label>
                        <input
                            id="apellido"
                            name="apellido"
                            className="form-control"
                            type="text"
                            value={this.state.empleado.apellido}
                            onChange={this.handleChange}
                        />
                        {this.state.errors.apellido && this.state.submitted && (
                            <small className="text-danger">{this.state.errors.apellido}</small>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="alias">Alias</label>
                        <input
                            id="alias"
                            name="alias"
                            className="form-control"
                            type="text"
                            value={this.state.empleado.alias}
                            onChange={this.handleChange}
                        />
                        {this.state.errors.alias && this.state.submitted && (
                            <small className="text-danger">{this.state.errors.alias}</small>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="clave">Clave</label>
                        <input
                            id="clave"
                            name="clave"
                            className="form-control"
                            type="password"
                            value={this.state.empleado.clave}
                            onChange={this.handleChange}
                        />
                        {this.state.errors.clave && this.state.submitted && (
                            <small className="text-danger">{this.state.errors.clave}</small>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="telefono">Telefono</label>
                        <input
                            id="telefono"
                            name="telefono"
                            className="form-control"
                            type="text"
                            value={this.state.empleado.telefono}
                            onChange={this.handleChange}
                        />
                        {this.state.errors.telefono && this.state.submitted && (
                            <small className="text-danger">{this.state.errors.telefono}</small>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="correo">Correo</label>
                        <input
                            id="correo"
                            name="correo"
                            className="form-control"
                            type="text"
                            value={this.state.empleado.correo}
                            onChange={this.handleChange}
                        />
                        {this.state.errors.correo && this.state.submitted && (
                            <small className="text-danger">{this.state.errors.correo}</small>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="estado">Estado</label>
                        <select
                            id="estado"
                            name="estado"
                            className="form-control"
                            value={Number(this.state.empleado.estado)}
                            onChange={this.handleChange}
                        >
                            <option value="1">HABILITADO</option>
                            <option value="0">DESHABILITADO</option>
                        </select>
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

export default EmpleadoRegistrar;
