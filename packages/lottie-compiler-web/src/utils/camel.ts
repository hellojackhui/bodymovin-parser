type TisCamelCase = (str: string) => boolean;
type TSetAttrName = (str: string) => string;

const specialTag = [
    'viewBox'
]

const isCamelCase: TisCamelCase = (str) => {
    return !!/([A-Z])/g.exec(str) && !specialTag.includes(str);
}

const camelCaseToAttrs: TSetAttrName = (str) => {
    if (isCamelCase(str)) {
        return str.replace(/([A-Z])/g, (v) => {
            return `-${v.toLowerCase()}`;
        })
    }
}


export {
    isCamelCase,
    camelCaseToAttrs,
}