const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const RBTree = require('./rbtree.js');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// Data storage
const DATA_DIR = path.join(__dirname, 'data');
const GAMES_FILE = path.join(DATA_DIR, 'games.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

// In-memory leaderboards for each game
const leaderboards = new Map();

// Initialize data directory
async function initializeDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

// Load data from files
async function loadData() {
  try {
    // Load games
    const gamesData = await fs.readFile(GAMES_FILE, 'utf8');
    const games = JSON.parse(gamesData);
    
    // Initialize leaderboards for each game
    Object.keys(games).forEach(gameId => {
      const leaderboard = new RBTree();
      if (games[gameId].scores) {
        games[gameId].scores.forEach(score => {
          leaderboard.insertOrUpdate(score.playerID, score.score);
        });
      }
      leaderboards.set(gameId, leaderboard);
    });
    
    return { games };
  } catch (error) {
    console.log('No existing data found, starting fresh');
    return { games: {} };
  }
}

// Save games data
async function saveGames(games) {
  try {
    await fs.writeFile(GAMES_FILE, JSON.stringify(games, null, 2));
  } catch (error) {
    console.error('Error saving games:', error);
  }
}

// Save users data
async function saveUsers(users) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

// Load users data
async function loadUsers() {
  try {
    const usersData = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(usersData);
  } catch (error) {
    return {};
  }
}

// Initialize server
let gamesData = {};
let usersData = {};

async function initializeServer() {
  await initializeDataDir();
  const data = await loadData();
  gamesData = data.games;
  usersData = await loadUsers();
  
  // Add default games if none exist
  if (Object.keys(gamesData).length === 0) {
    gamesData = {
      // Classic Games
      racing: {
        name: "Speed Racing",
        icon: "fa-car-side",
        color: "#f093fb",
        description: "Test your racing skills on the track",
        category: "Action",
        difficulty: "Medium",
        scores: []
      },
      puzzle: {
        name: "Brain Puzzle",
        icon: "fa-puzzle-piece",
        color: "#4facfe",
        description: "Challenge your mind with complex puzzles",
        category: "Puzzle",
        difficulty: "Hard",
        scores: []
      },
      shooter: {
        name: "Target Shooter",
        icon: "fa-crosshairs",
        color: "#fa709a",
        description: "Aim for perfection in this precision game",
        category: "Action",
        difficulty: "Medium",
        scores: []
      },
      
      // Coding Challenges
      leetcode: {
        name: "LeetCode Arena",
        icon: "fa-code",
        color: "#00d4ff",
        description: "Solve algorithmic problems and coding challenges",
        category: "Programming",
        difficulty: "Expert",
        scores: []
      },
      algorithms: {
        name: "Algorithm Master",
        icon: "fa-project-diagram",
        color: "#8338ec",
        description: "Master data structures and algorithms",
        category: "Programming",
        difficulty: "Expert",
        scores: []
      },
      debugging: {
        name: "Debug Detective",
        icon: "fa-bug",
        color: "#ff006e",
        description: "Find and fix bugs in code snippets",
        category: "Programming",
        difficulty: "Hard",
        scores: []
      },
      
      // Knowledge Games
      trivia: {
        name: "Tech Trivia",
        icon: "fa-brain",
        color: "#06ffa5",
        description: "Test your technology knowledge",
        category: "Knowledge",
        difficulty: "Medium",
        scores: []
      },
      math: {
        name: "Math Wizard",
        icon: "fa-calculator",
        color: "#ffd60a",
        description: "Solve mathematical problems quickly",
        category: "Education",
        difficulty: "Medium",
        scores: []
      },
      geography: {
        name: "World Explorer",
        icon: "fa-globe",
        color: "#003566",
        description: "Explore countries, capitals, and landmarks",
        category: "Knowledge",
        difficulty: "Easy",
        scores: []
      },
      
      // Strategy Games
      chess: {
        name: "Chess Master",
        icon: "fa-chess",
        color: "#2d3748",
        description: "Strategic chess puzzles and endgames",
        category: "Strategy",
        difficulty: "Hard",
        scores: []
      },
      memory: {
        name: "Memory Palace",
        icon: "fa-memory",
        color: "#e63946",
        description: "Test and improve your memory skills",
        category: "Memory",
        difficulty: "Medium",
        scores: []
      },
      
      // Creative Games
      typing: {
        name: "Speed Typing",
        icon: "fa-keyboard",
        color: "#f77f00",
        description: "Type as fast and accurately as possible",
        category: "Skill",
        difficulty: "Easy",
        scores: []
      },
      design: {
        name: "UI/UX Challenge",
        icon: "fa-paint-brush",
        color: "#7209b7",
        description: "Create beautiful user interfaces",
        category: "Design",
        difficulty: "Medium",
        scores: []
      },
      
      // Competitive Programming
      hackathon: {
        name: "Hackathon Sprint",
        icon: "fa-laptop-code",
        color: "#f72585",
        description: "Build projects under time pressure",
        category: "Programming",
        difficulty: "Expert",
        scores: []
      },
      cybersecurity: {
        name: "Cyber Defense",
        icon: "fa-shield-alt",
        color: "#264653",
        description: "Protect systems from cyber threats",
        category: "Security",
        difficulty: "Expert",
        scores: []
      }
    };
    
    // Initialize leaderboards for default games
    Object.keys(gamesData).forEach(gameId => {
      leaderboards.set(gameId, new RBTree());
    });
    
    await saveGames(gamesData);
  }
}

// API Routes

// Get all games
app.get('/api/games', (req, res) => {
  const gamesWithStats = {};
  
  Object.keys(gamesData).forEach(gameId => {
    const leaderboard = leaderboards.get(gameId);
    const playerCount = leaderboard ? leaderboard.size() : 0;
    const topPlayer = leaderboard && playerCount > 0 ? leaderboard.getPlayerByRank(1) : null;
    
    gamesWithStats[gameId] = {
      ...gamesData[gameId],
      playerCount,
      highScore: topPlayer ? topPlayer.score : 0
    };
  });
  
  res.json(gamesWithStats);
});

// Create new game
app.post('/api/games', async (req, res) => {
  try {
    const { name, description, icon, color, category, difficulty } = req.body;
    
    if (!name || !icon || !color) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const gameId = name.toLowerCase().replace(/[^a-z0-9]/g, '-');
    
    if (gamesData[gameId]) {
      return res.status(409).json({ error: 'Game already exists' });
    }
    
    gamesData[gameId] = {
      name,
      description: description || '',
      icon,
      color,
      category: category || 'Game',
      difficulty: difficulty || 'Medium',
      scores: []
    };
    
    leaderboards.set(gameId, new RBTree());
    await saveGames(gamesData);
    
    res.status(201).json({ gameId, ...gamesData[gameId] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create game' });
  }
});

// Update game
app.put('/api/games/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { name, description, icon, color, category, difficulty } = req.body;
    
    if (!gamesData[gameId]) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    gamesData[gameId] = {
      ...gamesData[gameId],
      name: name || gamesData[gameId].name,
      description: description !== undefined ? description : gamesData[gameId].description,
      icon: icon || gamesData[gameId].icon,
      color: color || gamesData[gameId].color,
      category: category || gamesData[gameId].category,
      difficulty: difficulty || gamesData[gameId].difficulty
    };
    
    await saveGames(gamesData);
    res.json(gamesData[gameId]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update game' });
  }
});

// Delete game
app.delete('/api/games/:gameId', async (req, res) => {
  try {
    const { gameId } = req.params;
    
    if (!gamesData[gameId]) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    delete gamesData[gameId];
    leaderboards.delete(gameId);
    await saveGames(gamesData);
    
    res.json({ message: 'Game deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete game' });
  }
});

// Get leaderboard for a game
app.get('/api/games/:gameId/leaderboard', (req, res) => {
  try {
    const { gameId } = req.params;
    const { limit = 50, search, timeFilter } = req.query;
    
    if (!gamesData[gameId]) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    const leaderboard = leaderboards.get(gameId);
    if (!leaderboard || leaderboard.size() === 0) {
      return res.json([]);
    }
    
    let scores = leaderboard.toArray();
    
    // Apply time filter
    const now = Date.now();
    if (timeFilter === 'today') {
      scores = scores.filter(s => {
        const scoreData = gamesData[gameId].scores.find(score => score.playerID === s.playerID);
        return scoreData && (now - scoreData.timestamp) < 86400000;
      });
    } else if (timeFilter === 'week') {
      scores = scores.filter(s => {
        const scoreData = gamesData[gameId].scores.find(score => score.playerID === s.playerID);
        return scoreData && (now - scoreData.timestamp) < 604800000;
      });
    }
    
    // Apply search filter
    if (search) {
      scores = scores.filter(s => s.playerID.toLowerCase().includes(search.toLowerCase()));
    }
    
    // Limit results
    scores = scores.slice(0, parseInt(limit));
    
    // Add timestamp data
    const enrichedScores = scores.map(score => {
      const scoreData = gamesData[gameId].scores.find(s => s.playerID === score.playerID);
      return {
        ...score,
        timestamp: scoreData ? scoreData.timestamp : Date.now()
      };
    });
    
    res.json(enrichedScores);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get leaderboard' });
  }
});

// Submit score
app.post('/api/games/:gameId/scores', async (req, res) => {
  try {
    const { gameId } = req.params;
    const { playerID, score } = req.body;
    
    if (!gamesData[gameId]) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    if (!playerID || typeof score !== 'number' || score < 0) {
      return res.status(400).json({ error: 'Invalid player ID or score' });
    }
    
    const leaderboard = leaderboards.get(gameId);
    const timestamp = Date.now();
    
    // Update leaderboard
    leaderboard.insertOrUpdate(playerID, score);
    
    // Update persistent storage
    const existingScoreIndex = gamesData[gameId].scores.findIndex(s => s.playerID === playerID);
    const scoreData = { playerID, score, timestamp };
    
    if (existingScoreIndex >= 0) {
      gamesData[gameId].scores[existingScoreIndex] = scoreData;
    } else {
      gamesData[gameId].scores.push(scoreData);
    }
    
    await saveGames(gamesData);
    
    const rank = leaderboard.getRank(playerID);
    res.json({ playerID, score, rank, timestamp });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit score' });
  }
});

// Get player rank
app.get('/api/games/:gameId/players/:playerID/rank', (req, res) => {
  try {
    const { gameId, playerID } = req.params;
    
    if (!gamesData[gameId]) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    const leaderboard = leaderboards.get(gameId);
    const rank = leaderboard.getRank(playerID);
    
    if (!rank) {
      return res.status(404).json({ error: 'Player not found' });
    }
    
    const playerData = leaderboard.findPlayer(playerID);
    res.json(playerData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get player rank' });
  }
});

// User management
app.post('/api/users/login', async (req, res) => {
  try {
    const { username, email } = req.body;
    
    if (!username || !email) {
      return res.status(400).json({ error: 'Username and email required' });
    }
    
    const userId = username.toLowerCase();
    
    if (!usersData[userId]) {
      usersData[userId] = {
        username,
        email,
        joinDate: new Date().toISOString(),
        preferences: {
          theme: 'default',
          notifications: true
        }
      };
      await saveUsers(usersData);
    }
    
    res.json(usersData[userId]);
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get user profile
app.get('/api/users/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const userId = username.toLowerCase();
    
    if (!usersData[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Calculate user statistics
    let totalGames = 0;
    let totalScore = 0;
    let bestRank = null;
    const recentScores = [];
    
    Object.keys(gamesData).forEach(gameId => {
      const game = gamesData[gameId];
      const userScores = game.scores.filter(score => score.playerID === username);
      totalGames += userScores.length;
      totalScore += userScores.reduce((sum, score) => sum + score.score, 0);
      
      // Get best rank
      const leaderboard = leaderboards.get(gameId);
      const rank = leaderboard.getRank(username);
      if (rank && (!bestRank || rank < bestRank)) {
        bestRank = rank;
      }
      
      // Add recent scores
      userScores.forEach(score => {
        recentScores.push({
          ...score,
          game: game.name,
          gameId
        });
      });
    });
    
    // Sort recent scores by timestamp
    recentScores.sort((a, b) => b.timestamp - a.timestamp);
    
    const avgScore = totalGames > 0 ? Math.round(totalScore / totalGames) : 0;
    
    res.json({
      ...usersData[userId],
      stats: {
        totalGames,
        totalScore,
        avgScore,
        bestRank
      },
      recentScores: recentScores.slice(0, 10)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to get user profile' });
  }
});

// Achievements endpoints
app.get('/api/users/:username/achievements', async (req, res) => {
  try {
    const { username } = req.params;
    const userId = username.toLowerCase();
    
    if (!usersData[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Calculate achievements based on user's game history
    const achievements = {
      firstScore: { unlocked: false, progress: 0 },
      speedDemon: { unlocked: false, progress: 0 },
      codeNinja: { unlocked: false, progress: 0 },
      perfectionist: { unlocked: false, progress: 0 },
      socialButterfly: { unlocked: false, progress: 0 },
      champion: { unlocked: false, progress: 0 }
    };
    
    let gamesPlayed = new Set();
    let hasSubmittedScore = false;
    let isChampion = false;
    
    // Check user's scores across all games
    Object.keys(gamesData).forEach(gameId => {
      const game = gamesData[gameId];
      const userScores = game.scores.filter(score => score.playerID === username);
      
      if (userScores.length > 0) {
        hasSubmittedScore = true;
        gamesPlayed.add(gameId);
        
        // Check for champion status
        const leaderboard = leaderboards.get(gameId);
        const rank = leaderboard.getRank(username);
        if (rank === 1) {
          isChampion = true;
        }
        
        // Check speed demon (racing game score > 1000)
        if (gameId === 'racing') {
          const maxScore = Math.max(...userScores.map(s => s.score));
          if (maxScore >= 1000) {
            achievements.speedDemon.unlocked = true;
            achievements.speedDemon.progress = maxScore;
          }
        }
        
        // Check code ninja (leetcode completions)
        if (gameId === 'leetcode') {
          achievements.codeNinja.progress = userScores.length;
          if (userScores.length >= 10) {
            achievements.codeNinja.unlocked = true;
          }
        }
      }
    });
    
    // Set achievement statuses
    if (hasSubmittedScore) {
      achievements.firstScore.unlocked = true;
      achievements.firstScore.progress = 1;
    }
    
    if (isChampion) {
      achievements.champion.unlocked = true;
      achievements.champion.progress = 1;
    }
    
    achievements.socialButterfly.progress = gamesPlayed.size;
    if (gamesPlayed.size >= 5) {
      achievements.socialButterfly.unlocked = true;
    }
    
    res.json(achievements);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get achievements' });
  }
});

// Tournaments endpoints
app.get('/api/tournaments', (req, res) => {
  try {
    const tournaments = [
      {
        id: 'weekly-coding',
        title: 'Weekly Coding Challenge',
        game: 'LeetCode Arena',
        gameId: 'leetcode',
        status: 'active',
        startDate: new Date(Date.now() - 86400000).toISOString(),
        endDate: new Date(Date.now() + 518400000).toISOString(),
        participants: 42,
        prize: '🏆 Champion Badge + 500 points'
      },
      {
        id: 'speed-racing-cup',
        title: 'Speed Racing Cup',
        game: 'Speed Racing',
        gameId: 'racing',
        status: 'upcoming',
        startDate: new Date(Date.now() + 86400000).toISOString(),
        endDate: new Date(Date.now() + 604800000).toISOString(),
        participants: 0,
        prize: '🥇 Gold Medal + 1000 points'
      },
      {
        id: 'brain-puzzle-championship',
        title: 'Brain Puzzle Championship',
        game: 'Brain Puzzle',
        gameId: 'puzzle',
        status: 'completed',
        startDate: new Date(Date.now() - 1209600000).toISOString(),
        endDate: new Date(Date.now() - 604800000).toISOString(),
        participants: 156,
        prize: '🧩 Puzzle Master Badge'
      }
    ];
    
    res.json(tournaments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get tournaments' });
  }
});

// Game statistics endpoint
app.get('/api/stats', (req, res) => {
  try {
    const stats = {
      totalGames: Object.keys(gamesData).length,
      totalPlayers: Object.keys(usersData).length,
      totalScores: 0,
      categories: {}
    };
    
    Object.values(gamesData).forEach(game => {
      stats.totalScores += game.scores.length;
      
      const category = game.category || 'Other';
      if (!stats.categories[category]) {
        stats.categories[category] = 0;
      }
      stats.categories[category]++;
    });
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get statistics' });
  }
});

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
initializeServer().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Games loaded: ${Object.keys(gamesData).length}`);
    console.log(`👥 Users loaded: ${Object.keys(usersData).length}`);
  });
});

module.exports = app;