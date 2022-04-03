import { ARRAY_END_TOKEN, OBJECT_END_TOKEN } from "../constant";
import { Cursor, OrderedIndex, SKIP_SCALAR, TargetType } from "./common";
import { decompressScalar } from './scaler'
import { appendTemplateObjectElementsValue, appendTemplateObjectPropertiesValue } from "./template";


/**
 * stopped here
 * @param c 
 * @param cursor 
 * @param data 
 * @param orderedIndex 
 * @returns 
 */

export const decompressElement = (c: string, cursor: Cursor, data: string, orderedIndex: OrderedIndex) => {
    let targetValue: any;

    if(c == ARRAY_END_TOKEN || c == OBJECT_END_TOKEN) {
        targetValue = cursor.currentTarget.value;
        cursor.currentTarget = cursor.stack[cursor.pointer - 1]; 
        cursor.pointer--; 
    }else {
        targetValue = decompressScalar(c, data, cursor, orderedIndex)
        if(targetValue === SKIP_SCALAR) { return false; }
    }


    if(cursor.currentTarget.type === TargetType.SCALAR) {
        cursor.currentTarget.value = targetValue;
    }else if(cursor.currentTarget.type === TargetType.ARRAY) {
        cursor.currentTarget.value[cursor.currentTarget.value.length] = targetValue;
    }else if(cursor.currentTarget.type === TargetType.OBJECT) {
        if(cursor.currentTarget.key != null) {
            cursor.currentTarget.value[cursor.currentTarget.key] = targetValue;
            cursor.currentTarget.key = void 0;
          } else {
            cursor.currentTarget.key = targetValue;
          }

    }else if(cursor.currentTarget.type === TargetType.TEMPLATE_OBJECT) {
        cursor.currentTarget.currentToken = targetValue;
    }else if(cursor.currentTarget.type === TargetType.TEMPLATE_OBJECT_PROPERTIES) {
        appendTemplateObjectPropertiesValue(cursor.currentTarget, targetValue);
    }else if(cursor.currentTarget.type === TargetType.TEMPLATE_OBJECT_ELEMENTS) {
        appendTemplateObjectElementsValue(cursor.currentTarget, targetValue);
    }
    return true;
}