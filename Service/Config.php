<?php
/*
 * Config.php
 * Improntus. 3rd November, 2025.
 */

declare(strict_types=1);

namespace Improntus\UpdateCartAjax\Service;

use Magento\Framework\App\Config\ScopeConfigInterface;
use Magento\Store\Model\ScopeInterface;
use Magento\Framework\Serialize\SerializerInterface;

class Config
{
    private const XML_PATH_IMPRONTUS_UPDATE_CART_AJAX_GENERAL_ENABLE = 'improntus_update_cart_ajax/general/enable';
    private const XML_PATH_IMPRONTUS_UPDATE_CART_AJAX_GENERAL_AJAX_TRIGGER_MODE = 'improntus_update_cart_ajax/general/ajax_trigger_mode';

    /**
     * Consturctor
     *
     * @param ScopeConfigInterface $scopeConfig
     * @param SerializerInterface $serializer
     */
    public function __construct(
        private readonly ScopeConfigInterface $scopeConfig,
        private readonly SerializerInterface $serializer
    ) {}

    /**
     *
     * @param string $field
     * @param null|int|string $scopeValue
     * @return mixed
     */
    private function getConfigValue(string $field, null|int|string $scopeValue = null): mixed
    {
        return $this->scopeConfig->getValue(
            $field,
            ScopeInterface::SCOPE_WEBSITE,
            $scopeValue
        );
    }

    /**
     * Check if the installments info feature is enabled in the system configuration.
     *
     * @return boolean
     */
    public function isEnabled(): bool
    {
        return (bool) $this->getConfigValue(
            self::XML_PATH_IMPRONTUS_UPDATE_CART_AJAX_GENERAL_ENABLE
        );
    }

    /**
     * Get Ajax Trigger Mode
     *
     * @return string
     */
    public function getAjaxTriggerMode(): string
    {
        return (string) $this->getConfigValue(
            self::XML_PATH_IMPRONTUS_UPDATE_CART_AJAX_GENERAL_AJAX_TRIGGER_MODE
        );
    }
}
