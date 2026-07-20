<?php

namespace Modules\DashboardPortal\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\DashboardPortal\app\Models\Banner;

class BannerController extends Controller
{
     /**
     * Display a listing of the resource.
     */
    public function getBanner(Request $request)
    {
        $search = $request->query('search');
        $query = Banner::query()->orderBy('created_at', 'desc');

        if ($search) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->has('page') || $request->has('limit')) {
            $limit = $request->query('limit', 10);
            $banners = $query->paginate($limit);

            $banners->getCollection()->transform(function ($banner) {
                if ($banner->url) {
                    $sas = GetBlobSasUri('aims-cntr', $banner->url);
                    $banner->blob_url = is_array($sas) ? ($sas['blobUriSas'] ?? $banner->blob_url) : ($sas ?: $banner->blob_url);
                }
                return $banner;
            });
        } else {
            $banners = $query->get()->map(function ($banner) {
                if ($banner->url) {
                    $sas = GetBlobSasUri('aims-cntr', $banner->url);
                    $banner->blob_url = is_array($sas) ? ($sas['blobUriSas'] ?? $banner->blob_url) : ($sas ?: $banner->blob_url);
                }
                return $banner;
            });
        }

        // Return the data as a JSON response
        return ResponseFormatter::success($banners, 'Banner data retrieved successfully');
    }

    public function storeBanner(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'visible' => 'required|string',
            'description' => 'nullable|string',
            'file' => 'required|file|mimes:jpeg,jpg,png,gif|max:50000', // Max 50MB
        ]);

        if (!$request->hasFile('file')) {
            return ResponseFormatter::error(null, 'File gambar wajib diunggah.', 400);
        }

        $file = $request->file('file');
        $fileName = time() . '_' . $file->getClientOriginalName();

        // Upload to Azure Blob Storage via helper
        $uploadResult = uploadToBlobStorage($fileName, $file->getRealPath(), 'slideshow');

        if (!$uploadResult || empty($uploadResult['fileBlobPathName'])) {
            return ResponseFormatter::error(null, 'Gagal mengunggah gambar ke Blob Storage.', 500);
        }

        $banner = Banner::create([
            'user_id' => auth()->id(),
            'name' => $request->name,
            'description' => $request->description,
            'visible' => $request->visible,
            'attc' => $file->getClientOriginalName(),
            'url' => $uploadResult['fileBlobPathName'],
            'blob_url' => $uploadResult['fileBlobUrl'],
            'blob_response' => $uploadResult['blobResponse'],
        ]);

        return ResponseFormatter::success($banner, 'Banner created successfully');
    }

    public function updateBanner(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'visible' => 'required|string',
            'description' => 'nullable|string',
            'file' => 'nullable|file|mimes:jpeg,jpg,png,gif|max:50000', // Max 50MB
        ]);

        $banner = Banner::findOrFail($id);

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
                return ResponseFormatter::error(null, 'Gagal mengunggah gambar ke Blob Storage.', 500);
            }
        }

        $banner->update($data);

        return ResponseFormatter::success($banner, 'Banner updated successfully');
    }

    public function deleteBanner($id)
    {
        $banner = Banner::findOrFail($id);
        $banner->delete();

        return ResponseFormatter::success(null, 'Banner deleted successfully');
    }

}
