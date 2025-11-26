#!/usr/bin/env python3
"""
Simple HTTP Server untuk VoxSilva Project
Menjalankan web server lokal untuk development
"""

import http.server
import socketserver
import webbrowser
import os
import sys

# Port untuk server (default: 8000)
PORT = 8000

# Handler untuk HTTP server
Handler = http.server.SimpleHTTPRequestHandler

# Cek apakah port sudah digunakan
def check_port(port):
    import socket
    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    result = sock.connect_ex(('127.0.0.1', port))
    sock.close()
    return result != 0

# Fungsi utama
def main():
    # Cek port
    if not check_port(PORT):
        print(f"⚠️  Port {PORT} sudah digunakan!")
        print(f"   Coba gunakan port lain dengan: python server.py <port>")
        sys.exit(1)
    
    # Buat server
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print("=" * 50)
        print("🚀 VoxSilva Development Server")
        print("=" * 50)
        print(f"📡 Server berjalan di: http://localhost:{PORT}")
        print(f"📡 Atau: http://127.0.0.1:{PORT}")
        print("=" * 50)
        print("📝 Tekan Ctrl+C untuk menghentikan server")
        print("=" * 50)
        
        # Buka browser otomatis (opsional)
        try:
            url = f"http://localhost:{PORT}"
            webbrowser.open(url)
            print(f"🌐 Browser dibuka otomatis: {url}")
        except:
            print("⚠️  Tidak bisa membuka browser otomatis")
        
        print("\n")
        
        # Jalankan server
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n\n🛑 Server dihentikan oleh user")
            print("👋 Terima kasih!")

if __name__ == "__main__":
    # Cek apakah ada argumen port
    if len(sys.argv) > 1:
        try:
            PORT = int(sys.argv[1])
        except ValueError:
            print("❌ Error: Port harus berupa angka!")
            print(f"   Usage: python server.py [port]")
            sys.exit(1)
    
    main()

