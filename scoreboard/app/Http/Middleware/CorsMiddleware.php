<?php

namespace App\Http\Middleware;

use Closure;

class CorsMiddleware {

    public function handle($request, Closure $next)
    {
        $response = $next($request);
        $response->header('Access-Control-Allow-Origin', '*');

        return $response;
    }
}
