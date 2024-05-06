import { ICategoria } from './ICategoria';

export interface IProducto {
    id: number;
    nombre: string;
    marca: string;
    descripcion: string;
    categorias: ICategoria[];
    precio: number;
    stock: number;
    fechaRegistro: Date | string;
    estado: boolean;
}

export interface IProductoRegistrar {
    nombre: string;
    marca: string;
    descripcion: string;
    precio: number | string;
    stock: number | string;
    estado: boolean;
}

export interface IProductoEditar extends IProductoRegistrar {
    id: number;
}
