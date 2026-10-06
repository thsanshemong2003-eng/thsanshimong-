import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  MessageSquare,
  Send,
  MoreVertical,
  Check,
  CheckCheck,
  Image,
  Tag,
  Phone,
  Video,
  ShieldAlert,
  Trash2,
  Ban,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';

export const InboxView: React.FC = () => {
  const {
    conversations,
    activeConversationId,
    setActiveConversationId,
    sendMessage,
    deleteConversation,
    blockParticipant,
    formatCurrentPrice,
    setSelectedListing,
    listings,
  } = useApp();

  const [messageInput, setMessageInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [customOfferAmount, setCustomOfferAmount] = useState<number>(0);

  const activeConversation = conversations.find((c) => c.id === activeConversationId) || conversations[0];

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!messageInput.trim() || !activeConversation) return;

    sendMessage(activeConversation.id, messageInput.trim());
    setMessageInput('');
  };

  const handleSendOffer = () => {
    if (!activeConversation || customOfferAmount <= 0) return;
    sendMessage(activeConversation.id, `Offer submitted: ${formatCurrentPrice(customOfferAmount, activeConversation.listingCurrency || 'USD')}`, customOfferAmount);
    setShowOfferModal(false);
    setCustomOfferAmount(0);
  };

  const handleSelectQuickReply = (reply: string) => {
    if (!activeConversation) return;
    sendMessage(activeConversation.id, reply);
  };

  const handleViewAttachedListing = () => {
    if (!activeConversation?.listingId) return;
    const l = listings.find((item) => item.id === activeConversation.listingId);
    if (l) setSelectedListing(l);
  };

  return (
    <div className="w-full max-w-6xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[640px] flex flex-col md:flex-row">
      {/* Left Column: Conversations List */}
      <div
        className={`w-full md:w-80 border-r border-slate-100 flex flex-col bg-slate-50/50 ${
          activeConversationId ? 'hidden md:flex' : 'flex'
        }`}
      >
        <div className="p-4 border-b border-slate-100 bg-white">
          <h2 className="text-lg font-bold font-display text-slate-900 flex items-center justify-between">
            <span>Messages & Deals</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {conversations.length}
            </span>
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {conversations.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              No conversations yet. Inquire about any listing to start chatting!
            </div>
          ) : (
            conversations.map((conv) => {
              const isActive = conv.id === activeConversation?.id;
              return (
                <div
                  key={conv.id}
                  onClick={() => setActiveConversationId(conv.id)}
                  className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                    isActive ? 'bg-white shadow-xs border-l-4 border-rose-500' : 'hover:bg-white/80'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img
                      src={conv.participantAvatar}
                      alt={conv.participantName}
                      className="w-12 h-12 rounded-2xl object-cover border border-slate-200"
                    />
                    {conv.isVerified && (
                      <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                        ✓
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate">
                        {conv.participantName}
                      </h4>
                      <span className="text-[10px] text-slate-400 shrink-0">
                        {conv.lastMessageTime}
                      </span>
                    </div>

                    {conv.listingTitle && (
                      <p className="text-[11px] font-semibold text-rose-600 truncate mb-1">
                        📦 {conv.listingTitle}
                      </p>
                    )}

                    <p className="text-xs text-slate-500 truncate">{conv.lastMessage}</p>
                  </div>

                  {conv.unreadCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-rose-600 text-white text-[10px] font-extrabold flex items-center justify-center shrink-0">
                      {conv.unreadCount}
                    </span>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Right Column: Chat Window */}
      {activeConversation ? (
        <div
          className={`flex-1 flex flex-col bg-white ${
            !activeConversationId ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Chat Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white z-10 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveConversationId(null)}
                className="md:hidden p-1.5 rounded-xl bg-slate-100 text-slate-600"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              <img
                src={activeConversation.participantAvatar}
                alt={activeConversation.participantName}
                className="w-10 h-10 rounded-xl object-cover border border-slate-200"
              />

              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm text-slate-900 font-display">
                    {activeConversation.participantName}
                  </h3>
                  {activeConversation.isVerified && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                      Verified ✓
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  <span>Online now</span>
                  {activeConversation.participantRating && (
                    <span>• ⭐ {activeConversation.participantRating}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => alert(`Connecting verified audio call with ${activeConversation.participantName}...`)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                title="Call Seller"
              >
                <Phone className="w-4 h-4" />
              </button>

              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                >
                  <MoreVertical className="w-4 h-4" />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-10 w-44 bg-white rounded-2xl shadow-xl border border-slate-200 p-1.5 text-xs z-30 animate-in fade-in">
                    <button
                      onClick={() => {
                        setShowOfferModal(true);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl text-left font-semibold"
                    >
                      <Tag className="w-3.5 h-3.5 text-rose-500" />
                      Make an Offer
                    </button>
                    <button
                      onClick={() => {
                        blockParticipant(activeConversation.id);
                        setShowMenu(false);
                        alert(`${activeConversation.participantName} has been blocked.`);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl text-left font-semibold"
                    >
                      <Ban className="w-3.5 h-3.5 text-amber-500" />
                      Block User
                    </button>
                    <button
                      onClick={() => {
                        deleteConversation(activeConversation.id);
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl text-left font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Delete Chat
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pinned Listing Attachment Banner */}
          {activeConversation.listingTitle && (
            <div
              onClick={handleViewAttachedListing}
              className="bg-slate-50 px-4 py-2.5 border-b border-slate-100 flex items-center justify-between gap-3 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-3 min-w-0">
                {activeConversation.listingImage && (
                  <img
                    src={activeConversation.listingImage}
                    alt={activeConversation.listingTitle}
                    className="w-10 h-10 rounded-xl object-cover shrink-0 border border-slate-200"
                  />
                )}
                <div className="min-w-0">
                  <h5 className="text-xs font-bold text-slate-800 truncate">
                    {activeConversation.listingTitle}
                  </h5>
                  <span className="text-xs font-black text-rose-600">
                    {activeConversation.listingPrice
                      ? formatCurrentPrice(activeConversation.listingPrice, activeConversation.listingCurrency || 'USD')
                      : ''}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOfferModal(true);
                  }}
                  className="px-3 py-1 bg-white border border-slate-200 hover:border-rose-400 text-slate-700 hover:text-rose-600 text-xs font-bold rounded-lg shadow-2xs transition-colors"
                >
                  Make Offer
                </button>
                <span className="text-xs text-slate-400 font-bold">View ➔</span>
              </div>
            </div>
          )}

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 bg-slate-50/30">
            {activeConversation.messages.map((msg) => {
              const isMe = msg.senderId === 'buyer';
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[85%] sm:max-w-md px-4 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      isMe
                        ? 'bg-slate-900 text-white rounded-br-xs'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs'
                    }`}
                  >
                    {msg.offerAmount && (
                      <div className="mb-2 pb-2 border-b border-white/20 flex items-center justify-between gap-3 font-bold">
                        <span className="text-amber-300">Official Offer</span>
                        <span>{formatCurrentPrice(msg.offerAmount, activeConversation.listingCurrency || 'USD')}</span>
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-1 px-1">
                    <span>{msg.timestamp}</span>
                    {isMe && (
                      <CheckCheck className={`w-3.5 h-3.5 ${msg.read ? 'text-blue-500' : 'text-slate-400'}`} />
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick preset replies */}
          <div className="px-4 py-2 border-t border-slate-100 bg-white flex items-center gap-2 overflow-x-auto scrollbar-none">
            <span className="text-[11px] font-bold text-slate-400 shrink-0">Quick:</span>
            {[
              'Is this still available?',
              'What is your best price?',
              'Can I inspect it in person tomorrow?',
              'Are original documents verified?',
            ].map((chip) => (
              <button
                key={chip}
                onClick={() => handleSelectQuickReply(chip)}
                className="px-3 py-1 rounded-full bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 text-xs font-semibold whitespace-nowrap transition-colors shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={handleSend}
            className="p-3.5 border-t border-slate-100 bg-white flex items-center gap-2 shrink-0"
          >
            <button
              type="button"
              onClick={() => {
                const sampleImg = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80';
                sendMessage(activeConversation.id, `[Attached Inspection Photo: ${sampleImg}]`);
              }}
              className="p-2.5 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="Attach Photo"
            >
              <Image className="w-5 h-5" />
            </button>

            <input
              type="text"
              placeholder="Type your message or offer..."
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white"
            />

            <button
              type="submit"
              disabled={!messageInput.trim()}
              className="p-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-40 text-white rounded-2xl shadow-md transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
          <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
          <h3 className="font-bold font-display text-base text-slate-700">No Chat Selected</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Select a conversation on the left or tap "Chat Seller" on any listing to negotiate and finalize deals.
          </p>
        </div>
      )}

      {/* Make Offer Modal inside chat */}
      {showOfferModal && activeConversation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-slate-100">
            <h4 className="font-bold font-display text-base text-slate-900 mb-2">
              Send Official Offer
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              To: {activeConversation.participantName}
            </p>

            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Offer Amount ({activeConversation.listingCurrency || 'USD'})
              </label>
              <input
                type="number"
                placeholder="Enter amount"
                value={customOfferAmount || ''}
                onChange={(e) => setCustomOfferAmount(Number(e.target.value))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setShowOfferModal(false)}
                className="flex-1 py-2.5 text-xs font-bold text-slate-600 bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSendOffer}
                disabled={!customOfferAmount || customOfferAmount <= 0}
                className="flex-1 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 disabled:opacity-50 rounded-xl shadow-xs"
              >
                Submit Offer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
