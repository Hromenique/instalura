import React, { Component } from 'react';
import FotoItem from './Foto';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

export default class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = { fotos: [] };
        this.login = this.props.login;
        this.store = this.props.store;
    }

    componentWillMount() {
        this.store.subscribe(() => {
            this.setState({fotos: this.store.getState()}) 
        });
    }

    componentDidMount() {
        this.carregaFotos();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.login !== undefined) {
            this.login = nextProps.login;
            this.carregaFotos();
        }
    }   

    carregaFotos() {
        let urlPerfil;

        if (this.login === undefined) {
            urlPerfil = `http://localhost:8080/api/fotos?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`;
        } else {
            urlPerfil = `http://localhost:8080/api/public/fotos/${this.login}`;
        }

        const listaFixa = [{"urlPerfil":"https://instagram.fcgh9-1.fna.fbcdn.net/vp/faf1cd7c1d50bbf382cad0d43df15a49/5B5FF9ED/t51.2885-19/s150x150/12599387_1591433254512484_973178862_a.jpg","loginUsuario":"rafael","horario":"16/10/2018 23:28","urlFoto":"https://i.pinimg.com/564x/7f/cb/57/7fcb570520831df31cd11d25d56b896d.jpg","id":4,"likeada":false,"likers":[],"comentarios":[],"comentario":"comentario da foto 1"},{"urlPerfil":"https://instagram.fcgh9-1.fna.fbcdn.net/vp/faf1cd7c1d50bbf382cad0d43df15a49/5B5FF9ED/t51.2885-19/s150x150/12599387_1591433254512484_973178862_a.jpg","loginUsuario":"rafael","horario":"16/10/2018 23:28","urlFoto":"https://i.pinimg.com/564x/ee/f7/79/eef77989d1053d1c36789ee799e79ff1.jpg","id":5,"likeada":false,"likers":[],"comentarios":[],"comentario":"comentario da foto 2"},{"urlPerfil":"https://instagram.fcgh9-1.fna.fbcdn.net/vp/faf1cd7c1d50bbf382cad0d43df15a49/5B5FF9ED/t51.2885-19/s150x150/12599387_1591433254512484_973178862_a.jpg","loginUsuario":"rafael","horario":"16/10/2018 23:28","urlFoto":"https://i.pinimg.com/564x/7f/cb/57/7fcb570520831df31cd11d25d56b896d.jpg","id":6,"likeada":false,"likers":[],"comentarios":[],"comentario":"comentario da foto 3"}];
        
        this.store.dispatch({type: 'LISTAGEM', fotos: listaFixa});
        // this.store.lista(urlPerfil);        
    }   

    like(fotoId){   
        this.store.like(fotoId);        
    }

    comenta(fotoId, textoComentario){
        this.store.comenta(fotoId, textoComentario);
    }

    render() {
        return (
            <div className="fotos container">
                <ReactCSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {
                        this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like.bind(this)} comenta={this.comenta.bind(this)}/>)
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }

}