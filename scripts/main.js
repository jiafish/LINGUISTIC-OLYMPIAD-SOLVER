// ============================================================================
// API 串接設定區
// ============================================================================

// TODO: 【API串接點1】請填入您的後端API位址
// 此API用於上傳檔案和題型，並獲取解題結果
const API_BASE_URL = 'http://localhost:8000'; // 請修改為實際API位址
const API_SOLVE_ENDPOINT = `${API_BASE_URL}/solve`; // 解題API端點

// TODO: 【API串接點2】如果需要單獨的檔案上傳API（在上傳時立即儲存），請填入以下位址
// const API_UPLOAD_ENDPOINT = `${API_BASE_URL}/upload`; // 檔案上傳API端點

// TODO: 【API串接點3】如果需要單獨的檔案刪除API，請填入以下位址
// const API_DELETE_ENDPOINT = `${API_BASE_URL}/delete`; // 檔案刪除API端點

// TODO: 【API串接點4】PDF下載API端點（如果需要從後端生成PDF）
// const API_DOWNLOAD_PDF_ENDPOINT = `${API_BASE_URL}/download-pdf`; // PDF下載API端點

// ============================================================================
// 等待 DOM 載入完成後執行
// ============================================================================
document.addEventListener('DOMContentLoaded', function() {
  // ============================================================================
  // 全局變數
  // ============================================================================
  const pageUpload = document.getElementById('page-upload');
  const pageLoading = document.getElementById('page-loading');
  const pageResult = document.getElementById('page-result');

  const solveForm = document.getElementById('solve-form');
  const problemInput = document.getElementById('problem-input');
  const answerInput = document.getElementById('answer-input');
  const solveBtn = document.getElementById('solve-btn');

  const problemUploadArea = document.getElementById('problem-upload-area');
  const answerUploadArea = document.getElementById('answer-upload-area');
  const problemFileInfo = document.getElementById('problem-file-info');
  const answerFileInfo = document.getElementById('answer-file-info');
  const problemFileName = document.getElementById('problem-file-name');
  const answerFileName = document.getElementById('answer-file-name');

  const analysisContent = document.getElementById('analysis-content');
  const stepsContent = document.getElementById('steps-content');
  const finalContent = document.getElementById('final-content');

  const funFactText = document.getElementById('fun-fact-text');

  let currentProblemType = 'Phonology'; // 預設題型
  let problemFile = null;
  let answerFile = null;
  let apiResponseData = null; // 儲存API回傳的完整資料，用於PDF下載

  // ============================================================================
  // Linguistic Fun Facts 資料（20組）
  // ============================================================================
  const funFacts = [
    "起來活動筋骨，休息是為了走更長遠的路。",
    "保持耐心。 最棒的旅程總是需要一點時間準備",
    "聽點音樂。 讓節奏感為你的下一題暖場",
    "思考你的策略。 下一步該怎麼做？提前規劃是成功的關鍵。",
    "感謝你的等待。 我們正在努力讓你盡快回到語奧遊戲中！",
    "保持專注。 一個小小的細節可能就是解題的關鍵。",
    "偶爾改變一下思路，或許會有意想不到的收穫。",
    "深呼吸。 讓自己放鬆，享受接下來的語奧時光。",
    "你知道語奧的縮寫是IOL而不是ILO嗎。",
    "第一屆國際語奧於2003年的保加利亞舉辦。",
    "很多的科學奧林匹亞起源於東歐的共產主義國家，目的是為了在冷戰時期與西方國家在科學和教育領域較量。",
    "語奧分為個人賽跟團體賽，時長分別為6小時及4小時。",
    "吃飽睡好，才是衝到最後的秘訣。",
    "2025年的語奧主辦國是台灣喔！",
    "參賽者可以選擇任一語言的題本作答。",
    "語奧不會使用人造或是虛構的語言出題。",
    "語奧每隊有四個人，一個國家最多可以派出兩隊。",
    "語奧的開幕典禮上，會有關於今年題目的小提示。",
    "每年2-3月台灣會舉辦語奧初選。",
    "台灣語奧的網站上有台灣初選的歷屆試題。"
  ];

  // ============================================================================
  // 頁面切換函數
  // ============================================================================
  function showPage(name) {
    pageUpload.classList.remove('active');
    pageLoading.classList.remove('active');
    pageResult.classList.remove('active');

    if (name === 'upload') pageUpload.classList.add('active');
    if (name === 'loading') pageLoading.classList.add('active');
    if (name === 'result') pageResult.classList.add('active');
  }

  // ============================================================================
  // 題型選擇（Tabs）
  // ============================================================================
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentProblemType = btn.getAttribute('data-type');
      console.log('Selected problem type:', currentProblemType); // 用於調試
    });
  });

  // ============================================================================
  // 檔案上傳功能
  // ============================================================================
  
  // 題目檔案上傳
  problemUploadArea.addEventListener('click', () => {
    problemInput.click();
  });

  problemInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      problemFile = e.target.files[0];
      displayFileInfo('problem', problemFile.name);
      
      // TODO: 【可選API串接】如果需要在上傳時立即儲存到後端
      // uploadFileToBackend(problemFile, 'problem');
    }
  });

  // 答案檔案上傳
  answerUploadArea.addEventListener('click', () => {
    answerInput.click();
  });

  answerInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      answerFile = e.target.files[0];
      displayFileInfo('answer', answerFile.name);
      
      // TODO: 【可選API串接】如果需要在上傳時立即儲存到後端
      // uploadFileToBackend(answerFile, 'answer');
    }
  });

  // 拖放功能
  setupDragAndDrop(problemUploadArea, problemInput, 'problem');
  setupDragAndDrop(answerUploadArea, answerInput, 'answer');

  function setupDragAndDrop(area, input, type) {
    area.addEventListener('dragover', (e) => {
      e.preventDefault();
      area.classList.add('dragover');
    });

    area.addEventListener('dragleave', () => {
      area.classList.remove('dragover');
    });

    area.addEventListener('drop', (e) => {
      e.preventDefault();
      area.classList.remove('dragover');
      const files = e.dataTransfer.files;
      if (files && files[0] && files[0].type === 'application/pdf') {
        const file = files[0];
        if (type === 'problem') {
          problemFile = file;
          // 創建新的 FileList 對象
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          problemInput.files = dataTransfer.files;
          displayFileInfo('problem', file.name);
        } else {
          answerFile = file;
          const dataTransfer = new DataTransfer();
          dataTransfer.items.add(file);
          answerInput.files = dataTransfer.files;
          displayFileInfo('answer', file.name);
        }
      }
    });
  }

  // 顯示檔案資訊
  function displayFileInfo(type, fileName) {
    if (type === 'problem') {
      problemFileName.textContent = fileName;
      problemFileInfo.classList.add('active');
    } else {
      answerFileName.textContent = fileName;
      answerFileInfo.classList.add('active');
    }
  }

  // 刪除檔案
  document.getElementById('problem-remove-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    removeFile('problem');
  });

  document.getElementById('answer-remove-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    removeFile('answer');
  });

  function removeFile(type) {
    if (type === 'problem') {
      problemFile = null;
      problemInput.value = '';
      problemFileInfo.classList.remove('active');
      
      // TODO: 【可選API串接】如果需要從後端刪除檔案
      // deleteFileFromBackend('problem');
    } else {
      answerFile = null;
      answerInput.value = '';
      answerFileInfo.classList.remove('active');
      
      // TODO: 【可選API串接】如果需要從後端刪除檔案
      // deleteFileFromBackend('answer');
    }
  }

  // 重新上傳檔案
  document.getElementById('problem-reupload-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    problemInput.click();
  });

  document.getElementById('answer-reupload-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    answerInput.click();
  });

  // ============================================================================
  // Loading 頁面 - Fun Facts 輪播（每7秒切換）
  // ============================================================================
  let funFactInterval = null;
  let currentFunFactIndex = 0;

  function startFunFactRotation() {
    // 顯示第一個fun fact
    funFactText.textContent = funFacts[0];
    
    // 每7秒切換
    funFactInterval = setInterval(() => {
      currentFunFactIndex = (currentFunFactIndex + 1) % funFacts.length;
      funFactText.style.opacity = '0';
      setTimeout(() => {
        funFactText.textContent = funFacts[currentFunFactIndex];
        funFactText.style.opacity = '1';
      }, 300);
    }, 7000);
  }

  function stopFunFactRotation() {
    if (funFactInterval) {
      clearInterval(funFactInterval);
      funFactInterval = null;
    }
  }

  // ============================================================================
  // 表單提交：呼叫後端API
  // ============================================================================
  solveForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 驗證檔案上傳
    if (!problemFile || !answerFile) {
      alert('請上傳檔案'); // 中文Alert
      return;
    }

    // 切換到Loading頁面
    showPage('loading');
    startFunFactRotation();

    // 禁用按鈕
    solveBtn.disabled = true;
    solveBtn.classList.add('btn-disabled');

    try {
      // ========================================================================
      // 【API串接點1】主要的API呼叫：上傳檔案和題型，獲取解題結果
      // ========================================================================
      const formData = new FormData();
      formData.append('problem_pdf', problemFile);
      formData.append('answer_pdf', answerFile);
      formData.append('problem_type', currentProblemType); // 題型名稱

      console.log('Sending request to:', API_SOLVE_ENDPOINT);
      console.log('Problem type:', currentProblemType);
      console.log('Problem file:', problemFile.name);
      console.log('Answer file:', answerFile.name);

      const response = await fetch(API_SOLVE_ENDPOINT, {
        method: 'POST',
        body: formData
        // 注意：不要手動設定 Content-Type，瀏覽器會自動設定 multipart/form-data
      });

      if (!response.ok) {
        throw new Error(`伺服器錯誤: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      apiResponseData = data; // 儲存完整回應，供PDF下載使用

      console.log('API Response:', data);

      // ========================================================================
      // 處理API回傳的資料
      // 請根據您的後端API回應格式調整以下欄位名稱
      // ========================================================================
      
      // TODO: 【API資料格式】請根據您的後端回應格式調整以下欄位名稱
      // 預期API回應格式範例：
      // {
      //   "problemAnalysis": "分析內容...",
      //   "stepByStepSolution": "步驟內容...",
      //   "finalAnswer": "最終答案..."
      // }


      // analysisContent.textContent = data.problemAnalysis || data.analysis || data.problem_analysis || '(未回傳分析內容)';
      
      stepsContent.innerHTML = data.stepByStepSolution ||  '<p class="text-gray-500">(未回傳分析內容)</p>'
          
      // finalContent.textContent = data.finalAnswer || data.answer || data.final_answer || '(未回傳最終答案)';

      // 調整結果區塊高度（根據內容自動調整，限制在300px-1080px之間）
      adjustResultSections();

      // 切換到結果頁面
      stopFunFactRotation();
      showPage('result');

    } catch (error) {
      console.error('Error:', error);
      alert(`發生錯誤: ${error.message}`);
      stopFunFactRotation();
      showPage('upload');
    } finally {
      solveBtn.disabled = false;
      solveBtn.classList.remove('btn-disabled');
    }
  });

  // ============================================================================
  // 調整結果區塊高度
  // ============================================================================
  function adjustResultSections() {
    // const sections = ['analysis-section', 'steps-section', 'final-section'];
    const sections = ['steps-section'];
    sections.forEach(sectionId => {
      const section = document.getElementById(sectionId);
      const content = section.querySelector('.result-content');
      const contentHeight = content.scrollHeight;
      
      // 設定高度範圍：最小300px，最大1080px
      if (contentHeight < 300) {
        section.style.minHeight = '300px';
      } else if (contentHeight > 1080) {
        section.style.maxHeight = '1080px';
        section.style.overflowY = 'auto';
      } else {
        section.style.minHeight = `${contentHeight}px`;
      }
    });
  }

  // ============================================================================
  // 取消Loading
  // ============================================================================
  document.getElementById('cancel-btn').addEventListener('click', () => {
    stopFunFactRotation();
    showPage('upload');
  });

  // ============================================================================
  // 新問題：重置表單
  // ============================================================================
  document.getElementById('new-problem-btn').addEventListener('click', () => {
    solveForm.reset();
    problemFile = null;
    answerFile = null;
    apiResponseData = null;
    problemFileInfo.classList.remove('active');
    answerFileInfo.classList.remove('active');
    // analysisContent.textContent = '';
    stepsContent.textContent = '';
    // finalContent.textContent = '';
    showPage('upload');
  });

  // ============================================================================
  // PDF下載功能
  // ============================================================================
  document.getElementById('download-pdf-btn').addEventListener('click', async () => {
    if (!apiResponseData) {
      alert('沒有可下載的資料');
      return;
    }

    try {
      // ========================================================================
      // 【API串接點4】PDF下載 - 方案1：從後端生成並下載PDF
      // ========================================================================
      // TODO: 如果您的後端提供PDF生成API，可以使用以下方式：
      // const response = await fetch(API_DOWNLOAD_PDF_ENDPEINT, {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(apiResponseData)
      // });
      // const blob = await response.blob();
      // const url = window.URL.createObjectURL(blob);
      // const a = document.createElement('a');
      // a.href = url;
      // a.download = 'solution.pdf';
      // a.click();
      // window.URL.revokeObjectURL(url);

      // ========================================================================
      // PDF下載 - 方案2：前端生成PDF（使用jsPDF等庫）
      // ========================================================================
      // 如果沒有後端PDF生成API，可以考慮在前端使用jsPDF生成
      // 目前先顯示Alert提示
      // alert('PDF下載功能需串接後端API或使用前端PDF生成庫（如jsPDF）');
      
      // 以下是使用jsPDF的範例（需要引入jsPDF庫）：
      // import jsPDF from 'jspdf';
      // const doc = new jsPDF();
      // doc.text('Problem Analysis', 10, 10);
      // doc.text(apiResponseData.problemAnalysis, 10, 20);
      // doc.save('solution.pdf');
      
    
      // 1. 取得你要輸出的三個區塊的 DOM
      // const analysisContent = document.getElementById('analysis-content');
      // const stepsContent = document.getElementById('steps-content');
      // const finalContent = document.getElementById('final-content');

      // 檢查是否有內容，避免報錯
      if (!stepsContent) {
          alert("請先產生解題結果再下載！");
          return;
      }

      // 2. 建立一個暫時的容器 (這個 div 不會顯示在畫面上，純粹為了排版 PDF)
      const elementToPrint = document.createElement('div');
      
      // 加入一些 CSS 樣式讓 PDF 好看一點 (padding, 字體等)
      elementToPrint.style.cssText = `
        width: 100%;
        margin: 0; 
        padding: 0;
        font-family: 'Microsoft JhengHei', sans-serif;
        color: #333;
        background: white; /* 確保背景是白的 */
      `;
      const styleContent = `
        <style>
            /* 針對所有段落、標題、列表項目、表格行，設定「不可被切斷」 */
            p, h1, h2, h3, h4, h5, h6, li, tr, blockquote {
                page-break-inside: avoid;
                break-inside: avoid; 
            }
            
            /* 確保圖片也不會被切一半 */
            img {
                page-break-inside: avoid;
                max-width: 100% !important;
            }

            /* 修正標題 margin 導致的頂部空白問題 */
            h1 { margin-top: 0; padding-top: 20px; }
            
            /* 優化排版 */
            .section-container { margin-bottom: 30px; }
            .content-box { font-size: 14px; line-height: 1.6; }
        </style>
      `;
      // 3. 組合內容 (使用 innerHTML 把剛剛後端傳來的 HTML 塞進去)
      // 你可以自己加 <h2> 標題讓 PDF 結構更清楚
      elementToPrint.innerHTML = `
        ${styleContent}
        <div style="padding: 20px;">
            <h1 style="text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px;">語奧解題報告</h1>
            
            
            
            <div class="section-container">
                <h2 style="color: #2c3e50; border-left: 5px solid #2c3e50; padding-left: 10px;">逐步詳解</h2>
                <div class="content-box">${stepsContent.innerHTML}</div>
            </div>
            
    
        </div>
      `;

    // 4. 設定 PDF 選項
    const opt = {
        margin:       10, // 頁面邊距
        filename:     '解題結果.pdf',
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
            scale: 2, 
            useCORS: true,
            scrollY: 0 // 【重要】防止因為捲動位置導致的空白
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        
        // 【修正 3】啟用 pagebreak 功能
        // mode: 'avoid-all' 會盡量不切斷任何元素
        // mode: 'css' 會尊照我們上面寫的 page-break-inside: avoid
        pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] } 
    };

    // 5. 執行轉換並下載
    // .set(opt) -> 設定參數
    // .from(elementToPrint) -> 指定要轉的元素 (就是我們剛剛組出來的那個)
    // .save() -> 下載
    html2pdf().set(opt).from(elementToPrint).save();
// });

    } catch (error) {
      console.error('PDF下載錯誤:', error);
      alert(`PDF下載失敗: ${error.message}`);
    }
  });

  // ============================================================================
  // 【可選】檔案上傳到後端的輔助函數（如果需要即時上傳）
  // ============================================================================
  // async function uploadFileToBackend(file, fileType) {
  //   try {
  //     const formData = new FormData();
  //     formData.append('file', file);
  //     formData.append('file_type', fileType);
  //     
  //     const response = await fetch(API_UPLOAD_ENDPOINT, {
  //       method: 'POST',
  //       body: formData
  //     });
  //     
  //     if (!response.ok) {
  //       throw new Error('檔案上傳失敗');
  //     }
  //     
  //     const data = await response.json();
  //     console.log('檔案上傳成功:', data);
  //     return data.file_id; // 假設後端回傳檔案ID
  //   } catch (error) {
  //     console.error('檔案上傳錯誤:', error);
  //     throw error;
  //   }
  // }

  // ============================================================================
  // 【可選】從後端刪除檔案的輔助函數
  // ============================================================================
  // async function deleteFileFromBackend(fileType) {
  //   try {
  //     const response = await fetch(API_DELETE_ENDPOINT, {
  //       method: 'DELETE',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ file_type: fileType })
  //     });
  //     
  //     if (!response.ok) {
  //       throw new Error('檔案刪除失敗');
  //     }
  //     
  //     console.log('檔案刪除成功');
  //   } catch (error) {
  //     console.error('檔案刪除錯誤:', error);
  //   }
  // }
});

