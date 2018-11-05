export function timeline(state = [], action) {
  if (action.type === 'LISTAGEM') {
    return action.fotos;
  }

  if (action.type === 'COMENTARIO') {
    const fotoId = action.fotoId;
    const novoComentario = action.novoComentario;

    const fotoAchada = state.find(foto => foto.id === fotoId);
    fotoAchada.comentarios.push(novoComentario);

    return state;
  }

  if (action.type === 'LIKE') {
    const liker = action.liker;
    const fotoId = action.fotoId;

    const fotoAchada = state.find(foto => foto.id === fotoId);
    fotoAchada.likeada = !fotoAchada.likeada;

    const possivelLiker = fotoAchada.likers.find(likerAtual => likerAtual.login === liker.login);

    if (possivelLiker === undefined) {
      fotoAchada.likers.push(liker);
    } else {
      const novosLikers = fotoAchada.likers.filter(likerAtual => likerAtual.login !== liker.login);
      fotoAchada.likers = novosLikers;
    }

    return state;
  }

  if (action.type === 'PESQUISA'){
      return action.fotos;
  }

  if(action.type === 'MENSAGEM'){
    // TODO FAZER TRATAMENTO DE ERRO
  }

  return state;
}