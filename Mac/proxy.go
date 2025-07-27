package main

import (
	"bytes"
	"context"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"strings"
	"sync"
	"time"
)

func main() {
	// Zotero API地址
	target, _ := url.Parse("http://localhost:23119")

	// 创建自定义反向代理
	proxy := &httputil.ReverseProxy{
		Director: func(req *http.Request) {
			req.URL.Scheme = target.Scheme
			req.URL.Host = target.Host
			req.URL.Path = singleJoiningSlash(target.Path, req.URL.Path)
			req.Host = target.Host
			req.Header.Del("Accept-Encoding")
		},
		ModifyResponse: func(resp *http.Response) error {
			resp.Header.Set("Access-Control-Allow-Origin", "*")
			resp.Header.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
			resp.Header.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
			return nil
		},
		ErrorHandler: func(w http.ResponseWriter, r *http.Request, err error) {
			http.Error(w, "代理服务器错误", http.StatusInternalServerError)
		},
	}

	// 创建HTTP服务器
	server := &http.Server{
		Addr: ":21931",
		Handler: http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			// 处理关闭请求
			if r.URL.Path == "/stopproxy" {
				w.WriteHeader(http.StatusOK)
				w.Write([]byte("Proxy shutting down..."))

				// 触发关闭信号（非阻塞）
				go func() {
					shutdownOnce.Do(func() {
						close(shutdownChan)
					})
				}()
				return
			}

			// 处理OPTIONS预检请求
			if r.Method == http.MethodOptions {
				handleCorsPreflight(w, r)
				return
			}

			// 复制请求体
			bodyBytes, _ := io.ReadAll(r.Body)
			r.Body = io.NopCloser(bytes.NewBuffer(bodyBytes))

			// 代理请求
			proxy.ServeHTTP(w, r)
		}),
	}

	// 启动服务器协程
	go func() {
		if err := server.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Server failed: %v", err)
		}
	}()

	// 等待关闭信号
	<-shutdownChan
	log.Println("Shutdown signal received, closing server...")

	// 优雅关闭服务器（最多等待5秒）
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := server.Shutdown(ctx); err != nil {
		log.Printf("Server shutdown error: %v", err)
	}
	log.Println("Proxy server stopped")
}

// 全局关闭控制
var (
	shutdownChan = make(chan struct{})
	shutdownOnce sync.Once
)

// 原有辅助函数保持不变
func handleCorsPreflight(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
	w.Header().Set("Access-Control-Max-Age", "86400")
	w.WriteHeader(http.StatusOK)
}

func singleJoiningSlash(a, b string) string {
	aslash := strings.HasSuffix(a, "/")
	bslash := strings.HasPrefix(b, "/")
	switch {
	case aslash && bslash:
		return a + b[1:]
	case !aslash && !bslash:
		return a + "/" + b
	}
	return a + b
}
