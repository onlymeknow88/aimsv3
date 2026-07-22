<?php

namespace Modules\DashboardPortal\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Modules\DashboardPortal\app\Models\NewsAndUpdate;

class NewsAndUpdateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $search = $request->query('search');
        $query = NewsAndUpdate::with('user:id,name')->orderBy('created_at', 'desc');

        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $resolveBlobUrl = function ($item) {
            if ($item->url) {
                $sas = GetBlobSasUri('aims-cntr', $item->url);
                $item->blob_url = is_array($sas)
                    ? ($sas['blobUriSas'] ?? $item->blob_url)
                    : ($sas ?: $item->blob_url);
            }
            return $item;
        };

        if ($request->has('page') || $request->has('limit')) {
            $limit = $request->query('limit', 10);
            $data = $query->paginate($limit);
            $data->getCollection()->transform($resolveBlobUrl);
        } else {
            $data = $query->get()->map($resolveBlobUrl);
        }

        return ResponseFormatter::success($data, 'News and update data retrieved successfully');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'visible'     => 'required|string|in:true,false',
            'description' => 'nullable|string',
            'file'        => 'nullable|file|mimes:jpg,jpeg,png,gif,webp,pdf|max:10240', // Max 10MB
        ]);

        $data = [
            'id'          => (string) Str::uuid(),
            'user_id'     => auth()->id(),
            'title'       => $request->title,
            'slug'        => Str::slug($request->title) . '-' . Str::random(6),
            'visible'     => $request->visible,
            'description' => $request->description,
        ];

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();

            $uploadResult = uploadToBlobStorage($fileName, $file->getRealPath(), 'news-and-update');

            if (!$uploadResult || empty($uploadResult['fileBlobPathName'])) {
                return ResponseFormatter::error('Gagal mengunggah file ke Blob Storage.', 500);
            }

            $data['attc']          = $file->getClientOriginalName();
            $data['url']           = $uploadResult['fileBlobPathName'];
            $data['blob_url']      = $uploadResult['fileBlobUrl'];
            $data['blob_response'] = $uploadResult['blobResponse'];
        }

        $news = NewsAndUpdate::create($data);

        return ResponseFormatter::success($news, 'News and update created successfully', 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'title'       => 'required|string|max:255',
            'visible'     => 'required|string|in:true,false',
            'description' => 'nullable|string',
            'file'        => 'nullable|file|mimes:jpg,jpeg,png,gif,webp,pdf|max:10240',
        ]);

        $news = NewsAndUpdate::findOrFail($id);

        $data = [
            'user_id'     => auth()->id(),
            'title'       => $request->title,
            'slug'        => Str::slug($request->title) . '-' . Str::random(6),
            'visible'     => $request->visible,
            'description' => $request->description,
        ];

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();

            $uploadResult = uploadToBlobStorage($fileName, $file->getRealPath(), 'news-and-update');

            if (!$uploadResult || empty($uploadResult['fileBlobPathName'])) {
                return ResponseFormatter::error('Gagal mengunggah file ke Blob Storage.', 500);
            }

            $data['attc']          = $file->getClientOriginalName();
            $data['url']           = $uploadResult['fileBlobPathName'];
            $data['blob_url']      = $uploadResult['fileBlobUrl'];
            $data['blob_response'] = $uploadResult['blobResponse'];
        }

        $news->update($data);

        return ResponseFormatter::success($news, 'News and update updated successfully');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $news = NewsAndUpdate::findOrFail($id);
        $news->delete();

        return ResponseFormatter::success(null, 'News and update deleted successfully');
    }
}
