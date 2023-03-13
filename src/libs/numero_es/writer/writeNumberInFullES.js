const {
  separateNumberClasses,
  fractionalParteOf,
  splitNumber,
  fractionalPartCounter,
  capitalizeFirstLetter,
  cutDoubleSpace,
} = require('../helpers/helpersFunctions.js');

function numberInFullConverterES(number) {
  // Trocar vírgula por ponto
  const stringNumber = number?.toString()?.replace(',', '.');
  // Recuperar valor numérico
  const numericValue = parseFloat(stringNumber);
  // Separar parte inteira
  const integerNumber = Math.trunc(numericValue);

  const oneBillion = 1000000000;
  const oneMillion = 1000000;
  const upperLimit = 999 * oneBillion;

  const {
    hundredsClass,
    thousandsClass,
    millionsClass,
    billionsClass,
  } = separateNumberClasses(integerNumber);

  const cents = fractionalParteOf(numericValue);
  let centsLength = null;

  const billionsInFull =
    (billionsClass == 1 ? '' : classesInFullES(billionsClass)) +
    (billionsClass ? ' mil millones ' : '');

  const millionsInFull =
    classesInFullES(millionsClass) +
    (millionsClass > 1 ? ' millones ' : millionsClass == 1 ? ' millón ' : '');

  const thousandsInFull =
    (thousandsClass == 1 ? '' : classesInFullES(thousandsClass)) +
    (thousandsClass > 0 ? ' mil ' : '');

  const hundredsInFull = classesInFullES(hundredsClass);

  const centsInFull =
    (cents == 0 ? '' : ' con ') +
    classesInFullES(cents) +
    (cents > 1 ? ' céntimos' : cents == 1 ? ' céntimo' : '');

  const spainCurrency =
    integerNumber &&
    (integerNumber % oneBillion == 0 || integerNumber % oneMillion == 0
      ? ' '
      : integerNumber > 1
        ? ' '
        : ' ');

  let caseSelect = null;

  // Caso o valor esteja acima do limite de 999bilhões, mostrar aviso ao usuário
  if (integerNumber >= upperLimit) caseSelect = 1;

  // Caso sejam usados mais que dois dígitos após a vírgula,
  // mostrar aviso ao usuário
  // evitando comportamento inadequado para o caso de R$ 0,100
  if (cents) centsLength = fractionalPartCounter(number);

  if (centsLength > 2) caseSelect = 2;

  // Caso o valor seja nulo, a resultado será "Cero euro"
  // Isso evita o surgimento de valor "undefined" para os centavos
  if (!numericValue) caseSelect = 3;

  let valueInFull = '';

  switch (caseSelect) {
    case 1:
      valueInFull = 'Valor mayor que 999 mil miillones de euros ';
      break;
    case 2:
      valueInFull = 'Los céntimos deben constar de un máximo de dos dígitos ';
      break;
    case 3:
      valueInFull = '';
      break;
    default:
      valueInFull =
        (integerNumber
          ? billionsInFull +
          millionsInFull +
          thousandsInFull +
          hundredsInFull +
          spainCurrency
          : 'Cero euro ') + centsInFull;
      valueInFull = cutDoubleSpace(valueInFull);
  }

  const capitalizedValueInFull = capitalizeFirstLetter(valueInFull).trim();

  return capitalizedValueInFull;
}

// Escreve por extenso números menores que 1000 em ES-ES
function classesInFullES(number) {
  const lessThanThirty = [
    '',
    'un',
    'dos',
    'tres',
    'cuatro',
    'cinco',
    'seis',
    'siete',
    'ocho',
    'nueve',
    'diez',
    'once',
    'doce',
    'trece',
    'catorce',
    'quince',
    'dieciséis',
    'diecisiete',
    'dieciocho',
    'diecinueve',
    'veinte',
    'veintiun',
    'veintidós',
    'veintitrés',
    'veinticuatro',
    'veinticinco',
    'veintiséis',
    'veintisiete',
    'veintiocho',
    'veintinueve',
  ];

  const tensAfterThirty = [
    '',
    'treinta',
    'cuarenta',
    'cincuenta',
    'sesenta',
    'setenta',
    'ochenta',
    'noventa',
  ];

  const hundreds = [
    '',
    'ciento',
    'doscientos',
    'trescientos',
    'cuatrocientos',
    'quinientos',
    'seiscientos',
    'setecientos',
    'ochocientos',
    'novecientos',
  ];

  let numberInFull = '';
  let { unitsPart, tensPart, hundredsPart } = splitNumber(number);

  const hundredsPartInFull =
    (number == 100 ? 'cien' : hundreds[hundredsPart]) + ' ';

  const tensPartInFull =
    tensPart == 0
      ? ''
      : tensPart > 2
        ? tensAfterThirty[tensPart - 2]
        : tensPart == 1
          ? lessThanThirty[unitsPart + 10]
          : lessThanThirty[unitsPart + 20];

  const unitsPartInFull = lessThanThirty[unitsPart];

  numberInFull =
    hundredsPartInFull +
    tensPartInFull +
    (unitsPart == 0 ? '' : tensPart > 2 ? ' y ' : '') +
    (tensPart > 2 || tensPart == 0 ? unitsPartInFull : '');

  return numberInFull;
}

module.exports = { numberInFullConverterES, classesInFullES };
