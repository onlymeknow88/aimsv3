<?php

namespace Modules\Pica\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class PicaController extends Controller
{
    public function dashboard()
    {
        return Inertia::render('Pica/Dashboard/Index');
    }

    public function activeDocument()
    {
        return Inertia::render('Pica/ActiveDocument/Index');
    }

    public function create()
    {
        return Inertia::render('Pica/ActiveDocument/Create');
    }

    public function edit(string $id)
    {
        return Inertia::render('Pica/ActiveDocument/Edit', ['id' => $id]);
    }

    public function detail(string $id)
    {
        return Inertia::render('Pica/ActiveDocument/Detail', ['id' => $id]);
    }

    public function draft()
    {
        return Inertia::render('Pica/Draft/Index');
    }

    public function returnDocument()
    {
        return Inertia::render('Pica/ReturnDocument/Index');
    }

    public function reviewCrs()
    {
        return Inertia::render('Pica/ReviewCrs/Index');
    }

    public function reviewCrsDetail(string $id)
    {
        return Inertia::render('Pica/ReviewCrs/Detail', ['id' => $id]);
    }
}
