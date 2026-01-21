U MySQL klijentu možete pokrenuti sledeće SQL upite kako biste osigurali da tabela `sales` ima potrebne kolone `sale_date` i `description`:

ALTER TABLE sales
ADD COLUMN sale_date DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL AFTER amount;

ALTER TABLE sales
MODIFY COLUMN sale_date DATETIME DEFAULT NULL;
```
### Objašnjenje:
- Ovim upitom postavljate podrazumevanu vrednost za `sale_date` na trenutni datum i vreme (`CURRENT_TIMESTAMP`).
- Ako želite da `sale_date` može biti prazna, možete omogućiti `NULL` umesto `NOT NULL`:
