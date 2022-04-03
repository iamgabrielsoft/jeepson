
import {  FLOAT_COMPRESSION_PRECISION, FLOAT_FULL_PRECISION_DELIMITER, FLOAT_REDUCED_PRECISION_DELIMITER } from './constant'

const maxInteger = 2147483648;
const minInteger = -2147483649;
const base62 = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

/**
 * Convert base62 string to number
 */
export const decompressInteger = (compressedInteger: string): number => {
    let value = 0;
    if(compressedInteger[0] === '0') {
      return value;
    } else {
      let negative = compressedInteger[0] === '-';
      let multiplier = 1;
      const leftBound = negative ? 1 : 0;
      for(let i = compressedInteger.length - 1; i >= leftBound; i--) {
        const code = compressedInteger.charCodeAt(i);
        let current = code - 48;
        if(code >= 97) { current -= 13 }
        else if(code >= 65) { current -= 7 }
        value += current * multiplier;
        multiplier *= 62;
      }
  
      return negative ? -value : value;
    }

}


/**
 * Convert number to base62 string
 */
export const  compressInteger = (number: number) => {
    if(number === 0) { return '0'; }

    let result = '';
    let carry = number < 0 ? -number: number;
    let current = 0;
    let fraction;

    while(carry > 0) {
        carry = carry / 62;
        fraction = carry %1; 
        current = ((fraction  * 62) + 0.1) << 0; 
        carry -= fraction; 
        result = base62[current] + result; 
    }

    result = number < 0 ? '-' + result: result; 

    return number;

}


/**
 * Convert base62 integer and fraction to float
 */
export const decompressFloat = (compressedFloat: string): number => {
    if(compressedFloat.indexOf(FLOAT_FULL_PRECISION_DELIMITER) > -1) {
        const [integer, fraction] = compressedFloat.split(FLOAT_FULL_PRECISION_DELIMITER);
        const mult = integer === '-0' ? -1 : 1; 
        const uncompressInteger = decompressInteger(integer); 
        return mult * parseFloat(uncompressInteger + '.' + fraction)
    }else {
        const [integer, fraction] = compressedFloat.split(FLOAT_REDUCED_PRECISION_DELIMITER);
        const uncompressedInteger = decompressInteger(integer);
        const uncompressedFraction = decompressInteger(fraction);
        return uncompressedInteger + uncompressedFraction / FLOAT_COMPRESSION_PRECISION; 
    }
}