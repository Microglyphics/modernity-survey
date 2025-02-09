// src/components/ternary-plot/LayerControls.jsx
import React from 'react';

const LayerControls = ({ layers, setLayers }) => {
    return (
        <div className="absolute top-4 right-4 bg-white p-4 rounded shadow-lg">
            <h3 className="text-sm font-bold mb-2">Layer Controls</h3>
            {Object.entries(layers).map(([key, value]) => (
                <div key={key} className="flex items-center mb-2">
                    <input
                        type="checkbox"
                        id={key}
                        checked={value}
                        onChange={(e) => setLayers({
                            ...layers,
                            [key]: e.target.checked
                        })}
                        className="mr-2"
                    />
                    <label htmlFor={key} className="text-sm capitalize">
                        {key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                </div>
            ))}
        </div>
    );
};

export default LayerControls;