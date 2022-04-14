'use strict'

function onInit() {
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
}

function showEditor() {
  document.querySelector('.main-gallery').classList.add('hide')
  document.querySelector('.main-editor').classList.remove('hide')
}

function toggleMenu() {
  document.body.classList.toggle('menu-open')
}