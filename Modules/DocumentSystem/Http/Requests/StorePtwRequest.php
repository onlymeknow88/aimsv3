<?php

namespace Modules\DocumentSystem\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StorePtwRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'       => 'required|string|max:255',
            'permit_type' => 'required|string|in:Hot Work,Working at Height,Confined Space,Electrical,General',
            'location'    => 'required|string',
            'start_date'  => 'required|date',
            'end_date'    => 'required|date|after_or_equal:start_date',
            'people'      => 'nullable|array',
            'people.*.email' => 'email',
            'people.*.role'  => 'string',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'       => 'Judul PTW wajib diisi.',
            'permit_type.required' => 'Jenis izin kerja wajib dipilih.',
            'location.required'    => 'Lokasi kerja wajib diisi.',
            'start_date.required'  => 'Tanggal mulai wajib diisi.',
            'end_date.required'    => 'Tanggal selesai wajib diisi.',
            'permit_type.in'       => 'Jenis izin harus salah satu: Hot Work, Working at Height, Confined Space, Electrical, General.',
        ];
    }
}
