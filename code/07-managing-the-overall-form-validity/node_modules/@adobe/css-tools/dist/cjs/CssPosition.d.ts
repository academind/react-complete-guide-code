/**
 * Store position information for a node
 */
export default class Position {
    start: {
        line: number;
        column: number;
    };
    end: {
        line: number;
        column: number;
    };
    source?: string;
    constructor(start: {
        line: number;
        column: number;
    }, end: {
        line: number;
        column: number;
    }, source: string);
}
