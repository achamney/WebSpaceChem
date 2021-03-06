window.configs = [
    {
        "name": "Sernimir II: Introduction",
        "section": "Sernimir II",
        "alpha": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "O", "id": "o1", "x": 1, "y": 1, "bonds": ["o2"]
                }, {
                    "name": "O", "id": "o2", "x": 2, "y": 1,"bonds": ["o1"]
                }],
                "bonds": [{ "count": 2, "left": "o1", "right": "o2" }]
            }],
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
        "section": "Sernimir II",
        "alpha": {
            "in": [],
            "inBonds": [],
            "outReqs": {
            }
        }, "beta": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "O", "id": "o1", "x": 1, "y": 1,
                    "probability": 100, "bonds": ["o2"]
                },
                {
                    "name": "O", "id": "o2", "x": 2, "y": 1,
                    "probability": 100, "bonds": ["o1"]
                }],
                "bonds": [{ "count": 2, "left": "o1", "right": "o2" }]
            }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "O", "id": "o1", x: 1, y: 1 }, { "name": "O", "id": "o2", x: 2, y: 1}],
                "bonds": [{ "count": 2, "left": "o1", "right": "o2" }]
            }
        }
    },
    { 
        "name": "Sernimir II: Crossover",
        "section": "Sernimir II",
        "alpha": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "Au", "id": "au1", "x": 1, "y": 1,
                    "probability": 100, "bonds": []
                }],
                "bonds": []
            }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "Pt", "id": "pt1", x: 1, y: 1}],
                "bonds": []
            }
        }, "beta": {
            "in": [{
                "probability": 100,
                "bonds": [],
                "elements": [{
                    "name": "Pt", "id": "pt1", "x": 1, "y": 1,
                    "probability": 100, "bonds": []
                }]
            }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "Au", "id": "au1", x: 1, y: 1}],
                "bonds": []
            }
        }
    },
    {
        "name": "Sernimir II: An introduction to bonding",
        "section": "Sernimir II",
        "alpha": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "Ag", "id": "ag1", "x": 1, "y": 1,
                    "probability": 100, "bonds": []
                }]
            }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "Ag", "id": "ag1", x: 1, y: 1 }, { "name": "F", "id": "f1", x: 2, y: 1 }],
                "bonds": [{ "count": 1, "left": "ag1", "right": "f1" }]
            }
        }, "beta": {
            "in": [{
                "probability": 100,
                "bonds": [],
                "elements": [{
                    "name": "F", "id": "f1", "x": 1, "y": 1,
                    "probability": 100, "bonds": []
                }]
            }],
            "outReqs": {}
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Sernimir II: A brief history of SpaceChem",
        "section": "Sernimir II",
        "alpha": {
            "in": [{
                "probability": 100,
                "bonds": [],
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1,
                    "probability": 100, "bonds": []
                }]
            }],
            "outReqs": {
            }
        }, "beta": {
            "in": [{
                "probability": 100,
                "bonds": [],
                "elements": [{
                    "name": "Cl", "id": "cl1", "x": 1, "y": 1,
                    "probability": 100, "bonds": []
                }]
            }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "H", "id": "h1", x: 1, y: 1 }, { "name": "Cl", "id": "cl1", x: 2, y: 1}],
                "bonds": [{ "count": 1, "left": "h1", "right": "cl1" }]}
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Sernimir IV: Double Bonds",
        "section": "Sernimir IV",
        "alpha": {
            "in": [{
                "probability": 100,
                "bonds": [],
                "elements": [{
                    "name": "O", "id": "o1", "x": 1, "y": 1,
                    "probability": 100, "bonds": []
                }]
            }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "O", "id": "o1", x: 1, y: 1 }, { "name": "O", "id": "o2", x: 2, y: 1 }],
                "bonds": [{ "count": 2, "left": "o1", "right": "o2" }]
            }
        }, "beta": {
            "in": [],
            "outReqs": {
            }
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Sernimir IV: Best Left Unanswered",
        "section": "Sernimir IV",
        "alpha": {
            "in": [{
                "probability": 100,
                "bonds": [],
                "elements": [{
                    "name": "N", "id": "n1", "x": 1, "y": 1,
                    "probability": 100, "bonds": []
                }]
            }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "N", "id": "n1", x: 1, y: 1 }, { "name": "N", "id": "n2", x: 2, y: 1 }],
                "bonds": [{ "count": 3, "left": "n1", "right": "n2" }]
            }
        }, "beta": {
            "in": [],
            "outReqs": {
            }
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Sernimir IV: Multiple Outputs",
        "section": "Sernimir IV",
        "alpha": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "C", "id": "c1", "x": 1, "y": 1,
                    "probability": 100, "bonds": ["o1"]
                },
                {
                    "name": "O", "id": "o1", "x": 2, "y": 1,
                    "probability": 100, "bonds": ["c1"]
                }],
                "bonds": [{ "count": 2, "left": "c1", "right": "o1" }],
            }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "C", "id": "c1", x: 1, y: 1 }],
                "bonds": []
            }
        }, "beta": {
            "in": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "O", "id": "o1", x: 1, y: 1 }],
                "bonds": []
            }
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Sernimir IV: An Introduction to Pipelines",
        "section": "Sernimir IV",
        "in": [{
            "inProb": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            x: 4, y: 1, w: 5, h: 6
        }, {
            "inProb": [{
                "probability": 100,
                "elements": [{
                    "name": "O", "id": "o1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            x: 5, y: 8, w: 5, h: 6
            }],
        "outReqs": [{
            "count": 40,
            "elements": [{ "name": "O", "id": "o1", x: 1, y: 1 }],
            "bonds": [],
            x: 23, y: 8, w: 2, h: 3
        }, {
            "count": 40,
            "elements": [{ "name": "H", "id": "h1", x: 1, y: 1 }],
            "bonds": [],
            x: 23, y: 14, w: 2, h: 3
        }],
        "reactors": ["standard"],
		"production": true
    },
    {
        "name": "Sernimir IV: There's something in fishcake",
        "section": "Sernimir IV",
        "in": [{
            "inProb": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            x: 4, y: 1, w: 5, h: 6
        }, {
            "inProb": [{
                "probability": 100,
                "elements": [{
                    "name": "Cl", "id": "cl1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            x: 5, y: 8, w: 5, h: 6
            }],
        "outReqs": [{
            "count": 40,
            "elements": [{ "name": "H", "id": "h1", x: 1, y: 1, "bonds":["cl1"]},
            { "name": "Cl", "id": "cl1", x: 2, y: 1, "bonds":["h1"]}],
            "bonds": [{count: 1, left:"h1", right:"cl1"}],
            x: 23, y: 8, w: 2, h: 3
        }],
        "reactors": ["standard"],
		"production": true
    },
    {
        "name": "Sernimir IV: Sleepless on Sernimir IV",
        "section": "Sernimir IV",
        "in": [{
            "inProb": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            x: 4, y: 1, w: 5, h: 6
        }, {
            "inProb": [{
                "probability": 100,
                "elements": [{
                    "name": "O", "id": "o1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            x: 5, y: 8, w: 5, h: 6
            }, {
                "inProb": [{
                    "probability": 100,
                    "elements": [{
                        "name": "C", "id": "c1", "x": 1, "y": 1, "bonds": []
                    }],
                    "bonds": []
            }],
            x: 6, y: 15, w: 5, h: 6
        }],
        "outReqs": [{
            "count": 40,
            "elements": [{ "name": "H", "id": "h1", x: 0, y: 2 }, { "name": "C", "id": "c1", x: 1, y: 2 }, { "name": "H", "id": "h2", x: 2, y: 2 },
                { "name": "O", "id": "o1", x: 1, y: 1 }],
            "bonds": [{ "count": 2, "left": "c1", "right": "o1" }, { "count": 1, "left": "c1", "right": "h1" }, { "count": 1, "left": "c1", "right": "h2" }],
            x: 23, y: 8, w: 2, h: 3
        }],
        "reactors": ["standard"],
		"production": true
    },
    {
        "name": "Danopth: Every day is the First Day",
        "section": "Danopth",
        "alpha": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1,
                    "probability": 100, "bonds": []
                }],
                "bonds": []
            }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "H", "id": "h1", x: 0, y: 1 },
                    { "name": "C", "id": "c1", x: 1, y: 1 },
                    { "name": "C", "id": "c2", x: 2, y: 1 },
                    { "name": "H", "id": "h2", x: 3, y: 1 }],
                "bonds": [{ "count": 1, "left": "h1", "right": "c1" }, { "count": 3, "left": "c1", "right": "c2" }, { "count": 1, "left": "c2", "right": "h2" }]
            }
        }, "beta": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "C", "id": "c1", "x": 1, "y": 1,
                    "probability": 100, "bonds": []
                }],
                "bonds":[]
            }],
            "outReqs": {}
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Danopth: It Takes Three",
        "section": "Danopth",
        "alpha": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", x: 1, y: 1,
                    "probability": 100, "bonds": []
                }],
                "bonds": []
            }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "H", "id": "h1", x: 1, y: 1 },
                    { "name": "H", "id": "h2", x: 3, y: 1 },
                    { "name": "H", "id": "h3", x: 2, y: 0 },
                    { "name": "N", "id": "n1", x: 2, y: 1 }],
                "bonds": [{ "count": 1, "left": "h1", "right": "n1" }, { "count": 1, "left": "h2", "right": "n1" }, { "count": 1, "left": "h3", "right": "n1" }]

            }
        }, "beta": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "N", "id": "n1", "x": 1, "y": 1,
                    "probability": 100, "bonds": []
                }],
                "bonds":[]
            }],
            "outReqs": {}
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Danopth: Split Before Bonding",
        "section": "Danopth",
        "alpha": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", x: 1, y: 1,
                    "probability": 100, "bonds": ["h2"]
                }, {
                    "name": "H", "id": "h2", x: 2, y: 1,
                    "probability": 100, "bonds": ["h1"]
                }],
                "bonds": [{ "count": 1, "left": "h1", "right": "h2" }],
            }],
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
                "probability": 100,
                "elements": [{
                    "name": "O", "id": "o1", x: 1, y: 1,
                    "probability": 100, "bonds": ["o2"]
                }, {
                    "name": "O", "id": "o2", x: 2, y: 1,
                    "probability": 100, "bonds": ["o1"]
                }],
                "bonds": [{ "count": 2, "left": "o1", "right": "o2" }],
            }],
            "outReqs": {}
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Danopth: Settling Into the New Routine",
        "section": "Danopth",
        "in": [{
            "inProb": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", "x": 0, "y": 1, "bonds": ["c1"]
                },{
                    "name": "H", "id": "h2", "x": 2, "y": 1, "bonds": ["c1"]
                },{
                    "name": "H", "id": "h3", "x": 1, "y": 0, "bonds": ["c1"]
                },{
                    "name": "H", "id": "h4", "x": 1, "y": 2, "bonds": ["c1"]
                },{
                    "name": "C", "id": "c1", "x": 1, "y": 1, "bonds": ["h1","h2","h3","h4"]
                }],
                "bonds": [{count:1, left:"h1", right:"c1"},
                {count:1, left:"h2", right:"c1"},
                {count:1, left:"h3", right:"c1"},
                {count:1, left:"h4", right:"c1"}]
            }],
            x: 8, y: 2, w: 2, h: 5
        }],
        "outReqs": [{
            "count": 40,
            "elements": [{ "name": "H", "id": "h1", x: 1, y: 1, bonds:["h2"] }, 
                { "name": "H", "id": "h2", x: 2, y: 1, bonds: ["h1"] }],
            "bonds": [{ "count": 1, "left": "h1", "right": "h2" }],
            x: 24, y: 12, w: 2, h: 3
        }, {
            "count": 40,
            "elements": [{ "name": "H", "id": "h1", x: 0, y: 1, bonds:["c1"]}, 
                { "name": "H", "id": "h2", x: 1, y: 0, bonds:["c1"] },
                { "name": "H", "id": "h3", x: 1, y: 2, bonds:["c1"] },
                { "name": "H", "id": "h4", x: 2, y: 0, bonds:["c2"] }, 
                { "name": "H", "id": "h5", x: 2, y: 2, bonds:["c2"] },
                { "name": "H", "id": "h6", x: 3, y: 1, bonds:["c2"] },
                { "name": "C", "id": "c1", x: 1, y: 1, bonds:["h1","h2","h3"] },
                { "name": "C", "id": "c2", x: 2, y: 1, bonds:["h4","h5","h6"] }],
            "bonds": [{ "count": 1, "left": "h1", "right": "c1" }, 
            { "count": 1, "left": "h2", "right": "c1" }, 
            { "count": 1, "left": "h3", "right": "c1" },
            { "count": 1, "left": "h4", "right": "c2" }, 
            { "count": 1, "left": "h5", "right": "c2" }, 
            { "count": 1, "left": "h6", "right": "c2" },
            { "count": 1, "left": "c1", "right": "c2" }],
            x: 24, y: 18, w: 2, h: 3
        }],
        "reactors": ["assembly", "disassembly"],
		"production": true
    },
    {
        "name": "Danopth: Nothing Works",
        "section": "Danopth",
        "in": [{
            "inProb": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", "x": 0, "y": 1, "bonds": ["c1"]
                }, {
                    "name": "H", "id": "h2", "x": 2, "y": 1, "bonds": ["c1"]
                }, {
                    "name": "H", "id": "h3", "x": 1, "y": 0, "bonds": ["c1"]
                }, {
                    "name": "H", "id": "h4", "x": 1, "y": 2, "bonds": ["c1"]
                }, {
                    "name": "C", "id": "c1", "x": 1, "y": 1, "bonds": ["h1", "h2", "h3", "h4"]
                }],
                "bonds": [{ count: 1, left: "h1", right: "c1" },
                { count: 1, left: "h2", right: "c1" },
                { count: 1, left: "h3", right: "c1" },
                { count: 1, left: "h4", right: "c1" }]
            }],
            x: 8, y: 2, w: 2, h: 5
        }, {
            "inProb": [{
                "probability": 100,
                "elements": [{
                    "name": "N", "id": "n1", "x": 1, "y": 1, "bonds": ["n2"]
                }, {
                    "name": "N", "id": "n2", "x": 2, "y": 1, "bonds": ["n1"]
                }],
                "bonds": [{ count: 3, left: "n1", right: "n2" }]
            }],
            x: 5, y: 19, w: 2, h: 3
        }],
        "outReqs": [{
            "count": 40,
            "elements": [{ "name": "H", "id": "h1", x: 0, y: 1, bonds: ["c1"] },
                { "name": "C", "id": "c1", x: 1, y: 1, bonds: ["h1", "n1"] },
                { "name": "N", "id": "n1", x: 2, y: 1, bonds: ["c1"] }
            ],
            "bonds": [{ "count": 1, "left": "h1", "right": "c1" },
                { "count": 3, "left": "c1", "right": "n1" }],
            x: 24, y: 3, w: 2, h: 3
        }, {
            "count": 40,
            "elements": [{ "name": "H", "id": "h1", x: 1, y: 1, bonds: ["h2"] },
            { "name": "H", "id": "h2", x: 2, y: 1, bonds: ["h1"] }],
            "bonds": [{ "count": 1, "left": "h1", "right": "h2" }],
            x: 24, y: 19, w: 2, h: 3
        }],
        "reactors": ["assembly", "disassembly"],
        "production": true
    },
    {
        "name": "Danopth: In Place Swap",
        "section": "Danopth",
        "in": [{
            "inProb": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", "x": 0, "y": 1, "bonds": ["c1"]
                }, {
                    "name": "H", "id": "h2", "x": 2, "y": 1, "bonds": ["c1"]
                }, {
                    "name": "H", "id": "h3", "x": 1, "y": 0, "bonds": ["c1"]
                }, {
                    "name": "H", "id": "h4", "x": 1, "y": 2, "bonds": ["c1"]
                }, {
                    "name": "C", "id": "c1", "x": 1, "y": 1, "bonds": ["h1", "h2", "h3", "h4"]
                }],
                "bonds": [{ count: 1, left: "h1", right: "c1" },
                { count: 1, left: "h2", right: "c1" },
                { count: 1, left: "h3", right: "c1" },
                { count: 1, left: "h4", right: "c1" }]
            }],
            x: 4, y: 15, w: 2, h: 5
        }, {
            "inProb": [{
                "probability": 100,
                "elements": [{
                    "name": "N", "id": "n1", "x": 1, "y": 1, "bonds": ["n2"]
                }, {
                    "name": "N", "id": "n2", "x": 2, "y": 1, "bonds": ["n1"]
                }],
                "bonds": [{ count: 3, left: "n1", right: "n2" }]
            }],
            x: 5, y: 3, w: 2, h: 3
        }],
        "outReqs": [{
            "count": 40,
            "elements": [{
                "name": "H", "id": "h1", "x": 0, "y": 1, "bonds": ["n1"]
            }, {
                "name": "H", "id": "h2", "x": 2, "y": 1, "bonds": ["n1"]
            }, {
                "name": "H", "id": "h3", "x": 1, "y": 0, "bonds": ["n1"]
            }, {
                "name": "N", "id": "n1", "x": 1, "y": 1, "bonds": ["h1", "h2", "h3"]
            }],
            "bonds": [{ count: 1, left: "h1", right: "n1" },
            { count: 1, left: "h2", right: "n1" },
            { count: 1, left: "h3", right: "n1" }],
            x: 24, y: 12, w: 2, h: 3
        },
        {
            "count": 40,
            "elements": [{ "name": "H", "id": "h1", x: 0, y: 1, bonds: ["c1"] },
                { "name": "C", "id": "c1", x: 1, y: 1, bonds: ["h1", "n1"] },
                { "name": "N", "id": "n1", x: 2, y: 1, bonds: ["c1"] }
            ],
            "bonds": [{ "count": 1, "left": "h1", "right": "c1" },
                { "count": 3, "left": "c1", "right": "n1" }],
            x: 24, y: 18, w: 2, h: 3
        }],
        "reactors": ["assembly", "disassembly"],
        "production": true
    },
    {
        "name": "Alkonost: An Introduction to Sensing",
        "section": "Alkonost",
        "alpha": {
            "in": [{
                "probability": 50,
                "elements": [{
                    "name": "He", "id": "he1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }, {
                "probability": 50,
                "elements": [{
                    "name": "Ar", "id": "ar1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds":[]
            }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "He", "id": "he1", x: 1, y: 1 }],
                "bonds": []
            }
        }, "beta": {
            "in": [],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "Ar", "id": "ar1", x: 1, y: 1 }],
                "bonds": []
            }
        },
        sensor: { x: 4, y: 1 }
    },
    {
        "name": "Alkonost: Prelude to a Migrane",
        "section": "Alkonost",
        "alpha": {
            "in": [{
                "probability": 50,
                "elements": [{
                    "name": "O", "id": "o1", "x": 1, "y": 1, "bonds": ["o2"]
                }, {
                     "name": "O", "id": "o2", "x": 2, "y": 1, "bonds": ["o1"]
                }],
                "bonds": [{ "count": 2, "left": "o1", "right": "o2" }]
            }, {
                "probability": 50,
                "elements": [{
                    "name": "O", "id": "o1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "O", "id": "o1", x: 1, y: 1 }],
                "bonds": []
            }
        }, "beta": {
            "in": [],
            "outReqs": {}
        },
        sensor: { x: 4, y: 1 },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Alkonost: Random Oxides",
        "section": "Alkonost",
        "alpha": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "O", "id": "o1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "O", "id": "o1", x: 0, y: 1 }, { "name": "O", "id": "o2", x: 2, y: 1 }, { "name": "Ti", "id": "ti1", x: 1, y: 1 }],
                "bonds": [{ "count": 2, "left": "o1", "right": "ti1" }, { "count": 2, "left": "ti1", "right": "o2" }]
            }
        }, "beta": {
            "in": [{
                    "probability": 50,
                    "elements": [{
                        "name": "Zn", "id": "zn1", "x": 1, "y": 1, "bonds": []
                    }],
                    "bonds": []
                }, {
                    "probability": 50,
                    "elements": [{
                        "name": "Ti", "id": "ti1", "x": 1, "y": 1, "bonds": []
                    }],
                    "bonds": []
            }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "O", "id": "o1", x: 1, y: 1 }, { "name": "Zn", "id": "zn1", x: 2, y: 1 }],
                "bonds": [{ "count": 2, "left": "o1", "right": "zn1" }]
            }
        },
        sensor: { x: 4, y: 1 },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Alkonost: No Ordinary Headache",
        "section": "Alkonost",
        "in": [{
            "inProb": [{
                "probability": 25,
                "elements": [{
                    "name": "N", "id": "n1", "x": 1, "y": 1, "bonds": ["n2"]
                }, {
                    "name": "N", "id": "n2", "x": 2, "y": 1, "bonds": ["n1"]
                }],
                "bonds": [{ count: 3, left: "n1", right: "n2" }]
            }, {
                "probability": 75,
                "elements": [{
                    "name": "O", "id": "o1", "x": 1, "y": 1, "bonds": ["o2"]
                }, {
                    "name": "O", "id": "o2", "x": 2, "y": 1, "bonds": ["o1"]
                }],
                "bonds": [{ count: 2, left: "o1", right: "o2" }]
            }],
            x: 8, y: 17, w: 2, h: 3
        }],
        "outReqs": [{
            "count": 40,
            "elements": [{
                "name": "N", "id": "n1", "x": 1, "y": 1, "bonds": ["o1"]
            }, {
                "name": "O", "id": "o1", "x": 2, "y": 1, "bonds": ["n1"]
            }],
            "bonds": [{ count: 2, left: "n1", right: "o1" }],
            x: 24, y: 2, w: 2, h: 3
        },
        {
            "count": 0,
            "elements": [],
            "bonds": [],
            x: 26, y: 13, w: 5, h: 6
        }],
        "reactors": ["sensor"],
        "production": true
    },
    {
        "name": "Alkonost: No Thanks Necessary",
        "section": "Alkonost",
        "in": [{
            "inProb": [{
                "probability": 25,
                "elements": [{
                    "name": "N", "id": "n1", "x": 1, "y": 1, "bonds": ["n2"]
                }, {
                    "name": "N", "id": "n2", "x": 2, "y": 1, "bonds": ["n1"]
                }],
                "bonds": [{ count: 3, left: "n1", right: "n2" }]
            }, {
                "probability": 75,
                "elements": [{
                    "name": "O", "id": "o1", "x": 1, "y": 1, "bonds": ["o2"]
                }, {
                    "name": "O", "id": "o2", "x": 2, "y": 1, "bonds": ["o1"]
                }],
                "bonds": [{ count: 2, left: "o1", right: "o2" }]
            }],
            x: 7, y: 4, w: 2, h: 3
        }, {
                "inProb": [{
                    "probability": 75,
                    "elements": [{
                        "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": ["o1"]
                    }, {
                        "name": "O", "id": "o1", "x": 2, "y": 1, "bonds": ["h1","h2"]
                        }, {
                            "name": "H", "id": "h2", "x": 2, "y": 2, "bonds": ["o1"]
                        }],
                    "bonds": [{ count: 1, left: "h1", right: "o1" },
                        { count: 1, left: "h2", right: "o1" }]
                }, {
                    "probability": 25,
                    "elements": [{
                        "name": "Na", "id": "na1", "x": 1, "y": 1, "bonds": ["cl1"]
                    }, {
                        "name": "Cl", "id": "cl1", "x": 2, "y": 1, "bonds": ["na1"]
                    }],
                    "bonds": [{ count: 1, left: "na1", right: "cl1" }]
                }],
                x: 7, y: 17, w: 2, h: 3
            }],
            "outReqs": [{
                "count": 0,
                "elements": [],
                "bonds": [],
                x: 27, y: 0, w: 5, h: 6
            },
            {
                "count": 20,
                "elements": [{
                        "name": "H", "id": "h1", "x": 0, "y": 2, "bonds": ["o1"]
                    }, {
                        "name": "O", "id": "o1", "x": 0, "y": 1, "bonds": ["h1","n1"]
                    }, {
                        "name": "O", "id": "o2", "x": 1, "y": 0, "bonds": ["n1"]
                    }, {
                        "name": "O", "id": "o3", "x": 2, "y": 1, "bonds": ["n1"]
                    }, {
                        "name": "N", "id": "n1", "x": 1, "y": 1, "bonds": ["o1", "o2", "o3"]
                }],
                "bonds": [{ count: 1, left: "h1", right: "o1" },
                    { count: 1, left: "o1", right: "n1" },
                    { count: 2, left: "o2", right: "n1" },
                    { count: 1, left: "o3", right: "n1" }],
                x: 23, y: 7, w: 2, h: 3
            }, {
                "count": 20,
                "elements": [{
                    "name": "Na", "id": "na1", "x": 0, "y": 2, "bonds": ["o1"]
                }, {
                    "name": "O", "id": "o1", "x": 0, "y": 1, "bonds": ["na1", "n1"]
                }, {
                    "name": "O", "id": "o2", "x": 1, "y": 0, "bonds": ["n1"]
                }, {
                    "name": "O", "id": "o3", "x": 2, "y": 1, "bonds": ["n1"]
                }, {
                    "name": "N", "id": "n1", "x": 1, "y": 1, "bonds": ["o1", "o2", "o3"]
                }],
                "bonds": [{ count: 1, left: "na1", right: "o1" },
                { count: 1, left: "o1", right: "n1" },
                { count: 2, left: "o2", right: "n1" },
                { count: 1, left: "o3", right: "n1" }],
                x: 21, y: 17, w: 2, h: 3
            }
        ],
        "reactors": ["sensor"],
        "production": true
    },
    {
        "name": "Alkonost: Going Green",
        "section": "Alkonost",
        "in": [{
            "inProb": [{
                "probability": 67,
                "elements": [{
                    "name": "O", "id": "o1", "x": 1, "y": 1, "bonds": ["c1"]
                }, {
                    "name": "C", "id": "c1", "x": 2, "y": 1, "bonds": ["o1","o2"]
                }, {
                    "name": "O", "id": "o2", "x": 3, "y": 1, "bonds": ["c1"]
                }],
                "bonds": [{ count: 2, left: "o1", right: "c1" }, { count: 2, left: "o2", right: "c1" }]
            }, {
                "probability": 33,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": ["s1"]
                }, {
                    "name": "S", "id": "s1", "x": 1, "y": 2, "bonds": ["h1", "h2"]
                }, {
                    "name": "H", "id": "h2", "x": 2, "y": 2, "bonds": ["s1"]
                }],
                "bonds": [{ count: 1, left: "h1", right: "s1" }, { count: 1, left: "h2", right: "s1" }]
            }],
            x: 3, y: 4, w: 1, h: 15
        }],
        "outReqs": [
            {
                "count": 40,
                "elements":[
                    {
                        "x":1,
                        "y":0,
                        "name":"O",
                        "id":"O1",
                        bonds:["S1"]
                    },
                    {
                        "x":0,
                        "y":1,
                        "name":"O",
                        "id":"O2",
                        bonds:["S1"]
                    },
                    {
                        "x":2,
                        "y":1,
                        "name":"O",
                        "id":"O3",
                        bonds:["S1"]
                    },
                    {
                        "x":1,
                        "y":2,
                        "name":"O",
                        "id":"O4",
                        bonds:["S1"]
                    },
                    {
                        "x":1,
                        "y":1,
                        "name":"S",
                        "id":"S1",
                        bonds:["O1","O2","O3","O4"]
                    },
                    {
                        "x":0,
                        "y":2,
                        "name":"H",
                        "id":"H1",
                        bonds: ["O2"]
                    },
                    {
                        "x":2,
                        "y":0,
                        "name":"H",
                        "id":"H2",
                        bonds: ["O3"]
                    }
                ],
                "bonds":[
                    {
                        "count":1,
                        "left":"O2",
                        "right":"S1"
                    },
                    {
                        "count":1,
                        "left":"O3",
                        "right":"S1"
                    },
                    {
                        "count":2,
                        "left":"O1",
                        "right":"S1"
                    },
                    {
                        "count":2,
                        "left":"O4",
                        "right":"S1"
                    },
                    {
                        "count":1,
                        "left":"O2",
                        "right":"H1"
                    },
                    {
                        "count":1,
                        "left":"O3",
                        "right":"H2"
                    }
                ],
                x: 23, y: 7, w: 2, h: 3
            }, {
                "count": 40,
                "elements": [{
                    "name": "C", "id": "c1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": [],
                x: 21, y: 17, w: 2, h: 3
            }
        ],
        "reactors": ["sensor"],
        "production": true
    },
    {
        "name": "Sikutar: Ice to Meet You",
        "section": "Sikutar",
        "alpha": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            "outReqs": {
                "count": 10,
                "elements": [{
                    "name": "Co", "id": "co1", x: 1, y: 1, "bonds": ["o1"]
                }, {
                    "name": "O", "id": "o1", x: 2, y: 1, "bonds": ["co1"]
                }],
                "bonds": [{ "count": 2, "left": "co1", "right": "o1" }]
            }
        }, "beta": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "Fe", "id": "fe1", x: 1, y: 1, "bonds": ["o1"]
                }, {
                    "name": "O", "id": "o1", x: 2, y: 1, "bonds": ["fe1"]
                }],
                "bonds": [{ "count": 2, "left": "fe1", "right": "o1" }]
            }],
            "outReqs": {
            }
        },
        fuser: { x: 4, y: 1 }
    },
    {
        "name": "Sikutar: Under the Ice",
        "section": "Sikutar",
        "alpha": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            "outReqs": {
                "count": 10,
                "elements": [{
                    "name": "N", "id": "n1", x: 1, y: 1, "bonds": ["n2"]
                }, {
                    "name": "N", "id": "n2", x: 2, y: 1, "bonds": ["n1","o1"]
                }, {
                    "name": "O", "id": "o1", x: 3, y: 1, "bonds": ["n2"]
                }],
                "bonds": [{ "count": 3, "left": "n1", "right": "n2" },
                { "count": 1, "left": "o1", "right": "n2" }]
            }
        }, "beta": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "N", "id": "n1", x: 1, y: 1, "bonds": []
                }],
                "bonds": []
            }],
            "outReqs": {
            }
        },
        fuser: { x: 4, y: 1 },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Sikutar: Unknown Sender",
        "section": "Sikutar",
        "alpha": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            "outReqs": {
                "count": 10,
                "elements": [{
                    "name": "Ne", "id": "ne1", x: 1, y: 1, "bonds": []
                }],
                "bonds": []
            }
        }, "beta": {
            "in": [],
            "outReqs": {
            }
        },
        fuser: { x: 4, y: 1 },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Sikutar: Falling",
        "section": "Sikutar",
        "in": [{
            "inProb": [{
                "probability": 100,
                "elements": [
                    {
                      "x": 1,
                      "y": 1,
                      "name": "H",
                      "id": "H1",
                      "bonds": [
                        "O1"
                      ]
                    },
                    {
                      "x": 1,
                      "y": 2,
                      "name": "O",
                      "id": "O1",
                      "bonds": [
                        "H1",
                        "H2"
                      ]
                    },
                    {
                      "x": 2,
                      "y": 2,
                      "name": "H",
                      "id": "H2",
                      "bonds": [
                        "O1"
                      ]
                    }
                  ],
                  "bonds": [
                    {
                      "count": 1,
                      "left": "H1",
                      "right": "O1"
                    },
                    {
                      "count": 1,
                      "left": "O1",
                      "right": "H2"
                    }
                  ]
            }],
            x: 4, y: 4, w: 2, h: 5
        }, {
            "inProb": [{
                "probability": 100,
                "elements": [{
                    "x": 1,
                    "y": 1,
                    "name": "Kr",
                    "id": "Kr1",
                    "bonds": []
                }],
                bonds:[]
            }],
            x: 0, y: 14, w: 5, h: 6
        }],
        "outReqs": [
            {
                "count": 20,
                "elements": [{
                    "name": "Y", "id": "y1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": [],
                x: 23, y: 7, w: 2, h: 3
            }, {
                "count": 20,
                "elements": [{
                    "name": "Zr", "id": "zr1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": [],
                x: 23, y: 12, w: 2, h: 3
            }, {
                "count": 20,
                "elements": [{
                    "name": "Nb", "id": "nb1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": [],
                x: 23, y: 17, w: 2, h: 3
            }
        ],
        "reactors": ["sensor", "fuser"],
        "production": true
    },
    {
        "name": "Sikutar: Applied Fusion",
        "section": "Sikutar",
        "in": [{
            "inProb": [{
                "probability": 100,
                "elements": [
                    {
                      "x": 1,
                      "y": 1,
                      "name": "H",
                      "id": "H1",
                      "bonds": [
                        "O1"
                      ]
                    },
                    {
                      "x": 1,
                      "y": 2,
                      "name": "O",
                      "id": "O1",
                      "bonds": [
                        "H1",
                        "H2"
                      ]
                    },
                    {
                      "x": 2,
                      "y": 2,
                      "name": "H",
                      "id": "H2",
                      "bonds": [
                        "O1"
                      ]
                    }
                  ],
                  "bonds": [
                    {
                      "count": 1,
                      "left": "H1",
                      "right": "O1"
                    },
                    {
                      "count": 1,
                      "left": "O1",
                      "right": "H2"
                    }
                  ]
            }],
            x: 4, y: 18, w: 2, h: 5
        }],
        "outReqs": [
            {
                "count": 20,
                "elements": [{
                    "name": "S", "id": "s1", "x": 1, "y": 1, "bonds": ["o1","o2","o3","o4"]
                },{
                    "name": "O", "id": "o1", "x": 0, "y": 1, "bonds": ["s1","h1"]
                },{
                    "name": "O", "id": "o2", "x": 2, "y": 1, "bonds": ["s1","h2"]
                },{
                    "name": "O", "id": "o3", "x": 1, "y": 0, "bonds": ["s1","h3"]
                },{
                    "name": "O", "id": "o4", "x": 1, "y": 2, "bonds": ["s1"]
                },{
                    "name": "H", "id": "h1", "x": 0, "y": 0, "bonds": ["o1"]
                },{
                    "name": "H", "id": "h2", "x": 2, "y": 2, "bonds": ["o2"]
                },{
                    "name": "H", "id": "h3", "x": 2, "y": 0, "bonds": ["o3"]
                }],
                "bonds": [
                    { "count": 1, "left": "s1", "right": "o1" },
                    { "count": 1, "left": "s1", "right": "o2" },
                    { "count": 1, "left": "s1", "right": "o3" },
                    { "count": 2, "left": "s1", "right": "o4" },
                    { "count": 1, "left": "o1", "right": "h1" },
                    { "count": 1, "left": "o2", "right": "h2" },
                    { "count": 1, "left": "o3", "right": "h3" }
                ],
                x: 23, y: 20, w: 2, h: 3
            }
        ],
        "reactors": ["sensor", "fuser"],
        "production": true
    },
    {
        "name": "Hephaestus IV: Like a Boss",
        "section": "Hephaestus IV",
        "alpha": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            "outReqs": {
                "count": 10,
                "elements": [{
                    "name": "H", "id": "h1", "x": 0, "y": 1, "bonds": ["c1"]
                }, {
                    "name": "H", "id": "h2", "x": 2, "y": 1, "bonds": ["c1"]
                }, {
                    "name": "H", "id": "h3", "x": 1, "y": 0, "bonds": ["c1"]
                }, {
                    "name": "H", "id": "h4", "x": 1, "y": 2, "bonds": ["c1"]
                }, {
                    "name": "C", "id": "c1", "x": 1, "y": 1, "bonds": ["h1", "h2", "h3", "h4"]
                }],
                "bonds": [{ "count": 1, "left": "h1", "right": "c1" },
                    { "count": 1, "left": "h2", "right": "c1" },
                    { "count": 1, "left": "h3", "right": "c1" },
                    { "count": 1, "left": "h4", "right": "c1" }]
            }
        }, "beta": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "C", "id": "c1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            "outReqs": {
            }
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }]
    },
    {
        "name": "Hephaestus IV: Sacre bleu",
        "section": "Hephaestus IV",
        "alpha": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": ["c1"]
                }, {
                    "name": "C", "id": "c1", "x": 2, "y": 1, "bonds": ["h1","n1"]
                }, {
                    "name": "N", "id": "n1", "x": 3, "y": 1, "bonds": ["c1"]
                }],
                "bonds": [{ "count": 1, "left": "h1", "right": "c1" },
                    { "count": 3, "left": "c1", "right": "n1" }]
            }],
            "outReqs": {
                "count": 10,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": ["h2"]
                }, {
                    "name": "H", "id": "h2", "x": 2, "y": 1, "bonds": ["h1"]
                }],
                "bonds": [{ "count": 1, "left": "h1", "right": "h2" }]
            }
        }, "beta": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", "x": 0, "y": 1, "bonds": ["c1"]
                }, {
                    "name": "H", "id": "h2", "x": 2, "y": 1, "bonds": ["c1"]
                }, {
                    "name": "H", "id": "h3", "x": 1, "y": 0, "bonds": ["c1"]
                }, {
                    "name": "H", "id": "h4", "x": 1, "y": 2, "bonds": ["c1"]
                }, {
                    "name": "C", "id": "c1", "x": 1, "y": 1, "bonds": ["h1", "h2", "h3", "h4"]
                }],
                "bonds": [{ "count": 1, "left": "h1", "right": "c1" },
                { "count": 1, "left": "h2", "right": "c1" },
                { "count": 1, "left": "h3", "right": "c1" },
                { "count": 1, "left": "h4", "right": "c1" }]
            }],
            "outReqs": {
                "count": 10,
                "elements": [{
                    "name": "H", "id": "h1", "x": 0, "y": 1, "bonds": ["c1"]
                }, {
                    "name": "H", "id": "h2", "x": 1, "y": 2, "bonds": ["c1"]
                }, {
                    "name": "H", "id": "h3", "x": 1, "y": 0, "bonds": ["c1"]
                }, {
                    "name": "N", "id": "n1", "x": 3, "y": 1, "bonds": ["c2"]
                }, {
                    "name": "C", "id": "c1", "x": 1, "y": 1, "bonds": ["h1", "h2", "h3", "c2"]
                }, {
                    "name": "C", "id": "c2", "x": 2, "y": 1, "bonds": ["c1", "n1"]
                }],
                "bonds": [{ "count": 1, "left": "h1", "right": "c1" },
                { "count": 1, "left": "h2", "right": "c1" },
                { "count": 1, "left": "h3", "right": "c1" },
                { "count": 1, "left": "c1", "right": "c2" },
                { "count": 3, "left": "c2", "right": "n1" }]
            }
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Hephaestus IV: The Plot Thickens",
        "section": "Hephaestus IV",
        "alpha": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "C", "id": "c1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            "outReqs": {
                "count": 10,
                "elements": [{
                    "name": "H", "id": "h1", "x": 0, "y": 0, "bonds": ["c1"]
                }, {
                    "name": "C", "id": "c1", "x": 0, "y": 1, "bonds": ["c2", "h1", "h2"]
                }, {
                    "name": "H", "id": "h2", "x": 0, "y": 2, "bonds": ["c1"]
                }, {
                    "name": "H", "id": "h3", "x": 1, "y": 0, "bonds": ["c2"]
                }, {
                    "name": "C", "id": "c2", "x": 1, "y": 1, "bonds": ["c1", "h3", "h4", "c3"]
                }, {
                    "name": "H", "id": "h4", "x": 1, "y": 2, "bonds": ["c2"]
                }, {
                    "name": "H", "id": "h5", "x": 2, "y": 0, "bonds": ["c3"]
                }, {
                    "name": "C", "id": "c3", "x": 2, "y": 1, "bonds": ["c2", "h5", "h6", "c4"]
                }, {
                    "name": "H", "id": "h6", "x": 2, "y": 2, "bonds": ["c3"]
                }, {
                    "name": "H", "id": "h7", "x": 3, "y": 0, "bonds": ["c4"]
                }, {
                    "name": "C", "id": "c4", "x": 3, "y": 1, "bonds": ["c3", "h7", "h8", "c5"]
                }, {
                    "name": "H", "id": "h8", "x": 3, "y": 2, "bonds": ["c4"]
                }, {
                    "name": "H", "id": "h9", "x": 4, "y": 0, "bonds": ["c5"]
                }, {
                    "name": "C", "id": "c5", "x": 4, "y": 1, "bonds": ["c4", "h9", "h10", "c6"]
                }, {
                    "name": "H", "id": "h10", "x": 4, "y": 2, "bonds": ["c5"]
                }, {
                    "name": "H", "id": "h11", "x": 5, "y": 0, "bonds": ["c6"]
                }, {
                    "name": "C", "id": "c6", "x": 5, "y": 1, "bonds": ["c5", "h11", "h12"]
                }, {
                    "name": "H", "id": "h12", "x": 5, "y": 2, "bonds": ["c6"]
                }],
                "bonds": [{ "count": 1, "left": "h1", "right": "c1" }, { "count": 1, "left": "h2", "right": "c1" },
                    { "count": 1, "left": "h3", "right": "c2" }, { "count": 1, "left": "h4", "right": "c2" }, { "count": 1, "left": "c2", "right": "c1" },
                    { "count": 1, "left": "h5", "right": "c3" }, { "count": 1, "left": "h6", "right": "c3" }, { "count": 1, "left": "c3", "right": "c2" },
                    { "count": 1, "left": "h7", "right": "c4" }, { "count": 1, "left": "h8", "right": "c4" }, { "count": 1, "left": "c4", "right": "c3" },
                    { "count": 1, "left": "h9", "right": "c5" }, { "count": 1, "left": "h10", "right": "c5" }, { "count": 1, "left": "c5", "right": "c4" },
                    { "count": 1, "left": "h11", "right": "c6" }, { "count": 1, "left": "h12", "right": "c6" }, { "count": 1, "left": "c6", "right": "c5" }],
                "size": "large"
            }
        }, "beta": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            "outReqs": {}
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Hephaestus IV: Danger Zone",
        "section": "Hephaestus IV",
        "alpha": {
            "in": [{
                "probability": 50,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }, {
                "probability": 50,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": ["h2"]
                }, {
                    "name": "H", "id": "h2", "x": 2, "y": 1, "bonds": ["h1"]
                }],
                "bonds": [{"count": 1, "left": "h1", "right": "h2"}]
            }],
            "outReqs": {
                "count": 10,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": ["h2"]
                }, {
                    "name": "H", "id": "h2", "x": 2, "y": 1, "bonds": ["h1"]
                }],
                "bonds": [{ "count": 1, "left": "h1", "right": "h2" }]
            }
        }, "beta": {
            "in": [],
            "outReqs": {
            }
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }],
        sensor: { x: 4, y: 1 }
    },
    {
        "name": "Atropos Station: The Blue Danube",
        "section": "Atropos Station",
        "alpha": {
            "in": [{
                "probability": 50,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }, {
                "probability": 50,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": ["h2"]
                }, {
                    "name": "H", "id": "h2", "x": 2, "y": 1, "bonds": ["h1"]
                }],
                "bonds": [{"count": 1, "left": "h1", "right": "h2"}]
            }],
            "outReqs": {
                "count": 10,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": ["h2"]
                }, {
                    "name": "H", "id": "h2", "x": 2, "y": 1, "bonds": ["h1"]
                }],
                "bonds": [{ "count": 1, "left": "h1", "right": "h2" }]
            }
        }, "beta": {
            "in": [],
            "outReqs": {
            }
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }],
        sensor: { x: 4, y: 1 },
        type: "flipflop"
    },
    {
        "name": "Atropos Station: No Stomach For Lunch",
        "section": "Atropos Station",
        "alpha": {
            "in": [{
                "probability": 100,
                "elements": [{ "name": "H", "id": "h1", x: 0, y: 1, bonds:["c1"]}, 
                    { "name": "H", "id": "h2", x: 1, y: 0, bonds:["c1"] },
                    { "name": "H", "id": "h3", x: 1, y: 2, bonds:["c1"] },
                    { "name": "H", "id": "h4", x: 2, y: 0, bonds:["c2"] }, 
                    { "name": "H", "id": "h5", x: 2, y: 2, bonds:["c2"] },
                    { "name": "H", "id": "h6", x: 3, y: 1, bonds:["c2"] },
                    { "name": "C", "id": "c1", x: 1, y: 1, bonds:["h1","h2","h3","c2"] },
                    { "name": "C", "id": "c2", x: 2, y: 1, bonds:["h4","h5","h6","c1"] }],
                "bonds": [{ "count": 1, "left": "h1", "right": "c1" }, 
                    { "count": 1, "left": "h2", "right": "c1" }, 
                    { "count": 1, "left": "h3", "right": "c1" },
                    { "count": 1, "left": "h4", "right": "c2" }, 
                    { "count": 1, "left": "h5", "right": "c2" }, 
                    { "count": 1, "left": "h6", "right": "c2" },
                    { "count": 1, "left": "c1", "right": "c2" }]
            }],
            "outReqs": {
                "count": 10,
                "elements": [ 
                { "name": "H", "id": "h2", x: 1, y: 0, bonds:["c1"] },
                { "name": "H", "id": "h3", x: 1, y: 2, bonds:["c1"] },
                { "name": "H", "id": "h4", x: 2, y: 0, bonds:["c2"] }, 
                { "name": "H", "id": "h5", x: 2, y: 2, bonds:["c2"] },
                { "name": "C", "id": "c1", x: 1, y: 1, bonds:["c2","h2","h3"] },
                { "name": "C", "id": "c2", x: 2, y: 1, bonds:["h4","h5","c1"] }],
            "bonds": [
                { "count": 1, "left": "h2", "right": "c1" }, 
                { "count": 1, "left": "h3", "right": "c1" },
                { "count": 1, "left": "h4", "right": "c2" }, 
                { "count": 1, "left": "h5", "right": "c2" }, 
                { "count": 2, "left": "c1", "right": "c2" }]
            }
        }, "beta": {
            "in": [],
            "outReqs": {
                "count": 10,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": ["h2"]
                }, {
                    "name": "H", "id": "h2", "x": 2, "y": 1, "bonds": ["h1"]
                }],
                "bonds": [{ "count": 1, "left": "h1", "right": "h2" }]
            }
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }],
        type: "flipflop"
    },
    {
        "name": "Atropos Station: No Employment Record Found",
        "section": "Atropos Station",
        "alpha": {
            "in": [{
                "probability": 33,
                "elements": [{
                    "name": "B", "id": "b1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }, {
                "probability": 33,
                "elements": [{
                    "name": "Al", "id": "al1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }, {
                "probability": 34,
                "elements": [{
                    "name": "Si", "id": "si1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            "outReqs": {
                "count": 10,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": ["cl1"]
                }, {
                    "name": "Cl", "id": "cl1", "x": 2, "y": 1, "bonds": ["h1"]
                }],
                "bonds": [{ "count": 1, "left": "h1", "right": "cl1" }]
            }
        }, "beta": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1, "bonds": []
                }],
                "bonds": []
            }],
            "outReqs": {
            }
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }],
        fuser: { x: 4, y: 2 },
        sensor: { x: 4, y: 1 },
        type: "flipflop"
    }
]