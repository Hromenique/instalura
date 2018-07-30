import React, { Component } from 'react';
import { Link } from 'react-router';
import PubSub from 'pubsub-js';
import { ATUALIZA_LIKER_EVENT } from './Eventos';

class FotoAtualizacoes extends Component {

    constructor(props) {
        super(props);
        this.state = { likeada: this.props.foto.likeada };
    }

    like(event) {
        event.preventDefault();
        fetch(`http://localhost:8080/api/fotos/${this.props.foto.id}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, { method: 'POST' })
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("não foi possível realizar o like da foto");
                }
            })
            .then(liker => {
                this.setState({ likeada: !this.state.likeada });
                PubSub.publish(ATUALIZA_LIKER_EVENT,
                    {
                        fotoId: this.props.foto.id,
                        liker: liker
                    }
                );
            });
    }

    comenta(event){
        event.preventDefault();
       
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({texto: this.comentario.value}),
            headers: new Headers({
                'Content-type':'application/json'
            })
        };

       fetch(`http://localhost:8080/api/fotos/${this.props.foto.id}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
        .then(response => {
            if(response.ok){
                return response.json();
            }else{
                throw new Error("não foi possível comentar");
            }
        })
        .then(novoComentario => {
            console.log(novoComentario);
        });
    }

    render() {
        return (
            <section className="fotoAtualizacoes">
                <a onClick={this.like.bind(this)} className={this.state.likeada ? 'fotoAtualizacoes-like-ativo' : 'fotoAtualizacoes-like'}>Likar</a>
                <form className="fotoAtualizacoes-form" onSubmit={this.comenta.bind(this)}>
                    <input type="text" placeholder="Adicione um comentário..." className="fotoAtualizacoes-form-campo" ref={input => this.comentario = input}/>
                    <input type="submit" value="Comentar!" className="fotoAtualizacoes-form-submit" />
                </form>

            </section>
        );
    };
}

class FotoInfo extends Component {

    constructor(props) {
        super(props);
        this.state = { likers: props.foto.likers };
    }

    componentWillMount() {
        PubSub.subscribe(ATUALIZA_LIKER_EVENT, (topico, infoLiker) => {
            //apenas a foto que está sendo likeada
            if(this.props.foto.id === infoLiker.fotoId){
                const possivelLiker = this.state.likers.find(liker => liker.login === infoLiker.liker.login);                
                
                if(possivelLiker === undefined){
                    const novosLikers = this.state.likers.concat(infoLiker.liker);                    
                    this.setState({likers: novosLikers});
                }else{
                    const novosLikers = this.state.likers.filter(liker=> liker.login !== infoLiker.liker.login);
                    this.setState({likers: novosLikers});
                }
            }           
        })
    }

    render() {
        return (
            <div className="foto-info">
                <div className="foto-info-likes">
                    {
                        this.state.likers.map((liker, i, likers) =>
                            <span><Link key={liker.login} to={`/timeline/${liker.login}`}>{liker.login}</Link>{ (likers.length > 1 && i !== likers.length -1) ? ', ' : ''}</span>)
                    }
                </div>

                <p className="foto-info-legenda">
                    <a className="foto-info-autor">autor </a>
                    {this.props.foto.comentario}
                </p>

                <ul className="foto-info-comentarios">
                    {
                        this.props.foto.comentarios.map(comentario => {
                            return (
                                <li className="comentario">
                                    <Link to={`/timeline/${comentario.login}`} className="foto-info-autor">{comentario.login}</Link>
                                    {comentario.texto}
                                </li>
                            );
                        })
                    }
                </ul>
            </div>
        );
    };
}

class FotoHeader extends Component {
    render() {
        return (
            <header className="foto-header">
                <figure className="foto-usuario">
                    <img src={this.props.foto.urlPerfil} alt="foto do usuario" />
                    <figcaption className="foto-usuario">
                        <Link to={`/timeline/${this.props.foto.loginUsuario}`}>{this.props.foto.loginUsuario}</Link>
                    </figcaption>
                </figure>
                <time className="foto-data">{this.props.foto.horario}</time>
            </header>
        );
    }
}

export default class FotoItem extends Component {
    render() {
        return (
            <div className="foto">
                <FotoHeader foto={this.props.foto} />
                <img alt="foto" className="foto-src" src={this.props.foto.urlFoto} />
                <FotoInfo foto={this.props.foto} />
                <FotoAtualizacoes foto={this.props.foto} />
            </div>
        );
    }
}