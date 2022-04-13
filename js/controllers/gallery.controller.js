'use strict'

function renderGallery() {
  const imgs = getImgs()
  let strHtml = ''
  imgs.forEach(
    (img) =>
      (strHtml += `
        <li><img src="${img.url}" alt="${img.alt}" onclick="onImgSelect(${img.id})" /></li>
    `)
  )

  document.querySelector('.image-gallery').innerHTML = strHtml
}

function onImgSelect(id) {
    setImg(id)
    showEditor()
    
    resizeCanvas()
    addLine()
    renderMeme()
}
