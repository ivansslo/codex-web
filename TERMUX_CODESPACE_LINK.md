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
