
import { OBJECT_END_TOKEN, OBJECT_START_TOKEN } from "../constant";
import { CompressOptions,  Compressors, Context, InvertedIndex } from "../interface";
import { ZipsonWriter } from "./writer";



export const compresObject = (
    compressors: Compressors, 
    context: Context, 
    obj: any, 
    invertedIndex: InvertedIndex, 
    writer: ZipsonWriter, 
    options: CompressOptions
) => {
    writer.write(OBJECT_START_TOKEN)
    const keys = Object.keys(obj); 
    
    
    let templateObj = new compressors.template.Object(obj[keys[0]], obj[keys[1]]); 
    if(templateObj.isTemplating) {
        templateObj.compressTemplate(compressors, context, invertedIndex, writer, options);
    }

    for(let i = 0; i<keys.length; i++) {
        if (i >1 && templateObj.isTemplating) {
            templateObj.isNextTemplateable(obj[keys[i]], writer); 
        }

        if(templateObj.isTemplating) {
            compressors.string(compressors, context, keys[i], invertedIndex, writer, options); 
            templateObj.compressTemplateValues(compressors, context, invertedIndex, writer, options, obj[keys[i]])
        
        }else {
            const key = keys[i];
            const val = obj[key];
            if(val != undefined) {
                compressors.string(compressors, context, key, invertedIndex, writer, options)
                compressors.any(compressors, context, val, invertedIndex, writer, options)
            }
        }
    }


    if(templateObj.isTemplating) {// Finalize template object if still templating
        templateObj.end(writer);
    }


    writer.write(OBJECT_END_TOKEN); 

}