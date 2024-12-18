<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <meta name="csrf-token" content="{{ csrf_token() }}">

    @if (app()->environment('production'))
        <!-- Use the static compiled CSS from build/ in production -->
        <link rel="stylesheet" href="{{ asset(mix('build/assets/app.css')) }}">
    @else
        <!-- Use Vite CSS during development -->
        @vite('resources/css/app.css')
    @endif
</head>

<body>
    <div id="root"></div>

     <!-- Dynamically load JS -->
     @if (app()->environment('production'))
        <!-- Use the static compiled JS from build/ in production -->
        <script src="{{ asset(mix('build/assets/app.js')) }}"></script>
    @else
        <!-- Use Vite JS during development -->
        @viteReactRefresh
        @vite('resources/js/app.tsx')
    @endif
</body>

<script>
    window.env = {
        API_BASE_URL: '{{ env("API_BASE_URL") }}'
    }
</script>

</html>
