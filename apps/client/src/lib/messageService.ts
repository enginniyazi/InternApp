import { api } from './api';

export interface MessageItem {
  id: string;
  applicationId: string;
  senderId: string;
  receiverId: string;
  content: string;
  attachmentUrl?: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    email: string;
    role: 'STUDENT' | 'COMPANY' | 'ADMIN';
    studentProfile?: { firstName: string; lastName: string };
    companyProfile?: { companyName: string };
  };
}

export async function fetchApplicationMessages(applicationId: string): Promise<MessageItem[]> {
  return api.get<MessageItem[]>(`/applications/${applicationId}/messages`);
}

export async function sendMessageToApplication(
  applicationId: string,
  content: string,
  attachmentUrl?: string
): Promise<MessageItem> {
  return api.post<MessageItem>(`/applications/${applicationId}/messages`, {
    content,
    attachmentUrl,
  });
}
