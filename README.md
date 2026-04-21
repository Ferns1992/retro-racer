# 🏎️ Retro Racer 🏁

Welcome to **Retro Racer**, an adrenaline-pumping, top-down 8-bit aesthetic arcade racing game!

Dodge obstacles, survive as long as you can across the neon-lit asphalt, and etch your name into the Global High Scores Leaderboard! 🌟

![Retro Racer Gameplay](gameplay.png)

## 🎮 How to Play
- Use the **Left & Right Arrow Keys** (or **A / D**) to steer your neon cyan sports car! 🛣️
- The game progressively speeds up — test your reflexes as the world hurdles past you! 🔥
- Crash into a block? Submitting your name will save your high score permanently! 🏆

## 🛠️ Tech Stack & Features
- **Frontend**: Pure HTML5 Canvas, Vanilla Javascript, styled with CSS and Pixel Fonts 👾
- **Backend API**: Node.js and Express 📡
- **Database**: SQLite3 (used for preserving High Scores natively without bloated secondary containers) 💾
- **Containerization**: Drop-in Docker and Docker-compose ready 🐳

---

## 🚀 Deployment (Docker / Portainer)

Deploying Retro Racer is simple! Everything comes pre-packaged in a single image, mapping the `3000` internal port to the host's `3070` port natively. It utilizes Docker Volumes to ensure your High Scores SQLite file is never wiped during restarts.

### 🐳 Deploying via Portainer Stacks
If you use Portainer to manage your Docker environment, follow these steps:

1. 🌐 Open your **Portainer Dashboard**.
2. 🗂️ Click on **Stacks** -> **Add stack**.
3. 📝 Set the stack name to `retro-racer`.
4. ⚙️ In the **Web editor**, simply paste the contents of `docker-compose.yml`, or upload the entirety of the directory.
5. 🛡️ *Note*: If your Portainer agent cannot natively build from local host directories on the fly, first run `docker build -t retro-racer-app .` on the host, and change `build: .` in your compose file to use `image: retro-racer-app`.
6. ▶️ Hit **Deploy the stack**.

### 💻 Standard Docker Compose
If you prefer the command line over Portainer:

```bash
cd retro-racer
docker compose up -d --build
```
Your game will now be live and permanently persisting high scores at:
👉 `http://YOUR_LOCAL_IP:3070`

Have fun and leave your friends in the dust! 🚦💨
