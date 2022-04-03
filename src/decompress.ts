
import { OrderedIndex, Cursor, Target, TargetType} from "./decompressor/common";
import { decompressStages } from "./decompressor/stages";


/**
 * Create an ordered index for decompression
 */
 export function makeOrderedIndex(): OrderedIndex {
    return {
      strings: [],
      integers: [],
      floats: [],
      dates: [],
      lpDates: [],
    }
  }

  /**
 * Create a new cursor with a root target for specified drain mode
 */
export const makeCursor = (drain: boolean): Cursor => {
    const rootTarget: Target = { type: TargetType.SCALAR, value: void 0 };
    const stack: Target[] = new Array(10);
    stack[0] = rootTarget;
  
    return { index: 0, rootTarget, stack, currentTarget: rootTarget, pointer: 0, drain };
}


/**
 * Decompress data string with provided ordered index
 */
export const decompress = (data: string, orderedIndex: OrderedIndex) => {
  const cursor = makeCursor(true); 
  decompressStages(cursor, data, orderedIndex); 
  return cursor.rootTarget.value; 

}

/**
 * Decompress zipson data incrementally by providing each chunk of data in sequence
 */

export const decompressIncremental = (orderedIndex) => {
  const cursor = makeCursor(false); 

  let buffer = ''; 

  const increment = (data: string | null) => {
    if(data == null) {
      cursor.drain = true; // Move cursor to drain mode if we got the last chunk of data
    }

    else if(data.length == 0) return 
    else { 
      buffer += data; 
    }

    const cursorIndexBefor = cursor.index; 
    decompressStages(cursor, buffer, orderedIndex); 
    const moveAmount = cursor.index - cursorIndexBefor; 


    if(moveAmount > 0) {
      buffer = buffer.substring(moveAmount); 
      cursor.index -= moveAmount; 
    }
  }

  return { increment, cursor }
}