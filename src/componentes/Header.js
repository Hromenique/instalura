import React, { Component } from 'react';
import { Link } from 'react-router';
import TimelineApi from '../logicas/TimelineApi';

export default class Header extends Component {

    pesquisa = (event) => {
        event.preventDefault();
        this.props.store.dispatch(TimelineApi.pesquisa(this.loginPesquisado.value));
    }

    render() {
        return (
            <header className="header container">
                <h1 className="header-logo">Instalura</h1>

                <form className="header-busca" onSubmit={this.pesquisa}>
                    <input type="text" name="search" placeholder="Pesquisa" className="header-busca-campo" ref={input => this.loginPesquisado = input} />
                    <input type="submit" value="Buscar" className="header-busca-submit" />
                </form>


                <nav>
                    <ul className="header-nav">
                        <li className="header-nav-item">
                            <a href="#">
                                ♡
                                {/*                 ♥ */}
                                {/* Quem deu like nas minhas fotos */}
                            </a>
                        </li>
                    </ul>
                </nav>
                <nav>
                    <ul className="header-nav">
                        <li className="header-nav-item">
                            <Link to="/logout">x</Link>
                        </li>
                    </ul>
                </nav>
            </header>
        );
    }

}