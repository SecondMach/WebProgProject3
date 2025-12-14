🎄 Santa’s Workshop Puzzle Game

An immersive, festive sliding-puzzle game built with HTML, CSS, JavaScript, PHP, and MySQL, featuring adaptive difficulty, story mode progression, analytics tracking, and a holiday-themed audio-visual experience.

🎮 Features Overview
🧩 Dynamic Puzzle Gameplay
Multi-size sliding puzzles:
3×3, 4×4 (default), 6×6, 8×8, 10×10
Guaranteed solvable boards using valid move shuffling
Visual tile numbering to assist puzzle solving
Highlighted movable tiles for improved usability
Smooth tile animations and transitions

📖 Christmas Story Mode
Progressive level system with increasing difficulty
Levels start at 3×3 and scale up to 10×10
Visual story map with festive level markers
Locked/unlocked levels based on player progression

🎮 Adaptive Gameplay Experience
Intelligent difficulty scaling based on:
Completion time
Number of moves
Player performance history
Difficulty affects:
Shuffle complexity
Available hints
Gameplay pacing

🔍 Strategic Assistance (Magic Features)
Limited magic hints based on difficulty level
Tile highlighting assistance
Optional puzzle preview system for guidance

⏱️ Immersive Audio-Visual Experience
Live gameplay timer
Festive background music
Music intensity increases during active gameplay
Snow effects and animated backgrounds
Smooth UI animations and hover effects

🏆 Victory & Rewards System
Animated victory screen featuring:
Sleigh animation
Sparkles and confetti effects
Animated stat counters
Player rewards and achievements
Replay, next level (story mode), and new game options

🎁 Rewards & Achievements
Unlockable festive rewards
Achievement tracking based on:
Puzzle size
Completion time
Total moves
Rewards page dynamically updates per user

📊 Leaderboard & Analytics
Global leaderboard visible to all users
Tracks:
Total games
Wins
Best completion time
Analytics system tracks:
Player sessions
Puzzle sizes
Difficulty progression
Player behavior patterns

🗄️ Database Design
Core Tables
Users
Puzzles
Game sessions
Analytics events

Puzzle configurations are procedurally generated, ensuring solvability without storing static puzzle layouts.

🔐 Security & Performance
SQL injection prevention via prepared statements
Indexed database fields for fast leaderboard queries
Transaction handling for critical session writes
Sessions are only recorded as wins when puzzles are fully solved

▶️ Resume System
If a player exits mid-game:
The game state (tiles, image, timer, moves) is saved

On return:
A Resume Game prompt appears on the homepage
Ensures progress is never incorrectly recorded as a win

🧭 Navigation
Consistent navigation bar across all pages (except homepage)
Login/Profile button dynamically updates based on user state
Seamless navigation between:
Home
Story Mode
Gameplay
Rewards
Leaderboard
Profile

🛠️ Tech Stack
Layer	Technology
Frontend	HTML5, CSS3, JavaScript
Backend	PHP
Database	MySQL
Audio	HTML5 Audio API
Storage	LocalStorage + MySQL
Effects	CSS Animations, JS DOM

🚀 Future Enhancements
Daily challenges
Seasonal themes beyond Christmas
Multiplayer race mode
Advanced analytics dashboard

This README was created and modified using AI and the main instruction page for this project.
