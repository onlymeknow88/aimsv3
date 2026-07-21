import React from 'react';
import { Loader2 } from 'lucide-react';
import useObservationForm from './Hooks/useObservationForm';
import CreateHeader           from './Partials/CreateHeader';
import SectionInfoUmum        from './Partials/SectionInfoUmum';
import SectionPenanggungJawab from './Partials/SectionPenanggungJawab';
import SectionPertanyaanPTO   from './Partials/SectionPertanyaanPTO';
import SectionAnggotaTim      from './Partials/SectionAnggotaTim';
import SectionWaktuKunjungan  from './Partials/SectionWaktuKunjungan';
import SectionKondisiPositif  from './Partials/SectionKondisiPositif';
import SectionKondisiRisiko   from './Partials/SectionKondisiRisiko';
import CreateFooter           from './Partials/CreateFooter';

const S = {
    label:   { fontSize: '12px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '6px', display: 'block' },
    input:   { width: '100%', padding: '8px 12px', border: '1px solid var(--border-color)', borderRadius: '6px', fontSize: '12px', outline: 'none', backgroundColor: '#fff', boxSizing: 'border-box' },
    title:   { fontSize: '13px', fontWeight: 700, color: 'var(--primary)', marginBottom: '14px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' },
    card:    { backgroundColor: 'var(--card-bg)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '20px', marginBottom: '20px', boxShadow: 'var(--shadow-sm)' },
};

export default function Create({ editId = null }) {
    const f = useObservationForm(editId);

    if (f.masterLoading && f.isEdit) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '10px', color: 'var(--text-secondary)', fontSize: '13px' }}>
                <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                Memuat data Field Leadership...
            </div>
        );
    }

    const shared = { labelStyle: S.label, inputStyle: S.input, cardStyle: S.card, sectionTitleStyle: S.title };

    return (
        <div style={{ padding: '24px 32px', backgroundColor: '#f8fafc', minHeight: '100vh', boxSizing: 'border-box' }}>
            <CreateHeader isEdit={f.isEdit} limitParam={f.limitParam} />

            <div style={{ maxWidth: '900px', margin: '0 auto' }}>

                <SectionInfoUmum
                    {...shared}
                    masterLoading={f.masterLoading}
                    date={f.date} setDate={f.setDate}
                    ccowId={f.ccowId} setCcowId={f.setCcowId} ccows={f.ccows}
                    companyId={f.companyId} setCompanyId={f.setCompanyId} companies={f.companies}
                    detailCompany={f.detailCompany}
                    departmentId={f.departmentId} setDepartmentId={f.setDepartmentId} departmentsList={f.departmentsList}
                    sectionId={f.sectionId} setSectionId={f.setSectionId} sectionsList={f.sectionsList}
                    areaLocationId={f.areaLocationId} setAreaLocationId={f.setAreaLocationId} areaLocationsList={f.areaLocationsList}
                    detailLocation={f.detailLocation} setDetailLocation={f.setDetailLocation}
                    errors={f.errors}
                />

                <SectionPenanggungJawab
                    {...shared}
                    pjaId={f.pjaId} setPjaId={f.setPjaId} pjaList={f.pjaList} sectionId={f.sectionId}
                    isAreaSuitable={f.isAreaSuitable} setIsAreaSuitable={f.setIsAreaSuitable}
                    type={f.type} setType={f.setType}
                    personilOnReview={f.personilOnReview} setPersonilOnReview={f.setPersonilOnReview}
                    personilOnReviewName={f.personilOnReviewName} setPersonilOnReviewName={f.setPersonilOnReviewName}
                    job={f.job} setJob={f.setJob}
                    errors={f.errors}
                />

                {f.isPTO && (
                    <SectionPertanyaanPTO
                        {...shared}
                        answers={f.answers} setAnswers={f.setAnswers}
                    />
                )}

                <SectionAnggotaTim
                    {...shared}
                    members={f.members}
                    addMember={f.addMember} removeMember={f.removeMember} updateMember={f.updateMember}
                    memberInternals={f.memberInternals} memberExternals={f.memberExternals}
                    limitMember={f.limitMember}
                />

                <SectionWaktuKunjungan
                    {...shared}
                    visitTime={f.visitTime} setVisitTime={f.setVisitTime}
                />

                {!f.isHazardReport && (
                    <SectionKondisiPositif
                        {...shared}
                        positiveConditions={f.positiveConditions}
                        addPositiveCondition={f.addPositiveCondition}
                        removePositiveCondition={f.removePositiveCondition}
                        updatePositiveCondition={f.updatePositiveCondition}
                        maxPositive={f.maxPositive}
                    />
                )}

                <SectionKondisiRisiko
                    {...shared}
                    isHazardReport={f.isHazardReport}
                    riskConditions={f.riskConditions}
                    addRiskCondition={f.addRiskCondition}
                    removeRiskCondition={f.removeRiskCondition}
                    updateRiskCondition={f.updateRiskCondition}
                    categories={f.categories}
                    typeKtaTta={f.typeKtaTta}
                    potencies={f.potencies}
                    maxRisk={f.maxRisk}
                    errors={f.errors}
                />

                <CreateFooter
                    isEdit={f.isEdit}
                    submitting={f.submitting}
                    handleSubmit={f.handleSubmit}
                />

            </div>
        </div>
    );
}
