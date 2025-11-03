<?php
/*
 * AjaxTriggerMode.php
 * Improntus. 3rd November, 2025.
 */

declare(strict_types=1);

namespace Improntus\UpdateCartAjax\Model\Config\Source;

use Magento\Framework\Data\OptionSourceInterface;

class AjaxTriggerMode implements OptionSourceInterface
{
    public const MODE_AUTO = 'auto';
    public const MODE_BUTTON = 'button';

    /**
     * Return array of options as value-label pairs
     *
     * @return array Format: array(array('value' => '<value>', 'label' => '<label>'), ...)
     */
    public function toOptionArray()
    {
        return [
            ['value' => self::MODE_AUTO, 'label' => __('Auto (on quantity change)')],
            ['value' => self::MODE_BUTTON, 'label' => __('With Update Cart button')],
        ];
    }
}
