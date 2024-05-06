import { IProducto } from './IProducto';

export interface IVentaDetalle {
    id: number;
    producto: IProducto;
    precioUnidad: number;
    cantidad: number;
    subTotal: number;
}

export interface IVentaDetalleRegistrar {
    idProducto: number | string;
    precioUnidad: number;
    cantidad: number | string;
    subTotal: number;
}
