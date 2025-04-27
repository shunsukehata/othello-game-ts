import { OthelloGame } from '../models/game';

/**
 * オセロゲームのUIを管理するクラス
 * HTMLとの連携、イベント処理を担当する
 */
export class OthelloUI {
  private game: OthelloGame;
  private boardElement: HTMLElement;
  private statusElement: HTMLElement;
  private scoreElement: HTMLElement;
  private resetButton: HTMLElement;
  
  /**
   * UIを初期化する
   * @param boardId ボードを表示する要素のID
   * @param statusId ステータスを表示する要素のID
   * @param scoreId スコアを表示する要素のID
   * @param resetButtonId リセットボタンの要素のID
   */
  constructor(
    boardId: string,
    statusId: string,
    scoreId: string,
    resetButtonId: string
  ) {
    // ゲームのインスタンスを作成
    this.game = new OthelloGame();
    
    // DOM要素を取得
    this.boardElement = document.getElementById(boardId) as HTMLElement;
    this.statusElement = document.getElementById(statusId) as HTMLElement;
    this.scoreElement = document.getElementById(scoreId) as HTMLElement;
    this.resetButton = document.getElementById(resetButtonId) as HTMLElement;
    
    if (!this.boardElement || !this.statusElement || 
        !this.scoreElement || !this.resetButton) {
      throw new Error('Required DOM elements not found');
    }
    
    // リセットボタンのイベントハンドラを設定
    this.resetButton.addEventListener('click', () => this.resetGame());
    
    // 初期表示
    this.render();
  }
  
  /**
   * ゲームをリセットする
   */
  resetGame(): void {
    this.game = new OthelloGame();
    this.render();
  }
  
  /**
   * UIを更新する
   */
  render(): void {
    this.renderBoard();
    this.renderStatus();
    this.renderScore();
  }
  
  /**
   * ボードを描画する
   */
  private renderBoard(): void {
    // ボードの初期化（子要素をすべて削除）
    this.boardElement.innerHTML = '';
    
    const board = this.game.getBoard();
    
    // ボード要素にクラスを設定
    this.boardElement.className = 'othello-board';
    
    // 各セルを作成
    for (let y = 0; y < board.length; y++) {
      for (let x = 0; x < board[y].length; x++) {
        const cell = document.createElement('div');
        cell.className = 'othello-cell';
        
        // セルのインデックスをデータ属性として設定
        cell.dataset.x = x.toString();
        cell.dataset.y = y.toString();
        
        // セルの石の状態に応じてクラスを追加
        const cellContent = document.createElement('div');
        cellContent.className = 'stone';
        
        if (board[y][x] === OthelloGame.BLACK) {
          cellContent.classList.add('black');
        } else if (board[y][x] === OthelloGame.WHITE) {
          cellContent.classList.add('white');
        } else if (this.game.isValidMove(x, y, this.game.getCurrentPlayer())) {
          // 有効な手の場合はハイライト
          cell.classList.add('valid-move');
        }
        
        cell.appendChild(cellContent);
        
        // クリックイベントハンドラを設定
        cell.addEventListener('click', () => this.handleCellClick(x, y));
        
        // ボードに追加
        this.boardElement.appendChild(cell);
      }
    }
  }
  
  /**
   * ステータスを描画する
   */
  private renderStatus(): void {
    if (this.game.isGameOver()) {
      const winner = this.game.getWinner();
      if (winner === OthelloGame.BLACK) {
        this.statusElement.textContent = '黒の勝ちです！';
      } else if (winner === OthelloGame.WHITE) {
        this.statusElement.textContent = '白の勝ちです！';
      } else {
        this.statusElement.textContent = '引き分けです！';
      }
    } else {
      const currentPlayer = this.game.getCurrentPlayer();
      this.statusElement.textContent = 
        currentPlayer === OthelloGame.BLACK ? '黒の番です' : '白の番です';
    }
  }
  
  /**
   * スコアを描画する
   */
  private renderScore(): void {
    const score = this.game.getScore();
    this.scoreElement.textContent = `黒: ${score.black}  白: ${score.white}`;
  }
  
  /**
   * セルクリック時の処理
   * @param x X座標
   * @param y Y座標
   */
  private handleCellClick(x: number, y: number): void {
    // 石を置く
    const placed = this.game.placeStone(x, y);
    
    // 石が置かれたらUIを更新
    if (placed) {
      this.render();
    }
  }
}
