<?php

namespace Modules\DocumentSystem\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreJsaRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'     => 'required|string|max:255',
            'work_type' => 'required|string',
            'location'  => 'required|string',
            'start_date'=> 'nullable|date',
            'end_date'  => 'nullable|date|after_or_equal:start_date',
            'people'    => 'nullable|array',
            'people.*.email' => 'email',
            'people.*.role'  => 'string',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'     => 'Judul JSA wajib diisi.',
            'work_type.required' => 'Jenis pekerjaan wajib diisi.',
            'location.required'  => 'Lokasi kerja wajib diisi.',
        ];
    }
}
