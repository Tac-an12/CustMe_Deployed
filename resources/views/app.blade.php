<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @if (app()->environment('production'))
        <!-- Use the static compiled CSS from build/ in production -->
        <link rel="stylesheet" href="{{ asset('build/assets/app-BW39WIU0.css') }}">
    @else
        <!-- Vite CSS in development -->
        @vite('resources/css/app.css')
    @endif
</head>

<body>
    <div id="root"></div>

    @if (app()->environment('production'))
        <!-- Use the static compiled JS from build/ in production -->
        <script src="{{ asset('build/assets/app-BHKo-1Ow.js') }}"></script>
    @else
        <!-- Vite JS in development -->
        @viteReactRefresh
        @vite('resources/js/app.ts')
    @endif
</body>

<script>
    window.env = {
        API_BASE_URL: '{{ env("API_BASE_URL") }}'
    }
</script>

</html>
