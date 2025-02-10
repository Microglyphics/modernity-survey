// src/data/testData.js

export const testSurveyResult = {
    // Response values (1-6)
    q1_response: 3,
    q2_response: 2,
    q3_response: 4,
    q4_response: 1,
    q5_response: 5,
    q6_response: 3,

    // Normalized scores (0-600)
    n1: 200,  // PreModern
    n2: 200,  // Modern
    n3: 200,  // PostModern

    // Plot coordinates (decimal 5,2)
    plot_x: 750.00,
    plot_y: 866.03,

    // Metadata
    session_id: "test-session-001",
    hash_email_session: "test-hash",
    browser: navigator.userAgent,
    region: "US",
    source: "local",
    timestamp: new Date().toISOString()
};

// Helper function to convert response values to scores for the ternary plot
export const getPlotData = (result) => ({
    scores: [
        result.n1 / 6,  // Scale down to 0-100 for plot
        result.n2 / 6,
        result.n3 / 6
    ],
    // Convert decimal coordinates to plot points
    plot_x: parseFloat(result.plot_x),
    plot_y: parseFloat(result.plot_y)
});