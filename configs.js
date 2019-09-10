window.configs = [
    { 
        "name": "Sernimir II",
        "alpha": {
            "in": [{
                "name": "O", "id": "o1", "x": 1, "y": 1,
                "probability": 100, "bonds": ["o2"]
            },
            {
                "name": "O", "id": "o2", "x": 2, "y": 1,
                "probability": 100, "bonds": ["o1"]
            }],
            "inBonds": [{ "count": 2, "left": "o1", "right": "o2" }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "O", "id": "o1", x: 1, y: 1 }, { "name": "O", "id": "o2", x: 2, y: 1 }],
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
                "name": "O", "id": "o1", "x": 1, "y": 1,
                "probability": 100, "bonds": ["o2"]
            },
            {
                "name": "O", "id": "o2", "x": 2, "y": 1,
                "probability": 100, "bonds": ["o1"]
            }],
            "inBonds": [{ "count": 2, "left": "o1", "right": "o2" }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "O", "id": "o1", x: 1, y: 1 }, { "name": "O", "id": "o2", x: 2, y: 1}],
                "bonds": [{ "count": 2, "left": "o1", "right": "o2" }]
            }
        }
    },
    { 
        "name": "Sernimir II: Crossover",
        "alpha": {
            "in": [{
                "name": "Au", "id": "au1", "x": 1, "y": 1,
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "Pt", "id": "pt1", x: 1, y: 1}],
                "bonds": []
            }
        }, "beta": {
            "in": [{
                "name": "Pt", "id": "pt1", "x": 1, "y": 1,
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "Au", "id": "au1", x: 1, y: 1}],
                "bonds": []
            }
        }
    },
    {
        "name": "Sernimir II: An introduction to bonding",
        "alpha": {
            "in": [{
                "name": "Ag", "id": "ag1", "x": 1, "y": 1,
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "Ag", "id": "ag1", x: 1, y: 1 }, { "name": "F", "id": "f1", x: 2, y: 1 }],
                "bonds": [{ "count": 1, "left": "ag1", "right": "f1" }]
            }
        }, "beta": {
            "in": [{
                "name": "F", "id": "f1", "x": 1, "y": 1,
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {}
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Sernimir II: A brief history of SpaceChem",
        "alpha": {
            "in": [{
                "name": "H", "id": "h1", "x": 1, "y": 1,
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
            }
        }, "beta": {
            "in": [{
                "name": "Cl", "id": "cl1", "x": 1, "y": 1,
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "H", "id": "h1", x: 1, y: 1 }, { "name": "Cl", "id": "cl1", x: 2, y: 1}],
                "bonds": [{ "count": 1, "left": "h1", "right": "cl1" }]}
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Sernimir IV: Double Bonds",
        "alpha": {
            "in": [{
                "name": "O", "id": "o1", "x": 1, "y": 1,
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "O", "id": "o1", x: 1, y: 1 }, { "name": "O", "id": "o2", x: 2, y: 1 }],
                "bonds": [{ "count": 2, "left": "o1", "right": "o2" }]
            }
        }, "beta": {
            "in": [],
            "inBonds": [],
            "outReqs": {
            }
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Sernimir IV: Best Left Unanswered",
        "alpha": {
            "in": [{
                "name": "N", "id": "n1", "x": 1, "y": 1,
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "N", "id": "n1", x: 1, y: 1 }, { "name": "N", "id": "n2", x: 2, y: 1 }],
                "bonds": [{ "count": 3, "left": "n1", "right": "n2" }]
            }
        }, "beta": {
            "in": [],
            "inBonds": [],
            "outReqs": {
            }
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Sernimir IV: Multiple Outputs",
        "alpha": {
            "in": [{
                "name": "C", "id": "c1", "x": 1, "y": 1,
                "probability": 100, "bonds": ["o1"]
            },
            {
                "name": "O", "id": "o1", "x": 2, "y": 1,
                "probability": 100, "bonds": ["c1"]
            }],
            "inBonds": [{ "count": 2, "left": "c1", "right": "o1" }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "C", "id": "c1", x: 1, y: 1 }],
                "bonds": []
            }
        }, "beta": {
            "in": [],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "O", "id": "o1", x: 1, y: 1 }],
                "bonds": []
            }
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Danopth: Every day is the First Day",
        "alpha": {
            "in": [{
                "name": "H", "id": "h1", "x": 1, "y": 1,
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "H", "id": "h1", x: 0, y: 1 },
                    { "name": "C", "id": "c1", x: 1, y: 1 },
                    { "name": "C", "id": "c2", x: 2, y: 1 },
                    { "name": "H", "id": "h2", x: 3, y: 1 }],
                "bonds": [{ "count": 1, "left": "h1", "right": "c1" }, { "count": 3, "left": "c1", "right": "c2" }, { "count": 1, "left": "c2", "right": "h2" }]
            }
        }, "beta": {
            "in": [
                {
                    "name": "C", "id": "c1", "x": 1, "y": 1,
                    "probability": 100, "bonds": []
                }],
            "inBonds": [],
            "outReqs": {}
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Danopth: It Takes Three",
        "alpha": {
            "in": [{
                "name": "H", "id": "h1", x: 1, y: 1,
                "probability": 100, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "H", "id": "h1", x: 1, y: 1 },
                    { "name": "H", "id": "h2", x: 3, y: 1 },
                    { "name": "H", "id": "h3", x: 2, y: 0 },
                    { "name": "N", "id": "n1", x: 2, y: 1 }],
                "bonds": [{ "count": 1, "left": "h1", "right": "n1" }, { "count": 1, "left": "h2", "right": "n1" }, { "count": 1, "left": "h3", "right": "n1" }]

            }
        }, "beta": {
            "in": [
                {
                    "name": "N", "id": "n1", "x": 1, "y": 1,
                    "probability": 100, "bonds": []
                }],
            "inBonds": [],
            "outReqs": {}
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Danopth: Split Before Bonding",
        "alpha": {
            "in": [{
                "name": "H", "id": "h1", x: 1, y: 1,
                "probability": 100, "bonds": ["h2"]
            }, {
                "name": "H", "id": "h2", x: 2, y: 1,
                "probability": 100, "bonds": ["h1"]
            }],
            "inBonds": [{ "count": 1, "left": "h1", "right": "h2" }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "H", "id": "h1", x: 1, y: 2 },
                { "name": "H", "id": "h2", x: 2, y: 0 },
                { "name": "O", "id": "o1", x: 1, y: 1 },
                { "name": "O", "id": "o2", x: 2, y: 1 }],
                "bonds": [{ "count": 1, "left": "h1", "right": "o1" }, { "count": 1, "left": "o1", "right": "o2" }, { "count": 1, "left": "o2", "right": "h2" }]

            }
        }, "beta": {
            "in": [{
                "name": "O", "id": "o1", x: 1, y: 1,
                "probability": 100, "bonds": ["o2"]
            }, {
                "name": "O", "id": "o2", x: 2, y: 1,
                "probability": 100, "bonds": ["o1"]
            }],
            "inBonds": [{ "count": 2, "left": "o1", "right": "o2" }],
            "outReqs": {}
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Alkonost: An Introduction to Sensing",
        "alpha": {
            "in": [{
                "name": "He", "id": "he1", "x": 1, "y": 1,
                "probability": 50, "bonds": []
            }, {
                "name": "Ar", "id": "ar1", "x": 1, "y": 1,
                "probability": 50, "bonds": []
            }],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "He", "id": "he1", x: 1, y: 1 }],
                "bonds": []
            }
        }, "beta": {
            "in": [],
            "inBonds": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "Ar", "id": "ar1", x: 1, y: 1 }],
                "bonds": []
            }
        },
        sensor: { x: 4, y: 1 }
    }
]