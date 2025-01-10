# Questionnaire App

Twitter認証を使用した、高機能なアンケート作成・集計アプリケーション

## 開発環境のセットアップ

### 必要な環境

- Node.js (v18.17以上)
- Docker
- Docker Compose
- PostgreSQL 15以上

### セットアップ手順

1. リポジトリのクローン
```bash
git clone https://github.com/yukanke-saab/questionnaire_v1.git
cd questionnaire_v1
```

2. 依存関係のインストール
```bash
npm install
```

3. 環境変数の設定
```bash
cp .env.example .env
```
.envファイルを編集し、以下の環境変数を設定してください：
- `DATABASE_URL`: PostgreSQLの接続文字列
- `NEXTAUTH_SECRET`: NextAuthの秘密鍵（任意の文字列）
- `NEXTAUTH_URL`: アプリケーションのURL（開発環境では`http://localhost:3000`）
- `TWITTER_CLIENT_ID`: TwitterアプリのClient ID
- `TWITTER_CLIENT_SECRET`: TwitterアプリのClient Secret
- `BLOB_READ_WRITE_TOKEN`: Vercel Blobのアクセストークン

4. データベースの起動
```bash
docker-compose up -d
```

5. データベースのセットアップ
```bash
# Prismaクライアントの生成
npx prisma generate

# データベースのマイグレーション
npx prisma migrate deploy

# シードデータの投入（オプション）
npm run seed
```

6. 開発サーバーの起動
```bash
npm run dev
```

アプリケーションは http://localhost:3000 で動作します。

### Twitter開発者アカウントの設定

1. [Twitter Developer Portal](https://developer.twitter.com/portal/dashboard) でアプリケーションを作成
2. User authentication settingsを有効化し、以下の設定を行う：
   - OAuth 2.0
   - Type of App: Web App
   - Callback URL: `http://localhost:3000/api/auth/callback/twitter`
   - Website URL: `http://localhost:3000`
3. 取得したClient IDとClient Secretを.envに設定

## 機能一覧

### アカウント管理
- Twitterアカウントでのログイン/ログアウト
- ユーザープロフィールの自動同期（アイコン、表示名）

### アンケート作成
- 3種類の選択肢タイプ
  - テキストのみ
  - テキスト + 画像
  - 画像のみ
- 選択肢の柔軟な設定
  - 2〜10個の選択肢を設定可能
  - 選択肢の順序変更
  - 画像のアップロードとプレビュー
- 回答者属性の設定
  - 基本属性（年齢、性別、居住地）の選択
  - カスタム属性の追加（最大10個の選択肢）
- 投票期限の詳細設定
  - 日、時間、分単位での設定
  - デフォルトで24時間後に設定
- サムネイル画像の設定（オプション）

### アンケート回答
- ワンクリックでの簡単な回答
- 属性情報の入力
- 1ユーザー1アンケートにつき1回の回答制限
- 投票期限による回答制限

### 結果表示
- リアルタイムな集計結果の表示
- 属性別のクロス集計
  - 年齢別の回答分布
  - 性別による回答傾向
  - 地域別の集計
  - カスタム属性による分析
- グラフィカルな可視化
  - 棒グラフ
  - 円グラフ
  - 属性別の分布図

### コミュニケーション機能
- コメント機能
  - アンケートへのコメント投稿
  - コメント一覧の表示
  - コメント投稿者のプロフィール表示
- シェア機能
  - TwitterシェアボタンⓊ
  - アンケートの直接リンク

### UI/UX
- レスポンシブデザイン
- ダークモード対応
- 投票期限のカウントダウン表示
- 回答済み状態の視覚的表示
- ローディング状態の表示

## 技術スタック

### フロントエンド
- Next.js 14
- React 18
- TypeScript
- TailwindCSS
- Recharts (グラフ描画)
- lucide-react (アイコン)

### バックエンド
- Next.js App Router
- NextAuth.js (認証)
- Prisma (ORM)
- PostgreSQL 15
- Vercel Blob Storage (画像ストレージ)

### インフラ
- Docker/Docker Compose
- Vercel (デプロイ)