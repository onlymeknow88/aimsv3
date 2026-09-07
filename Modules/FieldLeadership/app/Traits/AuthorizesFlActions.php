<?php

namespace Modules\FieldLeadership\App\Traits;

use Illuminate\Support\Facades\DB;

/**
 * Helper otorisasi untuk modul Field Leadership.
 *
 * Peran:
 * - Maker       : pembuat dokumen (field_leaderships.created_by = users.id atau employees.id)
 * - PJA         : user pada area_managers.user_id yang ditunjuk di dokumen (pja_id/pja_id_new)
 * - CRS/Admin   : pemilik role super_admin/fls_admin pada modul field-leadership
 *                 (konsisten dengan getCrsEmails())
 */
trait AuthorizesFlActions
{
    protected function flUserIsModuleAdmin(): bool
    {
        $uid = auth()->id();
        if (!$uid) return false;

        return DB::table('aims_user_roles as ur')
            ->join('aims_roles as r', 'ur.role_id', '=', 'r.id')
            ->join('aims_modules as m', 'r.module_id', '=', 'm.id')
            ->where('m.slug', 'field-leadership')
            ->whereIn('r.slug', ['super_admin', 'fls_admin'])
            ->where('ur.user_id', $uid)
            ->exists();
    }

    /**
     * CRS memakai role yang sama dengan admin modul (lihat getCrsEmails()).
     */
    protected function flUserIsCrs(): bool
    {
        return $this->flUserIsModuleAdmin();
    }

    protected function flUserIsCreator(object $fl): bool
    {
        $uid = auth()->id();
        if (!$uid) return false;

        if ((string) $fl->created_by === (string) $uid) return true;

        $employeeId = auth()->user()?->employee_id;

        return $employeeId && (string) $fl->created_by === (string) $employeeId;
    }

    protected function flUserIsAssignedPja(object $fl): bool
    {
        $uid = auth()->id();
        if (!$uid) return false;

        $pjaId = $fl->pja_id_new ?: ($fl->pja_id ?? null);
        if (!$pjaId) return false;

        return DB::table('area_managers')
            ->where('id', $pjaId)
            ->where('user_id', $uid)
            ->exists();
    }

    /**
     * Boleh melihat/mengubah isi dokumen: maker, PJA yang ditugaskan, atau admin modul.
     */
    protected function flCanManage(object $fl): bool
    {
        return $this->flUserIsCreator($fl)
            || $this->flUserIsAssignedPja($fl)
            || $this->flUserIsModuleAdmin();
    }

    /**
     * Resolve user PJA dari area_managers (fl.pja_id merujuk ke area_managers,
     * BUKAN users). Mengembalikan null bila tidak ditemukan / tanpa email.
     */
    protected function flPjaUser(?string $pjaId): ?object
    {
        if (!$pjaId) return null;

        return DB::table('area_managers as am')
            ->join('users as u', 'am.user_id', '=', 'u.id')
            ->where('am.id', $pjaId)
            ->select('u.*')
            ->first();
    }
}
