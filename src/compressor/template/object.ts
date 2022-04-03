
import { TEMPLATE_OBJECT_END, TEMPLATE_OBJECT_START } from "../../constant";
import { CompressOptions, Compressors, Context, InvertedIndex, TemplateCompressor } from "../../interface";
import { ZipsonWriter } from "../writer";



type TemplateStructField = [string];
type TemplateStructNestedField = [string, TemplateStruct];
interface TemplateStruct extends Array<TemplateStructField | TemplateStructNestedField> {
  [index: number]: TemplateStructField | TemplateStructNestedField;
}



export class TemplateObject implements TemplateCompressor<any> {
    public isTemplating: boolean;
    private struct: TemplateStruct = []; 


    constructor(a: any, b: any) {
        if(a != null && b != null) {
            this.isTemplating = buildTemplate(a, b, this.struct);
          }
    }

    compressTemplate = (compressors: Compressors, context: Context, invertedIndex: InvertedIndex, writer: ZipsonWriter, options: CompressOptions) => void; {
        compressObjectTemplate(compressors, context, invertedIndex, writer, options, this.struct)
    }

    compressTemplateValues  (
        compressors: Compressors,
        context: Context,
        invertedIndex: InvertedIndex,
        writer: ZipsonWriter,
        options: CompressOptions,
        obj: any) {
            compressObjectValues(compressors, context, invertedIndex, writer, options, this.struct, obj)
    }

    isNextTemplateable(obj: any, writer: ZipsonWriter) {
        this.isTemplating = conformsToStructure(this.struct, obj);
        if(!this.isTemplating) {
          writer.write(TEMPLATE_OBJECT_FINAL);
        }
    }


    end(writer: ZipsonWriter) {
        writer
    }
    
}


const buildTemplate = (a: any, b: any, struct: TemplateStruct, level = 0): boolean => {
    if(level > 6) { return false; }

    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
  
    // If they do not have the same amount of keys, it is not a shared structure
    if(keysA.length !== keysB.length) { return false; }
  
    // Do not try to find a shared structure if there is more than 10 keys for one level
    if(keysA.length > 10) { return false; }
  
    // Sort keys to assert structural equality
    keysA.sort((a, b) => a.localeCompare(b));
    keysB.sort((a, b) => a.localeCompare(b));
  
    // Check each key for structural equality
    for(let i = 0; i < keysA.length; i++) {
      const keyA = keysA[i];
      const keyB = keysB[i];
      // If the keys do not share the same identifier, they are not structurally equal
      if(keyA !== keyB) { return false; }
  
      const valueA = a[keyA];
      const valueB = b[keyB];
  
      // Check if the key is an object
      if(isObject(valueA)) {
        if(!isObject(valueB)) {
          // If a is an object a b is not, they are not structurally equal
          return false;
        }
  
        // Create a substructure for nested object
        const nextStruct: TemplateStruct = [];
  
        // Add key and substructure to parent structure
        struct.push([keyA, nextStruct]);
  
        // Check nested objects for structural equality
        if(!buildTemplate(valueA, valueB, nextStruct, level + 1)) {
          return false;
        }
      } else if(isObject(valueB)) {
        // If a is not an object and b is, they are not structurally equal
        return false;
      } else {
        struct.push([keyA]);
      }
    }
  
    // If not on root level or root level is structurally equal objects they are considered structurally equal
    return level > 0 || isObject(a);
}


/** Check if an object conforms to an existing structure */
const conformsToStructure = (struct: TemplateStruct, obj: any) => {
  if(!obj) { return false; }
  if(Object.keys(obj).length !== struct.length) { return false; }
  for(let i = 0; i < struct.length; i++) {
    const key = struct[i][0];
    const isNested = struct[i].length > 1;
    if(obj[key] === void 0) { return false; }
    if(isNested) {
      const x = struct[i];
      const y = x[1];
      if(!conformsToStructure(<TemplateStruct>struct[i][1], obj[key])) { return false; }
    } else {
      if(isObject(obj[key])) { return false; }
    }
  }
  return true 
}

const compressObjectTemplate = (
  compressors: Compressors,
  context: Context,
  invertedIndex: InvertedIndex,
  writer: ZipsonWriter,
  options: CompressOptions,
  struct: TemplateStruct) => {
    writer.write(TEMPLATE_OBJECT_START)

    for(let i = 0; i< struct.length; i++) {
      const key = struct[i][0]; 
      const isNested = struct[i].length > 1;
      compressors.string(compressors, context, key, invertedIndex, writer, options); 
      if(isNested) {
        compressObjectTemplate(compressors, context, invertedIndex, writer, options, <TemplateStruct>struct[i][1])
      }
    }

    writer.write(TEMPLATE_OBJECT_END); 
  } 
   


/**
 * Compress object values according to provided structure to writer
 */
function compressObjectValues(  compressors: Compressors,
  context: Context,
  invertedIndex: InvertedIndex,
  writer: ZipsonWriter,
  options: CompressOptions,
  struct: TemplateStruct,
  obj: any) {
  
    for(let i = 0; i<struct.length; i++) {
      const key = struct[i][0]; 
      const isNested = struct[i].length > 1; 
      if(isNested) {
        compressObjectValues(compressors, context, invertedIndex, writer, options, <TemplateStruct>struct[i][1], value)
      }else {
        compressors.any(compressors, context, value, invertedIndex, writer, options);
      }
    }
}
