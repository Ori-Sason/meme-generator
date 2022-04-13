'use strict'

const gElCanvas = document.getElementById('canvas')
const gCtx = gElCanvas.getContext('2d')
let gCurrFontFamily = 'impact'

function initGenerator() {
  renderFontFamilies()
  resizeCanvas()
  addLine()
  renderMeme()
}

function renderMeme() {
  const meme = getMeme()

  const img = new Image()
  img.src = getImg(meme.selectedImgId).url
  img.onload = () => {
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    meme.lines.forEach((line, idx) => drawText(idx, line))

    const line = getCurrLine()
    if ((line !== null) & (line.txt !== '')) markSelectedLine()
  }
}

function drawText(idx, { txt, size, fillClr, strokeClr }) {
  if (txt.trim() === '') return
  //   gCtx.font = gCtx.font.replace(/^\d+/, size)
  gCtx.font = `${size}px ${gCurrFontFamily}`
  gCtx.lineWidth = size / 25
  gCtx.strokeStyle = strokeClr
  gCtx.fillStyle = fillClr

  const pos = getPos(idx)
  gCtx.fillText(txt, pos.x, pos.y)
  gCtx.strokeText(txt, pos.x, pos.y)
}

function markSelectedLine() {
  const meme = getMeme()
  const line = getCurrLine()

  const pos = getPos(meme.selectedLineIdx)
  drawRect(pos, line.txt)
}

function drawRect(pos, txt) {
  gCtx.beginPath()
  gCtx.strokeStyle = 'whitesmoke'

  gCtx.rect(
    pos.x - 10,
    pos.y - parseInt(gCtx.font) * 1.1,
    gCtx.measureText(txt).width + 20,
    parseInt(gCtx.font) * 1.3
  )

  gCtx.stroke()
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

function onAddLine() {
  const elInput = document.querySelector('.editor-config .text-input')
  if (elInput.value.trim() === '') return

  addLine()
  elInput.value = ''
  renderMeme()
}

function onFontFamilyChange(name) {
  gCurrFontFamily = name
  renderMeme()
}

/* will need to fix the sizes (not always 50)*/
function getPos(idx) {
  switch (idx) {
    case 0:
      return { x: 30, y: 50 }
    case 1:
      return { x: 30, y: gElCanvas.height - 20 }
    default:
      return { x: 30, y: 50 * idx }
  }
}

function onSwitchLine() {
  switchLine()
  document.querySelector('.editor-config .text-input').value = getCurrLine().txt
  renderMeme()
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

function renderFontFamilies() {
  const names = getFontFamilies()
  let strHtml = ''
  names.map(
    (name) =>
      (strHtml += `
    <option value="${name}">${getCamelCase(name)}</option>
  `)
  )

  document.querySelector('.font-family-input').innerHTML = strHtml
}
