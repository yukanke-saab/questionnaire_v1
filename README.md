# Questionnaire App

Twitter認証を使用したアンケートアプリケーション

## 開発環境のセットアップ

### 必要な環境

- Node.js (v18以上)
- Docker
- Docker Compose

### セットアップ手順

1. リポジトリのクローン
```bash
git clone https://github.com/[your-username]/questionnaire_v1.git
cd questionnaire_v1
```

2. 依存関係のインストール
```bash
npm install
```

3. 環境変数の設定
```bash
cp .env.local.example .env.local
```
.env.localファイルを編集し、必要な環境変数を設定してください。

4. データベースの起動
```bash
docker-compose up -d
```

5. データベースのマイグレーション
```bash
npx prisma generate
npx prisma db push
```

6. 開発サーバーの起動
```bash
npm run dev
```

アプリケーションは http://localhost:3000 で動作します。

### Twitter開発者アカウントの設定

1. [Twitter Developer Portal](https://developer.twitter.com) でアプリケーションを作成
2. OAuth 2.0の設定で、以下のCallback URLを追加:
   - http://localhost:3000/api/auth/callback/twitter
3. 取得したClient IDとClient Secretを.env.localに設定

## 機能一覧

- Twitterアカウントでのログイン/ログアウト
- アンケートの作成
  - テキストまたは画像による選択肢
  - 回答者属性の設定（年齢、性別、居住地など）
- アンケートの回答
- 結果の表示
  - 全体の集計結果
  - 属性別のクロス集計
  - グラフィカルな表示

## 技術スタック

- Next.js 14
- TypeScript
- Prisma (ORM)
- PostgreSQL
- NextAuth.js
- TailwindCSS
- Recharts
- Docker/Docker Compose