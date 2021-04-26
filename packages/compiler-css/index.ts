import ParserCore from '../../lib/core.es';

class ParserToCSS {
    fetch: any;
    json: any;
    parser: any;

    constructor({
        requestFn,
        json = {},
    }) {
        this.fetch = requestFn || fetch;
        this.json = json = {};
    }

    parseByJson(json) {
        this.parser = new ParserCore({json});
        console.log(JSON.stringify(this.parser.outputJson()))
    }

    parseByFetch(url) {
        if (this.fetch) {
            this.fetch(url).then((json) => {
                console.log(json);
                this.parser = new ParserCore({json});
                console.log(JSON.stringify(this.parser.outputJson()))
            })
        }
    }
}

export default ParserToCSS;