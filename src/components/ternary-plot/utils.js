// src/components/ternary-plot/utils.js

// Constants for label positioning around the ternary plot
export const LABEL_POSITIONS = {
    postmodern: { x: 35, y: -90, r: -60 },
    modern: { x: -305, y: -550, r: 60 }
};

// Get point along edge between two points
export const getPointOnEdge = (start, end, percentage) => ({
    x: start.x + (end.x - start.x) * percentage,
    y: start.y + (end.y - start.y) * percentage
});

// Convert ternary coordinates to cartesian
export const ternaryToCartesian = (vertices) => (pre, mod, post) => {
    const total = pre + mod + post;
    const normalizedPre = pre / total;
    const normalizedMod = mod / total;
    const normalizedPost = post / total;

    const x = vertices.left.x * normalizedPost + 
             vertices.top.x * normalizedMod + 
             vertices.right.x * normalizedPre;

    const y = vertices.left.y * normalizedPost + 
             vertices.top.y * normalizedMod + 
             vertices.right.y * normalizedPre;

    return { x, y };
};