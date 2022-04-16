'use strict'

const STORAGE_KEY = 'memeDB'

function onInit() {
  createKeywordSearchMap()
  renderKeywords()
  renderKeywordsDataList()

  loadMemesFromStorage()
  createNewMeme()
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
  hideAllMainSections()
  document.querySelector('.main-gallery').classList.remove('hide')
  document.querySelector('.gallery-link').classList.add('active-page')
  hideMenu()  
}

function showEditor() {
  hideAllMainSections()
  document.querySelector('.main-editor').classList.remove('hide')
}

function showSavedMemes() {
  renderMemesFromStorage()
  hideAllMainSections()
  document.querySelector('.storage-gallery').classList.remove('hide')
  document.querySelector('.saved-memes-link').classList.add('active-page')
  hideMenu()
}

function hideAllMainSections() {
  const sections = document.querySelectorAll('.body-container>main section')
  sections.forEach(section => section.classList.add('hide'))
  
  const links = document.querySelectorAll('.header-links .nav-bar a')
  links.forEach(link => link.classList.remove('active-page'))
}

function toggleMenu() {
  document.body.classList.toggle('menu-open')
}

function hideMenu(){
  document.body.classList.remove('menu-open')
}
