import React, { useState, useEffect } from 'react';

const TreeNode = ({ x, y, value, highlighted }) => (
  <g className="transition-opacity duration-500">
    <circle
      cx={x}
      cy={y}
      r={20}
      className={`transition-colors duration-500 ${
        highlighted ? "fill-green-500" : "fill-white"
      } stroke-black stroke-2`}
    />
    <text
      x={x}
      y={y}
      className="text-sm"
      textAnchor="middle"
      dominantBaseline="middle"
    >
      {value}
    </text>
  </g>
);

const Edge = ({ x1, y1, x2, y2, highlighted }) => (
  <line
    x1={x1}
    y1={y1}
    x2={x2}
    y2={y2}
    className={`transition-colors duration-500 ${
      highlighted ? "stroke-green-500" : "stroke-black"
    } stroke-2`}
  />
);

const CodeLine = ({ code, highlighted }) => (
  <div className={`font-mono p-1 transition-colors duration-300 ${
    highlighted ? "bg-yellow-100" : ""
  }`}>
    {code}
  </div>
);

const BinaryTreeAnimation = () => {
  const [step, setStep] = useState(0);
  const [paused, setPaused] = useState(true);
  
  const tree = {
    val: 10,
    left: {
      val: 2,
      left: { val: 20, left: null, right: null },
      right: { val: 1, left: null, right: null }
    },
    right: {
      val: 10,
      left: null,
      right: { val: -25, left: null, right: null }
    }
  };

  const codeLines = [
    "public int maxPathSum(TreeNode root) {",
    "    if(root == null) return 0;",
    "    mSum(root);",
    "    return sum;",
    "}",
    "",
    "public int mSum(TreeNode root) {",
    "    if(root == null) return 0;",
    "    int ls = Math.max(0, mSum(root.left));",
    "    int rs = Math.max(0, mSum(root.right));",
    "    sum = Math.max(sum, root.val + ls + rs);",
    "    return root.val + Math.max(ls, rs);",
    "}"
  ];

  const steps = [
    { 
      node: [10], 
      message: "Start at root node 10",
      activeLines: [0, 2],
      recursionStack: ["mSum(10)"],
      values: { ls: "?", rs: "?", sum: "MIN_VALUE" }
    },
    { 
      node: [10, 2], 
      message: "Traverse left subtree, node 2",
      activeLines: [8],
      recursionStack: ["mSum(10)", "mSum(2)"],
      values: { ls: "?", rs: "?", sum: "MIN_VALUE" }
    },
    { 
      node: [10, 2, 20], 
      message: "Traverse to leaf node 20",
      activeLines: [8, 9],
      recursionStack: ["mSum(10)", "mSum(2)", "mSum(20)"],
      values: { ls: "20", rs: "0", sum: "20" }
    },
    { 
      node: [10, 2, 1], 
      message: "Traverse right child of node 2",
      activeLines: [9],
      recursionStack: ["mSum(10)", "mSum(2)", "mSum(1)"],
      values: { ls: "20", rs: "1", sum: "23" }
    },
    { 
      node: [10, 2], 
      message: "Calculate max path through node 2",
      activeLines: [10, 11],
      recursionStack: ["mSum(10)", "mSum(2)"],
      values: { ls: "20", rs: "1", sum: "23" }
    },
    { 
      node: [10, 10], 
      message: "Traverse right subtree, node 10",
      activeLines: [9],
      recursionStack: ["mSum(10)", "mSum(10)"],
      values: { ls: "23", rs: "?", sum: "23" }
    },
    { 
      node: [10, 10, -25], 
      message: "Traverse to leaf node -25",
      activeLines: [7, 8],
      recursionStack: ["mSum(10)", "mSum(10)", "mSum(-25)"],
      values: { ls: "23", rs: "0", sum: "23" }
    },
    { 
      node: [10], 
      message: "Calculate final max path sum",
      activeLines: [10, 11],
      recursionStack: ["mSum(10)"],
      values: { ls: "23", rs: "10", sum: "42" }
    }
  ];

  useEffect(() => {
    let timer;
    if (!paused && step < steps.length - 1) {
      timer = setTimeout(() => setStep(s => s + 1), 2000);
    }
    return () => clearTimeout(timer);
  }, [step, paused]);

  const renderTree = (node, x, y, level = 0, spacing = 100) => {
    if (!node) return null;

    const isHighlighted = steps[step].node.includes(node.val);
    const elements = [];

    elements.push(
      <TreeNode
        key={`node-${x}-${y}`}
        x={x}
        y={y}
        value={node.val}
        highlighted={isHighlighted}
      />
    );

    if (node.left) {
      elements.push(
        <Edge
          key={`edge-left-${x}-${y}`}
          x1={x}
          y1={y + 20}
          x2={x - spacing / 2}
          y2={y + 80}
          highlighted={isHighlighted}
        />
      );
      elements.push(...renderTree(node.left, x - spacing / 2, y + 80, level + 1, spacing / 2));
    }

    if (node.right) {
      elements.push(
        <Edge
          key={`edge-right-${x}-${y}`}
          x1={x}
          y1={y + 20}
          x2={x + spacing / 2}
          y2={y + 80}
          highlighted={isHighlighted}
        />
      );
      elements.push(...renderTree(node.right, x + spacing / 2, y + 80, level + 1, spacing / 2));
    }

    return elements;
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-lg p-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="h-96 relative">
            <svg width="100%" height="100%" viewBox="0 0 400 300">
              <g transform="translate(200, 40)">
                {renderTree(tree, 0, 0)}
              </g>
            </svg>
          </div>
          
          <div className="bg-gray-50 p-4 rounded overflow-auto h-96">
            <div className="mb-4">
              <h3 className="font-bold mb-2">Recursive Stack:</h3>
              <div className="bg-white p-2 rounded border">
                {steps[step].recursionStack.map((call, i) => (
                  <div key={i} className="font-mono text-sm">
                    {"\u2192".repeat(i)} {call}
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <h3 className="font-bold mb-2">Current Values:</h3>
              <div className="bg-white p-2 rounded border font-mono text-sm">
                <div>ls = {steps[step].values.ls}</div>
                <div>rs = {steps[step].values.rs}</div>
                <div>sum = {steps[step].values.sum}</div>
              </div>
            </div>
            <div>
              <h3 className="font-bold mb-2">Code:</h3>
              <div className="bg-white p-2 rounded border">
                {codeLines.map((line, i) => (
                  <CodeLine
                    key={i}
                    code={line}
                    highlighted={steps[step].activeLines.includes(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-4 bg-gray-100 rounded">
          <p className="text-lg font-medium">{steps[step].message}</p>
        </div>
        
        <div className="mt-4 flex justify-center gap-4">
          <button
            className={`px-4 py-2 rounded text-white ${
              step === 0 ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
          >
            Previous
          </button>
          
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setPaused(!paused)}
          >
            {paused ? "Play" : "Pause"}
          </button>
          
          <button
            className={`px-4 py-2 rounded text-white ${
              step === steps.length - 1 ? 'bg-blue-300' : 'bg-blue-500 hover:bg-blue-600'
            }`}
            onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
            disabled={step === steps.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default BinaryTreeAnimation;
