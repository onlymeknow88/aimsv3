import useWidgetStats from '../../../../Hooks/useWidgetStats';

/**
 * useIncidentWidget
 *
 * Fetch summary stats Incident Notification untuk widget di main dashboard.
 * Endpoint: /api/dashboard/incident-stats
 *
 * Delegasi ke useWidgetStats (param kanonik years/months + abort support).
 *
 * @param {Object} filters - { years, months } dari global dashboard filter
 * @returns {{ stats, loading, error, refetch }}
 */
export default function useIncidentWidget(filters = {}) {
    return useWidgetStats('/api/dashboard/incident-stats', filters);
}
