'use client'

import ChatBubble from '../ChatBubble';
import { ChatForm } from '../ChatForm';
import { ChatHeader } from '../ChatHeader';
import { useChat } from "ai/react"
import { IconStop } from '../Icons';
import styles from './container.module.css';
import { Loader } from '../Loader';
import Button from '../Button';
import { RetryButton } from '../RetryButton';



export const ChatContainer = () => {

    const { 
        messages, 
        setMessages,
        input, 
        handleInputChange, 
        handleSubmit,
        reload,
        isLoading,
        stop, 
        error
    } = useChat();

    function removeMessage(msgId){
        setMessages(messages.filter(m => m.id != msgId))
    } 

    return (
        <section className={styles.container}>
            <ChatHeader />
            <div className={styles.chat}>              
                {messages.map((msg) => (
                    <ChatBubble
                        key={msg.id}
                        message={msg.content}
                        isUser={msg.role == "user"} 
                        onRemove={() => removeMessage(msg.id)}
                    />
                ))}
            </div>
            <div>
                {error && <p>Ops! Alguma coisa deu errado!</p>}
                {isLoading && 
                    <div>
                        <Loader/>
                        <Button onClick={stop} variant='danger'>
                            <IconStop/> Parar
                        </Button>
                    </div>}
                {(!isLoading && messages.length > 0) && <RetryButton onClick={reload}/>}
            </div>
            <ChatForm 
                input={input}
                handleInputChange={handleInputChange}
                handleSubmit={handleSubmit}
            />
        </section>
    );
};