import { useEffect, useRef } from "react";
import { Client } from '@stomp/stompjs';
import { SOCKET_API_URL } from "../utils/constans";

export function useReservasSocket(setReservas) {
  const clientRef = useRef(null);

  useEffect(() => {
    const client = new Client({
      brokerURL: `ws://${SOCKET_API_URL}/ws`,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      
      onConnect: () => {
        console.log('✅ WebSocket conectado');
        
        client.subscribe('/topic/reservas', (message) => {
          try {
            if (!message.body) return;
            
            const data = JSON.parse(message.body);
            
            if (!data || !data.id) {
              console.warn('⚠️ Mensaje sin ID:', data);
              return;
            }

            setReservas(prev => {
              const arr = Array.isArray(prev) ? prev : [];
              const idx = arr.findIndex(r => r.id === data.id);
              
              if (idx === -1) {
                return [data, ...arr];
              }
              
              const arrNew = [...arr];
              arrNew[idx] = { ...arr[idx], ...data };
              return arrNew;
            });
            
            console.log('✅ Reserva actualizada:', data.id);
          } catch (error) {
            console.error('❌ Error al parsear mensaje:', error);
          }
        });
      },
      
      onStompError: (frame) => {
        console.error('❌ Error STOMP:', frame.headers['message']);
      },
      
      onWebSocketError: (event) => {
        console.error('❌ Error WebSocket:', event);
      }
    });

    clientRef.current = client;
    client.activate();

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [setReservas]);
}
