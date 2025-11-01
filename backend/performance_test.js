const RBTree = require("./rbtree.js");

function generateRandomPlayers(count) {
  const players = [];
  for (let i = 0; i < count; i++) {
    players.push({
      playerID: `player_${i}`,
      score: Math.floor(Math.random() * 5000) + 1000,
    });
  }
  return players;
}

function runPerformanceTest() {
  console.log("⚡ PERFORMANCE BENCHMARK TEST\n");

  const leaderboard = new RBTree();
  const playerCount = 10000;
  const testPlayers = generateRandomPlayers(playerCount);

  console.log(`Testing with ${playerCount} players...\n`);

  console.time("Insertion Time");
  testPlayers.forEach((player) => {
    leaderboard.insertOrUpdate(player.playerID, player.score);
  });
  console.timeEnd("Insertion Time");

  console.time("Rank Queries (1000 queries)");
  for (let i = 0; i < 1000; i++) {
    const randomIndex = Math.floor(Math.random() * playerCount);
    leaderboard.getRank(testPlayers[randomIndex].playerID);
  }
  console.timeEnd("Rank Queries (1000 queries)");

  console.time("Top K Queries (100 queries)");
  for (let i = 0; i < 100; i++) {
    leaderboard.getTopK(10);
  }
  console.timeEnd("Top K Queries (100 queries)");

  console.time("Score Updates (1000 updates)");
  for (let i = 0; i < 1000; i++) {
    const randomIndex = Math.floor(Math.random() * playerCount);
    const newScore = Math.floor(Math.random() * 5000) + 1000;
    leaderboard.updatePlayerScore(testPlayers[randomIndex].playerID, newScore);
  }
  console.timeEnd("Score Updates (1000 updates)");

  console.log(`\nFinal tree size: ${leaderboard.size()}`);

  const validation = leaderboard.validateRBTree();
  console.log(`Tree validation: ${validation.valid ? "PASS" : "FAIL"}`);
}

runPerformanceTest();
