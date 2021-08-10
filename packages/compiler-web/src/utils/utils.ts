function isBase64(url: string) {
    return !!(`${url}`.match(/png;base64/));
}

export {
    isBase64
};