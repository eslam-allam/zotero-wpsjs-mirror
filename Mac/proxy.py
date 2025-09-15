#!/usr/bin/env python3

import http.server
import http.client
import urllib.parse
import threading

PORT = 21931  # 代理监听端口
TARGET_HOST = "127.0.0.1"
TARGET_PORT = 23119
running = True  # 全局运行状态标记

class ProxyHandler(http.server.BaseHTTPRequestHandler):
    def handle_request(self, method):
        # 1. 解析请求路径
        url = urllib.parse.urlparse(self.path)
        path_query = url.path + ("?" + url.query if url.query else "")
        
        # 2. 特殊路由处理：关闭代理
        if path_query == "/stopproxy":
            self.send_response(200)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.end_headers()
            self.wfile.write(b"Proxy stopping...")
            global running
            running = False  # 触发关闭
            return
        
        # 3. 普通请求转发逻辑
        conn = None
        try:
            # 使用更短的超时时间，避免连接堆积
            conn = http.client.HTTPConnection(TARGET_HOST, TARGET_PORT, timeout=10)
            headers = {k: v for k, v in self.headers.items() if k != "Host"}
            body = None
            if method in ["POST", "PUT", "DELETE"] and "Content-Length" in self.headers:
                content_length = int(self.headers["Content-Length"])
                body = self.rfile.read(content_length)
            
            conn.request(method, path_query, body=body, headers=headers)
            response = conn.getresponse()
            
            # 4. 返回代理响应
            self.send_response(response.status)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
            self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization")
            for header, value in response.getheaders():
                self.send_header(header, value)
            self.end_headers()
            self.wfile.write(response.read())
            
        except (ConnectionRefusedError, http.client.HTTPException, OSError) as e:
            print(f"代理转发错误: {e}")
            # 返回错误响应
            self.send_response(503)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            error_response = {"error": "Zotero服务不可用", "message": str(e)}
            self.wfile.write(str(error_response).encode())
        except Exception as e:
            print(f"未知错误: {e}")
            self.send_response(500)
            self.send_header("Access-Control-Allow-Origin", "*")
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            error_response = {"error": "代理服务器错误", "message": str(e)}
            self.wfile.write(str(error_response).encode())
        finally:
            # 确保连接总是被关闭
            if conn:
                try:
                    conn.close()
                except:
                    pass

    # 支持所有HTTP方法
    def do_GET(self): self.handle_request("GET")
    def do_POST(self): self.handle_request("POST")
    def do_PUT(self): self.handle_request("PUT")
    def do_DELETE(self): self.handle_request("DELETE")
    def do_OPTIONS(self): self.handle_request("OPTIONS")

# 启动代理服务（支持优雅关闭）
def run_proxy():
    server = http.server.HTTPServer(("", PORT), ProxyHandler)
    print(f"反向代理运行中：端口 {PORT} → http://{TARGET_HOST}:{TARGET_PORT}")
    while running:  # 循环处理请求，直到running=False
        server.handle_request()
    server.server_close()  # 释放端口资源
    print("代理服务已停止")

if __name__ == "__main__":
    proxy_thread = threading.Thread(target=run_proxy)
    proxy_thread.start()
    proxy_thread.join()  # 等待线程结束