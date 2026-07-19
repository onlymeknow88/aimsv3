<?php

namespace Modules\DocumentSystem\Http\Controllers;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\DocumentSystem\Entities\JsaDocument;
use Modules\DocumentSystem\Entities\JsaDocumentActivity;
use Modules\DocumentSystem\Entities\JsaDocumentPeople;

class JsaController extends Controller
{
    /**
     * JSA Documents listing page.
     */
    public function index()
    {
        return inertia('DocumentSystem/Jsa/Index', [
            'documents' => []
        ]);
    }

    /**
     * Create JSA page.
     */
    public function create()
    {
        return inertia('DocumentSystem/Jsa/Create');
    }

    /**
     * Edit JSA page.
     */
    public function edit($id)
    {
        $document = JsaDocument::with(['user', 'parent', 'attachments', 'people'])->findOrFail($id);

        if ((string)$document->status === JsaDocument::ACTIVE && !$document->is_obsolate) {
            $currentRevision = $document->revision ?? 0;
            
            $newDoc = $document->replicate();
            $newDoc->doc_created = now();
            $newDoc->status = JsaDocument::DRAFT; // 1
            $newDoc->parent_document = $document->id;
            $newDoc->revision = (int) $currentRevision + 1;
            $newDoc->is_obsolate = false;
            
            if ($newDoc->save()) {
                // Replicate people
                $people = \DB::table('jsa_document_people')
                    ->where('document_id', $document->id)
                    ->get();
                foreach ($people as $person) {
                    \DB::table('jsa_document_people')->insert([
                        'id' => \Illuminate\Support\Str::uuid()->toString(),
                        'document_id' => $newDoc->id,
                        'user_id' => $person->user_id,
                        'email' => $person->email,
                        'type' => $person->type,
                        'is_notify_email' => $person->is_notify_email,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
                
                // Replicate attachments
                $attachments = \Modules\DocumentSystem\Entities\JsaDocumentAttachment::where('jsa_document_id', $document->id)->get();
                foreach ($attachments as $attachment) {
                    $newAtt = $attachment->replicate();
                    $newAtt->jsa_document_id = $newDoc->id;
                    $newAtt->save();
                }
                
                // Mark the old active document as obsolete
                $document->update([
                    'is_obsolate' => true,
                ]);
                
                return redirect()->route('doc.jsa.edit', $newDoc->id);
            }
        }

        return inertia('DocumentSystem/Jsa/Create', [
            'document' => $document
        ]);
    }

    /**
     * Obsolete JSA page.
     */
    public function obsolete()
    {
        return inertia('DocumentSystem/Jsa/Index', [
            'documents' => [],
            'isObsolete' => true
        ]);
    }

    /**
     * Draft JSA page.
     */
    public function draft()
    {
        return inertia('DocumentSystem/Jsa/Index', [
            'documents' => [],
            'isDraft' => true
        ]);
    }

    /**
     * View JSA document detail page.
     */
    public function detail($id)
    {
        return inertia('DocumentSystem/Jsa/Detail', [
            'id' => $id
        ]);
    }
}

