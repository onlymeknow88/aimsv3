import React from 'react';

import ProductionMtdWidget from './ProductionMtdWidget';
import ProductionYtdWidget from './ProductionYtdWidget';
import useProductionWidget from './Hooks/useProductionWidget';

/**
 * Wrapper Production MTD + YTD agar keduanya berbagi SATU fetch data
 * dari endpoint yang sama (menghindari request ganda identik).
 */
export default function ProductionWidgets({ filters = {}, showMtd = true, showYtd = true }) {
    const production = useProductionWidget(filters);

    return (
        <>
            {showMtd && <ProductionMtdWidget production={production} />}
            {showYtd && <ProductionYtdWidget production={production} />}
        </>
    );
}
