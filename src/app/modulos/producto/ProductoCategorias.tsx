import React, { Component, FormEventHandler } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios, { AxiosResponse } from 'axios';
import { IProducto } from './../../interfaces/IProducto';
import { ICategoria } from './../../interfaces/ICategoria';

interface ProductoCategoriasState {
    producto: IProducto | null;
    categorias: ICategoria[];
    carritoCategorias: ICategoria[];
    categoriaSelecionadaId: string;
}

class ProductoCategorias extends Component<
    RouteComponentProps<{ id: string }>,
    ProductoCategoriasState
> {
    constructor(props: RouteComponentProps<{ id: string }>) {
        super(props);

        this.state = {
            producto: null,
            categorias: [],
            carritoCategorias: [],
            categoriaSelecionadaId: '',
        };
    }

    componentDidMount() {
        Promise.all<AxiosResponse<IProducto>, AxiosResponse<ICategoria[]>>([
            axios.get<IProducto>(
                `http://localhost:8090/api/productos/${this.props.match.params.id}`
            ),
            axios.get<ICategoria[]>(`http://localhost:8090/api/categorias/`),
        ]).then(([responseProducto, responseCategorias]) => {
            this.setState((prevState) => ({
                ...prevState,
                producto: responseProducto.data,
                categorias: responseCategorias.data,
            }));
        });
    }

    handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
        e.preventDefault();
        axios
            .post(
                `http://localhost:8090/api/productos-categorias`,
                this.state.carritoCategorias.map((categoria) => ({
                    idProducto: this.state.producto!.id,
                    idCategoria: categoria.id,
                }))
            )
            .then(() => {
                this.setState(
                    ({
                        producto,
                        categorias,
                        categoriaSelecionadaId,
                        carritoCategorias,
                    }) => ({
                        producto: {
                            ...producto!,
                            categorias: [
                                ...producto!.categorias,
                                ...carritoCategorias,
                            ],
                        },
                        categorias,
                        carritoCategorias: [],
                        categoriaSelecionadaId,
                    })
                );
            });
    };

    agregarCategoriaAlCarrito = () => {
        if (this.state.categoriaSelecionadaId) {
            const categoria = this.state.categorias.find(
                (categoria) =>
                    categoria.id === parseInt(this.state.categoriaSelecionadaId)
            );
            if (categoria) {
                this.setState((prevState) => ({
                    ...prevState,
                    carritoCategorias: [
                        ...this.state.carritoCategorias,
                        categoria,
                    ],
                }));
            }
        }
    };

    eliminarCategoria = (id: number) => {
        axios
            .delete(
                `http://localhost:8090/api/productos/${
                    this.state.producto!.id
                }/categorias/${id}`
            )
            .then(() => {
                this.setState((prevState) => ({
                    producto: {
                        ...prevState.producto!,
                        categorias: prevState.producto!.categorias.filter(
                            (categoria) => categoria.id !== id
                        ),
                    },
                }));
            });
    };

    render() {
        return (
            this.state.producto && (
                <div className="producto-categorias">
                    <header>
                        <span className="badge bg-primary">PRODUCTO</span>
                        <h1 className="display-6">
                            <div className="row">
                                <div className="col">
                                    {this.state.producto.nombre}
                                </div>
                                <div className="col-auto">
                                    <Link
                                        className="btn btn-outline-secondary"
                                        to="/productos"
                                    >
                                        Volver
                                    </Link>
                                </div>
                            </div>
                        </h1>
                    </header>
                    <div className="row">
                        <div className="col-8">
                            <ul className="list-group">
                                <li className="list-group-item list-group-item-info">
                                    <div className="row gx-1">
                                        <div className="col-auto">
                                            <h3 className="h6 mb-0">
                                                CATEGORIAS
                                            </h3>
                                        </div>
                                        <div className="col-auto">
                                            <span className="badge bg-primary">
                                                {this.state.producto.categorias
                                                    .length +
                                                    this.state.carritoCategorias
                                                        .length}
                                            </span>
                                        </div>
                                    </div>
                                </li>
                                {this.state.producto.categorias.map(
                                    (categoria) => (
                                        <li
                                            key={categoria.id}
                                            className="list-group-item"
                                        >
                                            <div className="row">
                                                <div className="col">
                                                    {categoria.nombre}
                                                </div>
                                                <div className="col-auto">
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        type="button"
                                                        onClick={() => {
                                                            this.eliminarCategoria(
                                                                categoria.id
                                                            );
                                                        }}
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    )
                                )}
                                {this.state.carritoCategorias.map(
                                    (categoria) => (
                                        <li
                                            key={categoria.id}
                                            className="list-group-item list-group-item-secondary"
                                        >
                                            {categoria.nombre}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                        <div className="col-4">
                            <h3 className="h4">Añadir categoria</h3>
                            <form
                                autoComplete="off"
                                onSubmit={this.handleSubmit}
                                noValidate
                            >
                                <div className="mb-3">
                                    <label
                                        className="d-none"
                                        htmlFor="categoria"
                                    >
                                        Categoria
                                    </label>
                                    <select
                                        id="categoria"
                                        name="categoria"
                                        className="form-control"
                                        value={
                                            this.state.categoriaSelecionadaId
                                        }
                                        onChange={({ target: { value } }) => {
                                            this.setState((prevState) => ({
                                                ...prevState,
                                                categoriaSelecionadaId: value,
                                            }));
                                        }}
                                    >
                                        <option value="">
                                            --Selecciona una categoria--
                                        </option>
                                        {this.state.categorias.map(
                                            (categoria) => (
                                                <option
                                                    key={categoria.id}
                                                    value={categoria.id}
                                                >
                                                    {categoria.nombre}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>
                                <div className="d-grid gap-3">
                                    <button
                                        className="btn btn-info"
                                        type="button"
                                        onClick={this.agregarCategoriaAlCarrito}
                                    >
                                        Añadir
                                    </button>
                                    <button
                                        className="btn btn-primary"
                                        type="submit"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )
        );
    }
}

export default ProductoCategorias;
