const crypto = require('crypto');

exports.kreirajSHA256 = function(tekst){
  const hash = crypto.createHash('sha256');
  hash.update(tekst);
  return hash.digest('hex');
}

exports.kreirajSHA256 = function(tekst, sol){
  const hash = crypto.createHash('sha256');
  hash.update(tekst + sol);
  return hash.digest('hex');
}

exports.dajNasumceBroj = function(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); 
}
