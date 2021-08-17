const protoStr = Object.prototype.toString;


function isEqual(from, to, exceptKeys) {
    if (protoStr.call(from) !== protoStr.call(to)) {
        return false;
    }
    if (typeof from !== 'object' && typeof to !== 'object') {
        return from === to;
    }
    let fromKeys = Array.isArray(from) ? from : Object.keys(from);
    let toKeys = Array.isArray(to) ? to : Object.keys(to);
    if (fromKeys.length !== toKeys.length) {
      return false;
    }
    let res = true;
    for (let i = 0; i < fromKeys.length; i++) {
        let key = fromKeys[i];
        if (exceptKeys && exceptKeys.includes(key)) continue;
        if (Array.isArray(from)) {
          res = isEqual(fromKeys[i], to[i], exceptKeys)
        } else {
          res = isEqual(from[key], to[key], exceptKeys)
        }
        if (!res) break;
    }
    if (!res) return false;
    return true;
}

export default isEqual;