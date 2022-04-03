import { TemplateObjectIntermediateTarget, 
    TemplateObjectPropertiesTarget, 
    TemplateObjectElementsTarget
} from "./common";



export const appendTemplateObjectValue = (templateObjectTarget: TemplateObjectIntermediateTarget<any>, targetValue: any) => {
    const currentPath = templateObjectTarget.paths[templateObjectTarget.currentPathIndex]
    let i = 0;
    let targetObject = templateObjectTarget.currentObject;

    for(; i < currentPath.length - 1; i++) {
        const fragment = currentPath[i];
        targetObject = targetObject[fragment] = targetObject[fragment] || {};
    }
    
    if(targetValue != void 0) {
        targetObject[currentPath[i]] = targetValue
    }
}




export const appendTemplateObjectPropertiesValue = (templateObjectElementsTarget: TemplateObjectPropertiesTarget, targetValue: any) => {
    // If we have a negative path index that is the root identifier for a new object
    if(templateObjectElementsTarget.currentPathIndex === -1) {
      templateObjectElementsTarget.value[targetValue] = templateObjectElementsTarget.currentObject = {};
    } else {
      appendTemplateObjectValue(templateObjectElementsTarget, targetValue);
    }

    if(++templateObjectElementsTarget.currentPathIndex === templateObjectElementsTarget.expectedPaths) {
        templateObjectElementsTarget.currentPathIndex = -1;
    }
}




export const appendTemplateObjectElementsValue = (templateObjectPropertiesTarget: TemplateObjectElementsTarget, targetValue: any) => {
    if(templateObjectPropertiesTarget.currentPathIndex === 0) {
        templateObjectPropertiesTarget.currentObject = {};
        templateObjectPropertiesTarget.value.push(templateObjectPropertiesTarget.currentObject);
    }


    appendTemplateObjectValue(templateObjectPropertiesTarget, targetValue);


    // If we got all path values, rotate to 0 for the next element
    if(++templateObjectPropertiesTarget.currentPathIndex === templateObjectPropertiesTarget.expectedPaths) {
        templateObjectPropertiesTarget.currentPathIndex = 0;
      }

}
