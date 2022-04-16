'use strict'

function renderGallery(keyword = null) {
  const imgs = getImgs(keyword)
  let strHtml = ''
  imgs.forEach(
    (img) =>
      (strHtml += `
        <li><img src="${img.url}" alt="${img.alt}" onclick="onImgSelect(${img.id})" /></li>
    `)
  )

  strHtml += `<div class="invisible-btn">
    <li><img src="img/upload-img.png" alt="upload image"/></li>
    <input type="file" class="upload-img-btn" onchange="onUserImg(event)" accept="image/png, image/jpeg">
  </div>`

  document.querySelector('.image-gallery').innerHTML = strHtml
}

function renderKeywordsDataList(){
  const keywords = new Set()
  const imgs = getImgs()
  imgs.forEach(img => img.keywords.forEach(word => keywords.add(word)))

  // const keywords = getKeywords()
  const strHtml = Array.from(keywords).sort().map(keyword => `
    <option value="${getCamelCase(keyword)}">
  `)

  document.getElementById('keywords-list').innerHTML = strHtml.join('')
}

function onSearch(keyword){
  renderGallery(keyword)
}

function onImgSelect(id, userImg = null) {
  createNewMeme()
  setImg(id, userImg)
  showEditor()

  initGenerator()
}

/* USER UPLOAD IMAGE*/

function onUserImg(ev) {
  loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
  var reader = new FileReader()

  reader.onload = (event) => {
    var img = new Image()
    img.src = event.target.result
    img.onload = onImageReady.bind(null, img)
  }
  reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img) { 
  //we set img 1, but it will be ignored
  onImgSelect(1, img.src)
}
