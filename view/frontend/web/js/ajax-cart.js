define([
    'jquery',
    'Magento_Checkout/js/action/get-totals',
    'Magento_Customer/js/customer-data',
    'Magento_Ui/js/modal/alert',
    'mage/validation',
], function ($, totalAction, customerData, alert) {
    $.widget('mage.ajaxCart', {
        options: {
            validationURL: '',
            updateCartActionContainer: '',
            eventName: 'updateCartItemQty',
            qtyInput: '[data-cart-item-id="%s"]',
            updateButton: '[data-cart-item-update]',
            lastValues: {},
            changesHandled: false,
        },

        /**
         * Widget initialization
         * @inheritdoc
         */
        _create: function () {
            const { productId, allowedModes, triggerMode, updateButton } =
                this.options;
            const selector = this.options.qtyInput.replace('%s', productId);
            const $items = $(selector);
            const $updateButton = $(updateButton);

            $updateButton.addClass('disabled');
            this.handleChanges.bind(this)($items, $updateButton);

            const handlers = {
                [allowedModes.button]: () =>
                    this.handleButtonClick.bind(this)($updateButton),
                [allowedModes.auto]: () =>
                    this.handleAutoChange.bind(this)($items),
            };

            handlers[triggerMode]();
        },

        /**
         * Handle update button click
         * @param {*} updateButton
         */
        handleButtonClick: function (updateButton) {
            updateButton.on('click', (event) => {
                event.preventDefault();
                this._updateCart();
            });
        },

        /**
         * Handle automatic quantity change
         * @param {*} items
         */
        handleAutoChange: function (items) {
            this.addIncreaseDecreaseListeners(items);
            items.on('change', (event) => {
                const { currentTarget } = event;
                const isValid =
                        $.validator.validateSingleElement(currentTarget),
                    newQty = Number($(currentTarget).val());

                if (this.options.changesHandled && !isNaN(newQty) && isValid) {
                    this._updateCart();
                }
            });
        },

        /**
         * Add listeners to increase/decrease buttons
         * @param {*} items
         */
        addIncreaseDecreaseListeners: function (items) {
            const { increaseQtySelector, decreaseQtySelector } = this.options;
            $(`${increaseQtySelector}, ${decreaseQtySelector}`).off('.ajaxCart').on('click.ajaxCart', (e) => {
                e.preventDefault();
                const isIncrease = $(e.currentTarget).is(increaseQtySelector);
                const currentQty = Number(items.val()) || 1;
                let newQty = isIncrease ? currentQty + 1 : currentQty - 1;
                newQty = newQty < 1 ? 1 : newQty;
                items.val(newQty).trigger('change');
            });

        },

        /**
         * Handle quantity input changes
         * @param {*} items
         */
        handleChanges: function (items, button) {
            items.on('change', (e) => {
                this.options.changesHandled = true;
                button?.removeClass('disabled');
            });
        },

        /**
         * Update cart via AJAX (entry point)
         */
        _updateCart: function () {
            const $form = $('form#form-validate');
            if (!$form.length) {
                console.warn('ajaxCart: form#form-validate not found');
                return;
            }

            const action = $form.find(this.options.updateCartActionContainer).val();
            
            // Skip validation for empty cart or if no validation URL configured
            if (!this.options.validationURL || action === 'empty_cart') {
                const payload = $form.serialize();
                const url = $form.attr('action') || window.location.href;
                this._sendUpdateRequest(url, payload);
                return;
            }

            // Validate form first
            const isValid = $form.validation() && $form.validation('isValid');
            if (!isValid) {
                return;
            }

            // Perform async server-side validation
            this.validateItems($form);
        },

        /**
         * Validates updated shopping cart data.
         * @param {*} $form
         */
        validateItems: function ($form) {
            const validationURL = this.options.validationURL,
            data = $form.serialize(),
            actionUrl = $form.attr('action') || window.location.href;

            $.extend(data, {
                'form_key': $.mage.cookies.get('form_key')
            });

            $.ajax({
                url: validationURL,
                data: data,
                type: 'post',
                dataType: 'json',
                context: this,

                /** @inheritdoc */
                beforeSend: function () {
                    $(document.body).trigger('processStart');
                },

                /** @inheritdoc */
                complete: function () {
                    $(document.body).trigger('processStop');
                }
            })
                .done(function (response) {
                    if (response.success) {
                        this.onSuccess();
                        this._sendUpdateRequest(actionUrl, data);
                    } else {
                        this.onError(response);
                    }
                })
                .fail(function () {
                    this._onUpdateError({ responseText: 'Validation request failed' });
                });
        },

        /**
         * Item Quantity Form validation failed.
         */
        onError: function (response) {
            let elm,
                responseData = [];

            try {
                responseData = JSON.parse(response['error_message']);
            } catch (error) {
            }

            if (response['error_message']) {
                try {
                    $.each(responseData, function (index, data) {
                        if (data.itemId !== undefined) {
                            elm = $('#cart-' + data.itemId + '-qty');
                            elm.val(elm.attr('data-item-qty'));
                        }
                        response['error_message'] = data.error;
                    });
                } catch (e) {}
                alert({
                    content: response['error_message'],
                    actions: {
                        /** @inheritdoc */
                        always: function () {}
                    }
                });
            }
        },

        /**
         * Form validation succeed.
         */
        onSuccess: function () {
            $(document).trigger('ajax:' + this.options.eventName);
        },

        /**
         * Send AJAX request and delegate success/error
         * @param {string} url
         * @param {string} data
         */
        _sendUpdateRequest: function (url, data) {
            $.ajax({
                url: url,
                data: data,
                showLoader: true,
                method: 'POST',
                success: (res) => this._onUpdateSuccess(res),
                error: (xhr) => this._onUpdateError(xhr),
            }).always(() => {
                this.options.changesHandled = false;
                const button = this.options.updateButton;
                $(button)?.addClass('disabled');
            });
        },

        /**
         * Success handler: replace form, reload sections and totals
         * @param {string} res - HTML response
         */
        _onUpdateSuccess: function (res) {
            try {
                const parsed = $.parseHTML(res);
                const result = $(parsed).find('#form-validate');

                if (result?.length) {
                    $('#form-validate').replaceWith(result);
                    const sections = ['cart'];
                    customerData.reload(sections, true);
                    const deferred = $.Deferred();
                    deferred.always(() => {
                        this._reloadMessages();
                    });
                    totalAction([], deferred);
                } else {
                    console.warn(
                        'ajaxCart: #form-validate not found in response'
                    );
                }
            } catch (e) {
                console.error('ajaxCart: error processing response', e);
            }
        },

        /**
         * Error handler: try parse JSON error, fallback to text
         * @param {jqXHR} xhr
         */
        _onUpdateError: function (xhr) {
            let msg = 'ajaxCart: unknown error';
            try {
                const parsed = JSON.parse(xhr.responseText || '{}');
                msg =
                    parsed.message || parsed.Message || JSON.stringify(parsed);
            } catch (e) {
                msg = xhr.responseText || xhr.statusText || msg;
            }
            console.error(msg);
        },

        /**
         * Reload messages section to show any new messages
         * @returns {Void}
         */
        _reloadMessages: function () {
            const messages = $.cookieStorage.get('mage-messages');
            if (_.isEmpty(messages)) {
                return;
            }

            const deferred = $.Deferred();
            deferred.always(function () {
                customerData.set('messages', { messages: messages });
                $.cookieStorage.set('mage-messages', '');
            });

            //show messages even if reload fails
            customerData.reload(['messages']).then(
                function () {
                    deferred.resolve();
                },
                function () {
                    deferred.resolve();
                }
            );
        },
    });

    return $.mage.ajaxCart;
});
