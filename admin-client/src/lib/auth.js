export const hasSession = (session) => Boolean(session?.userId)

export const isAdminSession = (session) => session?.role === 'ADMIN'
