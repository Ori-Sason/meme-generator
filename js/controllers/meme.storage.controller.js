'use strict'

function renderMemesFromStorage() {
  loadMemesFromStorage()
  const savedMemes = getSavedMemes()

  if (savedMemes.length === 0) {
    const strHtml = '<h2>Your memes storage is empty.</h2>'
    document.querySelector('.storage-gallery').innerHTML = strHtml
    return
  }

  let strHtml = '<ul class="image-gallery clean-list">'

  savedMemes.forEach(
    (meme) =>
      (strHtml += `
    <li>
      <div class="icon-btn trash">
        <img src="img/icons/trash.png" alt="Remove meme" title="Remove meme" onclick="onRemoveMeme(${meme.id})">
      </div>
      <img src="${meme.screenshot}" onclick="onLoadMeme(${meme.id})" />
    </li>
  `)
  )

  strHtml += '<ul>'

  document.querySelector('.storage-gallery').innerHTML = strHtml
}

function onLoadMeme(id) {
  loadMeme(id)
  initGenerator()
  showEditor()

  //bug fix - FIX
  setTimeout(() => {
    resizeCanvas()
    renderMeme()
  }, 0)
}

function onRemoveMeme(id){
  const savedMemes = getSavedMemes()
  removeMemeFromStorage(id)
  renderMemesFromStorage()
}