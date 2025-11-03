# Improntus UpdateCartAjax for Magento 2

**UpdateCartAjax** is a Magento 2 module developed by Improntus that enhances the shopping cart experience by enabling AJAX-based updates. This means that when customers change the quantity of items in their cart or click and "Update Cart", the cart updates automatically without needing to refresh the page.

---

## 🧩 Magento Version Compatibility

| Magento Version         | Module Version     | Status            |
|-------------------------|--------------------|-------------------|
| `>= 2.4.5`              | ✅ 1.*             | Supported         |

---

## ⚙️ Installation

### Developer Mode

```bash
php bin/magento module:enable Improntus_UpdateCartAjax --clear-static-content
php bin/magento setup:upgrade
rm -rf var/di var/view_preprocessed var/cache generated/*
php bin/magento setup:static-content:deploy
```

#### Production mode
```sh
$ php bin/magento module:enable Improntus_UpdateCartAjax --clear-static-content
$ php bin/magento setup:upgrade
$ php bin/magento setup:static-content:deploy
```

### Configuration
- Stores > Configuration > Improntus > Update Cart Ajax
    - Enable/Disable Module
    - Select Ajax Trigger Mode (button click, on quantity change).


## 🚀 Usage

- After installation, navigate to `Stores > Configuration > Improntus > Update Cart Ajax` to configure the module.
- You can enable or disable the module as needed.
- Once enabled, the shopping cart will automatically update via AJAX when quantities are changed or the "Update Cart" button is clicked depending on the selected trigger mode.

---

### 🧪 Where can it be used?

- Adobe Commerce.

---


## A [Improntus](https://www.improntus.com) Product

[![N|Solid](https://improntus.com/wp-content/uploads/2024/05/Improntus-logo-2.webp)](https://www.improntus.com)
