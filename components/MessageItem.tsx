
import React from 'react';
import { Message } from '../types';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-2 md:mb-3 ${isUser ? 'justify-end' : 'justify-start'} message-appear`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 flex-shrink-0 mr-2 flex items-center justify-center text-[10px] font-bold text-white shadow-md self-end mb-1">
          N
        </div>
      )}
      <div className={`relative max-w-[80%] sm:max-w-[70%] md:max-w-[60%]`}>
        <div className={`px-4 py-2.5 rounded-[18px] transition-all duration-300 ${
          isUser 
            ? 'bg-[#0084FF] text-white rounded-br-sm' 
            : 'bg-[#242526] text-[#E4E6EB] rounded-bl-sm border border-white/5'
        }`}>
          <div className="text-[15px] leading-[1.35] whitespace-pre-wrap break-words">
            {message.text}
          </div>
        </div>
        <div className={`mt-1 flex items-center gap-1 opacity-40 ${isUser ? 'justify-end' : 'justify-start'}`}>
          <span className="text-[9px] font-bold uppercase tracking-tight">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isUser && (
            <svg className="w-3 h-3 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageItem;
