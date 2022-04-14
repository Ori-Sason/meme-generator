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
    if (line !== null && line.txt !== '') markSelectedLine()
  }
}

function drawText(idx, { txt, size, align, fillClr, strokeClr }) {
  if (txt.trim() === '') return
  //   gCtx.font = gCtx.font.replace(/^\d+/, size)
  gCtx.font = `${size}px ${gCurrFontFamily}`
  gCtx.lineWidth = size / 25
  gCtx.strokeStyle = strokeClr
  gCtx.fillStyle = fillClr

  const pos = getPos(idx, txt, align)
  gCtx.fillText(txt, pos.x, pos.y)
  gCtx.strokeText(txt, pos.x, pos.y)
}

function markSelectedLine() {
  const meme = getMeme()
  const line = getCurrLine()

  const pos = getPos(meme.selectedLineIdx, line.txt, line.align)
  drawRect(pos, line.txt)
}

function drawRect(pos, txt) {
  gCtx.beginPath()
  gCtx.strokeStyle = 'whitesmoke'

  gCtx.rect(
    pos.x - 10,
    pos.y - parseInt(gCtx.font),
    gCtx.measureText(txt).width + 20,
    parseInt(gCtx.font) * 1.3
  )

  gCtx.stroke()
}

function onChangeText(txt) {
  setLineTxt(txt)
  renderMeme()
}

function onSwitchLine() {
  switchLine()
  showCurrTextOnInput()
  renderMeme()
}

function showCurrTextOnInput() {
  const line = getCurrLine()
  document.querySelector('.editor-config .text-input').value = line.txt
}

function onAddLine() {
  const elInput = document.querySelector('.editor-config .text-input')
  if (elInput.value.trim() === '') return

  addLine()
  elInput.value = ''
  renderMeme()
}

function onDeleteLine() {
  deleteLine()
  showCurrTextOnInput()
  renderMeme()
}

function onChangeFontSize(diff) {
  setFontSize(diff)
  renderMeme()
}

function onChangeAlignment(alignment) {
  setAlign(alignment)
  renderMeme()
}

function onFontFamilyChange(name) {
  gCurrFontFamily = name
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

function downloadCanvas(elLink) {
  addLine()
  renderMeme()

  //the next set timeout is because 'image onload' takes time (we didn't learn promises yet)
  setTimeout(() => {
    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my meme.jpg'

    deleteLine()
  }, 0)
}

/* HELPERS */
/* will need to fix the sizes (not always 60)*/
function getPos(idx, txt, align) {
  let x = 30

  if (align === 'right') {
    x = gElCanvas.width - gCtx.measureText(txt).width - 30
  } else if (align === 'center') {
    x = (gElCanvas.width - gCtx.measureText(txt).width) / 2
  }

  switch (idx) {
    case 0:
      return { x, y: 60 }
    case 1:
      return { x, y: gElCanvas.height - 20 }
    default:
      return { x, y: 60 * idx }
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

function renderFontFamilies() {
  const names = getFontFamilies()
  let strHtml = ''
  names.map(
    (name) =>
      (strHtml += `
    <option value="${name}">${getCamelCase(name)}</option>
  `)
  )

  const elSelection = document.querySelector('.font-family-input')
  elSelection.innerHTML = strHtml
  elSelection.value = gCurrFontFamily
}
