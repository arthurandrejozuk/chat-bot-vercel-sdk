'use client'

import Button from '../Button';
import ChatBubble from '../ChatBubble';
import { ChatForm } from '../ChatForm';
import { ChatHeader } from '../ChatHeader';
import { IconStop } from '../Icons';
import { Loader } from '../Loader';
import { RetryButton } from '../RetryButton';
import { useChat } from "ai/react"
import styles from './container.module.css';



export const ChatContainer = () => {

    const { messages, input, handleInputChange, handleSubmit } = useChat();

    return (
        <section className={styles.container}>
            <ChatHeader />
            <div className={styles.chat}>              
                {messages.map((msg) => (
                    <ChatBubble
                        key={msg.id}
                        message={msg.message}
                        isUser={msg.isUser} 
                        onRemove={() => console.log('remove message', msg.id)}
                    />
                ))}
            </div>
            <ChatForm 
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />
        </section>
    );
};