<?php

namespace Modules\DocumentSystem\Http\Controllers;

use App\Http\Controllers\Controller;
use Modules\DocumentSystem\Entities\PtwDocument;

class PtwController extends Controller
{
    /**
     * PTW Documents listing page.
     */
    public function index()
    {
        return inertia('DocumentSystem/Ptw/Index', [
            'documents' => []
        ]);
    }

    /**
     * Create PTW page.
     */
    public function create()
    {
        return inertia('DocumentSystem/Ptw/Create');
    }

    /**
     * Edit PTW page.
     */
    public function edit($id)
    {
        $document = PtwDocument::with(['user', 'attachments', 'peoples'])->findOrFail($id);

        if ((string)$document->status === '5') {
            $newDoc = $document->replicate();
            $newDoc->doc_created = now();
            $newDoc->status = '1'; // Draft
            
            if ($newDoc->save()) {
                // Replicate people
                $peoples = \DB::table('ptw_document_peoples')
                    ->where('ptw_document_id', $document->id)
                    ->get();
                foreach ($peoples as $person) {
                    \DB::table('ptw_document_peoples')->insert([
                        'id' => \Illuminate\Support\Str::uuid()->toString(),
                        'ptw_document_id' => $newDoc->id,
                        'user_id' => $person->user_id,
                        'email' => $person->email,
                        'status' => $person->status,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
                
                // Replicate attachments
                $attachments = \Modules\DocumentSystem\Entities\PtwDocumentAttachment::where('ptw_document_id', $document->id)->get();
                foreach ($attachments as $attachment) {
                    $newAtt = $attachment->replicate();
                    $newAtt->ptw_document_id = $newDoc->id;
                    $newAtt->save();
                }
                
                return redirect()->route('doc.ptw.edit', $newDoc->id);
            }
        }

        return inertia('DocumentSystem/Ptw/Create', [
            'document' => $document
        ]);
    }

    /**
     * View PTW document detail page.
     */
    public function detail($id)
    {
        return inertia('DocumentSystem/Ptw/Detail', [
            'id' => $id
        ]);
    }
}

