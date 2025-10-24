import React, { Component, FormEventHandler } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
// Asumo que estas interfaces esperan números para idProducto y cantidad en la estructura final de API
import { IVentaRegistrar } from './../../interfaces/IVenta';
import { IVentaDetalleRegistrar } from './../../interfaces/IVentaDetalle';
import { IEmpleado } from './../../interfaces/IEmpleado';
import { IProducto } from './../../interfaces/IProducto';

interface CajaState {
    empleadoSeleccionadoId: string;
    empleados: IEmpleado[];
    productos: IProducto[];
    // Usamos string/number para cantidad y idProducto en el state para manejar la entrada de formularios
    ventaDetalles: IVentaDetalleRegistrar[];
    errorMessage: string; // Nuevo estado para mensajes de error
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
                    cantidad: 0, // Inicializar como número 0, pero se actualizará como string desde el input
                    subTotal: 0,
                },
            ],
            errorMessage: '',
        };
    }

    componentDidMount() {
        // Carga de datos inicial
        Promise.all<AxiosResponse<IEmpleado[]>, AxiosResponse<IProducto[]>>([
            axios.get<IEmpleado[]>('https://backminiventas20251020191423.azurewebsites.net/api/empleado'),
            axios.get<IProducto[]>('https://backminiventas20251020191423.azurewebsites.net/api/producto'),
        ]).then(([responseEmpleados, responseProductos]) => {
            this.setState((prevState) => ({
                ...prevState,
                empleados: responseEmpleados.data,
                productos: responseProductos.data,
            }));
        }).catch(error => {
            console.error('Error al cargar datos iniciales:', error);
            this.setState({ errorMessage: 'Error al cargar empleados o productos.' });
        });
    }

    handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();

        // 1. Filtrar y Mapear: Convertir tipos de string a number para el API
        const ventaDetalleFinal = this.state.ventaDetalles
            .filter((detalle) => {
                // Incluir solo si hay un producto seleccionado Y la cantidad es un número válido y positivo
                const cantidadNumerica = parseFloat(detalle.cantidad as string);
                return (
                    detalle.idProducto &&
                    !isNaN(cantidadNumerica) &&
                    cantidadNumerica > 0
                );
            })
            .map((detalle) => ({
                // *** FIX CRÍTICO: Convertir string IDs y Cantidad a NUMBER para el payload del API ***
                idProducto: parseInt(detalle.idProducto, 10), // Convertir ID de Producto (string) a int
                precioUnidad: detalle.precioUnidad,
                cantidad: parseFloat(detalle.cantidad as string), // Convertir Cantidad (string) a float
                subTotal: detalle.subTotal,
            }));

        const idEmpleado = parseInt(this.state.empleadoSeleccionadoId, 10);

        // 2. Construir el objeto final de Venta
        const venta: IVentaRegistrar = {
            idEmpleado: idEmpleado,
            ventaDetalle: ventaDetalleFinal as IVentaDetalleRegistrar[],
            total: this.state.ventaDetalles.reduce((total, ventaDetalle) => total + ventaDetalle.subTotal, 0),
            estado: true,
        };

        // 3. Validación y Envío
        if (idEmpleado && !isNaN(idEmpleado) && venta.ventaDetalle.length > 0) {
            this.setState({ errorMessage: '' }); // Limpiar error previo
            axios.post('https://backminiventas20251020191423.azurewebsites.net/api/venta', venta)
                .then(() => {
                    this.props.history.push('/venta/:id/detalle');
                })
                .catch((error) => {
                    // Manejo de error 400 del servidor
                    console.error('Error al realizar la venta:', error.response?.data || error.message);
                    this.setState({ 
                        errorMessage: `Error (Código ${error.response?.status || 'desconocido'}) al realizar la venta. Verifica la consola para detalles del servidor.`
                    });
                });
        } else {
            this.setState({ errorMessage: 'Por favor, selecciona un empleado y agrega al menos un producto con cantidad válida.' });
        }
    };

    // Lógica de cambio para el producto
    handleProductoChange = (value: string, i: number) => {
        this.setState((prevState) => {
            const producto = this.state.productos.find(
                (p) => p.id === parseInt(value)
            );
            
            // Usamos la cantidad actual del state (que es un string)
            const currentCantidad = parseFloat(prevState.ventaDetalles[i].cantidad as string);

            let ventaDetalle = {
                ...prevState.ventaDetalles[i],
                idProducto: value, // Guardar como string
                precioUnidad: producto ? producto.precio : 0,
            };

            // Cálculo de SubTotal: Usar parseFloat para la cantidad para mayor precisión
            ventaDetalle.subTotal = isNaN(currentCantidad)
                ? 0
                : parseFloat(
                      (currentCantidad * ventaDetalle.precioUnidad).toFixed(2)
                  );

            // Retornar el nuevo estado
            return {
                ...prevState,
                ventaDetalles: ([] as IVentaDetalleRegistrar[]).concat(
                    prevState.ventaDetalles.slice(0, i),
                    [ventaDetalle],
                    prevState.ventaDetalles.slice(i + 1)
                ),
            };
        });
    }

    // Lógica de cambio para la cantidad
    handleCantidadChange = (value: string, i: number) => {
        this.setState((prevState) => {
            // La cantidad ingresada (value) es un string. Convertir a float para el cálculo.
            const newCantidad = parseFloat(value);

            let ventaDetalle = {
                ...prevState.ventaDetalles[i],
                cantidad: value, // Guardar el valor del input (string) en el estado
            };

            // Cálculo de SubTotal: Usar parseFloat para la cantidad
            ventaDetalle.subTotal = isNaN(newCantidad)
                ? 0
                : parseFloat(
                      (newCantidad * ventaDetalle.precioUnidad).toFixed(2)
                  );

            // Retornar el nuevo estado
            return {
                ...prevState,
                ventaDetalles: ([] as IVentaDetalleRegistrar[]).concat(
                    prevState.ventaDetalles.slice(0, i),
                    [ventaDetalle],
                    prevState.ventaDetalles.slice(i + 1)
                ),
            };
        });
    }


    render() {
        return (
            <div className="caja">
                <header>
                    <h1 className="display-6">CAJA</h1>
                </header>
                
                {/* Mensaje de Error */}
                {this.state.errorMessage && (
                    <div className="alert alert-danger mb-3" role="alert">
                        {this.state.errorMessage}
                    </div>
                )}
                
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
                                    errorMessage: '', // Limpiar error al cambiar empleado
                                }));
                            }}
                        >
                            <option value="">--Selecciona un empleado--</option>
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
                                                    this.handleProductoChange(value, i);
                                                }}
                                            >
                                                <option value="">--Selecciona un producto--</option>
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
                                                type="number" // Asegurar que solo se permitan números en el input
                                                min="0"
                                                step="any"
                                                value={ventaDetalle.cantidad}
                                                onChange={({ target: { value } }) => {
                                                    this.handleCantidadChange(value, i);
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
                                            errorMessage: '', // Limpiar error al agregar línea
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
                                ).toFixed(2)}
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
