
import { compressAny } from "./compressor/any";
import { compressArray } from "./compressor/array";
import { compressDate } from "./compressor/date";
import { compressNumber } from "./compressor/number";
import { compresObject } from "./compressor/object";
import { compressString } from "./compressor/string";
import { TemplateObject } from "./compressor/template/object";
import { ZipsonWriter } from "./compressor/writer";
import { CompressOptions, Compressors, Context, InvertedIndex } from "./interface"


/** create a new compression context */
export const makeCompressContext = ():Context => {
    return {
        arrayItemWriter: [], 
        arrayLevel: 0
    }
}



export const compressors: Compressors = {
    any: compressAny, 
    array: compressArray, 
    object: compresObject, 
    date: compressDate, 
    number: compressNumber, 
    string: compressString,
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