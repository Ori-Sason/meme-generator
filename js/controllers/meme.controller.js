'use strict'

const gElCanvas = document.getElementById('canvas')
const gCtx = gElCanvas.getContext('2d')
let gCurrFontFamily = 'impact'
let gCurrSticker = 0
const STICKER_SIZE = 100
let gIsDownloadable = false

let gStartPos
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

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
  // if(img.complete){
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    meme.lines.forEach((line, idx) => {
      if (line.sticker) drawSticker(line)
      else if (line.txt) drawText(idx, line)
    })

    const line = getCurrLine()
    if (line !== null && (line.txt !== '' || line.sticker !== null))
      markSelectedLine()
  }

  // requestAnimationFrame(renderMeme)
}

function drawText(idx, line) {
  if (line.txt.trim() === '') return
  gCtx.font = `${line.size}px ${gCurrFontFamily}`
  gCtx.lineWidth = line.size / 25
  gCtx.strokeStyle = line.strokeClr
  gCtx.fillStyle = line.fillClr

  // const pos = setInitialPos(idx, line)
  const pos = line.pos

  gCtx.fillText(line.txt, pos.x, pos.y)
  gCtx.strokeText(line.txt, pos.x, pos.y)
}

function markSelectedLine() {
  const line = getCurrLine()
  drawRect(line)
}

function drawRect(line) {
  gCtx.beginPath()
  gCtx.lineWidth = 5
  gCtx.strokeStyle = '#30a9c8'

  const width = line.sticker
    ? STICKER_SIZE + 20
    : gCtx.measureText(line.txt).width + 20
  
  const height = line.sticker ? STICKER_SIZE + 20 : parseInt(gCtx.font) * 1.3

  gCtx.rect(
    line.pos.x - 10 - (line.sticker ? STICKER_SIZE / 2 : 0),
    line.pos.y - (line.sticker ? STICKER_SIZE / 2 + 10 : parseInt(gCtx.font)),
    width,
    height
  )

  gCtx.stroke()
}

function onChangeText(txt) {
  const line = getCurrLine()
  if (line.sticker) addLine()

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
  setInitialPos(null, getCurrLine())
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
  let line = getCurrLine()
  if (line.txt || line.sticker) {
    document.querySelector('.editor-config .text-input').value = ''
    addLine()
    line = getCurrLine()
  }

  setSticker(getStickerUrl(stickerId))

  const pos = setInitialPos(line.id, line)

  renderMeme()
}

function drawSticker(line) {
  const pos = line.pos

  const img = new Image()
  img.src = line.sticker

  // img.onload = () => {
  if(img.complete){
    gCtx.drawImage(
      img,
      pos.x - STICKER_SIZE / 2,
      pos.y - STICKER_SIZE / 2,
      STICKER_SIZE,
      STICKER_SIZE
    )
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
function setInitialPos(idx, line) {
  let x = line.sticker? STICKER_SIZE : 30

  if (line.align === 'right') {
    x =
      gElCanvas.width -
      30 -
      (line.sticker ? STICKER_SIZE : gCtx.measureText(line.txt).width)
  } else if (line.align === 'center') {
    x =
      (gElCanvas.width -
        (line.sticker ? STICKER_SIZE : gCtx.measureText(line.txt).width)) /
      2
  }

  let y = 60 * line.id
  if (line.id === 0) y = (line.sticker? STICKER_SIZE : 60)
  else if (line.id === 1) y = (gElCanvas.height - (line.sticker ? STICKER_SIZE : 20))

  const pos = { x, y }
  setLineInitPos(pos)
  return pos
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

/* DRAG AND DROP */
function onDown(ev) {
  const pos = getEvPos(ev)
  if (!isLineClicked(pos)) return
  setLineDrag(true)
  gStartPos = pos
  document.getElementById('canvas').style.cursor = 'grabbing'
}

function onMove(ev) {
  const meme = getCurrLine()
  if (!meme.isDrag) return
  const pos = getEvPos(ev)
  const dx = pos.x - gStartPos.x
  const dy = pos.y - gStartPos.y
  moveLine(dx, dy)
  gStartPos = pos
  renderMeme()
}

function onUp() {
  setLineDrag(false)
  document.getElementById('canvas').style.cursor = 'grab'
}

function getEvPos(ev) {
  let pos = {
    x: ev.offsetX,
    y: ev.offsetY,
  }
  if (gTouchEvs.includes(ev.type)) {
    ev.preventDefault()
    ev = ev.changedTouches[0]
    pos = {
      x: ev.pageX - ev.target.offsetLeft,
      y: ev.pageY - ev.target.offsetTop,
    }
  }
  return pos
}


//* FIX - DELETE THIS FUNCTION */
function drawArc() {
  gCtx.beginPath()
  gCtx.arc(getCurrLine().pos.x, getCurrLine().pos.y, 20, 0, 2 * Math.PI)
  gCtx.fill()
}
