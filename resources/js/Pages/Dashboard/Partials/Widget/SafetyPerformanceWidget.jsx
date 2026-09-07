import { ShieldCheck } from 'lucide-react';
import React from 'react';

import PerformanceWidget from './PerformanceWidget';

export default function SafetyPerformanceWidget({ filters = {} }) {
    return (
        <PerformanceWidget
            title="Safety Performance"
            subtitle="Safety Performance PT AMC"
            icon={ShieldCheck}
            accentColor="#2563eb"
            endpoint="/api/dashboard/safety-performance/stats"
            filters={filters}
        />
    );
}
