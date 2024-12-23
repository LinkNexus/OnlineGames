<?php

declare(strict_types=1);

namespace App\Twig\Extensions;

use Twig\Extension\AbstractExtension;
use Twig\TwigFunction;
use Twig\TwigFilter;

class JsonSerializeExtension extends AbstractExtension
{
    public function getFunctions(): array
    {
        return [
            new TwigFunction('json_serialize', $this->serialize(...)),
        ];
    }

    public function getFilters(): array
    {
        return [
            new TwigFilter('json_serialize', $this->serialize(...)),
        ];
    }

    public function serialize($value): string
    {
        return json_encode($value, JSON_UNESCAPED_SLASHES | JSON_HEX_TAG);
    }
}
