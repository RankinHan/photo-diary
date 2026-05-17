// 图文记录小程序 - 主程序（移动端优化版）

class PhotoDiary {
    constructor() {
        this.records = [];
        this.currentImages = [];
        this.editingId = null;
        this.isSubmitting = false;
        
        this.init();
    }

    init() {
        this.loadFromStorage();
        this.bindEvents();
        this.renderRecords();
    }

    // 绑定事件
    bindEvents() {
        // 图片上传按钮点击
        const uploadBtn = document.getElementById('uploadBtn');
        const imageInput = document.getElementById('imageInput');
        
        if (uploadBtn && imageInput) {
            uploadBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                imageInput.click();
            });
            
            imageInput.addEventListener('change', (e) => {
                this.handleImageUpload(e);
            });
        }

        // 发布按钮
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.submitRecord();
            });
        }

        // 弹窗关闭
        const modalClose = document.getElementById('modalClose');
        const imageModal = document.getElementById('imageModal');
        
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // 点击弹窗背景关闭
        if (imageModal) {
            imageModal.addEventListener('click', (e) => {
                if (e.target === imageModal) {
                    this.closeModal();
                }
            });
        }

        // 触摸滑动关闭弹窗
        let touchStartY = 0;
        if (imageModal) {
            imageModal.addEventListener('touchstart', (e) => {
                touchStartY = e.touches[0].clientY;
            }, { passive: true });
            
            imageModal.addEventListener('touchend', (e) => {
                const touchEndY = e.changedTouches[0].clientY;
                if (Math.abs(touchEndY - touchStartY) > 100) {
                    this.closeModal();
                }
            }, { passive: true });
        }
    }

    // 处理图片上传
    handleImageUpload(e) {
        const files = Array.from(e.target.files);
        
        if (files.length === 0) return;
        
        let processedCount = 0;
        const totalFiles = files.length;
        
        files.forEach(file => {
            // 验证文件类型
            if (!file.type.startsWith('image/')) {
                this.showToast('请上传图片文件！');
                processedCount++;
                return;
            }
            
            // 验证文件大小（最大10MB）
            if (file.size > 10 * 1024 * 1024) {
                this.showToast('图片大小不能超过10MB！');
                processedCount++;
                return;
            }

            const reader = new FileReader();
            
            reader.onload = (event) => {
                this.currentImages.push({
                    id: Date.now() + Math.random(),
                    src: event.target.result,
                    name: file.name
                });
                this.renderImagePreviews();
                processedCount++;
                
                if (processedCount === totalFiles) {
                    this.showToast(`成功添加 ${this.currentImages.length} 张图片`);
                }
            };
            
            reader.onerror = () => {
                this.showToast('图片读取失败，请重试');
                processedCount++;
            };
            
            reader.readAsDataURL(file);
        });

        // 清空input，允许重复选择同一文件
        e.target.value = '';
    }

    // 渲染图片预览
    renderImagePreviews() {
        const container = document.getElementById('imagePreviewContainer');
        if (!container) return;
        
        container.innerHTML = '';

        this.currentImages.forEach((img, index) => {
            const previewItem = document.createElement('div');
            previewItem.className = 'image-preview-item';
            previewItem.innerHTML = `
                <img src="${img.src}" alt="预览图片" loading="lazy">
                <button type="button" class="remove-image" data-index="${index}" aria-label="删除图片">×</button>
            `;
            container.appendChild(previewItem);
        });

        // 绑定删除按钮事件
        container.querySelectorAll('.remove-image').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const index = parseInt(e.target.dataset.index);
                this.currentImages.splice(index, 1);
                this.renderImagePreviews();
            });
        });
    }

    // 提交记录
    submitRecord() {
        if (this.isSubmitting) return;
        
        const textInput = document.getElementById('textInput');
        if (!textInput) return;
        
        const content = textInput.value.trim();

        if (!content && this.currentImages.length === 0) {
            this.showToast('请输入文字或添加图片！');
            return;
        }

        this.isSubmitting = true;
        const submitBtn = document.getElementById('submitBtn');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.textContent = '发布中...';
        }

        try {
            const record = {
                id: Date.now(),
                content: content,
                images: [...this.currentImages],
                timestamp: new Date().toISOString()
            };

            this.records.unshift(record);
            this.saveToStorage();
            this.renderRecords();
            this.clearForm();
            
            this.showToast('✨ 记录发布成功！');
        } catch (error) {
            console.error('发布失败:', error);
            this.showToast('发布失败，请重试');
        } finally {
            this.isSubmitting = false;
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.textContent = '✨ 发布记录';
            }
        }
    }

    // 清空表单
    clearForm() {
        const textInput = document.getElementById('textInput');
        if (textInput) {
            textInput.value = '';
        }
        this.currentImages = [];
        this.renderImagePreviews();
    }

    // 渲染记录列表
    renderRecords() {
        const recordsList = document.getElementById('recordsList');
        const emptyState = document.getElementById('emptyState');

        if (!recordsList || !emptyState) return;

        if (this.records.length === 0) {
            recordsList.innerHTML = '';
            emptyState.style.display = 'block';
            return;
        }

        emptyState.style.display = 'none';
        recordsList.innerHTML = this.records.map(record => this.createRecordHTML(record)).join('');

        // 绑定记录项事件
        this.bindRecordEvents();
    }

    // 创建记录HTML
    createRecordHTML(record) {
        const date = new Date(record.timestamp);
        const timeStr = this.formatDate(date);
        
        const imagesHTML = record.images && record.images.length > 0 
            ? `<div class="record-images">
                ${record.images.map(img => `
                    <div class="record-image" data-src="${img.src}">
                        <img src="${img.src}" alt="记录图片" loading="lazy">
                    </div>
                `).join('')}
               </div>`
            : '';

        return `
            <div class="record-item" data-id="${record.id}">
                <div class="record-header">
                    <span class="record-time">${timeStr}</span>
                    <div class="record-actions">
                        <button type="button" class="edit-btn" data-id="${record.id}">编辑</button>
                        <button type="button" class="delete-btn" data-id="${record.id}">删除</button>
                    </div>
                </div>
                <div class="record-content">${this.escapeHtml(record.content)}</div>
                ${imagesHTML}
            </div>
        `;
    }

    // 绑定记录项事件
    bindRecordEvents() {
        // 删除按钮
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = parseInt(e.target.dataset.id);
                this.deleteRecord(id);
            });
        });

        // 编辑按钮
        document.querySelectorAll('.edit-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const id = parseInt(e.target.dataset.id);
                this.startEdit(id);
            });
        });

        // 图片点击放大
        document.querySelectorAll('.record-image').forEach(img => {
            img.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const src = e.currentTarget.dataset.src;
                this.openModal(src);
            });
        });
    }

    // 删除记录
    deleteRecord(id) {
        if (confirm('确定要删除这条记录吗？')) {
            this.records = this.records.filter(r => r.id !== id);
            this.saveToStorage();
            this.renderRecords();
            this.showToast('🗑️ 记录已删除');
        }
    }

    // 开始编辑
    startEdit(id) {
        const record = this.records.find(r => r.id === id);
        if (!record) return;

        this.editingId = id;
        const recordItem = document.querySelector(`.record-item[data-id="${id}"]`);
        if (!recordItem) return;
        
        recordItem.classList.add('editing');

        const contentDiv = recordItem.querySelector('.record-content');
        const actionsDiv = recordItem.querySelector('.record-actions');

        if (!contentDiv || !actionsDiv) return;

        // 替换为编辑界面
        contentDiv.innerHTML = `
            <textarea class="edit-textarea" rows="3">${this.escapeHtml(record.content)}</textarea>
        `;
        
        actionsDiv.innerHTML = `
            <button type="button" class="save-btn" data-id="${id}">保存</button>
            <button type="button" class="cancel-btn" data-id="${id}">取消</button>
        `;

        // 绑定保存和取消事件
        const saveBtn = actionsDiv.querySelector('.save-btn');
        const cancelBtn = actionsDiv.querySelector('.cancel-btn');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.saveEdit(id);
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.cancelEdit(id);
            });
        }

        // 自动聚焦
        const textarea = recordItem.querySelector('.edit-textarea');
        if (textarea) {
            textarea.focus();
        }
    }

    // 保存编辑
    saveEdit(id) {
        const recordItem = document.querySelector(`.record-item[data-id="${id}"]`);
        if (!recordItem) return;
        
        const textarea = recordItem.querySelector('.edit-textarea');
        if (!textarea) return;
        
        const newContent = textarea.value.trim();

        const record = this.records.find(r => r.id === id);
        if (record) {
            record.content = newContent;
            this.saveToStorage();
            this.renderRecords();
            this.showToast('✅ 修改已保存');
        }

        this.editingId = null;
    }

    // 取消编辑
    cancelEdit(id) {
        this.editingId = null;
        this.renderRecords();
    }

    // 打开图片弹窗
    openModal(src) {
        const modal = document.getElementById('imageModal');
        const modalImg = document.getElementById('modalImage');
        
        if (!modal || !modalImg) return;
        
        modalImg.src = src;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    // 关闭弹窗
    closeModal() {
        const modal = document.getElementById('imageModal');
        if (!modal) return;
        
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    // 格式化日期
    formatDate(date) {
        const now = new Date();
        const diff = now - date;
        
        // 小于1分钟
        if (diff < 60000) {
            return '刚刚';
        }
        
        // 小于1小时
        if (diff < 3600000) {
            return Math.floor(diff / 60000) + '分钟前';
        }
        
        // 小于24小时
        if (diff < 86400000) {
            return Math.floor(diff / 3600000) + '小时前';
        }
        
        // 小于7天
        if (diff < 604800000) {
            return Math.floor(diff / 86400000) + '天前';
        }

        // 默认显示完整日期
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }

    // HTML转义
    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 显示提示
    showToast(message) {
        let toast = document.getElementById('toast');
        
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'toast';
            toast.className = 'toast';
            document.body.appendChild(toast);
        }
        
        toast.textContent = message;
        toast.classList.add('show');

        // 2秒后隐藏
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    // 保存到本地存储
    saveToStorage() {
        try {
            localStorage.setItem('photoDiary_records', JSON.stringify(this.records));
        } catch (e) {
            console.warn('无法保存到本地存储:', e);
            this.showToast('存储空间不足，请删除一些记录');
        }
    }

    // 从本地存储加载
    loadFromStorage() {
        try {
            const data = localStorage.getItem('photoDiary_records');
            if (data) {
                this.records = JSON.parse(data);
            }
        } catch (e) {
            console.warn('无法从本地存储加载:', e);
            this.records = [];
        }
    }
}

// 初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new PhotoDiary();
});

// 防止iOS双击缩放
document.addEventListener('touchstart', function() {}, { passive: true });

// 防止iOS橡皮筋效果
document.body.addEventListener('touchmove', function(e) {
    if (e.target.closest('.modal')) return;
}, { passive: true });
