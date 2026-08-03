import React, { useState, useEffect } from 'react';
import { fetchApplicationMessages, sendMessageToApplication } from '../../lib/messageService';
import type { MessageItem } from '../../lib/messageService';

interface ApplicationChatModalProps {
  applicationId: string;
  title: string;
  currentUserId: string;
  onClose: () => void;
}

export const ApplicationChatModal: React.FC<ApplicationChatModalProps> = ({
  applicationId,
  title,
  currentUserId,
  onClose,
}) => {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const loadMessages = () => {
    fetchApplicationMessages(applicationId)
      .then(setMessages)
      .catch(() => {});
  };

  useEffect(() => {
    loadMessages();
    const interval = setInterval(loadMessages, 4000); // 4 saniyede bir canlı sohbet güncelleme
    return () => clearInterval(interval);
  }, [applicationId]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setLoading(true);
    try {
      await sendMessageToApplication(applicationId, text.trim());
      setText('');
      loadMessages();
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="detail-modal-backdrop" onClick={onClose}>
      <div
        className="detail-modal-content"
        style={{ maxWidth: '550px', height: '600px', display: 'flex', flexDirection: 'column' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '12px',
          }}
        >
          <div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              💬 Doğrudan Mesajlaşma
            </span>
            <h3 style={{ margin: 0, fontSize: '18px', color: 'var(--text-main)' }}>{title}</h3>
          </div>
          <button type="button" className="btn-secondary" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Mesaj Listesi */}
        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '16px 0',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          {messages.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'var(--text-muted)', margin: 'auto' }}>
              Henüz mesaj yok. İlk mesajı siz gönderin!
            </div>
          ) : (
            messages.map((msg) => {
              const isMine = msg.senderId === currentUserId;
              const senderLabel = isMine
                ? 'Siz'
                : msg.sender?.studentProfile
                  ? `${msg.sender.studentProfile.firstName} ${msg.sender.studentProfile.lastName}`
                  : msg.sender?.companyProfile?.companyName || 'Kullanıcı';

              return (
                <div
                  key={msg.id}
                  style={{
                    alignSelf: isMine ? 'flex-end' : 'flex-start',
                    maxWidth: '80%',
                    background: isMine
                      ? 'linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)'
                      : 'var(--bg-primary)',
                    color: isMine ? '#ffffff' : 'var(--text-main)',
                    padding: '10px 14px',
                    borderRadius: isMine ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    border: isMine ? 'none' : '1px solid var(--border-color)',
                  }}
                >
                  <div
                    style={{ fontSize: '11px', opacity: 0.8, marginBottom: '2px', fontWeight: 600 }}
                  >
                    {senderLabel} &bull;{' '}
                    {new Date(msg.createdAt).toLocaleTimeString('tr-TR', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div style={{ fontSize: '14px', whiteSpace: 'pre-line', lineHeight: '1.4' }}>
                    {msg.content}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Mesaj Gönderme Formu */}
        <form
          onSubmit={handleSend}
          style={{
            display: 'flex',
            gap: '8px',
            borderTop: '1px solid var(--border-color)',
            paddingTop: '12px',
          }}
        >
          <input
            type="text"
            placeholder="Mesajınızı yazın..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'var(--bg-primary)',
              color: 'var(--text-main)',
            }}
          />
          <button type="submit" className="btn-primary" disabled={loading || !text.trim()}>
            {loading ? 'Gönderiliyor...' : 'Gönder 🚀'}
          </button>
        </form>
      </div>
    </div>
  );
};
