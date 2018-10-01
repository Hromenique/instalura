import {MESSAGE_EVENT, TIMELINE_EVENT} from '../eventos/Eventos';
import PubSub from 'pubsub-js';

const exibeMensagem = mensagem => PubSub.publish(MESSAGE_EVENT, mensagem);

export default class LogicaTimeLine{

    constructor(fotos){
        this.fotos = fotos;
    }

    subscribe(callback){
        PubSub.subscribe(TIMELINE_EVENT, (topico, fotos) => callback(fotos)); 
    }

    lista(urlPerfil){
        fetch(urlPerfil)
        .then(response => response.json())
        .then(fotos => {
            PubSub.publish(TIMELINE_EVENT, fotos);
            this.fotos = fotos;            
        });
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
            const fotoAchada = this.fotos.find(foto => foto.id === fotoId);
            fotoAchada.likeada = !fotoAchada.likeada;

            const possivelLiker = fotoAchada.likers.find(likerAtual => likerAtual.login === liker.login);

            if (possivelLiker === undefined) {
                fotoAchada.likers.push(liker);
            } else {
                const novosLikers = fotoAchada.likers.filter(likerAtual => likerAtual.login !== liker.login);
                fotoAchada.likers = novosLikers;
            }

            PubSub.publish(TIMELINE_EVENT, this.fotos);            
        })
        .catch(erro => {
            console.error(erro);
            exibeMensagem(erro.message);
        });
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
                const fotoAchada = this.fotos.find(foto => foto.id === fotoId);
                fotoAchada.comentarios.push(novoComentario);
                PubSub.publish(TIMELINE_EVENT, this.fotos);     
            })
            .catch(erro => {
                console.error(erro);
                exibeMensagem(erro.message);
            });
    }
}