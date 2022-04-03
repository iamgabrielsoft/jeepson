import { compress, makeCompressContext, makeInverterdIndex } from "./compress";
import { ZipsonStringWriter, ZipsonWriter } from "./compressor/writer";
import { decompress, decompressIncremental, makeOrderedIndex } from "./decompress"
import { CompressOptions } from "./interface";



/** parse data */
export const parse = (data: any): any => {
    const orderedIndex = makeOrderedIndex(); 
    return decompress(data, orderedIndex); 

}

/**parse incremental value */
export const parseIncrementalValue = () => {
    const orderedIndex = makeOrderedIndex()
    const { increment, cursor} = decompressIncremental(orderedIndex); 

    return (data: string | null) => {
        increment(data); 
        if(data === null) { return cursor.rootTarget.value }
    }
}


export const stringify = (data: any, options?: CompressOptions): string => {
    const writer = new ZipsonStringWriter()
    stringifyTo(data, writer, options); 
    return writer.value; 
}

/** stringify data */
export const stringifyTo = (data: any, writer: ZipsonWriter, options: CompressOptions = {}): void => {
    const invertedIndex = makeInverterdIndex(); 
    const context = makeCompressContext(); 
    compress(context, data, invertedIndex, writer, options); 
    writer.end();
}


