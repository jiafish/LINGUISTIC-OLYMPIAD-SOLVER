// ============================================================================
// 演示模式 JavaScript（不需要真實API）
// ============================================================================

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
  let problemFileName_demo = null;
  let answerFileName_demo = null;

  // ============================================================================
  // Linguistic Fun Facts 資料（20組）
  // ============================================================================
  const funFacts = [
    "'Pneumonoultramicroscopicsilicovolcanoconiosis' is one of the longest words in the English dictionary.",
    "Some languages like Pirahã are argued to have no exact number words.",
    "In many languages, word order changes meaning more than word endings.",
    "Sign languages have their own grammars, not just 'signed versions' of spoken languages.",
    "There are over 7,000 languages spoken in the world today.",
    "The word 'set' has the most definitions in the Oxford English Dictionary (over 400).",
    "Some languages, like Finnish, can form extremely long words through compounding.",
    "The Rosetta Stone was crucial in deciphering Egyptian hieroglyphs.",
    "Linguistic diversity is decreasing rapidly—one language dies every two weeks.",
    "Whistled languages exist in several cultures, such as Silbo Gomero in the Canary Islands.",
    "The sentence 'Buffalo buffalo Buffalo buffalo buffalo buffalo Buffalo buffalo' is grammatically correct in English.",
    "Some languages have more than 100 different pronouns.",
    "The word 'literally' is now often used to mean its opposite ('figuratively').",
    "Clicks are used as consonants in several African languages, like Xhosa and Zulu.",
    "Some languages don't have words for 'left' and 'right', using cardinal directions instead.",
    "The word 'orange' didn't have a name until the fruit was introduced—it was just 'yellow-red'.",
    "Pirahã language may lack recursion, challenging some theories of universal grammar.",
    "Some languages use tone to distinguish meaning, like Mandarin Chinese with four tones.",
    "The Sapir-Whorf hypothesis suggests language shapes our perception of reality.",
    "Palindromes exist in many languages—words or phrases that read the same backward and forward."
  ];

  // ============================================================================
  // 假資料（演示用）
  // ============================================================================
  const demoData = {
    problemAnalysis: `This is a ${currentProblemType} problem that requires careful analysis of linguistic patterns. The problem presents a set of data points that follow specific rules, which need to be identified through systematic comparison.

Key observations:
- The data shows consistent patterns across multiple examples
- There are identifiable structural relationships
- The pattern suggests a systematic rule-based approach
- Comparison of minimal pairs reveals the underlying structure

The problem requires identifying the relationship between input and output forms, and understanding the transformation rules that govern this linguistic phenomenon.`,
    
    stepByStepSolution: `Step 1: Identify the basic units
First, we examine the smallest meaningful units in the data and identify their patterns.

Step 2: Compare minimal pairs
By comparing similar forms with systematic differences, we can isolate the relevant variables.

Step 3: Formulate hypotheses
Based on the patterns observed, we develop hypotheses about the underlying rules.

Step 4: Test and refine
We test our hypotheses against all available data and refine our understanding.

Step 5: Generalize the rule
Once validated, we formulate the general rule that explains all observed patterns.

Step 6: Apply to new cases
Finally, we apply the discovered rule to solve the specific problem at hand.`,
    
    finalAnswer: `Based on the systematic analysis, the solution demonstrates a clear pattern where [specific rule applies].

The final answer follows the established pattern and can be verified through the methodology outlined above. All transformations are consistent with the identified linguistic rules.`
  };

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
      console.log('Selected problem type:', currentProblemType);
    });
  });

  // ============================================================================
  // 檔案上傳功能（演示模式 - 允許假上傳）
  // ============================================================================
  
  // 題目檔案上傳
  problemUploadArea.addEventListener('click', (e) => {
    // 如果點擊的不是按鈕，才觸發檔案選擇
    if (!e.target.closest('.file-actions')) {
      problemInput.click();
      // 演示模式：如果沒有檔案，自動填充假檔名
      setTimeout(() => {
        if (!problemFileName_demo) {
          problemFileName_demo = 'demo_problem.pdf';
          displayFileInfo('problem', problemFileName_demo);
        }
      }, 100);
    }
  });

  problemInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      problemFileName_demo = e.target.files[0].name;
      displayFileInfo('problem', problemFileName_demo);
    } else if (!problemFileName_demo) {
      // 演示模式：如果取消選擇，自動填充假檔名
      problemFileName_demo = 'demo_problem.pdf';
      displayFileInfo('problem', problemFileName_demo);
    }
  });

  // 答案檔案上傳
  answerUploadArea.addEventListener('click', (e) => {
    // 如果點擊的不是按鈕，才觸發檔案選擇
    if (!e.target.closest('.file-actions')) {
      answerInput.click();
      // 演示模式：如果沒有檔案，自動填充假檔名
      setTimeout(() => {
        if (!answerFileName_demo) {
          answerFileName_demo = 'demo_answer.pdf';
          displayFileInfo('answer', answerFileName_demo);
        }
      }, 100);
    }
  });

  answerInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      answerFileName_demo = e.target.files[0].name;
      displayFileInfo('answer', answerFileName_demo);
    } else if (!answerFileName_demo) {
      // 演示模式：如果取消選擇，自動填充假檔名
      answerFileName_demo = 'demo_answer.pdf';
      displayFileInfo('answer', answerFileName_demo);
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
      if (files && files[0]) {
        const file = files[0];
        if (type === 'problem') {
          problemFileName_demo = file.name;
          displayFileInfo('problem', file.name);
        } else {
          answerFileName_demo = file.name;
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
      problemFileName_demo = null;
      problemInput.value = '';
      problemFileInfo.classList.remove('active');
    } else {
      answerFileName_demo = null;
      answerInput.value = '';
      answerFileInfo.classList.remove('active');
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
  // 表單提交：演示模式（10秒後顯示假資料）
  // ============================================================================
  solveForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    // 演示模式：如果沒有上傳檔案，自動填充假檔名
    if (!problemFileName_demo) {
      problemFileName_demo = 'demo_problem.pdf';
      displayFileInfo('problem', problemFileName_demo);
    }
    if (!answerFileName_demo) {
      answerFileName_demo = 'demo_answer.pdf';
      displayFileInfo('answer', answerFileName_demo);
    }

    // 切換到Loading頁面
    showPage('loading');
    startFunFactRotation();

    // 禁用按鈕
    solveBtn.disabled = true;
    solveBtn.classList.add('btn-disabled');

    // ========================================================================
    // 演示模式：10秒後自動顯示假資料
    // ========================================================================
    setTimeout(() => {
      // 更新假資料中的題型
      const updatedDemoData = {
        problemAnalysis: `This is a ${currentProblemType} problem that requires careful analysis of linguistic patterns. The problem presents a set of data points that follow specific rules, which need to be identified through systematic comparison.

Key observations:
- The data shows consistent patterns across multiple examples
- There are identifiable structural relationships
- The pattern suggests a systematic rule-based approach
- Comparison of minimal pairs reveals the underlying structure

The problem requires identifying the relationship between input and output forms, and understanding the transformation rules that govern this linguistic phenomenon.`,
        
        stepByStepSolution: `Step 1: Identify the basic units
First, we examine the smallest meaningful units in the data and identify their patterns.

Step 2: Compare minimal pairs
By comparing similar forms with systematic differences, we can isolate the relevant variables.

Step 3: Formulate hypotheses
Based on the patterns observed, we develop hypotheses about the underlying rules.

Step 4: Test and refine
We test our hypotheses against all available data and refine our understanding.

Step 5: Generalize the rule
Once validated, we formulate the general rule that explains all observed patterns.

Step 6: Apply to new cases
Finally, we apply the discovered rule to solve the specific problem at hand.`,
        
        finalAnswer: `Based on the systematic analysis, the solution demonstrates a clear pattern where [specific rule applies].

The final answer follows the established pattern and can be verified through the methodology outlined above. All transformations are consistent with the identified linguistic rules.`
      };

      // 顯示假資料
      analysisContent.textContent = updatedDemoData.problemAnalysis;
      stepsContent.textContent = updatedDemoData.stepByStepSolution;
      finalContent.textContent = updatedDemoData.finalAnswer;

      // 調整結果區塊高度
      adjustResultSections();

      // 切換到結果頁面
      stopFunFactRotation();
      showPage('result');

      // 恢復按鈕
      solveBtn.disabled = false;
      solveBtn.classList.remove('btn-disabled');
    }, 10000); // 10秒
  });

  // ============================================================================
  // 調整結果區塊高度
  // ============================================================================
  function adjustResultSections() {
    const sections = ['analysis-section', 'steps-section', 'final-section'];
    
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
    solveBtn.disabled = false;
    solveBtn.classList.remove('btn-disabled');
  });

  // ============================================================================
  // 新問題：重置表單
  // ============================================================================
  document.getElementById('new-problem-btn').addEventListener('click', () => {
    solveForm.reset();
    problemFileName_demo = null;
    answerFileName_demo = null;
    problemFileInfo.classList.remove('active');
    answerFileInfo.classList.remove('active');
    analysisContent.textContent = '';
    stepsContent.textContent = '';
    finalContent.textContent = '';
    showPage('upload');
  });

  // ============================================================================
  // PDF下載功能（演示模式）
  // ============================================================================
  document.getElementById('download-pdf-btn').addEventListener('click', () => {
    alert('演示模式：PDF下載功能需在實際版本中串接後端API');
  });
});

