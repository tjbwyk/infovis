import http.server
import socketserver
import webbrowser

webbrowser.open("http://localhost:8192")

PORT = 8192
Handler = http.server.SimpleHTTPRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)
print("serving at port", PORT)
httpd.serve_forever()
