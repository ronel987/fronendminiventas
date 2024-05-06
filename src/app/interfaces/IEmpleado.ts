export interface IEmpleado {
    id: string;
    nombre: string;
    apellido: string;
    alias: string;
    clave: string;
    telefono: string | null;
    correo: string | null;
    fechaRegistro: Date | string;
    estado: boolean;
}

export interface IEmpleadoRegistrar {
    id: string;
    nombre: string;
    apellido: string;
    alias: string;
    clave: string;
    telefono: string;
    correo: string;
    estado: boolean;
}
