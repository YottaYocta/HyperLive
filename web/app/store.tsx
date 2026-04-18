"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface StoreValue {
  messages: Message[];
  addMessage: (msg: Message) => void;
  selectedTable: string | null;
  setSelectedTable: (table: string | null) => void;
}

const Store = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);
  return (
    <Store.Provider value={{ messages, addMessage: (msg) => setMessages((prev) => [...prev, msg]), selectedTable, setSelectedTable }}>
      {children}
    </Store.Provider>
  );
}

export function useStore() {
  const ctx = useContext(Store);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
