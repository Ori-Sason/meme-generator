'use strict'

const gElCanvas = document.getElementById('canvas')
const gCtx = gElCanvas.getContext('2d')
let gCurrFontFamily = 'impact'
let gCurrSticker = 0
let gIsDownloadable = false
let gUserImg = null

let gStartPos
const gTouchEvs = ['touchstart', 'touchmove', 'touchend']

function initGenerator() {
  _clearEditorTxtInput()
  renderFontFamilies()
  renderStickers()
  resizeCanvas()
  addLine()
  renderMeme()
}

function renderMeme() {
  const meme = getMeme()

  let img = new Image()
  img.src = getImg(meme.selectedImgId).url
  
  if(gUserImg) img.src = gUserImg.src
  
  img.onload = () => {
  // if(img.complete){
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
    meme.lines.forEach((line) => {
      if (line.sticker) drawSticker(line)
      else if (line.txt) drawText(line)
    })

    const line = getCurrLine()
    if (line !== null && (line.txt !== '' || line.sticker !== null))
      markSelectedLine()
  }

  // requestAnimationFrame(renderMeme)
}

function drawText(line) {
  if (line.txt.trim() === '') return
  const meme = getMeme()
  gCtx.font = `${line.size}px ${meme.fontFamily}`
  gCtx.lineWidth = line.size / 25
  gCtx.strokeStyle = line.strokeClr
  gCtx.fillStyle = line.fillClr

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
    ? line.size + 20
    : gCtx.measureText(line.txt).width + 20
  
  const height = line.sticker ? line.size + 20 : parseInt(gCtx.font) * 1.3

  gCtx.rect(
    line.pos.x - 10 - (line.sticker ? line.size / 2 : 0),
    line.pos.y - (line.sticker ? line.size / 2 + 10 : parseInt(gCtx.font)),
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
  setInitialPos(getCurrLine())
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

function onFontFamilyChange(fontName) {
  setFontFamily(fontName)
  renderMeme()
}

function renderFontFamilies() {
  const names = getFontFamilies()
  let strHtml = ''
  strHtml = names.map(
    (name) => `<option value="${name}">${getCamelCase(name)}</option>`
  )

  document.querySelector('.font-family-input').innerHTML = strHtml.join('')
  
  const meme = getMeme()
  document.querySelector('.font-family-input').value = meme.fontFamily
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
    _clearEditorTxtInput()
    addLine()
    line = getCurrLine()
  }

  setSticker(getStickerUrl(stickerId))

  const pos = setInitialPos(line)

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
      pos.x - line.size / 2,
      pos.y - line.size / 2,
      line.size,
      line.size
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

/* SAVE AND SHARE - MEME*/
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

function onSaveMeme(){
  saveMeme()
}

function onLoadMeme(id){
  loadMeme(id)
}

/* HELPERS */
/* will need to fix the sizes (not always 60)*/
function setInitialPos(line) {
  let x = line.sticker? line.size : 30

  if (line.align === 'right') {
    x =
      gElCanvas.width -
      30 -
      (line.sticker ? line.size : gCtx.measureText(line.txt).width)
  } else if (line.align === 'center') {
    x =
      (gElCanvas.width -
        (line.sticker ? line.size : gCtx.measureText(line.txt).width)) /
      2
  }

  let y = 60 * line.id
  if (line.id === 0) y = (line.sticker? line.size : 60)
  else if (line.id === 1) y = (gElCanvas.height - (line.sticker ? line.size : 20))

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

function _clearEditorTxtInput(){
  document.querySelector('.editor-config .text-input').value = ''
}

//* FIX - DELETE THIS FUNCTION */
function drawArc() {
  gCtx.beginPath()
  gCtx.arc(getCurrLine().pos.x, getCurrLine().pos.y, 20, 0, 2 * Math.PI)
  gCtx.fill()
}
