<?php

use App\Http\Controllers\Api\TaskApiController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\PasswordResetController;

Route::get('/{path?}', function () {
    return view('app'); // Adjust this to the correct view file
})->where('path', '.*');

// api/
// Route::group(['prefix' => 'api'], function() {
//     Route::post('/task', [TaskApiController::class, 'saveTask']);
// });


