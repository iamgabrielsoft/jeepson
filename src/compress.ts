
import { ZipsonWriter } from "./compressor/writer";
import { CompressOptions, Compressors, Context, InvertedIndex } from "./interface"


export const compressors: Compressors = {
    any: compressAny, 
    array: compressArray, 
    object: compressObject, 
    date: compressDate, 
    number: compressNumber, 
    template: {
        Object: TemplateObject
    }
}; 



/**
 * Create an inverted index for compression
 */
export const makeInverterdIndex = (): InvertedIndex => {
    return {
        stringMap: {},
        integerMap: {},
        floatMap: {},
        dateMap: {},
        lpDateMap: {},
        stringCount: 0,
        integerCount: 0,
        floatCount: 0,
        dateCount: 0,
        lpDateCount: 0,
    }
}


/**
 * Compress all data onto a provided writer
 */

export const compress = (context: Context, obj: any, invertedIndex: InvertedIndex, writer: ZipsonWriter, options: CompressOptions) => {
    compressors.any(compressors, context, obj, invertedIndex, writer, options); 
}