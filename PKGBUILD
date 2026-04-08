# Maintainer: rainyroot <rainyroot@github>
pkgname=nekotama
pkgver=0.1.0
pkgrel=1
pkgdesc="Anime desktop pet for Linux — Tamagotchi meets system monitor"
arch=('x86_64')
url="https://github.com/rainyroot/NekoTama"
license=('MIT')
depends=('electron30')
makedepends=('npm' 'nodejs')
source=("${pkgname}-${pkgver}.tar.gz::${url}/archive/v${pkgver}.tar.gz")
sha256sums=('SKIP')

prepare() {
  cd "NekoTama-${pkgver}"
  npm ci --prefer-offline
}

build() {
  cd "NekoTama-${pkgver}"
  npm run build
}

package() {
  cd "NekoTama-${pkgver}"

  install -dm755 "${pkgdir}/usr/lib/${pkgname}"
  cp -r dist "${pkgdir}/usr/lib/${pkgname}/"
  cp -r src/assets "${pkgdir}/usr/lib/${pkgname}/"
  cp package.json "${pkgdir}/usr/lib/${pkgname}/"

  install -dm755 "${pkgdir}/usr/bin"
  cat > "${pkgdir}/usr/bin/${pkgname}" << EOF
#!/bin/bash
exec electron30 /usr/lib/${pkgname} "\$@"
EOF
  chmod +x "${pkgdir}/usr/bin/${pkgname}"

  install -Dm644 /dev/stdin "${pkgdir}/usr/share/applications/${pkgname}.desktop" << EOF
[Desktop Entry]
Name=NekoTama
Comment=Anime desktop pet for Linux
Exec=${pkgname}
Icon=${pkgname}
Terminal=false
Type=Application
Categories=Utility;
EOF

  install -Dm644 LICENSE "${pkgdir}/usr/share/licenses/${pkgname}/LICENSE"
}
