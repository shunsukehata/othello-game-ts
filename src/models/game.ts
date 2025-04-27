/**
 * オセロゲームのモデルを表すクラス
 * ゲーム盤面の状態やゲームロジックを管理する
 */
export class OthelloGame {
  // ボードの大きさ
  private static readonly BOARD_SIZE = 8;
  
  // プレイヤー定数
  public static readonly EMPTY = 0;
  public static readonly BLACK = 1;
  public static readonly WHITE = 2;
  
  // 8方向の探索用オフセット（上、右上、右、右下、下、左下、左、左上）
  private static readonly DIRECTIONS = [
    { x: 0, y: -1 }, { x: 1, y: -1 }, { x: 1, y: 0 }, { x: 1, y: 1 },
    { x: 0, y: 1 }, { x: -1, y: 1 }, { x: -1, y: 0 }, { x: -1, y: -1 }
  ];

  // 盤面を表す2次元配列
  private board: number[][];
  
  // 現在のプレイヤー
  private currentPlayer: number;
  
  // 石が置かれた数
  private stonePlaced: number;

  /**
   * ゲームを初期化する
   */
  constructor() {
    // 盤面の初期化
    this.board = Array(OthelloGame.BOARD_SIZE).fill(null)
      .map(() => Array(OthelloGame.BOARD_SIZE).fill(OthelloGame.EMPTY));
    
    // 初期配置（中央に白黒2つずつ配置）
    const mid = OthelloGame.BOARD_SIZE / 2;
    this.board[mid - 1][mid - 1] = OthelloGame.WHITE;
    this.board[mid][mid] = OthelloGame.WHITE;
    this.board[mid - 1][mid] = OthelloGame.BLACK;
    this.board[mid][mid - 1] = OthelloGame.BLACK;
    
    // 黒から開始
    this.currentPlayer = OthelloGame.BLACK;
    
    // 最初に4つの石が置かれている
    this.stonePlaced = 4;
  }

  /**
   * 現在の盤面を取得する
   * @returns 盤面配列のコピー
   */
  getBoard(): number[][] {
    return this.board.map(row => [...row]);
  }

  /**
   * 現在のプレイヤーを取得する
   * @returns 現在のプレイヤー（BLACK or WHITE）
   */
  getCurrentPlayer(): number {
    return this.currentPlayer;
  }

  /**
   * ゲームが終了したかどうかを判定する
   * @returns ゲームが終了した場合はtrue、続行中の場合はfalse
   */
  isGameOver(): boolean {
    // 盤面が全て埋まった場合
    if (this.stonePlaced >= OthelloGame.BOARD_SIZE * OthelloGame.BOARD_SIZE) {
      return true;
    }
    
    // どちらのプレイヤーも石を置けない場合
    return !this.hasValidMove(OthelloGame.BLACK) && 
           !this.hasValidMove(OthelloGame.WHITE);
  }

  /**
   * 指定したプレイヤーが有効な手を持っているかチェックする
   * @param player 判定するプレイヤー
   * @returns 有効な手がある場合はtrue、ない場合はfalse
   */
  hasValidMove(player: number): boolean {
    for (let y = 0; y < OthelloGame.BOARD_SIZE; y++) {
      for (let x = 0; x < OthelloGame.BOARD_SIZE; x++) {
        if (this.isValidMove(x, y, player)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * 指定した場所に石を置くことが有効な手かどうかを判定する
   * @param x X座標
   * @param y Y座標
   * @param player プレイヤー
   * @returns 有効な場合はtrue、無効な場合はfalse
   */
  isValidMove(x: number, y: number, player: number): boolean {
    // すでに石が置かれている場合は無効
    if (this.board[y][x] !== OthelloGame.EMPTY) {
      return false;
    }
    
    // 8方向のそれぞれで、挟むことができる石があるかチェック
    for (const dir of OthelloGame.DIRECTIONS) {
      let nx = x + dir.x;
      let ny = y + dir.y;
      let foundOpponent = false;
      
      // ボード内にあり、かつ相手の石があれば進む
      while (
        nx >= 0 && nx < OthelloGame.BOARD_SIZE && 
        ny >= 0 && ny < OthelloGame.BOARD_SIZE &&
        this.board[ny][nx] !== OthelloGame.EMPTY && 
        this.board[ny][nx] !== player
      ) {
        foundOpponent = true;
        nx += dir.x;
        ny += dir.y;
      }
      
      // 最後に自分の石があれば、相手の石を挟むことができる
      if (
        foundOpponent && 
        nx >= 0 && nx < OthelloGame.BOARD_SIZE && 
        ny >= 0 && ny < OthelloGame.BOARD_SIZE && 
        this.board[ny][nx] === player
      ) {
        return true;
      }
    }
    
    return false;
  }

  /**
   * 石を置いて盤面を更新する
   * @param x X座標
   * @param y Y座標
   * @returns 手が有効で置けた場合はtrue、無効で置けなかった場合はfalse
   */
  placeStone(x: number, y: number): boolean {
    // 現在のプレイヤーが石を置けるかチェック
    if (!this.isValidMove(x, y, this.currentPlayer)) {
      return false;
    }
    
    // 石を置く
    this.board[y][x] = this.currentPlayer;
    this.stonePlaced++;
    
    // 8方向を探索して、挟んだ石を裏返す
    for (const dir of OthelloGame.DIRECTIONS) {
      this.flipDirection(x, y, dir.x, dir.y);
    }
    
    // 次のプレイヤーに交代
    this.nextPlayer();
    
    // 次のプレイヤーに有効手がない場合はパスして再度交代
    if (!this.hasValidMove(this.currentPlayer)) {
      this.nextPlayer();
    }
    
    return true;
  }

  /**
   * 指定方向に挟まれた石を裏返す
   * @param x 石を置いたX座標
   * @param y 石を置いたY座標
   * @param dx 探索するX方向
   * @param dy 探索するY方向
   */
  private flipDirection(x: number, y: number, dx: number, dy: number): void {
    const player = this.currentPlayer;
    const flips: { x: number, y: number }[] = [];
    let nx = x + dx;
    let ny = y + dy;
    
    // 相手の石を探索
    while (
      nx >= 0 && nx < OthelloGame.BOARD_SIZE && 
      ny >= 0 && ny < OthelloGame.BOARD_SIZE &&
      this.board[ny][nx] !== OthelloGame.EMPTY && 
      this.board[ny][nx] !== player
    ) {
      flips.push({ x: nx, y: ny });
      nx += dx;
      ny += dy;
    }
    
    // 最後に自分の石があれば、間の石を裏返す
    if (
      nx >= 0 && nx < OthelloGame.BOARD_SIZE && 
      ny >= 0 && ny < OthelloGame.BOARD_SIZE && 
      this.board[ny][nx] === player
    ) {
      for (const pos of flips) {
        this.board[pos.y][pos.x] = player;
      }
    }
  }
  
  /**
   * 次のプレイヤーに交代する
   */
  private nextPlayer(): void {
    this.currentPlayer = 
      this.currentPlayer === OthelloGame.BLACK ? 
      OthelloGame.WHITE : 
      OthelloGame.BLACK;
  }
  
  /**
   * 各プレイヤーの石の数を取得する
   * @returns プレイヤーごとの石の数を含むオブジェクト
   */
  getScore(): { black: number, white: number } {
    let black = 0;
    let white = 0;
    
    for (let y = 0; y < OthelloGame.BOARD_SIZE; y++) {
      for (let x = 0; x < OthelloGame.BOARD_SIZE; x++) {
        if (this.board[y][x] === OthelloGame.BLACK) {
          black++;
        } else if (this.board[y][x] === OthelloGame.WHITE) {
          white++;
        }
      }
    }
    
    return { black, white };
  }
  
  /**
   * 勝者を判定する
   * @returns 黒が勝った場合はBLACK、白が勝った場合はWHITE、引き分けの場合はEMPTY
   */
  getWinner(): number {
    if (!this.isGameOver()) {
      return OthelloGame.EMPTY; // ゲームが終了していない場合
    }
    
    const { black, white } = this.getScore();
    
    if (black > white) {
      return OthelloGame.BLACK;
    } else if (white > black) {
      return OthelloGame.WHITE;
    } else {
      return OthelloGame.EMPTY; // 引き分け
    }
  }
}
