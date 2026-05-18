.PHONY: setup up down kill restart logs status build help

# Varsayılan yardım menüsü
help:
	@echo "Mevcut komut kısayolları:"
	@echo "  make setup   - Çevre değişkenlerini oluşturur, yerel paketleri kurar ve imajları derler."
	@echo "  make up      - Docker konteynerlerini arka planda başlatır."
	@echo "  make down    - Çalışan tüm Docker konteynerlerini durdurur."
	@echo "  make kill    - Konteynerleri anında öldürür ve tüm verileri (veritabanı & redis volumelerini) sıfırlar."
	@echo "  make restart - Tüm konteynerleri yeniden başlatır."
	@echo "  make logs    - NestJS API servisi loglarını anlık olarak izler."
	@echo "  make status  - Konteynerlerin anlık sağlık ve çalışma durumlarını gösterir."
	@echo "  make build   - Docker imajlarını sıfırdan ve önbelleksiz (no-cache) derler."

# Setup: Çevre değişkenlerini kopyalar, bağımlılıkları yükler ve Docker compose'u hazırlar.
setup:
	@echo "--> Kurulum başlatılıyor..."
	@if [ ! -f .env ]; then \
		echo "--> .env.example dosyasından .env kopyalanıyor..."; \
		cp .env.example .env; \
	else \
		echo "--> .env dosyası zaten mevcut, kopyalama atlandı."; \
	fi
	@echo "--> Yerel bağımlılıklar (node_modules) yükleniyor..."
	npm install
	@echo "--> Docker imajları inşa ediliyor..."
	docker compose build
	@echo "--> Kurulum başarıyla tamamlandı! Konteynerleri başlatmak için 'make up' yazabilirsiniz."

# Up: Konteynerleri arka planda ayağa kaldırır.
up:
	@echo "--> Konteynerler arka planda başlatılıyor..."
	docker compose up
	@echo "--> Konteynerler başarıyla başlatıldı!"

# Down: Konteynerleri güvenli bir şekilde kapatır.
down:
	@echo "--> Konteynerler kapatılıyor..."
	docker compose down
	@echo "--> Konteynerler kapatıldı."

# Kill: Konteynerleri anında durdurur ve veritabanı/redis verilerini (volumeleri) tamamen siler (temiz bir başlangıç için).
kill:
	@echo "--> Konteynerler kapatılıyor ve veriler (volumeler) tamamen sıfırlanıyor..."
	docker compose down -v --remove-orphans
	@echo "--> Konteynerler ve volumeler başarıyla temizlendi."

# Restart: Servisleri yeniden başlatır.
restart:
	@echo "--> Servisler yeniden başlatılıyor..."
	docker compose restart
	@echo "--> Yeniden başlatıldı!"

# Logs: NestJS api servisinin loglarını anlık takip eder.
logs:
	docker compose logs -f api

# Status: Konteynerlerin sağlık durumlarını listeler.
status:
	docker compose ps

# Build: Önbelleksiz sıfırdan docker build yapar.
build:
	@echo "--> Docker imajları önbelleksiz yeniden inşa ediliyor..."
	docker compose build --no-cache
