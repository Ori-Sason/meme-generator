'use strict'

//KEYWORDS: animal, politician, baby, dog, cat, men, women, actors, movies, funny, comic, smile

const gKeywordSearchCountMap = {}

const gImgs = [
  { id: 1, url: '../../img/gallery/1.jpg', keywords: ['politician', 'men'], alt: 'donald trump' },
  { id: 2, url: '../../img/gallery/2.jpg', keywords: ['animal', 'dog', 'smile'], alt: 'puppies' },
]

const gMeme = {
  selectedImgId: 1,
  selectedLineIdx: 0,
  lines: [
    {
      txt: '',
      size: 20,
      align: 'left',
      color: 'red',
    },
  ],
}

function getImgs(){
    return gImgs
}

function getMeme() {
  return gMeme
}

function setLineTxt(text) {
  gMeme.lines[selectedLineIdx].txt = text
}

function getImg(id){
    return gImgs.find(img => img.id === id)
}

function setImg(id){
    gMeme.selectedImgId = id
}
