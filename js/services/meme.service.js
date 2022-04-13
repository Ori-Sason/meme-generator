'use strict'

//KEYWORDS: animal, politician, baby, dog, cat, men, women, actors, movies, funny, comic, smile

const gKeywordSearchCountMap = {}
const gFontFamilies = ['impact', 'fontdiner-swanky', 'lobster', 'poppins']

const gImgs = [
  {
    id: 1,
    url: '../../img/gallery/1.jpg',
    keywords: ['politician', 'men'],
    alt: 'donald trump',
  },
  {
    id: 2,
    url: '../../img/gallery/2.jpg',
    keywords: ['animal', 'dog', 'smile'],
    alt: 'puppies',
  },
]

const gMeme = {
  selectedImgId: 1,
  selectedLineIdx: 0,
  lines: [],
}

function getImgs() {
  return gImgs
}

function getMeme() {
  return gMeme
}

function setLineTxt(text) {
  gMeme.lines[gMeme.selectedLineIdx].txt = text
}

function getCurrLine() {
  if(gMeme.lines.length === 0) return null
  return gMeme.lines[gMeme.selectedLineIdx]
}

function getImg(id) {
  return gImgs.find((img) => img.id === id)
}

function setImg(id) {
  gMeme.selectedImgId = id
}

function setStrokeClr(clr) {
  gMeme.lines[gMeme.selectedLineIdx].strokeClr = clr
}

function setFillClr(clr) {
  gMeme.lines[gMeme.selectedLineIdx].fillClr = clr
}

function setFontSize(step) {
  getCurrLine().size += +step
}

function addLine() {
  _createMemeLine()
  gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function switchLine() {
  if (gMeme.selectedLineIdx === gMeme.lines.length - 1) {
    return (gMeme.selectedLineIdx = 0)
  }

  gMeme.selectedLineIdx++
}

function getFontFamilies(){
  return gFontFamilies
}

function _createMemeLine() {
  gMeme.lines.push({
    txt: '',
    size: 50,
    align: 'left',
    strokeClr: 'black',
    fillClr: 'whitesmoke',
  })
}
