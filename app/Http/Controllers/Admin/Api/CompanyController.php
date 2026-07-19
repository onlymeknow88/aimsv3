<?php

namespace App\Http\Controllers\Admin\Api;

use App\Helpers\ResponseFormatter;
use App\Http\Controllers\Controller;
use App\Models\Company;
use Illuminate\Http\Request;

class CompanyController extends Controller
{
    /**
     * API: List companies (paginated, searchable).
     */
    public function index(Request $request)
    {
        try {
            $limit  = $request->query('limit', 10);
            $search = $request->query('search', '');

            $query = Company::with(['manager', 'parentCompany']);

            if (!empty($search)) {
                $query->where(function ($q) use ($search) {
                    $q->where('company_name', 'like', "%{$search}%")
                      ->orWhere('document_code', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%")
                      ->orWhere('type', 'like', "%{$search}%");
                });
            }

            $companies = $query->orderBy('company_name')->paginate($limit);

            return ResponseFormatter::success($companies, 'Companies retrieved successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error retrieving companies: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Create a new company.
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'company_name'      => 'required|string|max:255|unique:companies,company_name',
                'document_code'     => 'nullable|string|max:255|unique:companies,document_code',
                'address'           => 'nullable|string',
                'email'             => 'nullable|email|max:255',
                'phone_number'      => 'nullable|string|max:50',
                'type'              => 'nullable|string|max:100',
                'parent_company_id' => 'nullable|exists:companies,id',
                'user_id'           => 'nullable|exists:users,id',
            ]);

            $company = Company::create($validated);

            return ResponseFormatter::success($company, 'Company created successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error creating company: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Update an existing company.
     */
    public function update(Request $request, $id)
    {
        try {
            $company = Company::findOrFail($id);

            $validated = $request->validate([
                'company_name'      => 'required|string|max:255|unique:companies,company_name,' . $id,
                'document_code'     => 'nullable|string|max:255|unique:companies,document_code,' . $id,
                'address'           => 'nullable|string',
                'email'             => 'nullable|email|max:255',
                'phone_number'      => 'nullable|string|max:50',
                'type'              => 'nullable|string|max:100',
                'parent_company_id' => 'nullable|exists:companies,id',
                'user_id'           => 'nullable|exists:users,id',
            ]);

            $company->update($validated);

            return ResponseFormatter::success($company, 'Company updated successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error updating company: ' . $e->getMessage(), 500);
        }
    }

    /**
     * API: Delete a company.
     */
    public function destroy($id)
    {
        try {
            $company = Company::findOrFail($id);
            $company->delete();

            return ResponseFormatter::success(null, 'Company deleted successfully');
        } catch (\Exception $e) {
            return ResponseFormatter::error('Error deleting company: ' . $e->getMessage(), 500);
        }
    }
}
