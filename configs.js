window.configs = [
    { 
        "name": "Sernimir II",
        "alpha": {
            "in": [{
                "name": "O", "id": "o1", "location": { "x": 1, "y": 1 },
                "probability": 100, "bonds": ["o2"]
            },
            {
                "name": "O", "id": "o2", "location": { "x": 2, "y": 1 },
                "probability": 100, "bonds": ["o1"]
            }],
            "inBonds": [{ "count": 2, "left": "o1", "right": "o2" }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "O", "id": "o1" }, { "name": "O", "id": "o2" }],
                "bonds": [{ "count": 2, "left": "o1", "right": "o2" }]
            }
        }, "beta": {
            "in": [],
            "inBonds": [],
            "outReqs": {}
        }
    },
    {
        "name": "Sernimir II: Slightly different",
        "alpha": {
            "in": [],
            "inBonds": [],
            "outReqs": {
            }
        }, "beta": {
            "in": [{
                "name": "O", "id": "o1", "location": { "x": 1, "y": 5 },
                "probability": 100, "bonds": ["o2"]
            },
            {
                "name": "O", "id": "o2", "location": { "x": 2, "y": 5 },
                "probability": 100, "bonds": ["o1"]
            }],
            "inBonds": [{ "count": 2, "left": "o1", "right": "o2" }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "O", "id": "o1" }, { "name": "O", "id": "o2" }],
                "bonds": [{ "count": 2, "left": "o1", "right": "o2" }]
            }
        }
    },
    { 
        "name": "Sernimir II: Crossover",
        "alpha": {
            "in": [{
                "name": "Au", "id": "au1", "location": { "x": 1, "y": 1 },
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "Pt", "id": "pt1" }],
                "bonds": []
            }
        }, "beta": {
            "in": [{
                "name": "Pt", "id": "pt1", "location": { "x": 1, "y": 5 },
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "Au", "id": "au1" }],
                "bonds": []
            }
        }
    },
    {
        "name": "Sernimir II: An introduction to bonding",
        "alpha": {
            "in": [{
                "name": "Ag", "id": "ag1", "location": { "x": 1, "y": 1 },
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "Ag", "id": "ag1" }, { "name": "F", "id": "f1" }],
                "bonds": [{ "count": 1, "left": "ag1", "right": "f1" }]
            }
        }, "beta": {
            "in": [{
                "name": "F", "id": "f1", "location": { "x": 1, "y": 5 },
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {}
        }
    },
    {
        "name": "Sernimir II: A brief history of SpaceChem",
        "alpha": {
            "in": [{
                "name": "H", "id": "h1", "location": { "x": 1, "y": 1 },
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
            }
        }, "beta": {
            "in": [{
                "name": "Cl", "id": "cl1", "location": { "x": 1, "y": 5 },
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "H", "id": "h1" }, { "name": "Cl", "id": "cl1" }],
                "bonds": [{ "count": 1, "left": "h1", "right": "cl1" }]}
        }
    },
    {
        "name": "Sernimir IV: Double Bonds",
        "alpha": {
            "in": [{
                "name": "O", "id": "o1", "location": { "x": 1, "y": 1 },
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "O", "id": "o1" }, { "name": "O", "id": "o2" }],
                "bonds": [{ "count": 2, "left": "o1", "right": "o2" }]
            }
        }, "beta": {
            "in": [],
            "inBonds": [],
            "outReqs": {
            }
        }
    },
    {
        "name": "Sernimir IV: Best Left Unanswered",
        "alpha": {
            "in": [{
                "name": "N", "id": "n1", "location": { "x": 1, "y": 1 },
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "N", "id": "n1" }, { "name": "N", "id": "n2" }],
                "bonds": [{ "count": 3, "left": "n1", "right": "n2" }]
            }
        }, "beta": {
            "in": [],
            "inBonds": [],
            "outReqs": {
            }
        }
    },
    {
        "name": "Sernimir IV: Multiple Outputs",
        "alpha": {
            "in": [{
                "name": "C", "id": "c1", "location": { "x": 1, "y": 1 },
                "probability": 100, "bonds": ["o1"]
            },
            {
                "name": "O", "id": "o1", "location": { "x": 2, "y": 1 },
                "probability": 100, "bonds": ["c1"]
            }],
            "inBonds": [{ "count": 2, "left": "c1", "right": "o1" }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "C", "id": "c1" }],
                "bonds": []
            }
        }, "beta": {
            "in": [],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "O", "id": "o1" }],
                "bonds": []
            }
        }
    },
    {
        "name": "Danopth: Every day is the First Day",
        "alpha": {
            "in": [{
                "name": "H", "id": "h1", "location": { "x": 1, "y": 1 },
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "H", "id": "h1" }, { "name": "C", "id": "c1" }, { "name": "C", "id": "c2" }, { "name": "H", "id": "h2" }],
                "bonds": [{ "count": 1, "left": "h1", "right": "c1" }, { "count": 3, "left": "c1", "right": "c2" }, { "count": 1, "left": "c2", "right": "h2" }]
            }
        }, "beta": {
            "in": [
                {
                    "name": "C", "id": "c1", "location": { "x": 1, "y": 5 },
                    "probability": 100, "bonds": []
                }],
            "inBonds": [],
            "outReqs": {}
        }
    }
]