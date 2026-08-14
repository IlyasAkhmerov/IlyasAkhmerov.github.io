import http.server
import socketserver
import os
import urllib.parse

PORT = 8000


class SPAHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path

        print(f"Request: {path}")

        # Если запрос на корень
        if path == '/':
            self.path = '/index.html'
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

        # Проверяем, существует ли файл
        file_path = path.lstrip('/')
        if os.path.exists(file_path) and not os.path.isdir(file_path):
            print(f"Serving file: {file_path}")
            return http.server.SimpleHTTPRequestHandler.do_GET(self)

        # Если это папка - ищем index.html в ней
        if os.path.isdir(file_path):
            index_path = os.path.join(file_path, 'index.html')
            if os.path.exists(index_path):
                self.path = path + '/index.html'
                return http.server.SimpleHTTPRequestHandler.do_GET(self)

        # Для всех остальных запросов - отдаем index.html (SPA)
        print(f"SPA fallback for: {path}")
        self.path = '/index.html'
        return http.server.SimpleHTTPRequestHandler.do_GET(self)


with socketserver.TCPServer(("", PORT), SPAHandler) as httpd:
    print(f"✅ Сервер запущен: http://localhost:{PORT}")
    print(f"   Откройте: http://localhost:{PORT}")
    print(f"")
    print(f"   Логин: admin / 1234")
    print(f"")
    print(f"   Маршруты:")
    print(f"   - / (главная)")
    print(f"   - /login (вход)")
    print(f"   - /dashboard (дашборд)")
    print(f"   - /products (продукты)")
    print(f"   - /products/household (товары для дома)")
    print(f"   - /services (услуги)")
    print(f"   - /company (о компании)")
    print(f"   - /protected/extra (глубокая защищенная страница)")
    httpd.serve_forever()