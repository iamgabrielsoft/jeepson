
import { ZipsonStringWriter, ZipsonWriter } from "./compressor/writer";

export interface Context {
    arrayItemWriter: ZipsonStringWriter[];
    arrayLevel: number; 
}


export interface CompressOptions {
    detectUtcTimestamps?: boolean;
    fullPrecisionFloats?: boolean;
}



export interface InvertedIndex {
    dateCount: number; 
    stringCount: number; 
    integerCount: number; 
    floatCount: number; 
    lpDateCount: number;
    stringMap:  { [index: string]: string }
    integerMap: { [index: number]: string }
    floatMap:   { [index: string]: string }
    dateMap:    { [index: number]: string }
    lpDateMap:  { [index: number]: string }
}


export interface TemplateCompressor<T> {
    isTemplating: boolean;
    isNextTemplateable: (obj: T, writer: ZipsonWriter) => void; 
    compressTemplate: (compressors: Compressors, context: Context, invertedIndex: InvertedIndex, writer: ZipsonWriter, options: CompressOptions) => void;
    compressTemplateValues: (compressors: Compressors, context: Context, invertedIndex: InvertedIndex, writer: ZipsonWriter, options: CompressOptions, obj: T) => void;
    end: (writer: ZipsonWriter) => void
}


export type Compressor<T> = (
    compressor: Compressors,
    context: Context,
    obj: T,
    invertedIndex: InvertedIndex, 
    writer: ZipsonWriter,
    options: CompressOptions
 ) => void;



 
/**
 * All available compressors for specific types
 */
 export interface Compressors {
     any: Compressor<any>; 
     array: Compressor<any[]>; 
     object: Compressor<any>; 
     string: Compressor<any>; 
     date: Compressor<number>; 
     number: Compressor<number>; 
     template: {
         Object: new (a: any, b: any) => TemplateCompressor<any>; 
     }
 }