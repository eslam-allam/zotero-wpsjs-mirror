import tkinter as tk
from tkinter import messagebox

def show_popup():
    # 创建主窗口
    root = tk.Tk()
    # 设置窗口标题
    root.title("Hello Py")
    
    # 显示消息框
    messagebox.showinfo("Hello Py", "Hello Py")
    
    # 进入主事件循环
    root.mainloop()

if __name__ == "__main__":
    show_popup()