import { Heart } from 'lucide-react';
import React from 'react';

import PerformanceWidget from './PerformanceWidget';

export default function HealthPerformanceWidget({ filters = {} }) {
    return (
        <PerformanceWidget
            title="Health Performance"
            icon={Heart}
            accentColor="#a855f7"
            endpoint="/api/dashboard/health-performance/stats"
            filters={filters}
        />
    );
}
