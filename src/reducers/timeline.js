export function timeline(state=[], action){
    if(action.type === 'LISTAGEM'){
      return action.fotos;
    }

    if(action.type === 'COMENTARIO'){
        const fotoId = action.fotoId;
        const novoComentario = action.novoComentario;

        const fotoAchada = state.find(foto => foto.id === fotoId);
        fotoAchada.comentarios.push(novoComentario);

        return state;
    }
  
    return state;
  }