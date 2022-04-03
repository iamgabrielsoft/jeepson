
import { OrderedIndex, Cursor, Target, TargetType} from "./decompressor/common";


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
function makeCursor(drain: boolean): Cursor {
    const rootTarget: Target = { type: TargetType.SCALAR, value: void 0 };
    const stack: Target[] = new Array(10);
    stack[0] = rootTarget;
  
    return { index: 0, rootTarget, stack, currentTarget: rootTarget, pointer: 0, drain };
  }