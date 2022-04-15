'use strict'

const STORAGE_KEY = 'memeDB'

function onInit() {
  const storagedMemes = getFromStorage(STORAGE_KEY)
  if(storagedMemes) gStorageMemes = storagedMemes
  
  renderGallery()
  addListeners()
}

function addListeners() {
  addMouseListeners()
  addTouchListeners()
  window.addEventListener('resize', () => {
    resizeCanvas()
    renderMeme()
  })
}

function addMouseListeners() {
  gElCanvas.addEventListener('mousemove', onMove)
  gElCanvas.addEventListener('mousedown', onDown)
  gElCanvas.addEventListener('mouseup', onUp)
}

function addTouchListeners() {
  gElCanvas.addEventListener('touchmove', onMove)
  gElCanvas.addEventListener('touchstart', onDown)
  gElCanvas.addEventListener('touchend', onUp)
}

function showGallery() {
  document.querySelector('.main-gallery').classList.remove('hide')
  document.querySelector('.main-editor').classList.add('hide')
  gUserImg = null
}

function showEditor() {
  document.querySelector('.main-gallery').classList.add('hide')
  document.querySelector('.main-editor').classList.remove('hide')
}

function toggleMenu() {
  document.body.classList.toggle('menu-open')
}