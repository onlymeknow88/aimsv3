<?php

namespace Modules\DocumentSystem\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDocumentRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title'          => 'required|string|max:255',
            'document_level' => 'required|string|in:SOP,TS,MN,WIN,FORM',
            'department'     => 'required|string',
            'company'        => 'nullable|string',
            'description'    => 'nullable|string',
            'invited_email'  => 'nullable|email',
        ];
    }

    public function messages(): array
    {
        return [
            'title.required'          => 'Judul dokumen wajib diisi.',
            'document_level.required' => 'Level dokumen wajib dipilih.',
            'document_level.in'       => 'Level dokumen harus salah satu dari: SOP, TS, MN, WIN, FORM.',
            'department.required'     => 'Departemen wajib dipilih.',
        ];
    }
}
