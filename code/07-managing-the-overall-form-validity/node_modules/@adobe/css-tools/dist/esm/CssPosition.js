/**
 * Store position information for a node
 */
export default class Position {
    start;
    end;
    source;
    constructor(start, end, source) {
        this.start = start;
        this.end = end;
        this.source = source;
    }
}
