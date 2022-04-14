'use strict'

const gElCanvas = document.getElementById('canvas')
const gCtx = gElCanvas.getContext('2d')
let gCurrFontFamily = 'impact'
let gCurrSticker = 0
let gIsDownloadable = false

function initGenerator() {
  renderFontFamilies()
  renderStickers()
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
    meme.lines.forEach((line, idx) => {
      if (line.sticker) drawSticker(line, idx)
      else if (line.txt) drawText(idx, line)
    })

    const line = getCurrLine()
    if (line !== null && line.txt !== '') markSelectedLine()
  }
}

function drawText(idx, { txt, size, align, fillClr, strokeClr }) {
  if (txt.trim() === '') return
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

/* TEXT SELECTION */

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

/* FONT STYLE */

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

function renderFontFamilies() {
  const names = getFontFamilies()
  let strHtml = ''
  strHtml = names.map(
    (name) => `<option value="${name}">${getCamelCase(name)}</option>`
  )

  const elSelection = document.querySelector('.font-family-input')
  elSelection.innerHTML = strHtml.join('')
  elSelection.value = gCurrFontFamily
}

function onChangeStrokeColor(clr) {
  setStrokeClr(clr)
  renderMeme()
}

function onChangeFillColor(clr) {
  setFillClr(clr)
  renderMeme()
}

/* STICKERS*/

function onAddSticker(stickerId) {
  const meme = getMeme()
  const idx = meme.selectedLineIdx

  addLine()
  setSticker(getStickerUrl(stickerId))
  renderMeme()

  setCurrLine(idx)
}

function drawSticker(line, idx) {
  const pos = getPos(idx, 'M', line.align)
  if (idx === 1) pos.y = gElCanvas.height - 100

  const img = new Image()
  img.src = line.sticker

  img.onload = () => {
    gCtx.drawImage(img, pos.x, pos.y, 100, 100)
  }
}

function renderStickers() {
  const stickers = getStickers()
  let strHtml = '<li><button onclick="onChangeStickers(-1)">&lt;</button></li>'

  for (let i = 0; i < 3; i++) {
    let stickerId = gCurrSticker + i
    if (stickerId >= stickers.length)
      stickerId = gCurrSticker + i - stickers.length

    strHtml += `<li><img src="${stickers[stickerId].url}" onclick="onAddSticker(${stickers[stickerId].id})"></li>`
  }

  strHtml += '<li><button onclick="onChangeStickers(1)">&gt;</button></li>'

  document.querySelector('.stickers-list').innerHTML = strHtml
}

function onChangeStickers(diff) {
  gCurrSticker += +diff

  const stickers = getStickers()

  if (gCurrSticker === -1) gCurrSticker = stickers.length - 1
  else if (gCurrSticker === stickers.length) gCurrSticker = 0

  renderStickers()
}

/* SAVE - MEME*/
function onDownloadCanvas(ev, elLink) {
  if (gIsDownloadable) return (gIsDownloadable = false)

  ev.preventDefault()
  addLine()
  renderMeme()

  //the next set timeout is because 'image onload' takes time (we didn't learn promises yet)
  setTimeout(() => {
    const data = gElCanvas.toDataURL()
    elLink.href = data
    elLink.download = 'my meme.jpg'
    gIsDownloadable = true
    elLink.click()

    deleteLine()
    renderMeme()
  }, 0)
}

function onShare(ev) {
  ev.preventDefault()

  addLine()
  renderMeme()

  //the next set timeout is because 'image onload' takes time (we didn't learn promises yet)
  setTimeout(() => {
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg')

    // A function to be called if request succeeds
    function onSuccess(uploadedImgUrl) {
      const encodedUploadedImgUrl = encodeURIComponent(uploadedImgUrl)
      window.open(
        `https://www.facebook.com/sharer/sharer.php?u=${encodedUploadedImgUrl}&t=${encodedUploadedImgUrl}`,
        '_blank'
      )
    }

    doUploadImg(imgDataUrl, onSuccess)

    deleteLine()
    renderMeme()
  }, 0)
}

function doUploadImg(imgDataUrl, onSuccess) {
  const formData = new FormData()
  formData.append('img', imgDataUrl)

  fetch('//ca-upload.com/here/upload.php', {
    method: 'POST',
    body: formData,
  })
    .then((res) => res.text())
    .then((url) => {
      onSuccess(url)
    })
    .catch((err) => {
      console.error(err)
    })
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
