import { IEmpleado } from './IEmpleado';
import { IVentaDetalle, IVentaDetalleRegistrar } from './IVentaDetalle';

export interface IVenta {
    id: number;
    empleado: IEmpleado;
    detalles: IVentaDetalle[];
    total: number;
    fechaRegistro: Date | number;
    estado: boolean;
}

export interface IVentaRegistrar {
    idEmpleado: number;
    ventaDetalle: IVentaDetalleRegistrar[];
    total: number | string;
    estado: boolean;
}
