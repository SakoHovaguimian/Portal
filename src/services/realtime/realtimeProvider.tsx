'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { io, type Socket } from 'socket.io-client'
import { clientContainer } from '@/clientContainer'
import { RealtimeEventSchema, RealtimeTicketSchema, type RealtimeEvent } from './models/realtimeEvent'
import type { RealtimeConfig } from './models/realtimeConfig'

type RealtimeStatus = 'connecting' | 'connected' | 'disconnected'
type RealtimeListener = (event: RealtimeEvent) => void

interface RealtimeContextValue {
  status: RealtimeStatus
  subscribe: (listener: RealtimeListener) => () => void
}

const RealtimeContext = createContext<RealtimeContextValue | null>(null)

export function RealtimeProvider({ children, config }: { children: React.ReactNode, config: RealtimeConfig }) {

  const listenersRef = useRef(new Set<RealtimeListener>())
  const socketRef = useRef<Socket | null>(null)
  const [status, setStatus] = useState<RealtimeStatus>('connecting')

  useEffect(() => {

    const socket = io(config.socket_url, {
      autoConnect: false,
      transports: ['websocket'],
      auth: config.ticket_path
        ? async (callback) => {

            try {

              const payload = await clientContainer.apiClient.request(config.ticket_path!, { method: 'POST' })
              const ticket = RealtimeTicketSchema.parse(payload)
              callback({ ticket: ticket.ticket })

            } catch {
              callback({ ticket: '' })
            }

          }
        : undefined,
    })

    socketRef.current = socket
    socket.on('connect', () => setStatus('connected'))
    socket.on('disconnect', () => setStatus('disconnected'))
    socket.on(config.event_name, (payload: unknown) => {

      const result = RealtimeEventSchema.safeParse(payload)

      if (result.success) {
        listenersRef.current.forEach((listener) => listener(result.data))
      }

    })
    socket.connect()

    return () => {
      socket.removeAllListeners()
      socket.disconnect()
      socketRef.current = null
    }

  }, [config.event_name, config.socket_url, config.ticket_path])

  const subscribe = useCallback((listener: RealtimeListener) => {

    listenersRef.current.add(listener)
    return () => listenersRef.current.delete(listener)

  }, [])

  const value = useMemo(() => ({ status, subscribe }), [status, subscribe])

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>

}

export function useRealtime(): RealtimeContextValue {

  const context = useContext(RealtimeContext)

  if (!context) {
    throw new Error('useRealtime must be used within RealtimeProvider')
  }

  return context

}
