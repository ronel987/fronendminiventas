import { StaticRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import CategoriaModulo from './../app/modulos/categoria/CategoriaModulo';

describe('Tests para categoria modulo', () => {
    render(
        <StaticRouter context={{ url: '/categorias' }}>
            <CategoriaModulo />
        </StaticRouter>
    )
        .findByTestId('categoria-modulo')
        .then((element) => {
            it('Contiene un div con className categoria-modulo', () => {
                expect(element.className).toContain('categoria-modulo');
            });
            it('Es una etiqueta DIV', () => {
                expect(element.tagName).toStrictEqual('DIV');
            });
            it('Contiene una etiqueta table', () => {
                expect(element.getElementsByTagName('table')).toBeDefined();
            });
        });
});
