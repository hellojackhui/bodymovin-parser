function buildTransformStyle(styles) {
    const { scale, rotate } = styles;
    let template = 'scale3d({{scale}}) rotate({{rotate}}deg)';
    let scaleStr = Array.isArray(scale) ? `${scale[0]}, ${scale[1]}, ${scale[2]}` : `${scale.x}, ${scale.y}, ${scale.z}`;
    template = template.replace(/\{\{scale\}\}/, scaleStr);
    template = template.replace(/\{\{rotate\}\}/, `${rotate}`);
    return {
        transform: template,
    };
}

function buildAnimeList(list, attributes) {
    const res = {};
    const { width, height, opacity, anchor, ...rest} = attributes;
    list.map((item) => {
        res[`${Number((Number(item.offset) * 100).toFixed(3))}%`] = {
            ...rest,
            ...item,
        };
    });
    return res;
}

export {
    buildTransformStyle,
    buildAnimeList,
}