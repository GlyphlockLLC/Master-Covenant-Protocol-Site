/* Prevent iOS input zoom */
input, textarea {
  font-size: 16px !important;
}

/* MAIN LAYOUT */
.dino-chat-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: radial-gradient(circle at 40% 20%, #222 0%, #000 90%);
  font-family: system-ui, sans-serif;
  overflow: hidden;
}

.dino-header {
  padding: 14px 20px;
  background: #101010aa;
  backdrop-filter: blur(12px);
  border-bottom: 1px solid #333;
  display: flex;
  align-items: center;
  gap: 8px;
}

.dino-title {
  color: #8afcff;
  font-size: 20px;
  font-weight: 700;
  letter-spacing: 0.8px;
  flex: 1;
  text-align: center;
}

.dino-icon-btn,
.dino-close-btn {
  background: none;
  border: none;
  color: #8afcff;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.dino-icon-btn:active,
.dino-close-btn:active {
  transform: scale(0.9);
}

/* Conversations List */
.dino-conv-list {
  background: #0a0a0a;
  border-bottom: 1px solid #333;
  max-height: 300px;
  overflow-y: auto;
}

.dino-conv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 20px;
  border-bottom: 1px solid #333;
}

.dino-conv-header h3 {
  color: #8afcff;
  font-size: 14px;
  font-weight: 600;
  margin: 0;
}

.dino-new-conv {
  background: #113024;
  border: 1px solid #8afcff;
  color: #8afcff;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 13px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;
  touch-action: manipulation;
}

.dino-new-conv:active {
  transform: scale(0.95);
}

.dino-conv-items {
  max-height: 240px;
  overflow-y: auto;
}

.dino-conv-item {
  padding: 12px 20px;
  border-bottom: 1px solid #222;
  cursor: pointer;
  transition: background 0.2s;
}

.dino-conv-item:hover {
  background: #111;
}

.dino-conv-item.active {
  background: #113024;
  border-left: 3px solid #8afcff;
}

.dino-conv-title {
  color: #fff;
  font-size: 14px;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.dino-conv-date {
  color: #666;
  font-size: 12px;
}

.dino-conv-empty {
  padding: 20px;
  text-align: center;
  color: #666;
  font-size: 13px;
}

/* MESSAGES */
.dino-messages {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  padding-bottom: 110px;
  scrollbar-width: none;
}

.dino-messages::-webkit-scrollbar {
  display: none;
}

.dino-bubble {
  display: flex;
  align-items: flex-start;
  margin-bottom: 18px;
  gap: 12px;
  max-width: 80%;
  padding: 14px 16px;
  border-radius: 16px;
  animation: dino-pop 0.25s ease-out;
}

@keyframes dino-pop {
  from { transform: scale(0.9); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.dino-user {
  background: #262834;
  color: #b0d4ff;
  margin-left: auto;
}

.dino-assistant {
  background: #113024;
  color: #caffd6;
}

.dino-avatar {
  font-size: 20px;
}

.dino-text {
  flex: 1;
  font-size: 15px;
  line-height: 1.5;
}

/* Voice button */
.dino-speak-btn {
  background: #1b1b1b;
  border: 2px solid #444;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  min-width: 48px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  cursor: pointer;
  touch-action: manipulation;
  user-select: none;
}

.dino-speak-btn:active {
  transform: scale(0.92);
  box-shadow: 0 0 20px #8afcff88;
}

/* INPUT BAR */
.dino-input-zone {
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #000000dd;
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 20px;
  border-top: 1px solid #333;
}

.dino-input {
  flex: 1;
  padding: 14px 18px;
  border-radius: 14px;
  border: 2px solid #333;
  background: #111;
  color: #fff;
  outline: none;
}

.dino-input:focus {
  border-color: #8afcff;
}

.dino-send-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ff 0%, #09f 100%);
  border: none;
  font-size: 28px;
  cursor: pointer;
  touch-action: manipulation;
  user-select: none;
}

.dino-send-btn:active {
  transform: scale(0.93);
  box-shadow: 0 0 25px #0af8;
}

/* FAB Button */
.dino-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  width: 64px;
  height: 64px;
  border: none;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ff 0%, #09f 100%);
  box-shadow: 0 8px 24px rgba(0, 255, 255, 0.4);
  cursor: pointer;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.dino-fab:active {
  transform: scale(0.93);
  box-shadow: 0 0 25px #0af8;
}