<?php

namespace App\Http\Controllers;

use App\Models\LegalDocument;
use Inertia\Inertia;

class LegalDocumentController extends Controller
{
    public function show(string $slug)
    {
        abort_unless(in_array($slug, ['terms', 'privacy', 'offer'], true), 404);
        $document = LegalDocument::query()->where('slug', $slug)->where('is_published', true)->first();
        abort_unless($document, 404);

        // Display untrusted legacy HTML as plain text; never inject raw markup.
        $content = (string) $document->content;
        $content = preg_replace('/<\s*br\s*\/?>/i', "\n", $content);
        $content = preg_replace('/<\/(p|div|h[1-6]|li|ul|ol)>/i', "\n\n", $content);
        $content = html_entity_decode(strip_tags($content), ENT_QUOTES | ENT_HTML5, 'UTF-8');

        return Inertia::render('LegalDocument', [
            'document' => [
                'slug' => $document->slug,
                'title' => $document->title,
                'content' => trim($content),
                'version' => $document->version,
                'effective_at' => $document->effective_at?->format('d.m.Y'),
            ],
        ]);
    }
}
