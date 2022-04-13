'use strict'

function onInit() {
  renderGallery()
  window.addEventListener('resize', () => {
    resizeCanvas()
    renderMeme()
  })
}

function showGallery() {
  document.querySelector('.main-gallery').classList.remove('hide')
  document.querySelector('.main-editor').classList.add('hide')
}

function showEditor() {
  document.querySelector('.main-gallery').classList.add('hide')
  document.querySelector('.main-editor').classList.remove('hide')
}
