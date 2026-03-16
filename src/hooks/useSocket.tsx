import { API_URL } from '@/services';
import { getToken } from '@/utils/auth';
import { useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

type EventCallback<T = unknown> = (data: T) => void;

export function useSocket(url: string = API_URL) {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io(url, {
        transports: ['websocket'],
        auth: {
          token: 'Bearer ' + getToken(),
        },
      });

      socketRef.current.on('connect', () => {
        console.info('Conectado ao WebSocket:', socketRef.current?.id);
      });

      socketRef.current.on('disconnect', () => {
        console.info('Desconectado do WebSocket');
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, [url]);

  const on = <T = unknown>(event: string, callback: EventCallback<T>) => {
    socketRef.current?.on(event, callback as EventCallback);
  };

  const off = <T = unknown>(event: string, callback?: EventCallback<T>) => {
    if (callback) {
      socketRef.current?.off(event, callback as EventCallback);
    } else {
      socketRef.current?.removeAllListeners(event);
    }
  };

  const emit = <T = unknown>(event: string, data: T) => {
    socketRef.current?.emit(event, data);
  };

  const isConnected = () => {
    return !!socketRef.current?.connected;
  };

  return { on, off, emit, isConnected };
}
