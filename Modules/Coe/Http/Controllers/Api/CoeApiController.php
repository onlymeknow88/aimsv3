<?php

namespace Modules\Coe\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Coe\Entities\Category;
use Modules\Coe\Entities\Event;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use App\Traits\SendsEmail;

class CoeApiController extends Controller
{
    use SendsEmail;

    /**
     * Get categories list with pagination and search.
     */
    public function getCategories(Request $request)
    {
        $search = $request->query('search');
        $query = Category::query()->orderBy('name', 'asc');

        if (!empty($search)) {
            $query->where('name', 'like', "%{$search}%");
        }

        if ($request->has('page') || $request->has('limit')) {
            $limit = $request->query('limit', 10);
            $categories = $query->paginate($limit);
        } else {
            $categories = $query->get();
        }

        return ResponseFormatter::success($categories, 'Categories retrieved successfully');
    }

    /**
     * Store a new category.
     */
    public function storeCategory(Request $request)
    {
        $request->validate([
            'name'  => 'required|string|max:255',
            'color' => 'required|string|max:7', // hex string e.g. #FF0000
        ]);

        $category = Category::create([
            'name'  => $request->name,
            'color' => $request->color,
        ]);

        return ResponseFormatter::success($category, 'Category created successfully');
    }

    /**
     * Update an existing category.
     */
    public function updateCategory(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $request->validate([
            'name'  => 'required|string|max:255',
            'color' => 'required|string|max:7',
        ]);

        $category->update([
            'name'  => $request->name,
            'color' => $request->color,
        ]);

        return ResponseFormatter::success($category, 'Category updated successfully');
    }

    /**
     * Delete a category.
     */
    public function deleteCategory($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return ResponseFormatter::success(null, 'Category deleted successfully');
    }

    /**
     * Get all events with optional filters (supports pagination).
     */
    public function getEvents(Request $request)
    {
        $query = Event::with(['category', 'section']);

        if ($request->has('category_id') && !empty($request->category_id)) {
            $query->where('category_id', $request->category_id);
        }

        if ($request->has('search') && !empty($request->search)) {
            $query->where('title', 'like', "%{$request->search}%");
        }

        $query->orderBy('start_date', 'desc');

        if ($request->has('page') || $request->has('limit')) {
            $limit = $request->query('limit', 10);
            $events = $query->paginate($limit);
        } else {
            $events = $query->get();
        }

        return ResponseFormatter::success($events, 'Events retrieved successfully');
    }

    public function storeEvent(Request $request)
    {
        $request->validate([
            'title'           => 'required|string|max:255',
            'category_id'     => 'required|exists:coe_categories,id',
            'section_id'      => 'nullable|exists:sections,id',
            'start_date'      => 'required|date',
            'end_date'        => 'nullable|date|after_or_equal:start_date',
            'frequency'       => 'nullable|string|max:100',
            'status'          => 'required|string|max:100',
            'description'     => 'nullable|string',
            'invited_emails'  => 'nullable|array',
            'repeat'          => 'boolean',
            'must_send_email' => 'boolean',
            'file'            => 'nullable|file|max:10240', // Max 10MB
        ]);

        $attachment = null;
        $blobUrl = null;
        $blobRespon = null;

        $uploadResult = $this->handleFileUpload($request);
        if ($uploadResult) {
            $attachment = $uploadResult['fileBlobPathName'];
            $blobUrl = $uploadResult['fileBlobUrl'];
            $blobRespon = json_encode($uploadResult['blobResponse']);
        }

        $event = Event::create([
            'user_id'         => $request->user()?->id,
            'category_id'     => $request->category_id,
            'section_id'      => $request->section_id,
            'title'           => $request->title,
            'status'          => $request->status,
            'description'     => $request->description,
            'invited_emails'  => $request->invited_emails,
            'start_date'      => $request->start_date,
            'end_date'        => $request->end_date,
            'frequency'       => $request->frequency,
            'repeat'          => $request->has('repeat') ? filter_var($request->repeat, FILTER_VALIDATE_BOOLEAN) : true,
            'must_send_email' => $request->has('must_send_email') ? filter_var($request->must_send_email, FILTER_VALIDATE_BOOLEAN) : true,
            'attachment'      => $attachment,
            'blob_url'        => $blobUrl,
            'blob_respon'     => $blobRespon,
        ]);

        $this->sendInvitationEmail($event);

        return ResponseFormatter::success($event, 'Event created successfully');
    }

    /**
     * Update an existing event.
     */
    public function updateEvent(Request $request, $id)
    {
        $event = Event::findOrFail($id);

        $request->validate([
            'title'           => 'required|string|max:255',
            'category_id'     => 'required|exists:coe_categories,id',
            'section_id'      => 'nullable|exists:sections,id',
            'start_date'      => 'required|date',
            'end_date'        => 'nullable|date|after_or_equal:start_date',
            'frequency'       => 'nullable|string|max:100',
            'status'          => 'required|string|max:100',
            'description'     => 'nullable|string',
            'invited_emails'  => 'nullable|array',
            'repeat'          => 'boolean',
            'must_send_email' => 'boolean',
            'file'            => 'nullable|file|max:10240', // Max 10MB
        ]);

        $attachment = $event->attachment;
        $blobUrl = $event->blob_url;
        $blobRespon = $event->blob_respon;

        $uploadResult = $this->handleFileUpload($request);
        if ($uploadResult) {
            $attachment = $uploadResult['fileBlobPathName'];
            $blobUrl = $uploadResult['fileBlobUrl'];
            $blobRespon = json_encode($uploadResult['blobResponse']);
        }

        $event->update([
            'category_id'     => $request->category_id,
            'section_id'      => $request->section_id,
            'title'           => $request->title,
            'status'          => $request->status,
            'description'     => $request->description,
            'invited_emails'  => $request->invited_emails,
            'start_date'      => $request->start_date,
            'end_date'        => $request->end_date,
            'frequency'       => $request->frequency,
            'repeat'          => $request->has('repeat') ? filter_var($request->repeat, FILTER_VALIDATE_BOOLEAN) : true,
            'must_send_email' => $request->has('must_send_email') ? filter_var($request->must_send_email, FILTER_VALIDATE_BOOLEAN) : true,
            'attachment'      => $attachment,
            'blob_url'        => $blobUrl,
            'blob_respon'     => $blobRespon,
        ]);

        $this->sendInvitationEmail($event);

        return ResponseFormatter::success($event, 'Event updated successfully');
    }

    /**
     * Delete an event.
     */
    public function deleteEvent($id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return ResponseFormatter::success(null, 'Event deleted successfully');
    }

    /**
     * Get sections list.
     */
    public function getSections()
    {
        $sections = \App\Models\Section::select('id', 'name')->orderBy('name', 'asc')->get();
        return ResponseFormatter::success($sections, 'Sections retrieved successfully');
    }

    /**
     * Get dashboard statistics.
     */
    public function getDashboardStats()
    {
        $totalEvents = Event::count();
        $completedEvents = Event::where('status', 'Completed')->count();
        $upcomingEvents = Event::where('status', 'Scheduled')->count();
        $cancelledEvents = Event::where('status', 'Cancelled')->count();

        // Chart 1: Events by Category
        $categoriesData = Event::select('category_id', \DB::raw('count(*) as count'))
            ->groupBy('category_id')
            ->with('category:id,name')
            ->get();

        $chart1Labels = [];
        $chart1Data = [];
        foreach ($categoriesData as $data) {
            $chart1Labels[] = $data->category->name ?? 'Unknown';
            $chart1Data[] = $data->count;
        }

        // Chart 3: Events by Status
        $statusCounts = Event::select('status', \DB::raw('count(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status')
            ->all();

        $chart3Labels = array_keys($statusCounts);
        $chart3Data = array_values($statusCounts);

        return ResponseFormatter::success([
            'kpis' => [
                'total' => $totalEvents,
                'completed' => $completedEvents,
                'upcoming' => $upcomingEvents,
                'cancelled' => $cancelledEvents,
            ],
            'chart1' => [
                'labels' => $chart1Labels,
                'data' => $chart1Data,
            ],
            'chart3' => [
                'labels' => $chart3Labels,
                'data' => $chart3Data,
            ]
        ], 'Dashboard statistics retrieved successfully');
    }

    /**
     * Send event invitation email.
     */
    private function sendInvitationEmail($event)
    {
        // Explicitly check must_send_email as boolean
        $mustSend = filter_var($event->must_send_email, FILTER_VALIDATE_BOOLEAN);
        
        if ($mustSend && !empty($event->invited_emails)) {
            // Filter out empty values
            $emailsArray = is_array($event->invited_emails) ? $event->invited_emails : explode(',', $event->invited_emails);
            $filteredEmails = array_filter(array_map('trim', $emailsArray));

            if (empty($filteredEmails)) {
                return;
            }

            $emails = implode(',', $filteredEmails);
            
            $attachments = [];
            $tempPath = null;
            
            if ($event->attachment) {
                $sas = GetBlobSasUri('aims-cntr', $event->attachment);
                $url = is_array($sas)
                    ? ($sas['blobUriSas'] ?? $sas['sasUri'] ?? $sas['url'] ?? $sas['blobUri'] ?? null)
                    : $sas;
                    
                if ($url) {
                    try {
                        $client = new \GuzzleHttp\Client(['verify' => config('app.env') === 'production']);
                        $contents = $client->get($url)->getBody()->getContents();
                        
                        $tempPath = tempnam(sys_get_temp_dir(), 'coe_');
                        file_put_contents($tempPath, $contents);
                        
                        $attachments[] = [
                            'name' => basename($event->attachment),
                            'path' => $tempPath,
                        ];
                    } catch (\Throwable $e) {
                        Log::error('Failed to download attachment from blob for event email: ' . $e->getMessage());
                    }
                }
            }

            $this->sendEmailWithTemplate(
                'coe::emails.event_invitation',
                ['event' => $event],
                $emails,
                'Undangan Acara AIMS: ' . $event->title,
                null,
                null,
                $attachments,
                4
            );

            // Clean up temporary file
            if ($tempPath && file_exists($tempPath)) {
                @unlink($tempPath);
            }
        }
    }

    /**
     * Upload file attachment to Azure Blob Storage.
     */
    private function handleFileUpload(Request $request)
    {
        if ($request->hasFile('file')) {
            $uploadedFile = $request->file('file');
            $filetype = $uploadedFile->getClientOriginalExtension();
            $file_name_clean = "" . Str::slug($request->title) . "-" . Str::slug(now()->toDateTimeString()) . ".$filetype";
            
            // Temp local path
            $tempPath = $uploadedFile->storeAs('tmp/coe_attachment', $file_name_clean, ['disk' => 'local']);
            $filePathTemp = storage_path('app/' . $tempPath);
            
            // Upload to Azure blob
            $blobResult = uploadToBlobStorage($file_name_clean, $filePathTemp, 'coe_attachment');
            
            // Delete temp file
            if (File::exists($filePathTemp)) {
                File::delete($filePathTemp);
            }
            
            return $blobResult;
        }

        return null;
    }
}
