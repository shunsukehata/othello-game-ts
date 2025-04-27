# オセロゲーム (Othello Game)

TypeScriptで実装したシンプルなオセロゲームです。

## 機能

- 8x8のオセロボード
- 対人プレイ（同一デバイス）
- 合法手のハイライト
- スコア表示
- ゲームリセット機能
- レスポンシブデザイン

## 技術スタック

- TypeScript
- HTML5
- CSS3

## 実行方法

### スタンドアロン版 (推奨)

最も簡単に遊べるバージョンです。単一のHTMLファイルで実装されています。

```bash
# リポジトリをクローン
git clone https://github.com/shunsukehata/othello-game-ts.git

# スタンドアロン版を開く
open othello-game-ts/standalone/index.html
```

または、単純にブラウザで `standalone/index.html` ファイルを開いてください。

### 開発版

モジュール形式のソースコードからビルドして実行する方法です。

```bash
# リポジトリをクローン
git clone https://github.com/shunsukehata/othello-game-ts.git

# 依存関係のインストール
cd othello-game-ts
npm install

# ビルドとサーバー起動
npm start
```

ブラウザで http://localhost:8080 にアクセスするとオセロゲームが表示されます。

## 開発方法

### セットアップ

```bash
# 依存関係のインストール
npm install
```

### ビルド

```bash
# プロジェクトのビルド
npm run build
```

ビルドされたファイルは `dist` ディレクトリに出力されます。

## ゲームルール

1. 黒が先手です
2. 相手の石を自分の石で挟むと、挟まれた石は自分の色に変わります
3. 少なくとも1つの石を裏返せる場所にのみ石を置けます
4. 石を置く場所がない場合はパスとなります
5. 両者とも置く場所がなくなるか、盤面が埋まるとゲーム終了です
6. より多くの石を自分の色にした方が勝ちです

## ライセンス

MIT
