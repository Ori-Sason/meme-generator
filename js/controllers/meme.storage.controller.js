'use strict'

function renderMemesFromStorage() {
  loadMemesFromStorage()
  const savedMemes = getSavedMemes()

  if (savedMemes.length === 0) {
    //FIX - WRITE A MESSAGE
    return
  }

  const strHtml = savedMemes.map(
    (meme) => `
    <li><img src="${meme.screenshot}" onclick="onLoadMeme(${meme.id})" /></li>
  `
  )

  document.querySelector('.storage-gallery .image-gallery').innerHTML =
    strHtml.join('')
}

function onLoadMeme(id) {
  loadMeme(id)
  console.log('got here')
  initGenerator()
  showEditor()

  //bug fix - FIX
  setTimeout(() => {
    resizeCanvas()
    renderMeme()
  }, 0)
}
