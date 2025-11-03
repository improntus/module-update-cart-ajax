<?php
/*
 * AjaxCartConfig.php
 * Improntus. 3rd November, 2025.
 */

declare(strict_types=1);

namespace Improntus\UpdateCartAjax\Block\Cart\Item;

use Magento\Checkout\Block\Cart\Item\Renderer\Actions\Generic;
use Magento\Framework\View\Element\Template\Context as Context;
use Improntus\UpdateCartAjax\Service\Config as ServiceConfig;
use Magento\Framework\Serialize\SerializerInterface;
use Improntus\UpdateCartAjax\Model\Config\Source\AjaxTriggerMode;

class AjaxCartConfig extends Generic
{
    /**
     * @var boolean
     */
    private $hideButton = false;

    /**
     * Constructor
     *
     * @param Context $context
     * @param ServiceConfig $serviceConfig
     * @param SerializerInterface $serializer
     * @param array $data
     */
    public function __construct(
        Context $context,
        private readonly ServiceConfig $serviceConfig,
        private readonly SerializerInterface $serializer,
        array $data = []
    ) {
        parent::__construct($context, $data);
    }

    /**
     * Retrieve if ajax update cart is enabled
     *
     * @return boolean
     */
    public function isEnabled(): bool
    {
        return $this->serviceConfig->isEnabled();
    }

    /**
     * Retrieve ajax trigger mode
     *
     * @return string
     */
    public function getAjaxTriggerMode(): string
    {
        $triggerMode = $this->serviceConfig->getAjaxTriggerMode();
        $this->setHideButton($triggerMode);
        return $triggerMode;
    }

    /**
     * Set hide button flag
     *
     * @param string $mode
     * @return void
     */
    private function setHideButton($mode): void
    {
        $this->hideButton = $mode === AjaxTriggerMode::MODE_AUTO;
    }

    /**
     * Get hide button flag
     *
     * @return boolean
     */
    public function getHideButton(): bool
    {
        return $this->hideButton;
    }

    /**
     * Get allowed trigger modes
     *
     * @return string
     */
    public function getAllowedModes(): string
    {
        return $this->serializer->serialize([
            AjaxTriggerMode::MODE_AUTO => AjaxTriggerMode::MODE_AUTO,
            AjaxTriggerMode::MODE_BUTTON => AjaxTriggerMode::MODE_BUTTON,
        ]);
    }
}
