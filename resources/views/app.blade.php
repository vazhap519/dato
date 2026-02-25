<!doctype html>
<html class="dark scroll-behavior: smooth" lang="{{ str_replace('_', '-', app()->getLocale()) }}" >
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1">

    {{-- მინიმალური fallback title (თუ JS არ ჩაიტვირთა) --}}
    <title>{{ config('app.name', 'Website') }}</title>

    {{-- favicon/manifest (რეკომენდაცია) --}}

    <link rel="manifest" href="/site.webmanifest">

    @viteReactRefresh
    @vite(['resources/js/app.jsx', 'resources/css/app.css'])

    {{-- აქ ჩაიწერება React/Inertia Head meta tags --}}
    @inertiaHead

    <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@200;300;400;500;600;700;800&display=swap" rel="stylesheet"/>
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet"/>
</head>
<body class="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display transition-colors duration-300">
@inertia
</body>
</html>
