import React, { Component } from 'react';
import FotoItem from './Foto';
import { TIMELINE_EVENT, ATUALIZA_LIKER_EVENT, MESSAGE_EVENT, NOVO_COMENTARIO_EVENT} from './Eventos';
import PubSub from 'pubsub-js';
import ReactCSSTransitionGroup from 'react/lib/ReactCSSTransitionGroup';

const exibeMensagem = mensagem => PubSub.publish(MESSAGE_EVENT, mensagem);

export default class Timeline extends Component {

    constructor(props) {
        super(props);
        this.state = { fotos: [] };
        this.login = this.props.login;
    }

    componentWillMount() {
        PubSub.subscribe(TIMELINE_EVENT, (topico, fotos) => this.setState({ fotos: fotos }))
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

        fetch(urlPerfil)
            .then(response => response.json())
            .then(fotos => this.setState({ fotos: fotos }));
    }

    like(fotoId){        
        fetch(`http://localhost:8080/api/fotos/${fotoId}/like?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error("não foi possível realizar o like da foto");
            }
        })
        .then(liker => {
            PubSub.publish(ATUALIZA_LIKER_EVENT,
                {
                    fotoId: fotoId,
                    liker: liker
                }
            );
        })
        .catch(erro => exibeMensagem(erro.message));
    }

    comenta(fotoId, textoComentario){
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({ texto: textoComentario }),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };

        fetch(`http://localhost:8080/api/fotos/${fotoId}/comment?X-AUTH-TOKEN=${localStorage.getItem('auth-token')}`, requestInfo)
            .then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    throw new Error("não foi possível comentar");
                }
            })
            .then(novoComentario => {
                PubSub.publish(NOVO_COMENTARIO_EVENT,
                    {
                        fotoId: fotoId,
                        novoComentario
                    });
            })
            .catch(erro => exibeMensagem(erro.message));
    }

    render() {
        return (
            <div className="fotos container">
                <ReactCSSTransitionGroup
                    transitionName="timeline"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={300}>
                    {
                        this.state.fotos.map(foto => <FotoItem key={foto.id} foto={foto} like={this.like} comenta={this.comenta}/>)
                    }
                </ReactCSSTransitionGroup>
            </div>
        );
    }

}