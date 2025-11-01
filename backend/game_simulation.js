class Node {
  constructor(playerID, score, color = 'red', left = null, right = null, parent = null) {
    this.playerID = playerID;         
    this.score = score;               
    this.color = color;               
    this.left = left;
    this.right = right;
    this.parent = parent;
    this.subtreeSize = 1;             
    this.timestamp = Date.now();      
  }
}

class RBTree {
  constructor(compareFn) {
    this.root = null;
    this.compare = compareFn || ((a, b) => {
      if (a.score !== b.score) return b.score - a.score; 
      return a.timestamp - b.timestamp;
    });
    this._size = 0;
    this.playerMap = new Map(); 
    this.NIL = { color: 'black' }; 
  }
  
  remove(playerID) {
    const node = this.playerMap.get(playerID);
    if (!node) return false;
    
    this.playerMap.delete(playerID);
    this.deleteNode(node);
    this._size--;
    return true;
  }

  deleteNode(z) {
    let y = z;
    let yOriginalColor = y.color;
    let x;
    
    this.updateSubtreeSizesToRoot(z);
    
    if (!z.left) {
      x = z.right;
      this.transplant(z, z.right);
    } else if (!z.right) {
      x = z.left;
      this.transplant(z, z.left);
    } else {
      y = this.minimum(z.right);
      yOriginalColor = y.color;
      x = y.right;
      
      if (y.parent === z) {
        if (x) x.parent = y;
      } else {
        this.transplant(y, y.right);
        y.right = z.right;
        if (y.right) y.right.parent = y;
      }
      
      this.transplant(z, y);
      y.left = z.left;
      if (y.left) y.left.parent = y;
      y.color = z.color;

      this.updateSubtreeSize(y);
    }
    
    if (x) this.updateSubtreeSizesToRoot(x);
    
    if (yOriginalColor === 'black' && x) {
      this.deleteFixup(x);
    }
  }

  transplant(u, v) {
    if (!u.parent) {
      this.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    
    if (v) v.parent = u.parent;
  }

  deleteFixup(x) {
    while (x && x !== this.root && x.color === 'black') {
      if (x === x.parent.left) {
        let w = x.parent.right;
        
        if (!w) break;
        
        if (w.color === 'red') {
          w.color = 'black';
          x.parent.color = 'red';
          this.rotateLeft(x.parent);
          w = x.parent.right;
          if (!w) break; 
        }
        
        const wLeftBlack = !w.left || w.left.color === 'black';
        const wRightBlack = !w.right || w.right.color === 'black';
        
        if (wLeftBlack && wRightBlack) {
          w.color = 'red';
          x = x.parent;
        } else {
          if (wRightBlack) {
            if (w.left) w.left.color = 'black';
            w.color = 'red';
            this.rotateRight(w);
            w = x.parent.right;
            if (!w) break; 
          }
          
          w.color = x.parent.color;
          x.parent.color = 'black';
          if (w.right) w.right.color = 'black';
          this.rotateLeft(x.parent);
          x = this.root;
        }
      } else {
        let w = x.parent.left;
        
        if (!w) break;
        
        if (w.color === 'red') {
          w.color = 'black';
          x.parent.color = 'red';
          this.rotateRight(x.parent);
          w = x.parent.left;
          if (!w) break; 
        }
        
        const wLeftBlack = !w.left || w.left.color === 'black';
        const wRightBlack = !w.right || w.right.color === 'black';
        
        if (wLeftBlack && wRightBlack) {
          w.color = 'red';
          x = x.parent;
        } else {
          if (wLeftBlack) {
            if (w.right) w.right.color = 'black';
            w.color = 'red';
            this.rotateLeft(w);
            w = x.parent.left;
            if (!w) break; 
          }
          
          w.color = x.parent.color;
          x.parent.color = 'black';
          if (w.left) w.left.color = 'black';
          this.rotateRight(x.parent);
          x = this.root;
        }
      }
    }
    
    if (x) x.color = 'black';
  }

  updateSubtreeSizesToRoot(node) {
    let current = node;
    while (current) {
      this.updateSubtreeSize(current);
      current = current.parent;
    }
  }

  rotateLeft(x) {
    if (!x || !x.right) return;
    
    const y = x.right;
    x.right = y.left;
    if (y.left) y.left.parent = x;
    y.parent = x.parent;
    
    if (!x.parent) {
      this.root = y;
    } else if (x === x.parent.left) {
      x.parent.left = y;
    } else {
      x.parent.right = y;
    }
    
    y.left = x;
    x.parent = y;
    
    this.updateSubtreeSize(x);
    this.updateSubtreeSize(y);
  }

  rotateRight(x) {
    if (!x || !x.left) return;
    
    const y = x.left;
    x.left = y.right;
    if (y.right) y.right.parent = x;
    y.parent = x.parent;
    
    if (!x.parent) {
      this.root = y;
    } else if (x === x.parent.right) {
      x.parent.right = y;
    } else {
      x.parent.left = y;
    }
    
    y.right = x;
    x.parent = y;
    
    this.updateSubtreeSize(x);
    this.updateSubtreeSize(y);
  }


  find(playerID) {
    return this.playerMap.get(playerID) || null;
  }

  findByScore(score) {
    const results = [];
    this._findByScore(this.root, score, results);
    return results;
  }

  _findByScore(node, score, results) {
    if (!node) return;
    
    if (node.score === score) {
      results.push(node);
    }
    
    if (score <= node.score) {
      this._findByScore(node.left, score, results);
    }
    
    if (score >= node.score) {
      this._findByScore(node.right, score, results);
    }
  }


  minimum(node = this.root) {
    if (!node) return null;
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  maximum(node = this.root) {
    if (!node) return null;
    while (node.right) {
      node = node.right;
    }
    return node;
  }


  getRank(playerID) {
    const node = this.playerMap.get(playerID);
    if (!node) return null;
    
    let rank = 1 + (node.left ? node.left.subtreeSize : 0);
    let y = node;
    let x = node.parent;
    
    while (x) {
      if (y === x.right) {
        rank += 1 + (x.left ? x.left.subtreeSize : 0);
      }
      y = x;
      x = x.parent;
    }
    
    return rank;
  }

  getPlayerByRank(rank) {
    if (rank < 1 || rank > this._size) return null;
    return this._getNodeByRank(this.root, rank);
  }

  _getNodeByRank(node, rank) {
    if (!node) return null;
    
    const leftSize = node.left ? node.left.subtreeSize : 0;
    
    if (rank <= leftSize) {
      return this._getNodeByRank(node.left, rank);
    } else if (rank === leftSize + 1) {
      return node;
    } else {
      return this._getNodeByRank(node.right, rank - leftSize - 1);
    }
  }

  getTopK(k) {
    if (k <= 0) return [];
    const result = [];
    this._getTopK(this.root, k, result);
    return result;
  }

  _getTopK(node, k, result) {
    if (!node || result.length >= k) return;

    this._getTopK(node.left, k, result);
    if (result.length < k) {
      result.push({ 
        playerID: node.playerID, 
        score: node.score, 
        rank: this.getRank(node.playerID) 
      });
    }
    this._getTopK(node.right, k, result);
  }

  getPlayersInScoreRange(minScore, maxScore) {
    const result = [];
    this._getPlayersInRange(this.root, minScore, maxScore, result);
    return result;
  }

  _getPlayersInRange(node, minScore, maxScore, result) {
    if (!node) return;
    
    if (node.score >= minScore) {
      this._getPlayersInRange(node.left, minScore, maxScore, result);
    }
    
    if (node.score >= minScore && node.score <= maxScore) {
      result.push({ playerID: node.playerID, score: node.score });
    }
    
    if (node.score <= maxScore) {
      this._getPlayersInRange(node.right, minScore, maxScore, result);
    }
  }

  getPercentileRank(playerID) {
    const rank = this.getRank(playerID);
    if (!rank) return null;
    return ((this._size - rank) / this._size) * 100;
  }


  updatePlayerScore(playerID, newScore) {
    const existingNode = this.playerMap.get(playerID);
    if (existingNode) {

      this.remove(playerID);
    }
    
    const newNode = new Node(playerID, newScore);
    this.insertNode(newNode);
    this.playerMap.set(playerID, newNode);
    return true;
  }

  batchUpdateScores(updates) {
    const results = [];
    for (const update of updates) {
      const success = this.updatePlayerScore(update.playerID, update.score);
      results.push({ playerID: update.playerID, success });
    }
    return results;
  }


  insertOrUpdate(playerID, score) {
    let node = this.playerMap.get(playerID);
    if (node) {
      this.remove(playerID);
    }
    node = new Node(playerID, score);
    this.insertNode(node);
    this.playerMap.set(playerID, node);
  }

  insertNode(node) {
    let y = null;
    let x = this.root;
    
    while (x) {
      y = x;
      x.subtreeSize++; 
      const cmp = this.compare(node, x);
      if (cmp < 0) x = x.left;
      else x = x.right;
    }
    
    node.parent = y;
    if (!y) {
      this.root = node;
    } else {
      const cmp = this.compare(node, y);
      if (cmp < 0) y.left = node;
      else y.right = node;
    }
    
    this._size++;
    this.insertFixup(node);
  }

  insertFixup(z) {
    while (z.parent && z.parent.color === 'red') {
      if (z.parent === z.parent.parent.left) {
        const y = z.parent.parent.right;
        if (y && y.color === 'red') {
          z.parent.color = 'black';
          y.color = 'black';
          z.parent.parent.color = 'red';
          z = z.parent.parent;
        } else {
          if (z === z.parent.right) {
            z = z.parent;
            this.rotateLeft(z);
          }
          z.parent.color = 'black';
          z.parent.parent.color = 'red';
          this.rotateRight(z.parent.parent);
        }
      } else {
        const y = z.parent.parent.left;
        if (y && y.color === 'red') {
          z.parent.color = 'black';
          y.color = 'black';
          z.parent.parent.color = 'red';
          z = z.parent.parent;
        } else {
          if (z === z.parent.left) {
            z = z.parent;
            this.rotateRight(z);
          }
          z.parent.color = 'black';
          z.parent.parent.color = 'red';
          this.rotateLeft(z.parent.parent);
        }
      }
    }
    this.root.color = 'black';
  }

  updateSubtreeSize(node) {
    if (!node) return 0;
    node.subtreeSize = 1 +
      (node.left ? node.left.subtreeSize : 0) +
      (node.right ? node.right.subtreeSize : 0);
    return node.subtreeSize;
  }

  findPlayer(playerID) {
    const node = this.playerMap.get(playerID);
    return node ? { 
      playerID: node.playerID, 
      score: node.score, 
      rank: this.getRank(playerID) 
    } : null;
  }

  toArray() {
    const arr = [];
    this._inorder(this.root, arr);
    return arr;
  }

  _inorder(node, arr) {
    if (!node) return;
    this._inorder(node.left, arr);
    arr.push({ 
      playerID: node.playerID, 
      score: node.score, 
      rank: this.getRank(node.playerID) 
    });
    this._inorder(node.right, arr);
  }

  clear() {
    this.root = null;
    this.playerMap.clear();
    this._size = 0;
  }

  size() {
    return this._size;
  }

  
  validateRBTree() {
    if (!this.root) return { valid: true, blackHeight: 1 };
    
    if (this.root.color !== 'black') {
      return { valid: false, reason: 'Root is not black' };
    }
    
    return this._validateRBTree(this.root);
  }

  _validateRBTree(node) {
    if (!node) return { valid: true, blackHeight: 1 };
    

    if (node.color === 'red') {
      if ((node.left && node.left.color === 'red') || 
          (node.right && node.right.color === 'red')) {
        return { valid: false, reason: 'Red node has red child' };
      }
    }
    
    const left = this._validateRBTree(node.left);
    const right = this._validateRBTree(node.right);
    
    if (!left.valid) return left;
    if (!right.valid) return right;
    
    if (left.blackHeight !== right.blackHeight) {
      return { valid: false, reason: 'Black height mismatch' };
    }
    
    return {
      valid: true,
      blackHeight: left.blackHeight + (node.color === 'black' ? 1 : 0)
    };
  }

  printTree(node = this.root, prefix = '', isLeft = true) {
    if (!node) return;
    
    if (node.right) {
      this.printTree(node.right, prefix + (isLeft ? '│   ' : '    '), false);
    }
    
    console.log(prefix + (isLeft ? '└── ' : '┌── ') + 
                `${node.playerID} (${node.score}) ${node.color}[${node.subtreeSize}]`);
    
    if (node.left) {
      this.printTree(node.left, prefix + (isLeft ? '    ' : '│   '), true);
    }
  }
}

module.exports = RBTree;