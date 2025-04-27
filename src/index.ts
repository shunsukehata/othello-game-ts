import { OthelloUI } from './ui/board';

/**
 * DOMが読み込まれた後にアプリケーションを初期化する
 */
document.addEventListener('DOMContentLoaded', () => {
  try {
    // OthelloUIのインスタンスを作成し、ゲームを開始
    const ui = new OthelloUI('game-board', 'game-status', 'game-score', 'reset-button');
    console.log('オセロゲームが正常に初期化されました');
  } catch (error) {
    console.error('ゲームの初期化中にエラーが発生しました:', error);
  }
});
