import React, { Component, FormEventHandler } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { IVentaRegistrar } from './../../interfaces/IVenta';
import { IVentaDetalleRegistrar } from './../../interfaces/IVentaDetalle';
import { IEmpleado } from './../../interfaces/IEmpleado';
import { IProducto } from './../../interfaces/IProducto';

interface CajaState {
    empleadoSeleccionadoId: string;
    empleados: IEmpleado[];
    productos: IProducto[];
    ventaDetalles: IVentaDetalleRegistrar[];
}

class Caja extends Component<RouteComponentProps, CajaState> {
    constructor(props: RouteComponentProps) {
        super(props);

        this.state = {
            empleadoSeleccionadoId: '',
            empleados: [],
            productos: [],
            ventaDetalles: [
                {
                    idProducto: '',
                    precioUnidad: 0,
                    cantidad: 0,
                    subTotal: 0,
                },
            ],
        };
    }

    componentDidMount() {
        Promise.all<AxiosResponse<IEmpleado[]>, AxiosResponse<IProducto[]>>([
            axios.get<IEmpleado[]>('http://localhost:8090/api/empleados'),
            axios.get<IProducto[]>('http://localhost:8090/api/productos'),
        ]).then(([responseEmpleados, responseProductos]) => {
            this.setState((prevState) => ({
                ...prevState,
                empleados: responseEmpleados.data,
                productos: responseProductos.data,
            }));
        });
    }

    handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        const venta: IVentaRegistrar = {
            idEmpleado: parseInt(this.state.empleadoSeleccionadoId),
            ventaDetalle: this.state.ventaDetalles.filter(
                (ventaDetalle) => ventaDetalle.idProducto && !isNaN(ventaDetalle.cantidad as number)
            ),
            total: this.state.ventaDetalles.reduce((total, ventaDetalle) => total + ventaDetalle.subTotal, 0),
            estado: true,
        };

        if (venta.ventaDetalle.length > 0) {
            axios.post('http://localhost:8090/api/ventas', venta).then(() => {
                this.props.history.push('/ventas/:id/detalle');
            });
        }
    };

    render() {
        return (
            <div className="caja">
                <header>
                    <h1 className="display-6">CAJA</h1>
                </header>
                <div className="row gx-2 mb-3">
                    <div className="col-auto">
                        <label htmlFor="empleado">Empleado</label>
                        <select
                            id="empleado"
                            name="empleado"
                            className="form-control"
                            value={this.state.empleadoSeleccionadoId}
                            onChange={({ target: { value } }) => {
                                this.setState((prevState) => ({
                                    ...prevState,
                                    empleadoSeleccionadoId: value,
                                }));
                            }}
                        >
                            <option value="">--Seleciona un empleado--</option>
                            {this.state.empleados.map((empleado) => (
                                <option
                                    key={empleado.id}
                                    value={empleado.id}
                                >{`${empleado.nombre} ${empleado.apellido}`}</option>
                            ))}
                        </select>
                    </div>
                </div>
                {this.state.empleadoSeleccionadoId && (
                    <form autoComplete="off" onSubmit={this.handleSubmit} noValidate>
                        {this.state.ventaDetalles.map((ventaDetalle, i) => (
                            <div key={i} className="card mb-3">
                                <div className="card-header">#{i + 1}</div>
                                <div className="card-body">
                                    <div className="row gx-2">
                                        <div className="col-3">
                                            <label htmlFor={`producto${i}`}>Producto</label>
                                            <select
                                                id={`producto${i}`}
                                                name="producto"
                                                className="form-control"
                                                value={ventaDetalle.idProducto}
                                                onChange={({ target: { value } }) => {
                                                    this.setState((prevState) => {
                                                        const producto = this.state.productos.find(
                                                            (producto) => producto.id === parseInt(value)
                                                        );
                                                        let ventaDetalle = {
                                                            ...this.state.ventaDetalles[i],
                                                            idProducto: value,
                                                        };

                                                        if (producto) {
                                                            ventaDetalle.precioUnidad = producto.precio;
                                                            ventaDetalle.subTotal = isNaN(
                                                                parseInt(ventaDetalle.cantidad as string)
                                                            )
                                                                ? 0
                                                                : parseFloat(
                                                                      (
                                                                          parseInt(ventaDetalle.cantidad as string) *
                                                                          producto.precio
                                                                      ).toFixed(2)
                                                                  );
                                                        } else {
                                                            ventaDetalle.precioUnidad = 0;
                                                            ventaDetalle.subTotal = 0;
                                                        }

                                                        return {
                                                            ...prevState,
                                                            ventaDetalles: ([] as IVentaDetalleRegistrar[]).concat(
                                                                prevState.ventaDetalles.slice(0, i),
                                                                [ventaDetalle],
                                                                prevState.ventaDetalles.slice(i + 1)
                                                            ),
                                                        };
                                                    });
                                                }}
                                            >
                                                <option value="">--Seleciona un producto--</option>
                                                {this.state.productos.map((producto) => (
                                                    <option key={producto.id} value={producto.id}>
                                                        {producto.nombre}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-3">
                                            <label htmlFor={`precio-unidad${i}`}>Precio</label>
                                            <input
                                                id={`precio-unidad${i}`}
                                                name="precio-unidad"
                                                className="form-control"
                                                value={ventaDetalle.precioUnidad}
                                                disabled
                                            />
                                        </div>
                                        <div className="col-3">
                                            <label htmlFor={`cantidad${i}`}>Cantidad</label>
                                            <input
                                                id={`cantidad${i}`}
                                                name="cantidad"
                                                className="form-control"
                                                value={ventaDetalle.cantidad}
                                                onChange={({ target: { value } }) => {
                                                    this.setState((prevState) => {
                                                        let ventaDetalle = {
                                                            ...this.state.ventaDetalles[i],
                                                            cantidad: value,
                                                        };
                                                        ventaDetalle.subTotal = isNaN(
                                                            parseInt(ventaDetalle.cantidad as string)
                                                        )
                                                            ? 0
                                                            : parseFloat(
                                                                  (
                                                                      parseInt(ventaDetalle.cantidad as string) *
                                                                      ventaDetalle.precioUnidad
                                                                  ).toFixed(2)
                                                              );

                                                        return {
                                                            ...prevState,
                                                            ventaDetalles: ([] as IVentaDetalleRegistrar[]).concat(
                                                                prevState.ventaDetalles.slice(0, i),
                                                                [ventaDetalle],
                                                                prevState.ventaDetalles.slice(i + 1)
                                                            ),
                                                        };
                                                    });
                                                }}
                                            />
                                        </div>
                                        <div className="col-3">
                                            <label htmlFor={`subtotal${i}`}>Subtotal</label>
                                            <input
                                                id={`subtotal${i}`}
                                                name="subtotal"
                                                className="form-control"
                                                value={ventaDetalle.subTotal}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                </div>
                                {i > 0 && (
                                    <div className="card-footer">
                                        <div className="row">
                                            <div className="col"></div>
                                            <div className="col-auto">
                                                <button
                                                    className="btn btn-sm btn-outline-danger"
                                                    type="button"
                                                    onClick={() => {
                                                        this.setState((prevState) => ({
                                                            ...prevState,
                                                            ventaDetalles: prevState.ventaDetalles.filter(
                                                                (_, index) => index !== i
                                                            ),
                                                        }));
                                                    }}
                                                >
                                                    Remover
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                        <div className="row mb-3">
                            <div className="col"></div>
                            <div className="col-auto">
                                <button
                                    className="btn btn-info"
                                    type="button"
                                    onClick={() => {
                                        this.setState((prevState) => ({
                                            ...prevState,
                                            ventaDetalles: [
                                                ...prevState.ventaDetalles,
                                                {
                                                    idProducto: '',
                                                    precioUnidad: 0,
                                                    cantidad: 0,
                                                    subTotal: 0,
                                                },
                                            ],
                                        }));
                                    }}
                                >
                                    NUEVO DETALLE
                                </button>
                            </div>
                        </div>
                        <div className="card card-body mb-3">
                            <p className="text-end mb-0">
                                TOTAL:{' S/. '}
                                {this.state.ventaDetalles.reduce(
                                    (total, ventaDetalle) => total + ventaDetalle.subTotal,
                                    0
                                )}
                            </p>
                        </div>
                        <button className="btn btn-primary w-100" type="submit">
                            REALIZAR VENTA
                        </button>
                    </form>
                )}
            </div>
        );
    }
}

export default Caja;
