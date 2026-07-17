<?php

namespace Modules\DocumentSystem\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Modules\DocumentSystem\Entities\Document;
use Illuminate\Support\Facades\DB;

class ApprovalController extends Controller
{
    /**
     * List documents pending approval for the authenticated user
     */
    public function index(Request $request)
    {
        $documents = Document::whereIn('status', ['2', '3']) // Ongoing & Needs Approval
            ->with(['activity', 'invitedPeople'])
            ->latest()
            ->get();

        return Inertia::render('DocumentSystem/Approval/Index', [
            'documents' => $documents,
        ]);
    }

    /**
     * Approve a document (Level 1 CRS or Level 2 PJA)
     */
    public function approve(Request $request, string $id)
    {
        $request->validate([
            'level' => 'required|in:1,2',
            'notes' => 'nullable|string',
        ]);

        $doc = Document::findOrFail($id);

        if ($request->level == 1) {
            $doc->update(['status' => '3', 'approved_by_crs' => auth()->id(), 'approved_at_crs' => now()]);
        } else {
            $doc->update(['status' => '5', 'approved_by_pja' => auth()->id(), 'approved_at_pja' => now()]); // Active
        }

        // Log activity
        DB::table('document_system_activities')->insert([
            'id'          => \Illuminate\Support\Str::uuid(),
            'document_id' => $doc->id,
            'user_id'     => auth()->id(),
            'activity'    => "Dokumen disetujui (Level {$request->level}): {$request->notes}",
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        return back()->with('success', 'Dokumen berhasil disetujui.');
    }

    /**
     * Reject a document with reason
     */
    public function reject(Request $request, string $id)
    {
        $request->validate([
            'reason' => 'required|string',
        ]);

        $doc = Document::findOrFail($id);
        $doc->update(['status' => '1']); // Back to Draft

        DB::table('document_system_activities')->insert([
            'id'          => \Illuminate\Support\Str::uuid(),
            'document_id' => $doc->id,
            'user_id'     => auth()->id(),
            'activity'    => "Dokumen ditolak: {$request->reason}",
            'created_at'  => now(),
            'updated_at'  => now(),
        ]);

        return back()->with('success', 'Dokumen berhasil ditolak dan dikembalikan ke draft.');
    }
}

