import React from 'react';

interface IAEAnimate {
    source: string | JSON;
    animeType: 'loop' | 'forwards';
}

export class AEAnimate extends React.PureComponent implements IAEAnimate {

    source: string | JSON;
    animeType: 'loop' | 'forwards';

    constructor(props) {
        super(props);
        
    }

    renderComponent() {
        return (
            <div>123123</div>
        )
    }

    render() {
        return this.renderComponent();
    }
}