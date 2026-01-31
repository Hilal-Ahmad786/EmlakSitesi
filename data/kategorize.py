# -*- coding: utf-8 -*-
import csv
import os
import shutil
from pathlib import Path

base_dir = Path("D:/Desktop/MdorientSite/yedek")
gorseller_dir = base_dir / "gorseller"

# Kategori klasörleri oluştur
kategori_dirs = {
    'Satilik': base_dir / "Satilik",
    'Kiralik': base_dir / "Kiralik",
    'Kapali': base_dir / "Kapali"
}

for kd in kategori_dirs.values():
    kd.mkdir(exist_ok=True)

# CSV'den ilan bilgilerini oku
ilan_kategori = {}
with open(base_dir / 'ilanlar_tumu.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for i, row in enumerate(reader, 1):
        ilan_kategori[i] = row['Durum']

print(f"Toplam {len(ilan_kategori)} ilan")

# Kategori sayıları
kategori_sayilari = {}
for k in ilan_kategori.values():
    kategori_sayilari[k] = kategori_sayilari.get(k, 0) + 1
print(f"Kategoriler: {kategori_sayilari}")

# Eşleştirme dosyasını oku ve görselleri taşı
moved = 0
new_mapping = []

with open(base_dir / 'gorsel_eslestirme.csv', 'r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    for row in reader:
        ilan_id = int(row['ilan_id'])
        kategori = ilan_kategori.get(ilan_id, 'Kapali')

        old_file = gorseller_dir / row['gorsel_dosya']
        new_dir = kategori_dirs.get(kategori, kategori_dirs['Kapali'])
        new_file = new_dir / row['gorsel_dosya']

        if old_file.exists():
            shutil.move(str(old_file), str(new_file))
            moved += 1

        new_mapping.append({
            'ilan_id': row['ilan_id'],
            'ilan_baslik': row['ilan_baslik'],
            'kategori': kategori,
            'gorsel_sira': row['gorsel_sira'],
            'gorsel_dosya': row['gorsel_dosya'],
            'orijinal_dosya': row['orijinal_dosya']
        })

print(f"\n{moved} gorsel tasindi")

# Yeni eşleştirme dosyasını kaydet
with open(base_dir / 'gorsel_eslestirme.csv', 'w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=['ilan_id', 'ilan_baslik', 'kategori', 'gorsel_sira', 'gorsel_dosya', 'orijinal_dosya'])
    writer.writeheader()
    writer.writerows(new_mapping)

# Boş gorseller klasörünü sil
try:
    gorseller_dir.rmdir()
    print("Eski gorseller klasoru silindi")
except:
    pass

# Özet
print("\n--- OZET ---")
for kategori, klasor in kategori_dirs.items():
    count = len(list(klasor.glob('*.jpg'))) + len(list(klasor.glob('*.png')))
    print(f"{kategori}: {count} gorsel")
