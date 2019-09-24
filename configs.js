window.configs = [
    {
        "name": "Sernimir II",
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
        "name": "Sleepless on Sernimir IV",
        "alpha": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "O", "id": "o1", "x": 1, "y": 1,
                    "probability": 100, "bonds": ["c1"]
                }, {
                    "name": "C", "id": "c1", "x": 1, "y": 2,
                    "probability": 100, "bonds": ["o1"]
                }],
                "bonds": [{ "count": 2, "left": "o1", "right": "c1" }],
            }],
            "outReqs": {
                "count": 10,
                "elements": [{ "name": "H", "id": "h1", x: 0, y: 2 }, { "name": "C", "id": "c1", x: 1, y: 2 }, { "name": "H", "id": "h2", x: 2, y: 2 },
                    { "name": "O", "id": "o1", x: 1, y: 1 }],
                "bonds": [{ "count": 2, "left": "c1", "right": "o1" }, { "count": 1, "left": "c1", "right": "h1" }, { "count": 1, "left": "c1", "right": "h2" }]
            }
        }, "beta": {
            "in": [{
                "probability": 100,
                "elements": [{
                    "name": "H", "id": "h1", "x": 1, "y": 1,
                    "probability": 100, "bonds": []
                }],
                "bonds": [],
            }],
            "outReqs": {
            }
        },
        bonders: [{ x: 4, y: 3 }, { x: 4, y: 4 }, { x: 5, y: 3 }, { x: 5, y: 4 }]
    },
    {
        "name": "Danopth: Every day is the First Day",
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
        "name": "Alkonost: An Introduction to Sensing",
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
        "name": "Sikutar: Ice to Meet You",
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
        "name": "Hephaestus IV: Like a Boss",
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
    }
]