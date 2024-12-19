<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use App\Models\InitialPayment;

class PurchasesController extends Controller
{
    public function getUserPurchases($id)
    {
        // Check if the user ID exists
        $userId = $id;

        if (!$userId) {
            return response()->json([
                'status' => 'error',
                'message' => 'User ID is required.',
            ], 400);
        }

        // Fetch purchases based on the user ID or target_user_id
        $purchases = InitialPayment::with([
                'request.post.images', // Include related images via post
                'request.user' // Include related user
            ])
            ->where(function ($query) use ($userId) {
                $query->where('user_id', $userId) // Purchases made by the user
                      ->orWhereHas('request', function ($subQuery) use ($userId) {
                          $subQuery->where('target_user_id', $userId); // Purchases made for the user
                      });
            })
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $purchases,
        ], 200);
    }
}
