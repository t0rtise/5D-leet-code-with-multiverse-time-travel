import React, { useState, useEffect } from 'react';

// Types
const PLAYER_TYPES = {
  SOLVER: 'SOLVER',
  SABOTEUR: 'SABOTEUR'
};

const NODE_STATUS = {
  UNRUN: 'UNRUN',
  PASS: 'PASS', 
  PARTIAL: 'PARTIAL',
  FAIL: 'FAIL',
  RUNTIME: 'RUNTIME',
  TLE: 'TLE'
};

const MOVE_TYPES = {
  CODE_EDIT: 'CODE_EDIT',
  ADD_TEST: 'ADD_TEST',
  BRANCH: 'BRANCH'
};

// Sample Problems
const PROBLEMS = [
  {
    id: 'two-sum',
    title: 'Two Sum',
    prompt: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
    starterCode: `function twoSum(nums, target) {
    // Your code here
    
}`,
    testsPublic: [
      { input: '[2,7,11,15], 9', expected: '[0,1]' },
      { input: '[3,2,4], 6', expected: '[1,2]' }
    ]
  },
  {
    id: 'reverse-string',
    title: 'Reverse String',
    prompt: 'Write a function that reverses a string. The input string is given as an array of characters s.',
    starterCode: `function reverseString(s) {
    // Your code here
    
}`,
    testsPublic: [
      { input: '["h","e","l","l","o"]', expected: '["o","l","l","e","h"]' },
      { input: '["H","a","n","n","a","h"]', expected: '["h","a","n","n","a","H"]' }
    ]
  },
  {
    id: 'valid-parentheses',
    title: 'Valid Parentheses',
    prompt: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    starterCode: `function isValid(s) {
    // Your code here
    
}`,
    testsPublic: [
      { input: '"()"', expected: 'true' },
      { input: '"()[]"', expected: 'true' },
      { input: '"(]"', expected: 'false' }
    ]
  }
];

// Styles object
const styles = {
  page: {
    minHeight: '100vh',
    position: 'relative',
    backgroundColor: 'rgb(193, 200, 187)'
  },
  checkeredBg: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
    backgroundImage: `
      repeating-conic-gradient(
        from 0deg at 50% 50%,
        rgb(193, 200, 187) 0deg 90deg,
        rgb(153, 153, 153) 90deg 180deg,
        rgb(193, 200, 187) 180deg 270deg,
        rgb(153, 153, 153) 270deg 360deg
      )
    `,
    backgroundSize: '80px 80px'
  },
  container: {
    position: 'relative',
    zIndex: 10,
    padding: '2rem',
    maxWidth: '64rem',
    margin: '0 auto'
  },
  button: {
    padding: '1rem 3rem',
    backgroundColor: 'white',
    color: 'black',
    fontWeight: '600',
    fontSize: '1.25rem',
    borderRadius: '0.75rem',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem'
  },
  card: {
    backgroundColor: 'white',
    border: '1px solid #e5e7eb',
    borderRadius: '1rem',
    padding: '1.5rem',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  gameContainer: {
    position: 'relative',
    zIndex: 10
  },
  gameGrid: {
    display: 'flex',
    height: '100vh',
    width: '100%'
  },
  panel: {
    width: '300px',
    minWidth: '300px',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRight: '1px solid #e5e7eb',
    overflowY: 'auto'
  },
  centerPanel: {
    flex: 1,
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    position: 'relative',
    overflow: 'auto'
  },
  rightPanel: {
    width: '300px',
    minWidth: '300px',
    maxHeight: '100%',
    padding: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderLeft: '1px solid #e5e7eb',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  header: {
    position: 'relative',
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderBottom: '2px solid #d1d5db',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  headerContent: {
    maxWidth: '80rem',
    margin: '0 auto',
    padding: '1rem 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  playerIndicator: {
    padding: '1rem 2rem',
    borderRadius: '1rem',
    border: '4px solid',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  },
  node: {
    position: 'absolute',
    width: '6rem',
    height: '5rem',
    borderRadius: '0.5rem',
    border: '2px solid',
    cursor: 'pointer',
    transition: 'all 0.2s',
    backgroundColor: 'white',
    zIndex: 10
  },
  statusIndicator: {
    position: 'absolute',
    top: '-0.5rem',
    right: '-0.5rem',
    width: '1.5rem',
    height: '1.5rem',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: 'white'
  },
  playerBadge: {
    position: 'absolute',
    top: '-0.5rem',
    left: '-0.5rem',
    width: '1.25rem',
    height: '1.25rem',
    borderRadius: '50%',
    border: '2px solid white',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.2)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.75rem',
    fontWeight: 'bold',
    color: 'white'
  },
  codeEditor: {
    backgroundColor: 'white',
    borderRadius: '0.5rem',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },
  editorHeader: {
    backgroundColor: '#f9fafb',
    padding: '0.5rem 1rem',
    borderBottom: '1px solid #e5e7eb',
    borderTopLeftRadius: '0.5rem',
    borderTopRightRadius: '0.5rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  textarea: {
    flex: 1,
    padding: '1rem',
    fontFamily: "'SF Mono', 'Monaco', 'Cascadia Code', monospace",
    fontSize: '0.875rem',
    resize: 'none',
    outline: 'none',
    backgroundColor: '#1f2937',
    color: '#10b981',
    border: 'none',
    overflow: 'auto',
    minHeight: 0
  },
  placeholder: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: '0.5rem',
    border: '2px dashed #d1d5db',
    textAlign: 'center',
    color: '#6b7280'
  }
};

// Checkered background component
const CheckeredBackground = () => (
  <div style={styles.checkeredBg} />
);

// Landing Page Component
function LandingPage({ onNavigate }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div style={styles.page}>
      <CheckeredBackground />
      
      <div style={{
        position: 'relative',
        zIndex: 10,
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(2.5rem)',
        transition: 'all 1s'
      }}>
        <div style={{ textAlign: 'center' }}>
          
          {/* Logo */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{
              width: '57.6rem',
              height: '28.8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '2rem'
            }}>
              <img 
                src="/steelhacksxii_logo.png" 
                alt="SteelHacks XII Logo"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <button 
              onClick={() => onNavigate('problemSelect')}
              style={{
                ...styles.button,
                boxShadow: '0 4px 15px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.1)';
              }}
            >
              <svg 
                style={{ width: '1.5rem', height: '1.5rem', transition: 'transform 0.2s' }} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <polygon points="5,3 19,12 5,21"></polygon>
              </svg>
              ENTER THE MULTIVERSE
            </button>
            
            <button 
              onClick={() => onNavigate('howToPlay')}
              style={{
                padding: '0.5rem 1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                color: '#374151',
                fontWeight: '500',
                fontSize: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #d1d5db',
                cursor: 'pointer',
                transition: 'all 0.3s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.02)';
                e.target.style.backgroundColor = 'white';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
              }}
            >
              How to Play
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// How to Play Page Component
function HowToPlayPage({ onNavigate }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div style={styles.page}>
      <CheckeredBackground />
      
      <div style={{
        ...styles.container,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(1rem)',
        transition: 'all 0.7s'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ marginBottom: '2rem' }}>
            <div style={{
              width: '24rem',
              height: '8rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <img 
                src="/steelhacksxii_logo_side.png" 
                alt="SteelHacks XII Logo"
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain'
                }}
              />
            </div>
          </div>
        </div>
        
        <div style={{
          backgroundColor: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          border: '1px solid #e5e7eb',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          maxWidth: '800px',
          margin: '0 auto'
        }}>
          
          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <p style={{ 
              fontSize: '1.125rem', 
              color: '#374151', 
              lineHeight: '1.6',
              fontWeight: '500'
            }}>
              <strong>Two players take turns editing one line of code at a time, creating a branching multiverse where the Solver tries to build working solutions while the Saboteur introduces bugs and errors.</strong>
            </p>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '1rem',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '0.5rem'
            }}>
              Turn Structure
            </h3>
            
            <div style={{ paddingLeft: '1rem' }}>
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ 
                  backgroundColor: '#10b981', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '1.5rem', 
                  height: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  marginTop: '0.125rem'
                }}>1</span>
                <p style={{ fontSize: '1rem', color: '#374151', margin: 0 }}>
                  <strong>Click a node</strong> to select it and open the code editor
                </p>
              </div>
              
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ 
                  backgroundColor: '#10b981', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '1.5rem', 
                  height: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  marginTop: '0.125rem'
                }}>2</span>
                <p style={{ fontSize: '1rem', color: '#374151', margin: 0 }}>
                  <strong>Edit exactly one line</strong> of code in the textarea
                </p>
              </div>
              
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ 
                  backgroundColor: '#10b981', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '1.5rem', 
                  height: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  marginTop: '0.125rem'
                }}>3</span>
                <p style={{ fontSize: '1rem', color: '#374151', margin: 0 }}>
                  <strong>Click "COMMIT MOVE"</strong> to save your changes and create a new timeline node
                </p>
              </div>
              
              <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ 
                  backgroundColor: '#10b981', 
                  color: 'white', 
                  borderRadius: '50%', 
                  width: '1.5rem', 
                  height: '1.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: 'bold',
                  flexShrink: 0,
                  marginTop: '0.125rem'
                }}>4</span>
                <p style={{ fontSize: '1rem', color: '#374151', margin: 0 }}>
                  <strong>Turn switches</strong> to the other player automatically
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              color: '#1f2937', 
              marginBottom: '1rem',
              borderBottom: '2px solid #e5e7eb',
              paddingBottom: '0.5rem'
            }}>
              Key Rules
            </h3>
            
            <div style={{ paddingLeft: '1rem' }}>
              <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ color: '#10b981', fontSize: '1.25rem', fontWeight: 'bold', flexShrink: 0 }}>•</span>
                <p style={{ fontSize: '1rem', color: '#374151', margin: 0 }}>
                  <strong>One line per turn</strong>: You can only modify one line of code per move
                </p>
              </div>
              
              <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ color: '#10b981', fontSize: '1.25rem', fontWeight: 'bold', flexShrink: 0 }}>•</span>
                <p style={{ fontSize: '1rem', color: '#374151', margin: 0 }}>
                  <strong>Must make a change</strong>: Empty commits are not allowed
                </p>
              </div>
              
              <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ color: '#10b981', fontSize: '1.25rem', fontWeight: 'bold', flexShrink: 0 }}>•</span>
                <p style={{ fontSize: '1rem', color: '#374151', margin: 0 }}>
                  <strong>Node selection</strong>: Click any existing node to branch from that point
                </p>
              </div>
              
              <div style={{ marginBottom: '0.75rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ color: '#10b981', fontSize: '1.25rem', fontWeight: 'bold', flexShrink: 0 }}>•</span>
                <p style={{ fontSize: '1rem', color: '#374151', margin: 0 }}>
                  <strong>Timeline creation</strong>: Each move creates a new node connected to the parent
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            onClick={() => onNavigate('landing')}
            style={{
              ...styles.button,
              padding: '0.75rem 1.5rem',
              fontSize: '1rem'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
          >
            ← Back 
          </button>
        </div>
      </div>
    </div>
  );
}

// Problem Selection Screen
function ProblemSelect({ onSelectProblem, onNavigate }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  return (
    <div style={styles.page}>
      <CheckeredBackground />
      
      <div style={{
        ...styles.container,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(1rem)',
        transition: 'all 0.7s'
      }}>
        {/* Logo at the top */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{
            width: '24rem',
            height: '8rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 2rem auto'
          }}>
            <img 
              src="/steelhacksxii_logo_side.png" 
              alt="SteelHacks XII Logo"
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain'
              }}
            />
          </div>
          <p style={{ fontSize: '2.5rem', color: '#1f2937', fontWeight: 'bold', textShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>Choose Your Problem</p>
        </div>
        
        <div style={styles.grid}>
          {PROBLEMS.map((problem, index) => (
            <div 
              key={problem.id}
              style={{
                ...styles.card,
                animationDelay: `${index * 150}ms`
              }}
              onClick={() => onSelectProblem(problem)}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
              }}
            >
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'black', marginBottom: '0.75rem' }}>
                {problem.title}
              </h3>
              <p style={{ color: '#374151', marginBottom: '1rem', fontSize: '0.875rem', lineHeight: '1.5' }}>
                {problem.prompt}
              </p>
              
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', fontWeight: '500', marginBottom: '0.5rem' }}>
                  Example:
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  fontFamily: 'monospace', 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '0.25rem', 
                  padding: '0.5rem',
                  marginBottom: '0.25rem'
                }}>
                  Input: {problem.testsPublic[0].input}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  fontFamily: 'monospace', 
                  backgroundColor: '#f9fafb', 
                  borderRadius: '0.25rem', 
                  padding: '0.5rem'
                }}>
                  Output: {problem.testsPublic[0].expected}
                </div>
              </div>
              
              <button style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: 'black',
                color: 'white',
                fontWeight: '500',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
              onMouseLeave={(e) => e.target.style.backgroundColor = 'black'}
              >
                Start
              </button>
            </div>
          ))}
        </div>
        
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button 
            onClick={() => onNavigate('landing')}
            style={{
              ...styles.button,
              padding: '0.75rem 1.5rem',
              fontSize: '1rem'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
            onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
          >
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
}

// Game Board Component
function GameBoard({ problem, onBack }) {
  const [gameState, setGameState] = useState({
    currentPlayer: PLAYER_TYPES.SOLVER,
    turnNumber: 1,
    selectedNodeId: null,
    nodes: {
      'root': {
        id: 'root',
        parentId: null,
        code: problem.starterCode,
        status: NODE_STATUS.UNRUN,
        createdBy: 'SYSTEM',
        moveId: null,
        createdAt: new Date().toISOString(),
        position: { x: 0, y: 0 }
      }
    },
    edges: [],
    moveLog: [],
    showEditor: false,
    currentCode: problem.starterCode,
    originalCode: ''
  });

  // Generate node positions for tree layout
  const getNodePositions = () => {
    const positions = {};
    const levels = {};
    const nodeWidth = 96;
    const nodeHeight = 80;
    const minHorizontalSpacing = 120;
    
    const calculateLevels = (nodeId, level = 0) => {
      levels[nodeId] = level;
      
      const children = Object.values(gameState.nodes).filter(
        node => node.parentId === nodeId
      );
      
      children.forEach(child => calculateLevels(child.id, level + 1));
    };
    
    calculateLevels('root');
    
    const wouldOverlap = (x1, y1, x2, y2) => {
      const horizontalOverlap = Math.abs(x1 - x2) < minHorizontalSpacing;
      const verticalOverlap = Math.abs(y1 - y2) < nodeHeight + 20;
      return horizontalOverlap && verticalOverlap;
    };
    
    const findNonOverlappingPosition = (targetX, targetY) => {
      let x = targetX;
      let attempts = 0;
      const maxAttempts = 20;
      
      while (attempts < maxAttempts) {
        let hasOverlap = false;
        
        for (const [nodeId, pos] of Object.entries(positions)) {
          if (wouldOverlap(x, targetY, pos.x, pos.y)) {
            hasOverlap = true;
            break;
          }
        }
        
        if (!hasOverlap) {
          return { x, y: targetY };
        }
        
        const direction = attempts % 2 === 0 ? 1 : -1;
        const distance = Math.ceil(attempts / 2) * minHorizontalSpacing;
        x = targetX + (direction * distance);
        attempts++;
      }
      
      return { x: targetX, y: targetY };
    };
    
    const positionNode = (nodeId, parentX = 0, siblingIndex = 0, siblingCount = 1) => {
      const level = levels[nodeId];
      
      if (nodeId === 'root') {
        positions[nodeId] = { x: 0, y: 0 };
      } else {
        let targetX;
        const targetY = level * 150;
        
        if (siblingCount === 1) {
          targetX = parentX;
        } else {
          const spacing = Math.max(minHorizontalSpacing, 200);
          const totalWidth = (siblingCount - 1) * spacing;
          const startX = parentX - totalWidth / 2;
          targetX = startX + siblingIndex * spacing;
        }
        
        positions[nodeId] = findNonOverlappingPosition(targetX, targetY);
      }
      
      const children = Object.values(gameState.nodes).filter(
        node => node.parentId === nodeId
      );
      
      children.forEach((child, index) => {
        positionNode(child.id, positions[nodeId].x, index, children.length);
      });
    };
    
    positionNode('root');
    
    return positions;
  };

  const nodePositions = getNodePositions();

  const selectNode = (nodeId) => {
    const node = gameState.nodes[nodeId];
    setGameState(prev => ({
      ...prev,
      selectedNodeId: nodeId,
      currentCode: node.code,
      originalCode: node.code,
      showEditor: true
    }));
  };

  const executeCode = (code) => {
    try {
      if (problem.id === 'two-sum') {
        const func = new Function('return ' + code)();
        const results = problem.testsPublic.map(test => {
          try {
            const [nums, target] = eval(`[${test.input}]`);
            const result = func(nums, target);
            const expected = JSON.parse(test.expected);
            const passed = JSON.stringify(result) === JSON.stringify(expected) || 
                          JSON.stringify(result) === JSON.stringify(expected.reverse());
            return { passed, result: JSON.stringify(result), expected: test.expected };
          } catch (e) {
            return { passed: false, error: e.message };
          }
        });
        
        const allPassed = results.every(r => r.passed);
        const anyPassed = results.some(r => r.passed);
        
        return {
          status: allPassed ? NODE_STATUS.PASS : anyPassed ? NODE_STATUS.PARTIAL : NODE_STATUS.FAIL,
          results
        };
      }
      
      new Function('return ' + code)();
      return { status: NODE_STATUS.PASS, results: [{ passed: true, result: 'Code compiles' }] };
    } catch (error) {
      return { status: NODE_STATUS.RUNTIME, results: [{ passed: false, error: error.message }] };
    }
  };

  const makeMove = () => {
    if (!gameState.showEditor || !gameState.selectedNodeId) return;

    const originalLines = gameState.originalCode.split('\n');
    const currentLines = gameState.currentCode.split('\n');
    
    // Count lines added and removed
    let linesAdded = 0;
    let linesRemoved = 0;
    let linesModified = 0;
    
    // Check if lines were added
    if (currentLines.length > originalLines.length) {
      linesAdded = currentLines.length - originalLines.length;
    }
    
    // Check if lines were removed
    if (originalLines.length > currentLines.length) {
      linesRemoved = originalLines.length - currentLines.length;
    }
    
    // Check for modified lines (only when line count is the same)
    if (currentLines.length === originalLines.length) {
      for (let i = 0; i < originalLines.length; i++) {
        if (originalLines[i] !== currentLines[i]) {
          linesModified++;
        }
      }
    }
    
    const totalChanges = (linesAdded > 0 ? 1 : 0) + (linesRemoved > 0 ? 1 : 0) + (linesModified > 0 ? 1 : 0);
    
    if (totalChanges === 0) {
      alert('You must make at least one change to commit a move!');
      return;
    }
    
    if (totalChanges > 1) {
      alert('You can only perform one operation per turn: either add 1 line, remove content from 1 line, or modify 1 line!');
      return;
    }
    
    if (linesAdded > 1) {
      alert('You can only add 1 line of code per turn!');
      return;
    }
    
    if (linesRemoved > 1) {
      alert('You can only remove content from 1 line per turn!');
      return;
    }
    
    if (linesModified > 1) {
      alert('You can only modify 1 line of code per turn!');
      return;
    }

    const newNodeId = `node-${Date.now()}`;
    const execution = executeCode(gameState.currentCode);
    
    const newNode = {
      id: newNodeId,
      parentId: gameState.selectedNodeId,
      code: gameState.currentCode,
      status: execution.status,
      createdBy: gameState.currentPlayer,
      moveId: `move-${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    const newEdge = {
      id: `edge-${Date.now()}`,
      from: gameState.selectedNodeId,
      to: newNodeId
    };

    setGameState(prev => ({
      ...prev,
      nodes: {
        ...prev.nodes,
        [newNodeId]: newNode
      },
      edges: [...prev.edges, newEdge],
      selectedNodeId: null,
      currentPlayer: prev.currentPlayer === PLAYER_TYPES.SOLVER ? PLAYER_TYPES.SABOTEUR : PLAYER_TYPES.SOLVER,
      turnNumber: prev.turnNumber + 1,
      showEditor: false,
      originalCode: ''
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case NODE_STATUS.PASS: return '#10b981';
      case NODE_STATUS.PARTIAL: return '#f59e0b';
      case NODE_STATUS.FAIL: return '#ef4444';
      case NODE_STATUS.RUNTIME: return '#dc2626';
      case NODE_STATUS.TLE: return '#f97316';
      default: return '#9ca3af';
    }
  };

  const getPlayerColor = (player) => {
    if (player === PLAYER_TYPES.SOLVER) return '#10b981';
    if (player === PLAYER_TYPES.SABOTEUR) return '#ef4444';
    return '#9ca3af';
  };

  return (
    <div style={styles.page}>
      <CheckeredBackground />
      
      <div style={styles.gameContainer}>
        {/* Header */}
        <div style={styles.header}>
          <div style={{...styles.headerContent, position: 'relative'}}>
            <button 
              onClick={onBack}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#f3f4f6',
                color: '#374151',
                borderRadius: '0.5rem',
                border: 'none',
                cursor: 'pointer',
                fontWeight: '500',
                zIndex: 10
              }}
            >
              ← Back
            </button>
            
            {/* Logo fixed in center */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              height: '9rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 5
            }}>
              <img 
                src="/steelhacksxii_logo_side.png" 
                alt="SteelHacks XII Logo"
                style={{
                  maxHeight: '100%',
                  maxWidth: '600px',
                  objectFit: 'contain'
                }}
              />
            </div>
            
            <div style={{
              ...styles.playerIndicator,
              borderColor: gameState.currentPlayer === PLAYER_TYPES.SOLVER ? '#10b981' : '#ef4444',
              backgroundColor: gameState.currentPlayer === PLAYER_TYPES.SOLVER ? '#ecfdf5' : '#fef2f2',
              color: gameState.currentPlayer === PLAYER_TYPES.SOLVER ? '#065f46' : '#991b1b',
              zIndex: 10
            }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '500', textTransform: 'uppercase', opacity: 0.8 }}>
                Now Playing
              </div>
              <div style={{ fontSize: '1.875rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{
                  width: '1rem',
                  height: '1rem',
                  borderRadius: '50%',
                  backgroundColor: gameState.currentPlayer === PLAYER_TYPES.SOLVER ? '#10b981' : '#ef4444'
                }}></span>
                {gameState.currentPlayer}
                <span style={{
                  width: '1rem',
                  height: '1rem',
                  borderRadius: '50%',
                  backgroundColor: gameState.currentPlayer === PLAYER_TYPES.SOLVER ? '#10b981' : '#ef4444'
                }}></span>
              </div>
              <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>
                {gameState.currentPlayer === PLAYER_TYPES.SOLVER ? 'Trying to solve' : 'Trying to sabotage'}
              </div>
            </div>
          </div>
        </div>
        
        <div style={{
          ...styles.gameGrid,
          height: 'calc(100vh - 80px)'
        }}>
          
          {/* Left Panel */}
          <div style={styles.panel}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '0.5rem',
              padding: '1rem',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: 'black', marginBottom: '0.5rem' }}>
                {problem.title}
              </h2>
              <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5', marginBottom: '0.75rem' }}>
                {problem.prompt}
              </p>
              
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', marginBottom: '0.5rem' }}>
                  Examples:
                </div>
                {problem.testsPublic.map((test, i) => (
                  <div key={i} style={{
                    fontSize: '0.75rem',
                    fontFamily: 'monospace',
                    backgroundColor: '#f9fafb',
                    borderRadius: '0.25rem',
                    padding: '0.5rem',
                    marginBottom: '0.5rem'
                  }}>
                    <div>Input: {test.input}</div>
                    <div>Output: {test.expected}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Center Panel */}
          <div style={styles.centerPanel}>
            <div style={{ position: 'relative', minHeight: '600px', minWidth: '800px' }}>
              {/* Render Lines */}
              {gameState.edges.map((edge) => {
                const fromPos = nodePositions[edge.from];
                const toPos = nodePositions[edge.to];
                const toNode = gameState.nodes[edge.to];
                
                if (!fromPos || !toPos) return null;
                
                const lineColor = toNode.createdBy === PLAYER_TYPES.SOLVER ? '#10b981' : '#ef4444';
                
                const fromX = fromPos.x + 400 + 48;
                const fromY = fromPos.y + 100 + 80;
                const toX = toPos.x + 400 + 48;
                const toY = toPos.y + 100;
                
                return (
                  <svg
                    key={edge.id}
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      width: '100%',
                      height: '100%',
                      zIndex: 1,
                      pointerEvents: 'none'
                    }}
                  >
                    <path
                      d={`M ${fromX} ${fromY} L ${toX} ${toY}`}
                      stroke={lineColor}
                      strokeWidth="3"
                      fill="none"
                    />
                  </svg>
                );
              })}

              {/* Render Nodes */}
              {Object.values(gameState.nodes).map(node => {
                const pos = nodePositions[node.id];
                const isSelected = gameState.selectedNodeId === node.id;
                
                return (
                  <div
                    key={node.id}
                    style={{
                      ...styles.node,
                      left: pos.x + 400,
                      top: pos.y + 100,
                      borderColor: isSelected ? 'black' : getPlayerColor(node.createdBy),
                      boxShadow: isSelected ? '0 10px 25px rgba(0, 0, 0, 0.2)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
                      transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                    }}
                    onClick={() => selectNode(node.id)}
                  >
                    {/* Code preview */}
                    <div style={{ padding: '0.5rem', height: '100%', overflow: 'hidden' }}>
                      <div style={{ 
                        fontSize: '0.75rem', 
                        fontFamily: 'monospace', 
                        color: '#374151', 
                        lineHeight: '1.2' 
                      }}>
                        {node.code.split('\n').slice(0, 2).map((line, i) => (
                          <div key={i} style={{ 
                            whiteSpace: 'nowrap', 
                            overflow: 'hidden', 
                            textOverflow: 'ellipsis' 
                          }}>
                            {line || ' '}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Node ID */}
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      backgroundColor: '#f3f4f6',
                      padding: '0.125rem 0.25rem',
                      borderBottomLeftRadius: '0.5rem',
                      borderBottomRightRadius: '0.5rem',
                      fontSize: '0.75rem',
                      textAlign: 'center',
                      color: '#6b7280'
                    }}>
                      {node.id === 'root' ? 'ROOT' : `N${Object.keys(gameState.nodes).indexOf(node.id)}`}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Panel */}
          <div style={styles.rightPanel}>
            {/* Code Editor */}
            {gameState.showEditor ? (
              <>
                {/* Commit Move Button */}
                <button
                  onClick={makeMove}
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    backgroundColor: 'black',
                    color: 'white',
                    borderRadius: '0.5rem',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: '500',
                    fontSize: '0.875rem',
                    transition: 'background-color 0.2s',
                    flexShrink: 0,
                    marginBottom: '1rem'
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#374151'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'black'}
                >
                  COMMIT MOVE
                </button>
                
                <div style={{ flex: 1, minHeight: 0 }}>
                  <div style={styles.codeEditor}>
                    <div style={styles.editorHeader}>
                      <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#ef4444', borderRadius: '50%' }}></div>
                      <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#f59e0b', borderRadius: '50%' }}></div>
                      <div style={{ width: '0.75rem', height: '0.75rem', backgroundColor: '#10b981', borderRadius: '50%' }}></div>
                      <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', fontWeight: '500', color: '#374151' }}>
                        solution.js
                      </span>
                    </div>
                    <textarea
                      value={gameState.currentCode}
                      onChange={(e) => setGameState(prev => ({ ...prev, currentCode: e.target.value }))}
                      style={styles.textarea}
                    />
                  </div>
                </div>
              </>
            ) : (
              <div style={styles.placeholder}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>Click a node to edit code</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('landing');
  const [selectedProblem, setSelectedProblem] = useState(null);

  const navigate = (screenName) => {
    setCurrentScreen(screenName);
  };

  const selectProblem = (problem) => {
    setSelectedProblem(problem);
    setCurrentScreen('gameBoard');
  };

  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'landing':
        return <LandingPage onNavigate={navigate} />;
      case 'howToPlay':
        return <HowToPlayPage onNavigate={navigate} />;
      case 'problemSelect':
        return <ProblemSelect onSelectProblem={selectProblem} onNavigate={navigate} />;
      case 'gameBoard':
        return <GameBoard problem={selectedProblem} onBack={() => navigate('problemSelect')} />;
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  };

  return renderCurrentScreen();
}