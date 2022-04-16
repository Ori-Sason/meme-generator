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
        <img src="img/icons/trash.png" alt="Delete meme" title="Delete meme" onclick="onDeleteMeme(${meme.id})">
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
  console.log('got here')
  initGenerator()
  showEditor()

  //bug fix - FIX
  setTimeout(() => {
    resizeCanvas()
    renderMeme()
  }, 0)
}

function onDeleteMeme(id){
  const savedMemes = getSavedMemes()
  savedMemes.splice(id, 1)
  saveMemesToStorage()
  renderMemesFromStorage()
}
