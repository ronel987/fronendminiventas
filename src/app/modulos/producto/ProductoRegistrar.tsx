import React, { Component, FormEventHandler, ChangeEventHandler } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import { IProductoRegistrar } from './../../interfaces/IProducto';
import { ICategoria } from './../../interfaces/ICategoria';

interface ProductoRegistrarState {
    producto: IProductoRegistrar;
    categorias: ICategoria[];
    errors: {
        [key: string]: string | null;
    };
    submitted: boolean;
}

class ProductoRegistrar extends Component<RouteComponentProps, ProductoRegistrarState> {
    constructor(props: RouteComponentProps) {
        super(props);

        this.state = {
            producto: {
                nombre: '',
                marca: '',
                descripcion: '',
                precio: '0',
                stock: 0,
                estado: true,
            },
            categorias: [],
            errors: {},
            submitted: false,
        };
    }

    componentDidMount() {
        this.validarFormulario();
        axios.get<ICategoria[]>('https://apiminiventas.azurewebsites.net/api/categoria').then((response) => {
            this.setState((prevState) => ({
                ...prevState,
                categorias: response.data,
            }));
        });
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
                .post('https://apiminiventas.azurewebsites.net/api/producto', {
                    ...this.state.producto,
                    nombre: this.state.producto.nombre.trim(),
                    marca: this.state.producto.marca.trim(),
                    descripcion: this.state.producto.descripcion.trim(),
                    precio: parseFloat(this.state.producto.precio as string),
                    stock: parseInt(this.state.producto.stock as string),
                })
                .then(() => {
                    this.props.history.push('/producto');
                });
        }
    };

    handleChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement> = ({ target: { name, value } }) => {
        if (name === 'nombre') {
            this.setState((prevState) => ({
                producto: {
                    ...prevState.producto,
                    nombre: value,
                },
                errors: {
                    ...prevState.errors,
                    nombre: this.isNombreOrMarcaValid(value),
                },
            }));
        } else if (name === 'marca') {
            this.setState((prevState) => ({
                producto: {
                    ...prevState.producto,
                    marca: value,
                },
                errors: {
                    ...prevState.errors,
                    marca: this.isNombreOrMarcaValid(value),
                },
            }));
        } else if (name === 'descripcion') {
            this.setState((prevState) => ({
                producto: {
                    ...prevState.producto,
                    descripcion: value,
                },
            }));
        } else if (name === 'precio') {
            this.setState((prevState) => ({
                producto: {
                    ...prevState.producto,
                    precio: value,
                },
                errors: {
                    ...prevState.errors,
                    precio: this.isPrecioValid(value),
                },
            }));
        } else if (name === 'stock') {
            this.setState((prevState) => ({
                producto: {
                    ...prevState.producto,
                    stock: value,
                },
                errors: {
                    ...prevState.errors,
                    stock: this.isStockValid(value),
                },
            }));
        } else if (name === 'estado') {
            this.setState((prevState) => ({
                producto: {
                    ...prevState.producto,
                    estado: Boolean(parseInt(value)),
                },
            }));
        }
    };

    validarFormulario(): void {
        this.setState((prevState) => ({
            ...prevState,
            errors: {
                nombre: this.isNombreOrMarcaValid(this.state.producto.nombre),
                marca: this.isNombreOrMarcaValid(this.state.producto.marca),
                precio: this.isPrecioValid(this.state.producto.precio.toString()),
                stock: this.isStockValid(this.state.producto.stock.toString()),
            },
        }));
    }

    isNombreOrMarcaValid(nombre: string): string | null {
        if (!nombre.trim()) {
            return 'Este campo es obligatorio';
        } else if (nombre.trim().length > 50) {
            return 'Este campo debe contener 50 carácteres como máximo';
        }

        return null;
    }

    isPrecioValid(precio: string): string | null {
        if (!precio.trim()) {
            return 'Este campo es obligatorio';
        } else if (isNaN(parseFloat(precio))) {
            return 'Ingrese un número válido';
        } else if (parseFloat(precio) < 0) {
            return 'El precio debe ser un número positivo';
        } else if (!/^\d{1,8}(\.\d{1,2})?$/.test(precio.trim())) {
            return 'El precio debe contener 8 cifras y 2 decimales como máximo';
        }

        return null;
    }

    isStockValid(stock: string): string | null {
        if (!stock) {
            return 'Este campo es obligatorio';
        } else if (!/^\d+$/.test(stock.trim())) {
            return 'El stock debe ser un número entero';
        } else if (parseInt(stock) < 0) {
            return 'El stock debe ser un número mayor o igual a 0';
        }

        return null;
    }

    render() {
        return (
            <div className="producto-registrar">
                <header>
                    <h1 className="display-6">
                        <div className="row">
                            <div className="col">Registrar producto</div>
                            <div className="col-auto">
                                <Link className="btn btn-outline-secondary" to="/producto">
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
                            value={this.state.producto.nombre}
                            onChange={this.handleChange}
                        />
                        {this.state.errors.nombre && this.state.submitted && (
                            <small className="text-danger">{this.state.errors.nombre}</small>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="marca">Marca</label>
                        <input
                            id="marca"
                            name="marca"
                            className="form-control"
                            type="text"
                            value={this.state.producto.marca}
                            onChange={this.handleChange}
                        />
                        {this.state.errors.marca && this.state.submitted && (
                            <small className="text-danger">{this.state.errors.marca}</small>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="descripcion">Descripción</label>
                        <input
                            id="descripcion"
                            name="descripcion"
                            className="form-control"
                            type="text"
                            value={this.state.producto.descripcion}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="precio">Precio</label>
                        <input
                            id="precio"
                            name="precio"
                            className="form-control"
                            type="text"
                            value={this.state.producto.precio}
                            onChange={this.handleChange}
                        />
                        {this.state.errors.precio && this.state.submitted && (
                            <small className="text-danger">{this.state.errors.precio}</small>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="stock">Stock</label>
                        <input
                            id="stock"
                            name="stock"
                            className="form-control"
                            type="text"
                            value={this.state.producto.stock}
                            onChange={this.handleChange}
                        />
                        {this.state.errors.stock && this.state.submitted && (
                            <small className="text-danger">{this.state.errors.stock}</small>
                        )}
                    </div>
                    <div className="mb-3">
                        <label htmlFor="estado">Estado</label>
                        <select
                            id="estado"
                            name="estado"
                            className="form-control"
                            value={Number(this.state.producto.estado)}
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

export default ProductoRegistrar;
