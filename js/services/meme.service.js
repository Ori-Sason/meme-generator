'use strict'

//KEYWORDS: animal, politician, baby, dog, cat, men, women, actors, movies, funny, comic, smile

const gKeywordSearchCountMap = {}

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
  lines: [
    {
      txt: '',
      size: 50,
      align: 'left',
      strokeClr: 'black',
      fillClr: 'whitesmoke',
    },
  ],
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

function setFontSize(step){
    getCurrLine().size += +step
}

