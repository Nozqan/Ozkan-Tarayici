"""Akrep uygulama ikonlarını checkpoint boyut sınırına uygun biçimde optimize eder."""

from pathlib import Path

from PIL import Image


PROJE_KOKU = Path(__file__).resolve().parents[1]
KAYNAK = PROJE_KOKU / "assets/images/icon.png"
HEDEFLER = [
    PROJE_KOKU / "assets/images/icon.png",
    PROJE_KOKU / "assets/images/splash-icon.png",
    PROJE_KOKU / "assets/images/favicon.png",
    PROJE_KOKU / "assets/images/android-icon-foreground.png",
]


def ana() -> None:
    """Kaynak ikonu tüm hedeflere kayıpsız boyut küçültme ile yazar."""
    with Image.open(KAYNAK) as kaynak_resim:
        resim = kaynak_resim.convert("RGBA")
        resim.thumbnail((512, 512), Image.Resampling.LANCZOS)

        for hedef in HEDEFLER:
            resim.save(hedef, format="PNG", optimize=True, compress_level=9)
            print(f"{hedef.name}: {hedef.stat().st_size} bayt")


if __name__ == "__main__":
    ana()
