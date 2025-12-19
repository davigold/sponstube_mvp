
import React, { useState, useEffect, useRef } from 'react';
import { Send, User, FileText, Paperclip, MoreHorizontal, DollarSign, ArrowRightLeft, Check, X } from 'lucide-react';
import { Button, Input, Card } from './Common';
import { Role } from '../types';
import { useCurrency } from '../contexts/CurrencyContext';

interface Message {
  id: string;
  author: string;
  role: Role;
  content: string;
  timestamp: string;
  type: 'text' | 'revision' | 'offer_update';
  meta?: {
      newPrice?: number;
      currency?: string;
      status?: 'pending' | 'accepted' | 'rejected';
  }
}

interface MessageThreadProps {
  contextId: string; // Campaign ID
  userRole: Role;
  className?: string;
}

export const MessageThread: React.FC<MessageThreadProps> = ({ contextId, userRole, className }) => {
  const { formatCurrency } = useCurrency();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isNegotiating, setIsNegotiating] = useState(false);
  const [negotiationPrice, setNegotiationPrice] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load messages
  useEffect(() => {
    const saved = localStorage.getItem(`cm_messages_${contextId}`);
    if (saved) {
      setMessages(JSON.parse(saved));
    } else {
        setMessages([{
            id: 'init',
            author: 'SponsTube Bot',
            role: 'staff',
            content: 'Deal Room Open. You can discuss details or negotiate the budget here.',
            timestamp: new Date().toISOString(),
            type: 'text'
        }]);
    }
  }, [contextId]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim() && !isNegotiating) return;

    let newMessage: Message;

    if (isNegotiating && negotiationPrice) {
        newMessage = {
            id: `msg-${Date.now()}`,
            author: userRole === 'brand' ? 'Brand Manager' : 'Creator',
            role: userRole,
            content: `Proposed a new rate: ${formatCurrency(Number(negotiationPrice))}`,
            timestamp: new Date().toISOString(),
            type: 'offer_update',
            meta: {
                newPrice: Number(negotiationPrice),
                status: 'pending'
            }
        };
        setIsNegotiating(false);
        setNegotiationPrice('');
    } else {
        newMessage = {
            id: `msg-${Date.now()}`,
            author: userRole === 'brand' ? 'Brand Manager' : 'Creator',
            role: userRole,
            content: inputText,
            timestamp: new Date().toISOString(),
            type: 'text'
        };
    }

    const updated = [...messages, newMessage];
    setMessages(updated);
    localStorage.setItem(`cm_messages_${contextId}`, JSON.stringify(updated));
    setInputText('');
  };

  const handleAcceptOffer = (msgId: string) => {
      const updated = messages.map(m => m.id === msgId && m.meta ? { ...m, meta: { ...m.meta, status: 'accepted' as const } } : m);
      setMessages(updated);
      localStorage.setItem(`cm_messages_${contextId}`, JSON.stringify(updated));
      
      // Auto-reply system message
      const sysMsg: Message = {
          id: `sys-${Date.now()}`,
          author: 'System',
          role: 'staff',
          content: 'Offer Accepted! The contract value has been updated.',
          timestamp: new Date().toISOString(),
          type: 'text'
      };
      setMessages(prev => [...prev, sysMsg]);
  };

  return (
    <div className={`flex flex-col h-[500px] bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 rounded-xl ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center bg-white dark:bg-slate-900 rounded-t-xl shrink-0">
        <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-slate-700 dark:text-slate-200">Deal Room</h3>
            <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">Live</span>
        </div>
        <div className="text-xs text-slate-400 flex items-center gap-1">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Online
        </div>
      </div>

      {/* Messages List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-700" ref={scrollRef}>
        {messages.map((msg) => {
          const isMe = msg.role === userRole;
          const isSystem = msg.author === 'System' || msg.author === 'SponsTube Bot';
          
          if (isSystem) {
              return (
                  <div key={msg.id} className="flex justify-center my-4">
                      <span className="text-[10px] uppercase tracking-wide font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">{msg.content}</span>
                  </div>
              )
          }

          if (msg.type === 'offer_update') {
              return (
                  <div key={msg.id} className="flex justify-center my-4 w-full">
                      <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm w-[280px]">
                          <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-500 uppercase tracking-wider">
                              <ArrowRightLeft size={12} /> Counter Offer
                          </div>
                          <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                              {formatCurrency(msg.meta?.newPrice || 0)}
                          </div>
                          <p className="text-xs text-slate-500 mb-4">Proposed by {msg.author}</p>
                          
                          {msg.meta?.status === 'pending' ? (
                              !isMe ? (
                                <div className="flex gap-2">
                                    <button onClick={() => handleAcceptOffer(msg.id)} className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2 rounded-lg transition-colors flex items-center justify-center gap-1">
                                        <Check size={14} /> Accept
                                    </button>
                                    <button className="flex-1 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-600 dark:text-slate-300 text-xs font-bold py-2 rounded-lg transition-colors">
                                        Decline
                                    </button>
                                </div>
                              ) : (
                                <div className="text-xs text-center text-slate-400 italic bg-slate-50 dark:bg-slate-900/50 py-2 rounded">Waiting for response...</div>
                              )
                          ) : (
                              <div className="text-xs text-center text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-900/20 py-2 rounded border border-emerald-100 dark:border-emerald-500/20">
                                  Offer Accepted
                              </div>
                          )}
                      </div>
                  </div>
              );
          }

          return (
            <div key={msg.id} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700 ${isMe ? 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400' : 'bg-white dark:bg-slate-800 text-slate-600'}`}>
                <User size={14} />
              </div>
              <div className={`max-w-[80%] ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{msg.author}</span>
                  <span className="text-[10px] text-slate-400">{new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div className={`p-3 rounded-2xl text-sm shadow-sm ${
                  isMe 
                    ? 'bg-indigo-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 rounded-b-xl shrink-0">
        {isNegotiating ? (
            <div className="mb-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-500/20 animate-in slide-in-from-bottom-2">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase">Propose New Rate</span>
                    <button onClick={() => setIsNegotiating(false)}><X size={14} className="text-indigo-400 hover:text-indigo-600" /></button>
                </div>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input 
                            type="number" 
                            className="w-full pl-8 pr-3 py-2 text-sm rounded-md border border-indigo-200 dark:border-indigo-500/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-950" 
                            placeholder="Enter amount..."
                            value={negotiationPrice}
                            onChange={e => setNegotiationPrice(e.target.value)}
                            autoFocus
                        />
                    </div>
                    <Button size="sm" onClick={handleSend} className="bg-indigo-600 text-white">Send Offer</Button>
                </div>
            </div>
        ) : (
            <div className="flex items-center gap-4 mb-2 px-1">
                <button 
                    onClick={() => setIsNegotiating(true)}
                    className="flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors px-2 py-1 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                    <DollarSign size={14} /> Negotiate
                </button>
            </div>
        )}
        
        {!isNegotiating && (
            <div className="flex gap-2">
            <input
                className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
                placeholder="Type a message..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <Button size="sm" icon={<Send size={16} />} onClick={handleSend} className="px-4" />
            </div>
        )}
      </div>
    </div>
  );
};
