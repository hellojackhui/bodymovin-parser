const expRegEnum = {
    loopOutExpReg: /loopOutDuration\((.+), (\d+)\)/,
    loopInExpReg: /loopOutDuration\((.+), (\d+)\)/,
}

function parseExpression(exp) {
    const options: any = {
        cycleType: 'none',
        itemCount: 1,
        mode: 'steps(1)',
        fillMode: 'forward'
    };
    let regRes = null;
    if (!exp) return options;
    if (regRes = exp.match(expRegEnum.loopOutExpReg)) {
        const [, mode, numkeyFrames] = regRes;
        if (mode === "'cycle'") {
            options['cycleType'] = 'normal';
            if (numkeyFrames == 0) {
                options['itemCount'] = 'infinite';
            }
        }
        if (mode === "'pingpong'") {
            options['cycleType'] = 'alternate';
            if (numkeyFrames == 0) {
                options['itemCount'] = 'infinite';
            }
        }
        if (mode === "'Offset'") {
            options['mode'] = 'steps(1)';
        }
        if (mode === "'Offset'") {
            options['fillMode'] = 'forward';
        }

        if (numkeyFrames) {
            // 需要根据关键帧进行duration计算。
        }
    }

    if (regRes = exp.match(expRegEnum.loopInExpReg)) {
        const [, mode, numkeyFrames] = regRes;
        if (mode === "'cycle'") {
            options['cycleType'] = 'normal';
            if (numkeyFrames == 0) {
                options['itemCount'] = 'infinite';
            }
        }
        if (mode === "'pingpong'") {
            options['cycleType'] = 'alternate';
            if (numkeyFrames == 0) {
                options['itemCount'] = 'infinite';
            }
        }
        if (mode === "'Offset'") {
            options['mode'] = 'steps(1)';
        }
        if (mode === "'continue'") {
            options['fillMode'] = 'forward';
        }

        if (numkeyFrames) {
            // 需要根据关键帧进行duration计算。
        }
    }

    return options;
}

export {
    parseExpression,
}