// 15481555260c011c535055565d671501024255554b00350d131d0a0a024c
// 064f0610000b011c4e041645135f114f4a1f0a015241024511061d1b074e
// 034904161d0c0259490345020048151b0d1116451300100a001e49000800
// 2f001f0716001e59541f450d135b114f4c50010011451811001205061d45
// 005350061d06051c54094507174e1b02480345081d521345131d0d4f034f
// 0800121015040259541f4517174c18065e15450b175756151d001a060c49
// 02520905060a0f0c5202000b1144111c0d1109091d571301521d06014343
// 0f4f04550b0a190b001b001c010154214204451c1d550445111c00011d0e

let getBinaryArray = (encryptedMessage) => {
  const output = [];

  encryptedMessage.split("").forEach((letter) => {
    output.push(convertStringToBinaryString(letter));
  });

  return output;
};

let convertStringToBinaryString = (input) => {
  let output = "";
  for (var i = 0; i < input.length; i++) {
    let binaryWithoutLeadingZeros = input[i].charCodeAt(0).toString(2);
    let binary = binaryWithoutLeadingZeros;
    if (binary.length < 8) {
      while (binary.length < 8) {
        binary = "0" + binary;
      }
    }
    output += binary;
  }
  return output;
};

let decryptBinaryArray = (input, key) => {
  const output = [];

  input.forEach((binaryLetter) => {
    output.push(decrypt(binaryLetter, key));
  });

  return output;
};

let decrypt = (binaryLetterString, key) => {
  let output = "";
  for (var i = 0; i < binaryLetterString.length; i++) {
    let binaryDigit = Number(binaryLetterString[i]);
    let associatedKeyBinary = Number(key[i]);
    let xoredBinary = binaryDigit ^ associatedKeyBinary;
    output += String(xoredBinary);
  }
  return output;
};

let binaryArrayToString = (stringArray) => {
  var binCode = [];

  for (i = 0; i < stringArray.length; i++) {
    binCode.push(String.fromCharCode(parseInt(stringArray[i], 2)));
  }
  return binCode.join("");
};

let getKeyFromBinaryExpectedMostCommonLetter = (
  mostCommonEncryptedLetter,
  expectedMostCommonDecryptedLetter
) => {
  const encryptedLetterBinary = convertStringToBinaryString(mostCommonEncryptedLetter);
  const expectedLetterBinary = convertStringToBinaryString(expectedMostCommonDecryptedLetter);
  let output = "";
  for (var i = 0; i < encryptedLetterBinary.length; i++) {
    let encryptedBinaryDigit = Number(encryptedLetterBinary[i]);
    let expectedBinaryDigit = Number(expectedLetterBinary[i]);
    let xoredBinary = encryptedBinaryDigit ^ expectedBinaryDigit;
    output += String(xoredBinary);
  }
  return output;
};

const xorBinaryArrays = (array1, array2) => {
  const output = [];
  for (var i = 0; i < array1.length; i++) {
    const xored = decrypt(array1[i], array2[i]);
    output.push(xored);
  }
  return output;
};

const sliderFunction = (word, xoredString) => {
  const wordBinary = convertStringToBinaryString(word);
  for (let i = 0; i < xoredString.length; i++) {
    const xoredStringSlice = xoredString.slice(i, i + word.length);
    const decryptedWord = decrypt(xoredStringSlice, wordBinary);
    console.log(`index: ${i}: ${decryptedWord}`);
  }
};

const line1 = "15481555260c011c535055565d671501024255554b00350d131d0a0a024c";
const line2 = "064f0610000b011c4e041645135f114f4a1f0a015241024511061d1b074e";

const xoredLine1And2 = () => {
  const binaryArray1 = getBinaryArray(line1);
  const binaryArray2 = getBinaryArray(line2);
  const xoredBinaryArray = xorBinaryArrays(binaryArray1, binaryArray2);
  const xoredString = binaryArrayToString(xoredBinaryArray);
  console.log(xoredString);
  // sliderFunction("blockchain", xoredString);
};

xoredLine1And2();
