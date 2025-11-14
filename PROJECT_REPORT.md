# DYNAMIC GAMING LEADERBOARD SYSTEM WITH RED-BLACK TREE

## Data Structures and Algorithms Course Project

---

## 1. TITLE PAGE

**Project Title:** Dynamic Gaming Leaderboard System with Real-Time Score Management using Red-Black Tree

**Course Name:** Data Structures and Algorithms

**Group Number:** [Your Group Number]

**Group Members:**
- [Member 1 Name] (Student ID: [ID])
- [Member 2 Name] (Student ID: [ID])
- [Member 3 Name] (Student ID: [ID])
- [Member 4 Name] (Student ID: [ID])

**Institution Name:** [Your University/College Name]

**Date of Submission:** [Date]

---

## 2. TABLE OF CONTENTS

1. Title Page
2. Table of Contents
3. Introduction
4. Tech Stack
5. Data Structures and Algorithms Used
6. Implementation
7. Results and Output
8. Conclusion and Learning Outcomes
9. References

---


## 3. INTRODUCTION

### 3.1 Project Overview

The Dynamic Gaming Leaderboard System is a web-based application that manages competitive gaming scores using an efficient Red-Black Tree data structure. The system allows players to play actual games (Aim Trainer, TypeRace, and Cognitive Trainer), automatically submit their scores, and view real-time rankings on a leaderboard. Unlike traditional leaderboard systems that use simple arrays or databases, our implementation leverages a self-balancing Red-Black Tree to ensure O(log n) time complexity for all critical operations including insertion, deletion, and rank queries.

The system features:
- Three fully playable browser-based games
- Real-time score updates during gameplay (every 500ms)
- Automatic score submission and leaderboard synchronization
- Efficient ranking system using Red-Black Tree
- User authentication and session management
- Score deletion functionality
- Multi-player competitive environment

### 3.2 Objectives

1. **Implement a Self-Balancing Red-Black Tree** for efficient score management with guaranteed O(log n) operations
2. **Develop Real-Time Gaming System** where players play actual games instead of manually entering scores
3. **Achieve Optimal Performance** for insertion, deletion, and rank queries even with thousands of players
4. **Create Interactive User Experience** with live score updates and instant leaderboard refresh
5. **Demonstrate Practical Application** of advanced data structures in a real-world scenario
6. **Ensure Data Integrity** through proper tree balancing and validation

### 3.3 Scope

**Included Functionalities:**
- User registration and login system
- Three playable games: Aim Trainer, TypeRace, Cognitive Trainer
- Live score submission during gameplay (throttled to 500ms)
- Red-Black Tree based leaderboard with O(log n) operations
- Real-time rank calculation
- Score deletion for own scores
- Session persistence across game plays
- Responsive web interface
- Multi-user support

**Not Included:**
- Persistent user authentication (uses session storage)
- Game replay/recording system
- Multiplayer head-to-head mode
- Achievement system integration
- Mobile native applications
- Database persistence (uses JSON file storage)

---


## 4. TECH STACK

### 4.1 Software

#### Programming Languages
- **JavaScript (Node.js)** - Backend server implementation
- **JavaScript (ES6+)** - Frontend game logic and UI
- **HTML5** - Structure and Canvas API for games
- **CSS3** - Styling and animations

#### Libraries/Frameworks

**Backend:**
- **Express.js (v4.18.2)** - Web application framework for Node.js
- **CORS (v2.8.5)** - Cross-Origin Resource Sharing middleware
- **Node.js File System (fs)** - File-based data persistence

**Frontend:**
- **Vanilla JavaScript** - No framework dependencies for better performance
- **HTML5 Canvas API** - For rendering game graphics
- **Font Awesome 6.0.0** - Icon library for UI elements
- **Google Fonts (Inter)** - Typography

#### Development Tools
- **Visual Studio Code** - Primary IDE
- **Git/GitHub** - Version control and collaboration
- **Node Package Manager (npm)** - Dependency management
- **Chrome DevTools** - Debugging and performance analysis
- **Postman** - API endpoint testing

#### Other Software
- **JSON** - Data storage format for games and users
- **SessionStorage API** - Client-side session management
- **LocalStorage API** - Theme preferences storage

### 4.2 Hardware

#### Minimum System Requirements
- **Processor:** Intel Core i3 or equivalent (2.0 GHz)
- **RAM:** 4 GB minimum, 8 GB recommended
- **Storage:** 100 MB free disk space
- **Display:** 1280x720 resolution minimum
- **Network:** Internet connection for multi-user functionality

#### Recommended System Requirements
- **Processor:** Intel Core i5 or equivalent (2.5 GHz+)
- **RAM:** 8 GB or higher
- **Storage:** 500 MB free disk space
- **Display:** 1920x1080 resolution
- **Network:** Broadband internet connection

#### Browser Requirements
- **Chrome/Edge:** Version 90+ (Recommended)
- **Firefox:** Version 88+
- **Safari:** Version 14+
- **Opera:** Version 76+

#### Peripherals
- **Mouse:** Required for Aim Trainer and Cognitive Trainer games
- **Keyboard:** Required for TypeRace and Cognitive Trainer games

---


## 5. DATA STRUCTURES AND ALGORITHMS USED

### 5.1 Red-Black Tree (Primary Data Structure)

#### Name of Data Structure
**Self-Balancing Red-Black Tree**

#### Justification for Use
A Red-Black Tree was chosen as the core data structure for the leaderboard system due to its guaranteed O(log n) time complexity for insertion, deletion, and search operations. Unlike simple arrays (O(n) for insertion in sorted order) or hash maps (no inherent ordering), Red-Black Trees maintain sorted order while providing efficient operations.

**Key Advantages:**
1. **Guaranteed Performance:** Worst-case O(log n) for all operations
2. **Automatic Balancing:** Self-balancing properties ensure tree height remains logarithmic
3. **Ordered Traversal:** In-order traversal gives sorted scores automatically
4. **Efficient Rank Queries:** Can find player rank in O(log n) time
5. **Dynamic Updates:** Handles frequent insertions/deletions efficiently

#### Specific Use-case in the Project

**Location:** `backend/rbtree.js`

**Primary Operations:**
1. **insertOrUpdate(playerID, score)** - Insert new player or update existing score
2. **remove(playerID)** - Delete a player's score
3. **getRank(playerID)** - Get player's current rank
4. **getPlayerByRank(rank)** - Get player at specific rank
5. **toArray()** - Get sorted leaderboard

**Implementation Details:**
```javascript
class Node {
    constructor(playerID, score) {
        this.playerID = playerID;
        this.score = score;
        this.color = RED;
        this.left = null;
        this.right = null;
        this.parent = null;
        this.size = 1; // Subtree size for rank queries
    }
}
```

#### Red-Black Tree Properties Maintained
1. Every node is either RED or BLACK
2. Root is always BLACK
3. All leaves (NIL) are BLACK
4. RED nodes cannot have RED children
5. All paths from root to leaves have same number of BLACK nodes



### 5.2 Hash Map (JavaScript Object/Map)

#### Name of Data Structure
**Hash Map (JavaScript Object)**

#### Justification for Use
Hash Maps provide O(1) average-case lookup time for player data and game information. Used for quick access to game configurations and user sessions.

#### Specific Use-case in the Project
- **Game Data Storage:** `gamesData` object stores game configurations
- **User Data Storage:** `usersData` object stores user information
- **Leaderboard Cache:** `leaderboards` Map stores RBTree instances per game
- **Session Management:** Quick user lookup during authentication

**Example:**
```javascript
const leaderboards = new Map();
leaderboards.set('aim', new RBTree());
leaderboards.set('type', new RBTree());
leaderboards.set('cognitive', new RBTree());
```

### 5.3 Array (Dynamic Array)

#### Name of Data Structure
**Dynamic Array (JavaScript Array)**

#### Justification for Use
Arrays are used for storing ordered collections where index-based access is needed, such as game history and score lists.

#### Specific Use-case in the Project
- **Score History:** Each game stores array of score objects
- **Leaderboard Display:** Converting RBTree to array for frontend display
- **Game List:** Storing multiple game configurations

### 5.4 Queue (Implicit in Event Loop)

#### Name of Data Structure
**Event Queue (JavaScript Event Loop)**

#### Justification for Use
JavaScript's event loop manages asynchronous operations, ensuring non-blocking I/O for API requests and game updates.

#### Specific Use-case in the Project
- **API Request Handling:** Queuing multiple score submissions
- **Live Score Updates:** Throttled updates using event queue
- **Canvas Rendering:** RequestAnimationFrame queue for smooth animations

---


## 5.5 ALGORITHMS USED

### Algorithm 1: Red-Black Tree Insertion with Balancing

#### Name of Algorithm
**Red-Black Tree Insertion with Rotation and Recoloring**

#### Brief Description
Inserts a new node into the Red-Black Tree and performs rotations and recoloring to maintain Red-Black properties.

#### Pseudo-code
```
FUNCTION insertOrUpdate(playerID, score):
    existing = findNode(playerID)
    
    IF existing EXISTS:
        IF existing.score < score:
            existing.score = score
            // Restructure tree based on new score
            remove(playerID)
            insert(playerID, score)
        RETURN
    
    newNode = createNode(playerID, score, RED)
    
    IF root is NULL:
        root = newNode
        root.color = BLACK
        RETURN
    
    // Standard BST insertion
    current = root
    WHILE TRUE:
        IF newNode.score > current.score:
            IF current.right is NULL:
                current.right = newNode
                newNode.parent = current
                BREAK
            current = current.right
        ELSE:
            IF current.left is NULL:
                current.left = newNode
                newNode.parent = current
                BREAK
            current = current.left
    
    // Fix Red-Black violations
    fixInsert(newNode)
    updateSizes(newNode)

FUNCTION fixInsert(node):
    WHILE node.parent.color == RED:
        IF node.parent == node.parent.parent.left:
            uncle = node.parent.parent.right
            
            IF uncle.color == RED:
                // Case 1: Recoloring
                node.parent.color = BLACK
                uncle.color = BLACK
                node.parent.parent.color = RED
                node = node.parent.parent
            ELSE:
                IF node == node.parent.right:
                    // Case 2: Left rotation
                    node = node.parent
                    rotateLeft(node)
                
                // Case 3: Right rotation
                node.parent.color = BLACK
                node.parent.parent.color = RED
                rotateRight(node.parent.parent)
        ELSE:
            // Mirror cases
            ...
    
    root.color = BLACK
```

#### Time & Space Complexity Analysis
- **Time Complexity:** O(log n)
  - Tree height is O(log n) due to balancing
  - Insertion traversal: O(log n)
  - Fixing violations: O(log n) rotations maximum
  
- **Space Complexity:** O(1)
  - Only constant extra space for pointers
  - No recursive calls (iterative implementation)

#### Justification & Use-case
This algorithm ensures the leaderboard remains balanced even with frequent score updates. When a player achieves a new high score, the tree automatically reorganizes to maintain O(log n) access time, crucial for real-time gaming where hundreds of score updates may occur per minute.



### Algorithm 2: Rank Calculation using Subtree Sizes

#### Name of Algorithm
**Augmented Red-Black Tree Rank Query**

#### Brief Description
Calculates a player's rank by utilizing augmented subtree size information stored in each node. This allows O(log n) rank queries without traversing the entire tree.

#### Pseudo-code
```
FUNCTION getRank(playerID):
    node = findNode(playerID)
    IF node is NULL:
        RETURN NULL
    
    rank = 1
    current = node
    
    // Count nodes with higher scores
    WHILE current != NULL:
        IF current.right != NULL:
            rank += current.right.size
        
        IF current.parent != NULL AND current == current.parent.left:
            rank += 1
            IF current.parent.right != NULL:
                rank += current.parent.right.size
        
        current = current.parent
    
    RETURN rank

FUNCTION updateSizes(node):
    WHILE node != NULL:
        leftSize = node.left ? node.left.size : 0
        rightSize = node.right ? node.right.size : 0
        node.size = 1 + leftSize + rightSize
        node = node.parent
```

#### Time & Space Complexity Analysis
- **Time Complexity:** O(log n)
  - Traverses from node to root
  - Tree height is O(log n)
  
- **Space Complexity:** O(1)
  - Only uses constant extra space

#### Justification & Use-case
Traditional rank calculation requires O(n) time to count all higher scores. Our augmented approach stores subtree sizes, enabling O(log n) rank queries. This is essential for displaying "Your rank: #5" immediately after score submission without scanning all players.

### Algorithm 3: In-Order Traversal for Sorted Leaderboard

#### Name of Algorithm
**Reverse In-Order Traversal (Descending Order)**

#### Brief Description
Traverses the Red-Black Tree in reverse in-order (right-root-left) to produce a sorted list of scores from highest to lowest.

#### Pseudo-code
```
FUNCTION toArray():
    result = []
    reverseInOrder(root, result)
    RETURN result

FUNCTION reverseInOrder(node, result):
    IF node is NULL:
        RETURN
    
    // Visit right subtree first (higher scores)
    reverseInOrder(node.right, result)
    
    // Visit current node
    result.push({
        playerID: node.playerID,
        score: node.score,
        rank: result.length + 1
    })
    
    // Visit left subtree (lower scores)
    reverseInOrder(node.left, result)
```

#### Time & Space Complexity Analysis
- **Time Complexity:** O(n)
  - Visits each node exactly once
  
- **Space Complexity:** O(n)
  - Stores all n nodes in result array
  - Recursion stack: O(log n) due to tree height

#### Justification & Use-case
When displaying the full leaderboard, we need all scores in descending order. Reverse in-order traversal naturally produces this ordering in O(n) time, which is optimal since we must visit all nodes anyway.



### Algorithm 4: Tree Rotation (Left and Right)

#### Name of Algorithm
**Red-Black Tree Rotation**

#### Brief Description
Rotations are fundamental operations that restructure the tree while maintaining BST property and reducing height.

#### Pseudo-code
```
FUNCTION rotateLeft(node):
    rightChild = node.right
    node.right = rightChild.left
    
    IF rightChild.left != NULL:
        rightChild.left.parent = node
    
    rightChild.parent = node.parent
    
    IF node.parent == NULL:
        root = rightChild
    ELSE IF node == node.parent.left:
        node.parent.left = rightChild
    ELSE:
        node.parent.right = rightChild
    
    rightChild.left = node
    node.parent = rightChild
    
    // Update sizes
    updateSizes(node)
    updateSizes(rightChild)

FUNCTION rotateRight(node):
    // Mirror of rotateLeft
    ...
```

#### Time & Space Complexity Analysis
- **Time Complexity:** O(1)
  - Constant number of pointer updates
  
- **Space Complexity:** O(1)
  - No extra space needed

#### Justification & Use-case
Rotations are the core mechanism for maintaining tree balance. After insertions or deletions, rotations restructure the tree to ensure O(log n) height, which is critical for maintaining performance guarantees.

### Algorithm 5: Throttled Live Score Updates

#### Name of Algorithm
**Time-Based Throttling for API Requests**

#### Brief Description
Limits the frequency of score submissions to prevent server overload while maintaining real-time feel.

#### Pseudo-code
```
lastSubmitTime = 0
THROTTLE_INTERVAL = 500 // milliseconds

FUNCTION submitScoreLive(score):
    currentTime = getCurrentTime()
    
    IF currentTime - lastSubmitTime < THROTTLE_INTERVAL:
        RETURN // Skip this update
    
    lastSubmitTime = currentTime
    
    // Make API call
    POST /api/games/{gameId}/scores
    BODY: { playerID, score }
```

#### Time & Space Complexity Analysis
- **Time Complexity:** O(1)
  - Simple time comparison
  
- **Space Complexity:** O(1)
  - Only stores last submit time

#### Justification & Use-case
During gameplay, scores can change multiple times per second. Without throttling, this would generate hundreds of API calls per minute per player. Throttling to 500ms intervals reduces load by 90% while maintaining a real-time experience.

---


## 6. IMPLEMENTATION (CODE)

### 6.1 Project Structure

```
Dynamic-Game-Leaderboard/
├── backend/
│   ├── server.js           # Express server & API endpoints
│   ├── rbtree.js           # Red-Black Tree implementation
│   ├── package.json        # Dependencies
│   └── data/
│       ├── games.json      # Game configurations & scores
│       └── users.json      # User data
├── frontend/
│   ├── index.html          # Main leaderboard interface
│   └── games.html          # Playable games page
├── file.html               # Original game reference
├── README.md               # Project documentation
├── LIVE_GAMEPLAY_GUIDE.md  # Gameplay instructions
├── FIXES_APPLIED.md        # Bug fixes documentation
└── PROJECT_REPORT.md       # This report
```

### 6.2 Core Components

#### 6.2.1 Red-Black Tree Implementation (`backend/rbtree.js`)
- **Lines of Code:** ~400
- **Key Methods:**
  - `insertOrUpdate()` - O(log n)
  - `remove()` - O(log n)
  - `getRank()` - O(log n)
  - `getPlayerByRank()` - O(log n)
  - `toArray()` - O(n)
  - `size()` - O(1)

#### 6.2.2 Backend Server (`backend/server.js`)
- **Lines of Code:** ~600
- **API Endpoints:**
  - `GET /api/games` - List all games
  - `POST /api/games` - Create new game
  - `GET /api/games/:id/leaderboard` - Get sorted scores
  - `POST /api/games/:id/scores` - Submit/update score
  - `DELETE /api/games/:id/scores/:player` - Delete score
  - `GET /api/users/:username` - Get user profile

#### 6.2.3 Frontend Interface (`frontend/index.html`)
- **Lines of Code:** ~2800
- **Features:**
  - User authentication
  - Game selection grid
  - Real-time leaderboard display
  - Score submission
  - Delete functionality
  - Theme switching

#### 6.2.4 Game Implementation (`frontend/games.html`)
- **Lines of Code:** ~1000
- **Games:**
  - Aim Trainer (Canvas-based)
  - TypeRace (Text input)
  - Cognitive Trainer (Multi-modal)

### 6.3 Source Code Access

**Full source code is available at:**

📁 **Project Files:** All code is included in the submitted project folder

**Key Files to Review:**
1. `backend/rbtree.js` - Red-Black Tree implementation (Core DS)
2. `backend/server.js` - API and RBTree integration
3. `frontend/games.html` - Live score update implementation
4. `frontend/index.html` - Leaderboard display logic

**Installation & Running:**
```bash
# Install dependencies
cd backend
npm install

# Start server
npm start

# Open browser
http://localhost:3000
```

### 6.4 Code Highlights

#### Red-Black Tree Node Structure
```javascript
class Node {
    constructor(playerID, score) {
        this.playerID = playerID;
        this.score = score;
        this.color = RED;
        this.left = null;
        this.right = null;
        this.parent = null;
        this.size = 1; // For O(log n) rank queries
    }
}
```

#### Live Score Update (Throttled)
```javascript
let lastScoreSubmit = 0;
const submitThrottle = 500;

async function submitScoreLive(score) {
    const now = Date.now();
    if (now - lastScoreSubmit < submitThrottle) return;
    lastScoreSubmit = now;
    
    await fetch(`${API_URL}/games/${gameId}/scores`, {
        method: 'POST',
        body: JSON.stringify({ playerID, score })
    });
}
```

---


## 7. RESULTS AND OUTPUT

### 7.1 Application Screenshots

#### Screenshot 1: Login Page
```
┌─────────────────────────────────────────┐
│         🎮 Elite Gaming Platform        │
│     Sign in to track your scores        │
│                                         │
│  Username: [________________]           │
│  Email:    [________________]           │
│                                         │
│         [🔐 Sign In]                    │
│                                         │
│  New here? Just enter your details!     │
└─────────────────────────────────────────┘
```
**Description:** Clean, modern login interface with gradient background

#### Screenshot 2: Game Selection Dashboard
```
┌─────────────────────────────────────────────────────────┐
│ 🎮 Elite Gaming    [Games] [Achievements] [Profile]    │
│                                          Player: Alice   │
├─────────────────────────────────────────────────────────┤
│              Choose Your Game                           │
│                                                         │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ 🎯 Aim       │  │ ⌨️ TypeRace  │  │ 🧠 Cognitive │ │
│  │ Trainer      │  │              │  │ Trainer      │ │
│  │              │  │              │  │              │ │
│  │ Players: 15  │  │ Players: 23  │  │ Players: 8   │ │
│  │ Top: 1,250   │  │ Top: 95 WPM  │  │ Top: 2,100   │ │
│  │              │  │              │  │              │ │
│  │ [▶ Play]     │  │ [▶ Play]     │  │ [▶ Play]     │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
```
**Description:** Three game cards showing player count and high scores

#### Screenshot 3: Aim Trainer Game (In Progress)
```
┌─────────────────────────────────────────────────────────┐
│ ← Back to Leaderboard          Player: Alice           │
│                                🔄 Live Score Updates    │
├─────────────────────────────────────────────────────────┤
│ 🎯 Click moving targets! Score updates live!           │
├─────────────────────────────────────────────────────────┤
│                                                         │
│        ●  (target)                                      │
│                     ●  (target)                         │
│                                    ●  (target)          │
│                                                         │
│                Time: 18s                                │
├─────────────────────────────────────────────────────────┤
│  Score: 150    Accuracy: 85%    Hits: 15    Time: 18s  │
├─────────────────────────────────────────────────────────┤
│                    [Play Again]                         │
└─────────────────────────────────────────────────────────┘
```
**Description:** Active gameplay with moving targets and live stats

#### Screenshot 4: Leaderboard Display (All Players)
```
┌─────────────────────────────────────────────────────────┐
│                  🏆 Game Leaderboards                   │
│              Compete and rise to the top!               │
├─────────────────────────────────────────────────────────┤
│  [🎯 Aim Trainer] [⌨️ TypeRace] [🧠 Cognitive]         │
├─────────────────────────────────────────────────────────┤
│  Rank │ Player (All Players)    │ Score / Actions      │
├───────┼─────────────────────────┼──────────────────────┤
│  🥇   │ 👤 Bob                  │ 🏆 1,250             │
│  🥈   │ 👤 Charlie              │ 🏆 1,100             │
│  🥉   │ 👤 Alice (You) ✓        │ 🏆 950  [🗑️ Delete] │ ← Green
│   4   │ 👤 David                │ 🏆 800               │
│   5   │ 👤 Eve                  │ 🏆 750               │
└───────┴─────────────────────────┴──────────────────────┘
```
**Description:** Sorted leaderboard with current user highlighted

