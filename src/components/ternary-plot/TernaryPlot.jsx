// src/components/ternary-plot/TernaryPlot.jsx
import React, { useState } from 'react';
import LayerControls from './LayerControls';
import { LABEL_POSITIONS, getPointOnEdge, ternaryToCartesian } from './utils';

const TernaryPlot = ({ analysisData, questions, responses }) => {
    const [layers, setLayers] = useState({
        baseline: true,
        gridLines: true,
        mixTriangle: true,
        shading: true
    });

    const width = 800;
    const height = 700;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const plotWidth = width - margin.left - margin.right;
    const plotHeight = height - margin.top - margin.bottom;

    const vertices = {
        top: { x: plotWidth / 2 + margin.left, y: margin.top },
        left: { x: margin.left, y: height - margin.bottom },
        right: { x: width - margin.right, y: height - margin.bottom }
    };

    const convertCoords = ternaryToCartesian(vertices);

    const generateShading = () => {
        const elements = [];

        [vertices.top, vertices.right, vertices.left].forEach((vertex, idx) => {
            const others = [vertices.left, vertices.top, vertices.right].filter((v, i) => i !== idx);
            
            const point70Edge1 = getPointOnEdge(vertex, others[0], 0.3);
            const point70Edge2 = getPointOnEdge(vertex, others[1], 0.3);
            const point50Edge1 = getPointOnEdge(vertex, others[0], 0.5);
            const point50Edge2 = getPointOnEdge(vertex, others[1], 0.5);

            elements.push(
                <path
                    key={`strong-${idx}`}
                    d={`M ${vertex.x},${vertex.y} 
                        L ${point70Edge1.x},${point70Edge1.y} 
                        L ${point70Edge2.x},${point70Edge2.y} Z`}
                    fill="#90EE90"
                    opacity="0.2"
                />,
                <path
                    key={`moderate-${idx}`}
                    d={`M ${point70Edge1.x},${point70Edge1.y} 
                        L ${point50Edge1.x},${point50Edge1.y} 
                        L ${point50Edge2.x},${point50Edge2.y}
                        L ${point70Edge2.x},${point70Edge2.y} Z`}
                    fill="#E8EB10"
                    opacity="0.2"
                />
            );
        });

        return elements;
    };

    const generateMixTriangle = () => {
        const leftSide50 = getPointOnEdge(vertices.left, vertices.top, 0.5);
        const rightSide50 = getPointOnEdge(vertices.right, vertices.top, 0.5);
        const bottomSide50 = getPointOnEdge(vertices.left, vertices.right, 0.5);

        return (
            <path
                key="mix-triangle"
                d={`M ${bottomSide50.x},${bottomSide50.y} 
                    L ${leftSide50.x},${leftSide50.y} 
                    L ${rightSide50.x},${rightSide50.y} 
                    Z`}
                stroke="#ff0000"
                strokeWidth="2"
                fill="none"
            />
        );
    };

    const generateBaselineWithScales = () => {
        return (
            <g>
                <path
                    d={`M ${vertices.left.x},${vertices.left.y} 
                       L ${vertices.top.x},${vertices.top.y} 
                       L ${vertices.right.x},${vertices.right.y} 
                       L ${vertices.left.x},${vertices.left.y}`}
                    stroke="black"
                    strokeWidth="2"
                    fill="none"
                />
                <text 
                    x={(vertices.left.x + vertices.right.x) / 2} 
                    y={vertices.left.y + 40} 
                    textAnchor="middle"
                >
                    PreModern
                </text>
                <text 
                    x={vertices.left.x - 40} 
                    y={(vertices.left.y + vertices.top.y) / 2} 
                    textAnchor="end"
                    transform={`rotate(${LABEL_POSITIONS.postmodern.r} ${vertices.left.x - 40} ${(vertices.left.y + vertices.top.y) / 2})`}
                >
                    PostModern
                </text>
                <text 
                    x={vertices.right.x + 40} 
                    y={(vertices.right.y + vertices.top.y) / 2}
                    textAnchor="start"
                    transform={`rotate(${LABEL_POSITIONS.modern.r} ${vertices.right.x + 40} ${(vertices.right.y + vertices.top.y) / 2})`}
                >
                    Modern
                </text>
            </g>
        );
    };

    const generateGridLines = () => {
        const gridElements = [];
        for (let i = 1; i < 10; i++) {
            const ratio = i / 10;
            
            // Right parallel lines
            let startX = vertices.left.x + (vertices.right.x - vertices.left.x) * ratio;
            let startY = vertices.left.y;
            let endX = startX + (vertices.top.x - vertices.left.x);
            let endY = vertices.top.y;

            gridElements.push(
                <line
                    key={`grid-r-${i}`}
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#ff0000"
                    strokeWidth="1"
                    opacity="0.4"
                />
            );

            // Left parallel lines
            startX = vertices.left.x + (vertices.right.x - vertices.left.x) * (1 - ratio);
            startY = vertices.left.y;
            endX = startX - (vertices.right.x - vertices.top.x);
            endY = vertices.top.y;

            gridElements.push(
                <line
                    key={`grid-l-${i}`}
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#ff0000"
                    strokeWidth="1"
                    opacity="0.4"
                />
            );

            // Bottom parallel lines
            startX = vertices.left.x + (vertices.top.x - vertices.left.x) * ratio;
            startY = vertices.left.y - (vertices.left.y - vertices.top.y) * ratio;
            endX = vertices.right.x - (vertices.right.x - vertices.top.x) * ratio;
            endY = startY;

            gridElements.push(
                <line
                    key={`grid-b-${i}`}
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#ff0000"
                    strokeWidth="1"
                    opacity="0.4"
                />
            );
        }
        return gridElements;
    };

    const plotPoint = convertCoords(...analysisData.scores);

    return (
        <div className="relative">
            <LayerControls layers={layers} setLayers={setLayers} />
            <svg width={width} height={height} className="bg-white mx-auto" viewBox={`0 0 ${width} ${height}`}>
                {layers.shading && generateShading()}
                {layers.gridLines && generateGridLines()}
                {layers.baseline && generateBaselineWithScales()}
                {layers.mixTriangle && generateMixTriangle()}
                <circle 
                    cx={plotPoint.x} 
                    cy={plotPoint.y} 
                    r="6" 
                    fill="red" 
                    stroke="white" 
                    strokeWidth="2"
                />
            </svg>
        </div>
    );
};

export default TernaryPlot;