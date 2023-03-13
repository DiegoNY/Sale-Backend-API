// Retira espaços vazios duplos de uma string
function cutDoubleSpace(str) {
  str = str.replace(/\s{2,}/g, ' ');
  return str;
}

function capitalizeFirstLetter(str) {
  //pega apenas as palavras e tira todos os espaços em branco.
  return str.replace(/\w\S/, function (str) {
    //passa o primeiro caractere para maiusculo, e adiciona o todo resto minusculo
    return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
  });
}

// Informa o número de casas decimais de um número
function fractionalPartCounter(number) {
  // Forma alternativa de conversão número-string
  const stringNumber = number + '';
  // Trocar vírgula por ponto
  const newStringNumber = stringNumber.replace(',', '.');
  const stringFractionalPart = newStringNumber.split('.');
  const fractionalLength = stringFractionalPart[1].length;

  return fractionalLength;
}

// Separa centenas, dezenas, unidades  de um número
function splitNumber(number) {
  // Separar centena
  const hundredsPart = Math.trunc(number / 100);

  // Separar dezena
  const integerQuotient = Math.trunc(number / 10);
  const tensPart = integerQuotient % 10;

  // Separar unidade
  const unitsPart = Math.trunc(number) % 10;

  return { unitsPart, tensPart, hundredsPart };
}

// Separa a parte decimal de um número
function fractionalParteOf(number) {
  const integralPart = Math.trunc(number);
  const fractionalPart = number - integralPart;
  const roundedFractionalPart = Math.round(fractionalPart + 'e+2');

  return roundedFractionalPart;
}

// Separa número nas classes: centenas, milhares, milhões, bilhões
function separateNumberClasses(number) {
  const oneBillion = 1000000000;
  const oneMillion = 1000000;
  const oneThousand = 1000;

  const billionsClass = Math.trunc(number / oneBillion);

  const millionsClass = Math.trunc(
    (number - billionsClass * oneBillion) / oneMillion
  );

  const thousandsClass = Math.trunc(
    (number - billionsClass * oneBillion - millionsClass * oneMillion) /
    oneThousand
  );

  const hundredsClass = Math.trunc(
    number -
    billionsClass * oneBillion -
    millionsClass * oneMillion -
    thousandsClass * oneThousand
  );

  return { hundredsClass, thousandsClass, millionsClass, billionsClass };
}

module.exports = {
  separateNumberClasses,
  fractionalParteOf,
  splitNumber,
  fractionalPartCounter,
  capitalizeFirstLetter,
  cutDoubleSpace,
};
