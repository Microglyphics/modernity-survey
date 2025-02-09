// src/components/ternary-plot/utils.js

// Constants for label positioning around the ternary plot
export const LABEL_POSITIONS = {
    postmodern: { x: 35, y: -90, r: -60 },
    modern: { x: -305, y: -550, r: 60 }
};

// Get a point along an edge between two points
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

// Check if point is inside triangle
export const isInsideTriangle = (vertices) => (px, py) => {
    const {left, right, top} = vertices;
    
    // Calculate barycentric coordinates
    const denominator = (left.y - top.y) * (right.x - top.x) + (top.x - left.x) * (right.y - top.y);
    const a = ((left.y - top.y) * (px - top.x) + (top.x - left.x) * (py - top.y)) / denominator;
    const b = ((top.y - right.y) * (px - top.x) + (right.x - top.x) * (py - top.y)) / denominator;
    const c = 1 - a - b;
    
    return a >= 0 && a <= 1 && b >= 0 && b <= 1 && c >= 0 && c <= 1;
};