# Link & Login Codespace dari Termux

Codespace aktif untuk repo ini:

- **Repo:** `ivansslo/codex-web`
- **Codespace:** `codex-web-termux-jjwrqxjpr577cw94`
- **Machine:** 4 cores, 16 GB RAM, 32 GB storage
- **Web link:** https://codex-web-termux-jjwrqxjpr577cw94.github.dev

## Buka dari terminal Termux

Jalankan ini di Termux:

```bash
pkg update -y
pkg install -y curl git openssh gh

curl -L -o termux-login-codespace.sh https://raw.githubusercontent.com/ivansslo/codex-web/main/termux-login-codespace.sh
chmod +x termux-login-codespace.sh
./termux-login-codespace.sh
```

## Kalau sudah login GitHub CLI

Langsung masuk SSH:

```bash
gh codespace ssh -c codex-web-termux-jjwrqxjpr577cw94
```

## Buka link web dari Termux

Kalau Termux mendukung `termux-open-url`:

```bash
termux-open-url https://codex-web-termux-jjwrqxjpr577cw94.github.dev
```

Atau copy link ini ke browser Android:

```text
https://codex-web-termux-jjwrqxjpr577cw94.github.dev
```

## Setelah masuk Codespace

```bash
cd /workspaces/codex-web
git pull
npm install
npm run dev
```

## Membuka localhost Codespace di browser Android

Kalau server dev berjalan di Codespace, misalnya Vite port `5173`, jalankan server di terminal Codespace:

```bash
cd /workspaces/codex-web
npm install
npm run dev -- --host 0.0.0.0
```

Lalu dari Termux Android, forward port Codespace ke localhost Android:

```bash
curl -L -o termux-open-codespace-localhost.sh https://raw.githubusercontent.com/ivansslo/codex-web/main/termux-open-codespace-localhost.sh
chmod +x termux-open-codespace-localhost.sh
./termux-open-codespace-localhost.sh
```

Browser Android akan dibuka ke:

```text
http://127.0.0.1:5173
```

Alternatif manual:

```bash
gh codespace ports forward 5173:5173 -c codex-web-termux-jjwrqxjpr577cw94
```

Lalu buka di browser Android:

```text
http://127.0.0.1:5173
```
