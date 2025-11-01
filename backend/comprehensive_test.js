const RBTree = require("./rbtree.js");

function runComprehensiveTest() {
  console.log("🎮 DYNAMIC GAME LEADERBOARD COMPREHENSIVE TEST\n");

  const leaderboard = new RBTree();

  console.log("=== PHASE 1: BASIC OPERATIONS ===");


  const players = [
    { playerID: "alice", score: 2500 },
    { playerID: "bob", score: 1800 },
    { playerID: "charlie", score: 3200 },
    { playerID: "diana", score: 2100 },
    { playerID: "eve", score: 2900 },
  ];

  players.forEach((p) => {
    leaderboard.insertOrUpdate(p.playerID, p.score);
    console.log(`✓ Added ${p.playerID} (score: ${p.score})`);
  });

  console.log(`Total players: ${leaderboard.size()}`);


  console.log("\n=== PHASE 2: RANK QUERIES ===");

  players.forEach((p) => {
    const rank = leaderboard.getRank(p.playerID);
    console.log(`${p.playerID}: Rank ${rank}, Score: ${p.score}`);
  });


  console.log("\n=== TOP PLAYERS BY RANK ===");
  for (let rank = 1; rank <= Math.min(3, leaderboard.size()); rank++) {
    const player = leaderboard.getPlayerByRank(rank);
    if (player) {
      console.log(`Rank ${rank}: ${player.playerID} (Score: ${player.score})`);
    }
  }

  console.log("\n=== PHASE 3: SCORE UPDATES ===");

  leaderboard.updatePlayerScore("bob", 2800); 
  leaderboard.updatePlayerScore("alice", 2600); 

  console.log("After score updates:");
  ["alice", "bob", "charlie"].forEach((id) => {
    const info = leaderboard.findPlayer(id);
    console.log(`${id}: Rank ${info.rank}, Score: ${info.score}`);
  });

  console.log("\n=== PHASE 4: TOP K AND RANGE QUERIES ===");

  const top3 = leaderboard.getTopK(3);
  console.log("🏆 TOP 3 PLAYERS:");
  top3.forEach((player, index) => {
    console.log(`${index + 1}. ${player.playerID} - Score: ${player.score}`);
  });

  const midRangePlayers = leaderboard.getPlayersInScoreRange(2000, 3000);
  console.log("\n🎯 PLAYERS WITH SCORES 2000-3000:");
  midRangePlayers.forEach((player) => {
    console.log(`- ${player.playerID}: ${player.score}`);
  });

  console.log("\n=== PHASE 5: PERCENTILE RANKINGS ===");

  players.forEach((p) => {
    const percentile = leaderboard.getPercentileRank(p.playerID);
    console.log(
      `${p.playerID}: ${percentile.toFixed(
        1
      )}% (better than ${percentile.toFixed(1)}% of players)`
    );
  });

  console.log("\n=== PHASE 6: BATCH OPERATIONS ===");

  const batchUpdates = [
    { playerID: "alice", score: 2700 },
    { playerID: "frank", score: 2300 },
    { playerID: "charlie", score: 3300 },
  ];

  const batchResults = leaderboard.batchUpdateScores(batchUpdates);
  console.log("Batch update results:");
  batchResults.forEach((result) => {
    console.log(
      `- ${result.playerID}: ${result.success ? "Updated" : "Failed"}`
    );
  });

  console.log(`Total players after batch: ${leaderboard.size()}`);

  console.log("\n=== PHASE 7: DELETE OPERATIONS ===");

  console.log("Before deletion:");
  console.log(`Total players: ${leaderboard.size()}`);

  const removed = leaderboard.remove("diana");
  console.log(`Removed Diana: ${removed}`);
  console.log(`Total players after deletion: ${leaderboard.size()}`);

  console.log("\n=== PHASE 8: VALIDATION ===");

  const validation = leaderboard.validateRBTree();
  console.log(`RB Tree Validation: ${validation.valid ? "PASS" : "FAIL"}`);
  if (!validation.valid) {
    console.log(`Reason: ${validation.reason}`);
  }

  console.log("\n=== FINAL LEADERBOARD ===");
  const finalRankings = leaderboard.toArray();
  finalRankings.forEach((player) => {
    console.log(`#${player.rank} - ${player.playerID}: ${player.score}`);
  });
}

runComprehensiveTest();
