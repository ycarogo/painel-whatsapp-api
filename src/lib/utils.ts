import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Instance {
  id: number;
  name: string;
  description: string | null;
  connectionStatus: "ONLINE" | "OFFLINE";
  ownerJid: string;
  profilePicUrl: string;
  createdAt: string;
  updatedAt: string;
  Auth: {
    id: number;
    token: string;
    createdAt: string;
    updatedAt: string;
  };
  Webhook: {
    id: number;
    enabled: true;
    url: string;
    events: {
      chatsSet: boolean;
      chatsUpsert: boolean;
      contactsSet: boolean;
      messagesSet: boolean;
      sendMessage: boolean;
      chatsDeleted: boolean;
      chatsUpdated: boolean;
      groupsUpsert: boolean;
      refreshToken: boolean;
      groupsUpdated: boolean;
      qrcodeUpdated: boolean;
      contactsUpsert: boolean;
      messagesUpsert: boolean;
      statusInstance: boolean;
      contactsUpdated: boolean;
      messagesUpdated: boolean;
      presenceUpdated: boolean;
      connectionUpdated: boolean;
      groupsParticipantsUpdated: boolean;
    };
    createdAt: string;
    updatedAt: string;
  };
}
