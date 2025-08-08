from flask import Flask, request, Response
import requests
import threading
import logging
import time
import os

app = Flask(__name__)
shutdown_flag = False
shutdown_lock = threading.Lock()
log = logging.getLogger('werkzeug')
log.setLevel(logging.ERROR)  # 禁用Flask默认请求日志

TARGET_URL = "http://127.0.0.1:23119"  # Zotero API地址
PROXY_PORT = 21932
SHUTDOWN_ENDPOINT = "/stopproxy"

def proxy_request():
    # 构建目标URL
    target = f"{TARGET_URL}{request.path}"
    if request.query_string:
        target += f"?{request.query_string.decode()}"

    # 转发请求头 (排除不安全的头)
    headers = {
        k: v for k, v in request.headers
        if k.lower() not in ['host', 'content-length', 'content-encoding']
    }

    # 发送请求到目标服务器
    try:
        resp = requests.request(
            method=request.method,
            url=target,
            headers=headers,
            data=request.get_data(),
            cookies=request.cookies,
            stream=True,
            allow_redirects=False
        )
    except requests.exceptions.RequestException as e:
        app.logger.error(f"代理请求失败: {str(e)}")
        return Response("目标服务器错误", status=502)

    # 构建代理响应
    response = Response(resp.iter_content(chunk_size=8192), status=resp.status_code)

    # 添加跨域头
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'

    # 复制原始响应头
    for key, value in resp.headers.items():
        if key.lower() not in ['content-encoding', 'transfer-encoding', 'content-length']:
            response.headers[key] = value

    return response

@app.before_request
def handle_preflight():
    """处理OPTIONS预检请求"""
    if request.method == 'OPTIONS':
        resp = Response()
        resp.headers['Access-Control-Allow-Origin'] = '*'
        resp.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
        resp.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        resp.headers['Access-Control-Max-Age'] = '86400'
        return resp

@app.route(SHUTDOWN_ENDPOINT, methods=['GET', 'POST'])
def shutdown_server():
    """触发代理服务器关闭"""
    global shutdown_flag

    with shutdown_lock:
        if not shutdown_flag:
            shutdown_flag = True
            threading.Thread(target=delayed_shutdown).start()
            return "Proxy shutting down...", 200
        return "Shutdown already initiated", 202

@app.route('/', defaults={'path': ''})
@app.route('/<path:path>', methods=['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'])
def proxy_handler(path):
    """处理所有代理请求"""
    # 检查是否为关闭请求
    if request.path == SHUTDOWN_ENDPOINT:
        return shutdown_server()
    
    return proxy_request()

def delayed_shutdown():
    """延迟关闭服务器确保响应已发送"""
    time.sleep(1)  # 给响应时间完成
    os.kill(os.getpid(), 15)  # 发送SIGTERM信号

def run_server():
    from waitress import serve
    print(f"代理服务器运行在: http://0.0.0.0:{PROXY_PORT}")
    print(f"目标服务器地址: {TARGET_URL}")
    print(f"停止代理: curl http://localhost:{PROXY_PORT}{SHUTDOWN_ENDPOINT}")
    serve(app, host="0.0.0.0", port=PROXY_PORT)

if __name__ == '__main__':
    run_server()