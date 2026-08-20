import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from './api';

// Query Keys for cache invalidation & deduplication
export const queryKeys = {
  adminAnalytics: ['analytics', 'admin'] as const,
  facultyAnalytics: (id?: string) => ['analytics', 'faculty', id] as const,
  companyAnalytics: (id?: string) => ['analytics', 'company', id] as const,
  studentAnalytics: (id?: string) => ['analytics', 'student', id] as const,
  auditLogs: (params?: any) => ['audit', params] as const,
  admins: ['admins'] as const,
  notifications: ['notifications'] as const,
  unreadCount: ['notifications', 'unread-count'] as const,
  notificationPreferences: ['notifications', 'preferences'] as const,
  internships: (filters?: any) => ['internships', filters] as const,
  internshipDetail: (id: string) => ['internship', id] as const,
  myApplications: ['applications', 'me'] as const,
  myTasks: ['tasks', 'me'] as const,
  myReports: ['reports', 'me'] as const,
};

// --- Hook 1: Admin Analytics with Caching ---
export function useAdminAnalytics() {
  return useQuery({
    queryKey: queryKeys.adminAnalytics,
    queryFn: async () => {
      const res = await api.getAdminAnalytics();
      return res.data;
    },
    staleTime: 60 * 1000, // Fresh for 1 minute
    gcTime: 5 * 60 * 1000,
  });
}

// --- Hook 2: Audit Logs with Search & Pagination Cache ---
export function useAuditLogs(params: any = {}) {
  return useQuery({
    queryKey: queryKeys.auditLogs(params),
    queryFn: async () => {
      const res = await api.getAuditLogs(params);
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}

// --- Hook 2B: Institutional Administrators List ---
export function useAdmins() {
  return useQuery({
    queryKey: queryKeys.admins,
    queryFn: async () => {
      const res = await api.getAdmins();
      return res.data?.data || res.data || [];
    },
    staleTime: 30 * 1000,
  });
}

// --- Hook 3: Notifications with Stale-While-Revalidate ---
export function useNotifications() {
  return useQuery({
    queryKey: queryKeys.notifications,
    queryFn: async () => {
      const res = await api.getMyNotifications();
      return res.data;
    },
    staleTime: 15 * 1000,
  });
}

// --- Hook 4: Live Unread Counter with Background Heartbeat ---
export function useUnreadNotificationCount() {
  return useQuery({
    queryKey: queryKeys.unreadCount,
    queryFn: async () => {
      try {
        const res = await api.getUnreadNotificationCount();
        return typeof res.data?.count === 'number' ? res.data.count : 0;
      } catch {
        return 0;
      }
    },
    staleTime: 15 * 1000,
    refetchInterval: 30 * 1000, // Background heartbeat polling every 30s
    retry: 0,
  });
}

// --- Hook 5: Optimistic Mark Notification Read Mutation ---
export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.markRead(id);
    },
    // Optimistic Update: Immediately update cache before network finishes
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications });
      await queryClient.cancelQueries({ queryKey: queryKeys.unreadCount });

      const previousNotifications = queryClient.getQueryData<any[]>(queryKeys.notifications);
      const previousCount = queryClient.getQueryData<number>(queryKeys.unreadCount);

      if (previousNotifications) {
        queryClient.setQueryData<any[]>(queryKeys.notifications, (old) =>
          old ? old.map((n) => (n.id === id ? { ...n, isRead: true } : n)) : []
        );
      }

      if (typeof previousCount === 'number') {
        queryClient.setQueryData<number>(queryKeys.unreadCount, Math.max(0, previousCount - 1));
      }

      return { previousNotifications, previousCount };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications, context.previousNotifications);
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(queryKeys.unreadCount, context.previousCount);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
    },
  });
}

// --- Hook 6: Optimistic Mark All Read Mutation ---
export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      return api.markAllRead();
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications });
      await queryClient.cancelQueries({ queryKey: queryKeys.unreadCount });

      const previousNotifications = queryClient.getQueryData<any[]>(queryKeys.notifications);
      const previousCount = queryClient.getQueryData<number>(queryKeys.unreadCount);

      if (previousNotifications) {
        queryClient.setQueryData<any[]>(queryKeys.notifications, (old) =>
          old ? old.map((n) => ({ ...n, isRead: true })) : []
        );
      }

      queryClient.setQueryData<number>(queryKeys.unreadCount, 0);

      return { previousNotifications, previousCount };
    },
    onError: (_err, _variables, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications, context.previousNotifications);
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(queryKeys.unreadCount, context.previousCount);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
    },
  });
}

// --- Hook 7: Optimistic Delete Notification Mutation ---
export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      return api.deleteNotification(id);
    },
    onMutate: async (id: string) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.notifications });
      await queryClient.cancelQueries({ queryKey: queryKeys.unreadCount });

      const previousNotifications = queryClient.getQueryData<any[]>(queryKeys.notifications);
      const previousCount = queryClient.getQueryData<number>(queryKeys.unreadCount);

      if (previousNotifications) {
        const target = previousNotifications.find((n) => n.id === id);
        queryClient.setQueryData<any[]>(queryKeys.notifications, (old) =>
          old ? old.filter((n) => n.id !== id) : []
        );

        if (target && !target.isRead && typeof previousCount === 'number') {
          queryClient.setQueryData<number>(queryKeys.unreadCount, Math.max(0, previousCount - 1));
        }
      }

      return { previousNotifications, previousCount };
    },
    onError: (_err, _id, context) => {
      if (context?.previousNotifications) {
        queryClient.setQueryData(queryKeys.notifications, context.previousNotifications);
      }
      if (context?.previousCount !== undefined) {
        queryClient.setQueryData(queryKeys.unreadCount, context.previousCount);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications });
      queryClient.invalidateQueries({ queryKey: queryKeys.unreadCount });
    },
  });
}
