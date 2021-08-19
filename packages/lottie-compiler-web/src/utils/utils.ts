function isBase64(url: string) {
    return !!(`${url}`.match(/png;base64/));
}

function framesFilter(data) {
    let set = [];
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
        const obj = {
            ...data[keys[i]],
            offset: 0,
        }
        let attrStr = typeof data[keys[i]] === 'object' ? JSON.stringify(obj) : '';
        if (!set.length || set[set.length - 1] !== attrStr) {
            set.push(attrStr);
        } else if (data[keys[i]].offset !== 1) {
            delete data[keys[i]];
        }
    }
    return data;
}

export {
    isBase64,
    framesFilter,
};