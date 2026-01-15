<?php
/*
 * RendererPlugin.php
 * Improntus. 12th January, 2026.
 */

declare(strict_types=1);

namespace Improntus\UpdateCartAjax\Plugin\Block\Cart\Item;

use Magento\Checkout\Block\Cart\Item\Renderer;
use Improntus\UpdateCartAjax\Service\Config as ServiceConfig;

class RendererPlugin
{
    private const TEMPLATE_PATH = 'Improntus_UpdateCartAjax::cart/item/default.phtml';

    /**
     * Constructor
     *
     * @param ServiceConfig $serviceConfig
     */
    public function __construct(
        private readonly ServiceConfig $serviceConfig
    ) {}

    /**
     * After getTemplate plugin
     *
     * @param Renderer $subject
     * @param string $result
     * @return string
     */
    public function afterGetTemplate(
        Renderer $subject,
        string $result
    ) {
        if ($this->serviceConfig->isAddQtyButtonsEnabled()) {
            return self::TEMPLATE_PATH;
        }

        return $result;
    }
}
