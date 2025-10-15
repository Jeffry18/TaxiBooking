import React from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import './WhatsAppChat.css';

const WhatsAppChat = () => {
  const phoneNumber = "918089084080"; // WhatsApp number
  const message = "Hi, I would like to book a taxi!"; // Default message

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="whatsapp-chat" onClick={handleWhatsAppClick}>
      <FaWhatsapp className="whatsapp-icon" />
      <span className="whatsapp-tooltip">Chat with us!</span>
    </div>
  );
};

export default WhatsAppChat;