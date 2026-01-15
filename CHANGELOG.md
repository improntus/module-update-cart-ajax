CHANGELOG
---------

### 1.0.2 (2026-01-15)

* Added `updateItemQty` API call validation before sending update request to ensure quantity is valid.
* Updated instance selector for `ajaxCart` initialization in `update_ajax_cart.phtml` to target specific cart item elements only.

### 1.0.1 (2026-01-12)

* Added aria-label attributes to quantity increase and decrease buttons for better accessibility.
* Added plugin `afterGetTemplate` to RendererPlugin to allow dynamic template selection based on configuration.
* Added new event listeners in `ajax-cart.js` to handle quantity increase and decrease button clicks.
* Added styles for quantity buttons in `_module.less`.


### 1.0.0 (2025-11-03)

* Initial release of Improntus_UpdateCartAjax module.
