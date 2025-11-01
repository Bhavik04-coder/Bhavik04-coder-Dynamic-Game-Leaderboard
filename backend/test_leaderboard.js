const RBTree = require("./rbtree.js");

const leaderboard = new RBTree();

// Test data
const testPlayers = [
  { playerID: "player1", score: 1500 },
  { playerID: "player2", score: 2000 },
  { playerID: "player3", score: 1800 },
  { playerID: "player4", score: 2200 },
  { playerID: "player5", score: 1700 },
];

console.log("=== ADDING PLAYERS ===");
testPlayers.forEach((player) => {
  leaderboard.insertOrUpdate(player.playerID, player.score);
  console.log(`Added ${player.playerID} with score ${player.score}`);
});

console.log(`\nTotal players: ${leaderboard.size()}`);