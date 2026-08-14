import http.server
import socketserver
import os

PORT = 8000

class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Если запрос не на статический файл и не на index.html
        if self.path.startswith('/') and not os.path.exists(self.path[1:]) and '.' not in self.path:
            # Перенаправляем на index.html
            self.path = '/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
    print(f"✅ Сервер запущен: http://localhost:{PORT}")
    print(f"   Откройте: http://localhost:{PORT}")
    httpd.serve_forever()