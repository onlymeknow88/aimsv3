<?php

namespace Modules\DashboardPortal\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\DashboardPortal\app\Models\Slideshow;

class SlideshowController extends Controller
{
     /**
     * Display a listing of the resource.
     */
    public function getSlideShow(Request $request)
    {
        $search = $request->query('search');
        $query = Slideshow::query()->orderBy('created_at', 'desc');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->has('page') || $request->has('limit')) {
            $limit = $request->query('limit', 10);
            $slideshows = $query->paginate($limit);
            
            $slideshows->getCollection()->transform(function ($slide) {
                if ($slide->url) {
                    $sas = GetBlobSasUri('aims-cntr', $slide->url);
                    $slide->blob_url = is_array($sas) ? ($sas['blobUriSas'] ?? $slide->blob_url) : ($sas ?: $slide->blob_url);
                }
                return $slide;
            });
        } else {
            $slideshows = $query->get()->map(function ($slide) {
                if ($slide->url) {
                    $sas = GetBlobSasUri('aims-cntr', $slide->url);
                    $slide->blob_url = is_array($sas) ? ($sas['blobUriSas'] ?? $slide->blob_url) : ($sas ?: $slide->blob_url);
                }
                return $slide;
            });
        }

        // Return the data as a JSON response
        return ResponseFormatter::success($slideshows, 'Slideshow data retrieved successfully');
    }

    public function storeSlideShow(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'visible' => 'required|string',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:mp4|max:50000', // Max 50MB
        ]);

        if (!$request->hasFile('file')) {
            return ResponseFormatter::error('File video wajib diunggah.', 400);
        }

        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();

        // Upload to Azure Blob Storage via helper
        $uploadResult = uploadToBlobStorage($fileName, $file->getRealPath(), 'slideshow');

        if (!$uploadResult || empty($uploadResult['fileBlobPathName'])) {
            return ResponseFormatter::error('Gagal mengunggah video ke Blob Storage.', 500);
        }

        $slideshow = Slideshow::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'description' => $request->description,
            'visible' => $request->visible,
            'attc' => $file->getClientOriginalName(),
            'url' => $uploadResult['fileBlobPathName'],
            'blob_url' => $uploadResult['fileBlobUrl'],
            'blob_response' => $uploadResult['blobResponse'],
        ]);

        return ResponseFormatter::success($slideshow, 'Slideshow created successfully');
    }

    public function updateSlideShow(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'visible' => 'required|string',
            'description' => 'nullable|string',
            'file' => 'nullable|file|mimes:mp4|max:50000', // Max 50MB
        ]);

        $slideshow = Slideshow::findOrFail($id);
        
        $data = [
            'name' => $request->name,
            'description' => $request->description,
            'visible' => $request->visible,
        ];

        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $fileName = time() . '_' . $file->getClientOriginalName();
            
            $uploadResult = uploadToBlobStorage($fileName, $file->getRealPath(), 'slideshow');
            if ($uploadResult && !empty($uploadResult['fileBlobPathName'])) {
                $data['attc'] = $file->getClientOriginalName();
                $data['url'] = $uploadResult['fileBlobPathName'];
                $data['blob_url'] = $uploadResult['fileBlobUrl'];
                $data['blob_response'] = $uploadResult['blobResponse'];
            } else {
                return ResponseFormatter::error('Gagal mengunggah video ke Blob Storage.', 500);
            }
        }

        $slideshow->update($data);

        return ResponseFormatter::success($slideshow, 'Slideshow updated successfully');
    }

    public function deleteSlideShow($id)
    {
        $slideshow = Slideshow::findOrFail($id);
        $slideshow->delete();

        return ResponseFormatter::success(null, 'Slideshow deleted successfully');
    }
}
