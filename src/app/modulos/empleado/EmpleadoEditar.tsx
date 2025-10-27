import React, { Component, FormEventHandler, ChangeEventHandler } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { IEmpleadoRegistrar } from './../../interfaces/IEmpleado';

interface RouteParams {
    id: string;
}

interface EmpleadoEditarState {
    empleado: IEmpleadoRegistrar;
    errors: {
        [key: string]: string | null;
    };
    submitted: boolean;
    loading: boolean;
}

class EmpleadoEditar extends Component<RouteComponentProps<RouteParams>, EmpleadoEditarState> {
    constructor(props: RouteComponentProps<RouteParams>) {
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
            loading: true,
        };
    }

    componentDidMount() {
        const { id } = this.props.match.params;
        axios
            .get<IEmpleadoRegistrar>(`https://backminiventas20251020191423.azurewebsites.net/api/empleado/${id}`)
            .then((response) => {
                this.setState({
                    empleado: response.data,
                    loading: false,
                });
                this.validarFormulario();
            })
            .catch(() => {
                alert('Error al cargar el empleado');
                this.props.history.push('/empleado');
            });
    }

    handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
        event.preventDefault();
        this.validarFormulario();

        if (Object.values(this.state.errors).some((error) => error !== null)) {
            this.setState({ submitted: true });
        } else {
            axios
                .put(
                    `https://backminiventas20251020191423.azurewebsites.net/api/empleado/${this.state.empleado.id}`,
                    {
                        ...this.state.empleado,
                        nombre: this.state.empleado.nombre.trim(),
                        apellido: this.state.empleado.apellido.trim(),
                        telefono: this.state.empleado.telefono.trim(),
                        correo: this.state.empleado.correo.trim(),
                    }
                )
                .then(() => {
                    this.props.history.push('/empleado');
                })
                .catch(() => alert('Error al actualizar el empleado'));
        }
    };

    handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = ({ target: { name, value } }) => {
        const validarCampo = (campo: string, valor: string): string | null => {
            switch (campo) {
                case 'nombre': return this.isNombreValid(valor);
                case 'apellido': return this.isApellidoValid(valor);
                case 'alias': return this.isAliasValid(valor);
                case 'clave': return this.isClaveValid(valor);
                case 'telefono': return this.isTelefonoValid(valor);
                case 'correo': return this.isCorreoValid(valor);
                default: return null;
            }
        };

        this.setState((prevState) => ({
            empleado: {
                ...prevState.empleado,
                [name]: name === 'estado' ? Boolean(parseInt(value)) : value,
            },
            errors: {
                ...prevState.errors,
                [name]: validarCampo(name, value),
            },
        }));
    };

    validarFormulario(): void {
        const e = this.state.empleado;
        this.setState({
            errors: {
                id: this.isIdValid(e.id),
                nombre: this.isNombreValid(e.nombre),
                apellido: this.isApellidoValid(e.apellido),
                alias: this.isAliasValid(e.alias),
                clave: this.isClaveValid(e.clave),
                telefono: this.isTelefonoValid(e.telefono),
                correo: this.isCorreoValid(e.correo),
            },
        });
    }

    // === VALIDACIONES ===

    isIdValid(id: string): string | null {
        if (!id) return 'Este campo es obligatorio';
        else if (!/^\d{8}$/.test(id)) return 'El número de DNI debe contener 8 dígitos';
        return null;
    }

    isNombreValid(nombre: string): string | null {
        if (!nombre) return 'Este campo es obligatorio';
        else if (!/^[A-Záéíóú\s]{3,50}$/i.test(nombre.trim()))
            return 'El nombre debe contener letras y tener entre 3 y 50 caracteres';
        return null;
    }

    isApellidoValid(nombre: string): string | null {
        if (!nombre) return 'Este campo es obligatorio';
        else if (!/^[A-Záéíóú\s]{3,50}$/i.test(nombre.trim()))
            return 'El apellido debe contener letras y tener entre 3 y 50 caracteres';
        return null;
    }

    isAliasValid(alias: string): string | null {
        if (!alias) return 'Este campo es obligatorio';
        else if (!/^\w{3,12}$/.test(alias))
            return 'El alias debe tener entre 3 y 12 caracteres alfanuméricos';
        return null;
    }

    isClaveValid(clave: string): string | null {
        if (!clave) return 'Este campo es obligatorio';
        else if (!/^(?=.*[A-Za-z])(?=.*[0-9])[A-Z0-9]{8,20}$/i.test(clave))
            return 'La clave debe tener 8-20 caracteres, una letra y un número';
        return null;
    }

    isTelefonoValid(telefono: string): string | null {
        if (!telefono) return 'Este campo es obligatorio';
        else if (!/^\d{9}$/.test(telefono))
            return 'El teléfono debe tener 9 dígitos';
        return null;
    }

    isCorreoValid(correo: string): string | null {
        if (!correo) return 'Este campo es obligatorio';
        else if (!/^(\w\.)*\w+@([a-zA-Z0-9]+\.)+[a-zA-Z0-9]{2,3}$/.test(correo))
            return 'Ingrese un correo válido';
        return null;
    }

    render() {
        if (this.state.loading) {
            return <div>Cargando empleado...</div>;
        }

        return (
            <div className="empleado-editar">
                <header>
                    <h1 className="display-6">
                        <div className="row">
                            <div className="col">Editar empleado</div>
                            <div className="col-auto">
                                <Link className="btn btn-outline-secondary" to="/empleado">
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
                            disabled
                        />
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
                        <label htmlFor="telefono">Teléfono</label>
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
                            Actualizar
                        </button>
                    </div>
                </form>
            </div>
        );
    }
}

export default EmpleadoEditar;
