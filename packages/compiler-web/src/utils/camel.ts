type TisCamelCase = (str: string) => boolean;
type TSetAttrName = (str: string) => string;

const isCamelCase: TisCamelCase = (str) => {
    return !!/([A-Z])/g.exec(str);
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