import { IMagicAssets } from "../types/index";

class Assets implements IMagicAssets {

    refId: string;
    assetSize: {
        width: number,
        height: number,
    };
    path: string;

    constructor(data) {
        this.refId = data.refId;
        this.assetSize = {
            width: data.w,
            height: data.h,
        }
        this.path = data.p;
    }

}

export default Assets;