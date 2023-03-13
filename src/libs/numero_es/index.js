const { numberInFullConverterES } = require('./writer/writeNumberInFullES.js');

function numberInFullConverter(number) {
  let numberInFull = '';
  numberInFull = numberInFullConverterES(number);
  return numberInFull;
}

export { numberInFullConverter };
