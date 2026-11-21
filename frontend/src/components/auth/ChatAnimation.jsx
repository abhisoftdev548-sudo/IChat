
import React from "react";
import { MessageCircle, Heart, Send, Sparkles } from "lucide-react";
import { useTheme } from "../../context/theme";


const ChatAnimation = () => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`chat-animation ${
        isDark ? "chat-animation-dark" : "chat-animation-light"
      }`}
    >
      {/* Background decoration */}
      <div className="animation-orbit orbit-one" />
      <div className="animation-orbit orbit-two" />

      <div className="floating-particle particle-one" />
      <div className="floating-particle particle-two" />
      <div className="floating-particle particle-three" />
      <div className="floating-particle particle-four" />

      {/* Main visual */}
      <div className="animation-center">
        <div className="center-glow" />

        <div className="center-icon">
          <MessageCircle size={42} strokeWidth={1.5} />
          <span className="icon-dot" />
        </div>

        <div className="center-caption">
          <span>WHISPER</span>
          <Sparkles size={13} />
        </div>
      </div>

      {/* Message card 1 */}
      <div className="floating-card card-one">
        <div className="card-header">
          <div className="avatar avatar-one">A</div>
          <div>
            <p className="card-name">Alex</p>
            <p className="card-time">Just now</p>
          </div>
          <span className="online-dot" />
        </div>

        <div className="message-bubble">
          Hey! How's your day going?
        </div>
      </div>

      {/* Message card 2 */}
      <div className="floating-card card-two">
        <div className="card-header">
          <div className="avatar avatar-two">J</div>
          <div>
            <p className="card-name">Jamie</p>
            <p className="card-time">2 min ago</p>
          </div>
          <Heart size={14} className="heart-icon" />
        </div>

        <div className="message-bubble outgoing-bubble">
          It's better talking to you.
        </div>
      </div>

      {/* Typing card */}
      <div className="floating-card typing-card">
        <div className="typing-label">Someone is typing</div>

        <div className="typing-dots">
          <span />
          <span />
          <span />
        </div>
      </div>

      {/* Send icon */}
      <div className="floating-send">
        <Send size={17} />
      </div>
    </div>
  );
};

export default ChatAnimation;
