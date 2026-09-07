import useWidgetStats from '../../../../Hooks/useWidgetStats';

/**
 * useProductionWidget
 * Fetch production stats untuk widget main dashboard.
 * Endpoint: /api/dashboard/production/stats
 *
 * Delegasi ke useWidgetStats (param kanonik years/months + abort support).
 */
export default function useProductionWidget(filters = {}) {
    return useWidgetStats('/api/dashboard/production/stats', filters);
}
