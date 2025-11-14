const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const RBTree = require('./rbtree.js');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

const DATA_DIR = path.join(__dirname, 'data');
const GAMES_FILE = path.join(DATA_DIR, 'games.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');

const leaderboards = new Map();

async function initializeDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating data directory:', error);
  }
}

async function loadData() {
  try {
    const gamesData = await fs.readFile(GAMES_FILE, 'utf8');
    const games = JSON.parse(gamesData);
    
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

async function saveGames(games) {
  try {
    await fs.writeFile(GAMES_FILE, JSON.stringify(games, null, 2));
  } catch (error) {
    console.error('Error saving games:', error);
  }
}

async function saveUsers(users) {
  try {
    await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Error saving users:', error);
  }
}

async function loadUsers() {
  try {
    const usersData = await fs.readFile(USERS_FILE, 'utf8');
    return JSON.parse(usersData);
  } catch (error) {
    return {};
  }
}

let gamesData = {};
let usersData = {};

async function initializeServer() {
  await initializeDataDir();
  const data = await loadData();
  gamesData = data.games;
  usersData = await loadUsers();
  
  if (Object.keys(gamesData).length === 0) {
    gamesData = {
      aim: {
        name: "🎯 Aim Trainer",
        icon: "fa-bullseye",
        color: "#f093fb",
        description: "Test your reflexes with escaping buttons! Click targets as they move across the screen.",
        category: "Action",
        difficulty: "Medium",
        scores: []
      },
      type: {
        name: "⌨️ TypeRace",
        icon: "fa-keyboard",
        color: "#4facfe",
        description: "Race against the clock! Type the displayed text as fast and accurately as possible.",
        category: "Skill",
        difficulty: "Easy",
        scores: []
      },
      cognitive: {
        name: "🧠 Cognitive Trainer",
        icon: "fa-brain",
        color: "#8b5cf6",
        description: "Multi-modal challenge! Match colors with mouse actions and shapes with keyboard inputs.",
        category: "Brain Training",
        difficulty: "Expert",
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
    
    Object.keys(gamesData).forEach(gameId => {
      leaderboards.set(gameId, new RBTree());
    });
    
    await saveGames(gamesData);
  }
}

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
    
    if (search) {
      scores = scores.filter(s => s.playerID.toLowerCase().includes(search.toLowerCase()));
    }
    
    scores = scores.slice(0, parseInt(limit));
    
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
    
    leaderboard.insertOrUpdate(playerID, score);
    
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

app.delete('/api/games/:gameId/scores/:playerID', async (req, res) => {
  try {
    const { gameId, playerID } = req.params;
    
    if (!gamesData[gameId]) {
      return res.status(404).json({ error: 'Game not found' });
    }
    
    const leaderboard = leaderboards.get(gameId);
    const removed = leaderboard.remove(playerID);
    
    if (!removed) {
      return res.status(404).json({ error: 'Score not found' });
    }
    
    const scoreIndex = gamesData[gameId].scores.findIndex(s => s.playerID === playerID);
    if (scoreIndex >= 0) {
      gamesData[gameId].scores.splice(scoreIndex, 1);
    }
    
    await saveGames(gamesData);
    
    res.json({ message: 'Score deleted successfully', playerID, gameId });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete score' });
  }
});

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

app.get('/api/users/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const userId = username.toLowerCase();
    
    if (!usersData[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    let totalGames = 0;
    let totalScore = 0;
    let bestRank = null;
    const recentScores = [];
    
    Object.keys(gamesData).forEach(gameId => {
      const game = gamesData[gameId];
      const userScores = game.scores.filter(score => score.playerID === username);
      totalGames += userScores.length;
      totalScore += userScores.reduce((sum, score) => sum + score.score, 0);
      
      const leaderboard = leaderboards.get(gameId);
      const rank = leaderboard.getRank(username);
      if (rank && (!bestRank || rank < bestRank)) {
        bestRank = rank;
      }
      
      userScores.forEach(score => {
        recentScores.push({
          ...score,
          game: game.name,
          gameId
        });
      });
    });
    
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

app.get('/api/users/:username/achievements', async (req, res) => {
  try {
    const { username } = req.params;
    const userId = username.toLowerCase();
    
    if (!usersData[userId]) {
      return res.status(404).json({ error: 'User not found' });
    }
    
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
    
    Object.keys(gamesData).forEach(gameId => {
      const game = gamesData[gameId];
      const userScores = game.scores.filter(score => score.playerID === username);
      
      if (userScores.length > 0) {
        hasSubmittedScore = true;
        gamesPlayed.add(gameId);
        
        const leaderboard = leaderboards.get(gameId);
        const rank = leaderboard.getRank(username);
        if (rank === 1) {
          isChampion = true;
        }
        
        if (gameId === 'racing') {
          const maxScore = Math.max(...userScores.map(s => s.score));
          if (maxScore >= 1000) {
            achievements.speedDemon.unlocked = true;
            achievements.speedDemon.progress = maxScore;
          }
        }
        
        if (gameId === 'leetcode') {
          achievements.codeNinja.progress = userScores.length;
          if (userScores.length >= 10) {
            achievements.codeNinja.unlocked = true;
          }
        }
      }
    });
    
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

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

initializeServer().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📊 Games loaded: ${Object.keys(gamesData).length}`);
    console.log(`👥 Users loaded: ${Object.keys(usersData).length}`);
  });
});

module.exports = app;