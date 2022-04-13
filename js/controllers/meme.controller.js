'use strict'

const gElCanvas = document.getElementById('canvas')
const gCtx = gElCanvas.getContext('2d')

function renderMeme() {
  const meme = getMeme()
  const img = getImg(meme.selectedImgId)

  resizeCanvas()
  drawImgOnCanvas(img.url)
}

function drawImgOnCanvas(url) {
  var img = new Image()
  img.src = url
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
  }
}

function resizeCanvas() {
  gElCanvas.width = 0
  gElCanvas.height = 0

  const elContainer = document.querySelector('.canvas-container')
  gElCanvas.width = elContainer.offsetWidth -50
  // Unless needed, better keep height fixed.  /* FIX */
    gElCanvas.height = elContainer.offsetHeight -50
}

function onChangeText(txt) {
  setLineTxt(txt)
  renderMeme()
}
