<?php

use App\Http\Controllers\ForumController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Redirecionar homepage para o fórum
Route::get('/', [ForumController::class, 'index'])->name('home');

// Rotas do fórum
Route::get('/forum', [ForumController::class, 'index'])->name('forum.index');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
