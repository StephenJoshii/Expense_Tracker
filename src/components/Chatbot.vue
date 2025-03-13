<template>
    <div class="chatbot-container" :class="{ 'open': isChatOpen }">
      <div class="chatbot-toggle" @click="toggleChat">
        <span v-if="!isChatOpen" class="chatbot-icon"></span>
        <span v-else class="close-icon">×</span>
      </div>
      <div v-if="isChatOpen" class="chatbot-content">
        <div class="messages">
          <div v-for="(message, index) in messages" :key="index" :class="message.sender === 'user' ? 'user-message' : 'bot-message'">
            {{ message.text }}
          </div>
        </div>
        <div class="input-area">
          <input v-model="userInput" @keyup.enter="sendMessage" placeholder="Type your message..." />
          <button class="btn" @click="sendMessage">Send</button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        isChatOpen: false,
        userInput: '',
        messages: [],
      };
    },
    methods: {
      toggleChat() {
        this.isChatOpen = !this.isChatOpen;
      },
      async sendMessage() {
        if (this.userInput.trim() === '') return;
  
        this.messages.push({ text: this.userInput, sender: 'user' });
        const question = this.userInput;
        this.userInput = '';
  
        try {
          const response = await axios.post('http://localhost:3000/chatbot', {
            question: question,
            userId: this.$store.state.userId,
          });
  
          this.messages.push({ text: response.data.response, sender: 'bot' });
        } catch (error) {
          console.error('Error sending message:', error);
          this.messages.push({ text: 'Error: Could not get response.', sender: 'bot' });
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .chatbot-container {
    position: fixed;
    bottom: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
    transition: width 0.3s ease, height 0.3s ease, border-radius 0.3s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
  
  .chatbot-container.open {
    width: 300px;
    height: 400px;
    border-radius: 8px;
  }
  
  .chatbot-toggle {
    background-color: #007bff;
    color: white;
    text-align: center;
    cursor: pointer;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .chatbot-icon {
    width: 30px;
    height: 30px;
    background-color: white;
    border-radius: 50%;
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23007bff"%3E%3Cpath d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/%3E%3C/svg%3E');
    background-size: cover;
  }
  
  .chatbot-content {
    background-color: white;
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  
  .messages {
    flex-grow: 1;
    padding: 10px;
    overflow-y: auto;
  }
  
  .user-message,
  .bot-message {
    padding: 8px;
    margin-bottom: 5px;
    border-radius: 5px;
  }
  
  .user-message {
    background-color: #e0f7fa;
    align-self: flex-end;
  }
  
  .bot-message {
    background-color: #f0f0f0;
    align-self: flex-start;
  }
  
  .input-area {
    display: flex;
    padding: 10px;
    border-top: 1px solid #eee;
  }
  
  input {
    flex-grow: 1;
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 4px;
    margin-right: 5px;
  }
  
  .btn {
    padding: 8px 15px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  </style>