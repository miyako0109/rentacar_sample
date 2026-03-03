# Basic認証の設定

## 方法1: Apache（.htaccess）

1. **.htpasswd を作成する**（ターミナルでプロジェクトフォルダに移動して実行）
   ```bash
   htpasswd -c .htpasswd ユーザー名
   ```
   パスワードを聞かれたら入力してください。2人目以降は `-c` を付けずに:
   ```bash
   htpasswd .htpasswd もう1人のユーザー名
   ```

2. **.htaccess の AuthUserFile を修正する**
   - `.htaccess` を開き、`AuthUserFile` をサーバー上の**絶対パス**に書き換えてください。
   - 例: `AuthUserFile /home/yourname/public_html/rentacar_sample/.htpasswd`

3. レンタルサーバーでは「Basic認証」や「.htaccess」が使えるかマニュアルで確認してください。

---

## 方法2: Node.js サーバー（ローカル・検証用）

1. プロジェクトフォルダで:
   ```bash
   node server.js
   ```

2. ブラウザで **http://localhost:3000/html/index.html** を開く。

3. ユーザー名・パスワードを入力（初期値: `admin` / `password`）。

4. 変更する場合は `server.js` の `BASIC_USER` と `BASIC_PASS` を編集してください。

---

## 方法3: GitHub Pages 用（認証ゲート）

GitHub に上げたサイトを閲覧するときの簡易認証です。

- リポジトリの**ルート**に `index.html`（認証ゲート）を置いてあります。
- サイトにアクセスするとまずパスワード入力画面が表示され、正しいパスワードを入力するとサイトを閲覧できます。
- **初期パスワード**: `sample`  
  **変更する場合**: ルートの `index.html` を開き、`GATE_PASSWORD = 'sample';` の `'sample'` を任意のパスワードに書き換えてから push してください。
- 認証状態はブラウザの sessionStorage に保存されるため、タブを閉じるまで有効です。再アクセス時は再度パスワード入力が必要です。
- ※ パスワードはリポジトリ内に記載されるため、厳密な秘匿には向きません。GitHub Pages の「閲覧をちょっと制限したい」用途向けです。
