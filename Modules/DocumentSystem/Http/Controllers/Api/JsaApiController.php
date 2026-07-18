<?php

namespace Modules\DocumentSystem\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\DocumentSystem\Entities\JsaDocument;
use Modules\DocumentSystem\Entities\JsaDocumentActivity;
use Modules\DocumentSystem\Entities\JsaDocumentPeople;
use Modules\DocumentSystem\Entities\JsaDocumentAttachment;
use Modules\DocumentSystem\Services\DocumentSystemService;

class JsaApiController extends Controller
{
    /**
     * List all JSA documents
     */
    public function index(Request $request)
    {
        $isObsolete = $request->boolean('is_obsolete', false);
        $isDraft = $request->boolean('is_draft', false);

        $query = JsaDocument::with(['activities', 'people', 'attachments'])
            ->where('is_obsolate', $isObsolete);

        if ($isDraft) {
            $query->where('status', '1'); // 1 = Draft
        } else {
            $query->where('status', '5'); // 5 = Active
        }

        $documents = $query->latest()->get();

        return ResponseFormatter::success($documents, 'JSA documents retrieved successfully');
    }

    /**
     * Store new JSA document
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'work_type'   => 'required|string',
            'location'    => 'required|string',
        ]);

        $user = auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userId = $user ? $user->id : null;

        $doc = JsaDocument::create([
            'title'         => $request->title,
            'description'   => $request->description,
            'doc_created'   => $request->doc_created ? date('Y-m-d H:i:s', strtotime($request->doc_created)) : now(),
            'department_id' => $request->department_id,
            'status'        => $request->status ?? '1', // 1 = Draft
            'user_id'       => $userId,
            'created_by'    => $userId,
        ]);

        if ($request->hasFile('files')) {
            $service = app(DocumentSystemService::class);
            foreach ($request->file('files') as $file) {
                $uploadResult = $service->uploadAttachment($file, 'jsa');
                if ($uploadResult) {
                    JsaDocumentAttachment::create([
                        'jsa_document_id' => $doc->id,
                        'file_path'       => $uploadResult['fileBlobPathName'],
                        'blob_url'        => $uploadResult['fileBlobUrl'],
                        'blob_respon'     => json_encode($uploadResult['blobResponse']),
                    ]);
                }
            }
        }

        return ResponseFormatter::success($doc, 'JSA berhasil dibuat.');
    }

    /**
     * Update JSA document
     */
    public function update(Request $request, string $id)
    {
        $doc = JsaDocument::findOrFail($id);

        $user = $request->user() ?? auth()->user() ?? auth('admin')->user() ?? auth('web')->user();
        $userId = $user ? $user->id : null;

        $doc->update([
            'title'         => $request->title ?? $doc->title,
            'description'   => $request->description ?? $doc->description,
            'doc_created'   => $request->doc_created ? date('Y-m-d H:i:s', strtotime($request->doc_created)) : $doc->doc_created,
            'department_id' => $request->department_id ?? $doc->department_id,
            'status'        => $request->status ?? $doc->status,
            'user_id'       => $doc->user_id ?? $userId,
            'created_by'    => $doc->created_by ?? $userId,
        ]);

        if ($request->hasFile('files')) {
            $service = app(DocumentSystemService::class);
            foreach ($request->file('files') as $file) {
                $uploadResult = $service->uploadAttachment($file, 'jsa');
                if ($uploadResult) {
                    JsaDocumentAttachment::create([
                        'jsa_document_id' => $doc->id,
                        'file_path'       => $uploadResult['fileBlobPathName'],
                        'blob_url'        => $uploadResult['fileBlobUrl'],
                        'blob_respon'     => json_encode($uploadResult['blobResponse']),
                    ]);
                }
            }
        }

        return ResponseFormatter::success($doc, 'JSA berhasil diperbarui.');
    }

    /**
     * Delete JSA document
     */
    public function destroy(string $id)
    {
        $doc = JsaDocument::findOrFail($id);
        
        // Also delete related attachments records
        JsaDocumentAttachment::where('jsa_document_id', $doc->id)->delete();
        
        $doc->delete();

        return ResponseFormatter::success(null, 'JSA berhasil dihapus.');
    }

    /**
     * Delete JSA attachment
     */
    public function deleteAttachment(string $id)
    {
        $attachment = JsaDocumentAttachment::findOrFail($id);
        $attachment->delete();

        return ResponseFormatter::success(null, 'Lampiran JSA berhasil dihapus.');
    }
}
