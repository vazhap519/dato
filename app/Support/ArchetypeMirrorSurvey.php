<?php

namespace App\Support;

use RuntimeException;

/**
 * Versioned question/answer keys shared by the website and statistics endpoint.
 * Never trust option labels or role mappings supplied by the visitor.
 */
final class ArchetypeMirrorSurvey
{
    public const VERSION = 'mirror-v1';

    public static function questions(): array
    {
        $path = resource_path('data/archetype-mirror-questions.json');
        $data = json_decode((string) file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);

        if (!is_array($data) || ($data['version'] ?? null) !== self::VERSION ||
            !is_array($data['questions'] ?? null) || count($data['questions']) !== 20) {
            throw new RuntimeException('Invalid archetype mirror definition');
        }

        foreach ($data['questions'] as $question) {
            if (!is_array($question) || !is_string($question['text'] ?? null) ||
                !is_array($question['options'] ?? null) || count($question['options']) !== 4) {
                throw new RuntimeException('Invalid archetype mirror question');
            }
            foreach ($question['options'] as $option) {
                if (!is_array($option) || !is_string($option['slug'] ?? null) ||
                    !is_string($option['label'] ?? null)) {
                    throw new RuntimeException('Invalid archetype mirror option');
                }
            }
        }

        return $data['questions'];
    }
}
