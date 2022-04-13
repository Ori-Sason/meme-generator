'use strict'

function getCamelCase(txt){
    function firstCharUpperCase(word){
        return word.charAt(0).toUpperCase() + word.substring(1)
    }

    return txt.split('-').map(word => firstCharUpperCase(word)).join(' ')
}