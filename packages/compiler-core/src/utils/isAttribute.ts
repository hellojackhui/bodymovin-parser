function isAttribute(type, data) {
    switch (type) {
        case 'o':
            return isOpacityAttribute(data);
        case 'r':
            return isRotateAttribute(data);
        case 'p':
            return isPositionAttribute(data);
        case 'a':
            return isAnchorAttribute(data);
        case 's':
            return isScaleAttribute(data);
        default:
            break;
    }
}

function isOpacityAttribute(data) {
    const { a: animate, k: keyframes } = data;
    return !animate && typeof keyframes === 'number';
}

function isRotateAttribute(data) {
    const { a: animate, k: keyframes } = data;
    return !animate && typeof keyframes === 'number';
}

function isPositionAttribute(data) {
    const { a: animate, k: keyframes } = data;
    return !animate && Array.isArray(keyframes);
}

function isAnchorAttribute(data) {
    const { a: animate, k: keyframes } = data;
    return !animate && Array.isArray(keyframes);
}

function isScaleAttribute(data) {
    const { a: animate, k: keyframes } = data;
    return !animate && Array.isArray(keyframes);
}

export default isAttribute;