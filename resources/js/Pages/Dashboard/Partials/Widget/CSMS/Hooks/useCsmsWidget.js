import useWidgetStats from '../../../../Hooks/useWidgetStats';

/**
 * useCsmsWidget
 *
 * Fetch summary stats CSMS untuk widget di main dashboard.
 * Endpoint: /api/csms/main-dashboard-stats
 *
 * Delegasi ke useWidgetStats (param kanonik years/months + abort support).
 *
 * @param {Object} filters - { years, months } dari global dashboard filter
 * @returns {{ stats, loading, error, refetch }}
 */
export default function useCsmsWidget(filters = {}) {
    return useWidgetStats('/api/csms/main-dashboard-stats', filters);
}
