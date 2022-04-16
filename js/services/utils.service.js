'use strict'

function getCamelCase(txt) {
  function firstCharUpperCase(word) {
    return word.charAt(0).toUpperCase() + word.substring(1)
  }

  return txt
    .split('-')
    .map((word) => firstCharUpperCase(word))
    .join(' ')
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min)
}
