'use strict'

const gElCanvas = document.getElementById('canvas')
const gCtx = gElCanvas.getContext('2d')

function renderMeme() {
  const meme = getMeme()

  const img = new Image()
  img.src = getImg(meme.selectedImgId).url
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    drawText(getCurrLine())
  }
}

/* FIX RESIZING */
function resizeCanvas() {
  gElCanvas.width = 0
  gElCanvas.height = 0

  const elContainer = document.querySelector('.canvas-container')
  gElCanvas.width = elContainer.offsetWidth - 50
  // Unless needed, better keep height fixed.  /* FIX */
  gElCanvas.height = elContainer.offsetHeight - 50
}

function drawText({ txt, size, fillClr, strokeClr }) {
  gCtx.font = gCtx.font.replace(/^\d+/, size)
  gCtx.lineWidth = 2
  gCtx.strokeStyle = strokeClr
  gCtx.fillStyle = fillClr

  gCtx.fillText(txt, 50, 50)
  gCtx.strokeText(txt, 50, 50)
}

function onChangeText(txt) {
  setLineTxt(txt)
  renderMeme()
}

function onChangeStrokeColor(clr) {
  setStrokeClr(clr)
  renderMeme()
}

function onChangeFillColor(clr) {
  setFillClr(clr)
  renderMeme()
}

function onChangeFontSize(diff) {
  setFontSize(diff)
  renderMeme()
}
