<?php

namespace Modules\Coe\Http\Controllers\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Modules\Coe\Entities\Category;
use Modules\Coe\Entities\Event;

class CoeApiController extends Controller
{
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

    /**
     * Store a new event.
     */
    public function storeEvent(Request $request)
    {
        $request->validate([
            'title'           => 'required|string|max:255',
            'category_id'     => 'required|exists:coe_categories,id',
            'section_id'      => 'nullable|exists:sections,id',
            'start_date'      => 'required|date',
            'end_date'        => 'nullable|date|after_or_equal:start_date',
            'status'          => 'required|string|max:100',
            'description'     => 'nullable|string',
            'invited_emails'  => 'nullable|array',
            'repeat'          => 'boolean',
            'must_send_email' => 'boolean',
        ]);

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
            'repeat'          => $request->repeat ?? true,
            'must_send_email' => $request->must_send_email ?? true,
        ]);

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
            'status'          => 'required|string|max:100',
            'description'     => 'nullable|string',
            'invited_emails'  => 'nullable|array',
            'repeat'          => 'boolean',
            'must_send_email' => 'boolean',
        ]);

        $event->update([
            'category_id'     => $request->category_id,
            'section_id'      => $request->section_id,
            'title'           => $request->title,
            'status'          => $request->status,
            'description'     => $request->description,
            'invited_emails'  => $request->invited_emails,
            'start_date'      => $request->start_date,
            'end_date'        => $request->end_date,
            'repeat'          => $request->repeat ?? true,
            'must_send_email' => $request->must_send_email ?? true,
        ]);

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
}
