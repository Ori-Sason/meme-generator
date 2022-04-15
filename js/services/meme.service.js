'use strict'

//KEYWORDS: animal, politician, baby, dog, cat, men, women, actors, movies, funny, comic, smile


const gKeywordSearchCountMap = {}
const gFontFamilies = ['impact', 'poppins', 'fontdiner-swanky', 'lobster']

const gImgs = [
  {
    id: 1,
    url: 'img/gallery/1.jpg',
    keywords: ['politician', 'men'],
    alt: 'donald trump',
  },
  {
    id: 2,
    url: 'img/gallery/2.jpg',
    keywords: ['animal', 'dog', 'smile'],
    alt: 'puppies',
  },
  {
    id: 3,
    url: 'img/gallery/3.jpg',
    keywords: ['animal', 'dog', 'baby'],
    alt: 'baby and dog',
  },
  {
    id: 4,
    url: 'img/gallery/4.jpg',
    keywords: ['animal', 'cat'],
    alt: 'cat sleep on laptop',
  },
  {
    id: 5,
    url: 'img/gallery/5.jpg',
    keywords: ['baby', 'funny'],
    alt: 'baby wins',
  },
  {
    id: 6,
    url: 'img/gallery/6.jpg',
    keywords: ['actors', 'movies', 'men'],
    alt: '',
  },
  {
    id: 7,
    url: 'img/gallery/7.jpg',
    keywords: ['baby', 'smile', 'funny'],
    alt: 'happy baby',
  },
  {
    id: 8,
    url: 'img/gallery/8.jpg',
    keywords: ['actors', 'movies', 'men'],
    alt: '',
  },
  {
    id: 9,
    url: 'img/gallery/9.jpg',
    keywords: ['baby', 'smile', 'funny'],
    alt: 'happy baby',
  },
  {
    id: 10,
    url: 'img/gallery/10.jpg',
    keywords: ['politician', 'smile', 'men'],
    alt: 'Barack Obama',
  },
  {
    id: 11,
    url: 'img/gallery/11.jpg',
    keywords: ['men'],
    alt: 'kissing men',
  },
  {
    id: 12,
    url: 'img/gallery/12.jpg',
    keywords: ['men', 'funny'],
    alt: 'Haim Hecht',
  },
  {
    id: 13,
    url: 'img/gallery/13.jpg',
    keywords: ['actors', 'movies', 'men', 'smile'],
    alt: 'Leonardo DiCaprio',
  },
  {
    id: 14,
    url: 'img/gallery/14.jpg',
    keywords: ['actors', 'movies', 'men'],
    alt: '',
  },
  {
    id: 15,
    url: 'img/gallery/15.jpg',
    keywords: ['actors', 'movies', 'men'],
    alt: '',
  },
  {
    id: 16,
    url: 'img/gallery/16.jpg',
    keywords: ['actors', 'movies', 'men'],
    alt: 'Dr. Evil',
  },
  {
    id: 17,
    url: 'img/gallery/17.jpg',
    keywords: ['actors', 'movies', 'men'],
    alt: 'vladimir Putin',
  },
  {
    id: 18,
    url: 'img/gallery/18.jpg',
    keywords: ['actors', 'movies', 'men'],
    alt: 'Toy Story',
  },
]

const gStickers = [
  { id: 1, url: 'img/stickers/bar-chart.png' },
  { id: 2, url: 'img/stickers/cool.png' },
  { id: 3, url: 'img/stickers/headache.png' },
  { id: 4, url: 'img/stickers/idea.png' },
  { id: 5, url: 'img/stickers/nice.png' },
  { id: 6, url: 'img/stickers/no-way.png' },
  { id: 7, url: 'img/stickers/oh-yeah.png' },
  { id: 8, url: 'img/stickers/oops.png' },
  { id: 9, url: 'img/stickers/self-confidence.png' },
  { id: 10, url: 'img/stickers/yay.png' },
]

let gStorageMemes = []
let gMeme = {}

function createNewMeme() {
  gMeme = {
    id:
      gStorageMemes.length === 0
        ? 0
        : gStorageMemes[gStorageMemes.length - 1].id + 1,
    
    selectedImgId: 1,
    selectedLineIdx: 0,
    fontFamily: 'impact',
    lines: [],
  }
}

function getImgs() {
  return gImgs
}

function getMeme() {
  return gMeme
}

function getCurrLine() {
  if (gMeme.lines.length === 0) return null
  return gMeme.lines[gMeme.selectedLineIdx]
}

function setCurrLine(idx) {
  gMeme.selectedLineIdx = idx
}

function getImg(id) {
  return gImgs.find((img) => img.id === id)
}

function setImg(id) {
  gMeme.selectedImgId = id
}

function setLineTxt(text) {
  gMeme.lines[gMeme.selectedLineIdx].txt = text
}

function switchLine() {
  if (gMeme.selectedLineIdx === gMeme.lines.length - 1) {
    return (gMeme.selectedLineIdx = 0)
  }

  gMeme.selectedLineIdx++
}

function addLine() {
  _createMemeLine()
  gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function deleteLine() {
  if (gMeme.lines.length === 0) return

  gMeme.lines.splice(gMeme.selectedLineIdx)
  gMeme.selectedLineIdx--

  if (gMeme.selectedLineIdx < 0) gMeme.selectedLineIdx = 0

  if (gMeme.lines.length === 0) {
    _createMemeLine()
  }
}

function setFontSize(step) {
  getCurrLine().size += +step
}

function setAlign(alignment) {
  const line = getCurrLine()
  line.align = alignment
}

function getFontFamilies() {
  return gFontFamilies.sort()
}

function setFontFamily(fontName){
  gMeme.fontFamily = fontName
}

function setStrokeClr(clr) {
  gMeme.lines[gMeme.selectedLineIdx].strokeClr = clr
}

function setFillClr(clr) {
  gMeme.lines[gMeme.selectedLineIdx].fillClr = clr
}

function setSticker(src) {
  const line = getCurrLine()
  line.sticker = src
}

function getStickerUrl(id) {
  const sticker = gStickers.find((sticker) => sticker.id === +id)
  return sticker.url
}

function getStickers() {
  return gStickers
}

function isLineClicked(clickedPos) {
  function isStickerInArea(pos, width, height) {
    return (
      clickedPos.x >= pos.x - width / 2 - 10 &&
      clickedPos.x <= pos.x + width / 2 + 10 &&
      clickedPos.y >= pos.y - height / 2 - 10 &&
      clickedPos.y <= pos.y + height / 2 + 10
    )
  }

  function isTextInArea(pos, width, height) {
    return (
      clickedPos.x >= pos.x - 10 &&
      clickedPos.x <= pos.x + width + 10 &&
      clickedPos.y >= pos.y - height - 10 &&
      clickedPos.y <= pos.y - 10
    )
  }

  const lineIdx = gMeme.lines.findIndex(
    (line) =>
      (line.sticker && isStickerInArea(line.pos, line.size, line.size)) ||
      (line.txt &&
        isTextInArea(line.pos, gCtx.measureText(line.txt).width, line.size))
  )

  if (lineIdx !== -1) setCurrLine(lineIdx)

  return lineIdx !== -1
}

function setLineDrag(isDrag) {
  const line = getCurrLine()
  line.isDrag = isDrag
}

function moveLine(dx, dy) {
  const line = getCurrLine()
  line.pos.x += dx
  line.pos.y += dy
}

function setLineInitPos(pos) {
  const line = getCurrLine()
  line.pos = pos
}

function _createMemeLine() {
  gMeme.lines.push({
    id: gMeme.lines.length,
    txt: '',
    size: 50,
    align: 'left',
    strokeClr: 'black',
    fillClr: 'whitesmoke',
    sticker: null,
    pos: { x: 30, y: 60 },
    isDrag: false,
  })
}

function saveMeme() {
  const memeIdx = getMemeIdxInStorage(gMeme.id)

  if (memeIdx === -1) gStorageMemes.push(gMeme)
  else gStorageMemes[memeIdx] = gMeme

  saveToStorage(STORAGE_KEY, gStorageMemes)
}

function loadMeme(id){
  const memeIdx = getMemeIdxInStorage(id)
  gMeme = gStorageMemes[memeIdx]
  initGenerator() // FIX - THIS SHOULD BE REPLACES FROM THE MEMES CONTROLLER (HIDE + INIT)
}

function getMemeIdxInStorage(id) {
  return gStorageMemes.findIndex((meme) => meme.id === id)
}
