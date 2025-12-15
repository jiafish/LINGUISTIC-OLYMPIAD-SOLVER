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
    "2025年的語奧主辦國是台灣喔！",
    "你知道語奧的縮寫是IOL而不是ILO嗎。",
    "語奧每隊有四個人，一個國家最多可以派出兩隊。",
    "語奧的開幕典禮上，會有關於今年題目的小提示。",
    "起來活動筋骨，休息是為了走更長遠的路。",
    "保持耐心。 最棒的旅程總是需要一點時間準備",
    "聽點音樂。 讓節奏感為你的下一題暖場",
    "思考你的策略。 下一步該怎麼做？提前規劃是成功的關鍵。",
    "感謝你的等待。 我們正在努力讓你盡快回到語奧遊戲中！",
    "保持專注。 一個小小的細節可能就是解題的關鍵。",
    "偶爾改變一下思路，或許會有意想不到的收穫。",
    "深呼吸。 讓自己放鬆，享受接下來的語奧時光。",
    "第一屆國際語奧於2003年的保加利亞舉辦。",
    "很多的科學奧林匹亞起源於東歐的共產主義國家，目的是為了在冷戰時期與西方國家在科學和教育領域較量。",
    "語奧分為個人賽跟團體賽，時長分別為6小時及4小時。",
    "吃飽睡好，才是衝到最後的秘訣。",
    "參賽者可以選擇任一語言的題本作答。",
    "語奧不會使用人造或是虛構的語言出題。",
    "每年2-3月台灣會舉辦語奧初選。",
    "台灣語奧的網站上有台灣初選的歷屆試題。"
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
        
        stepByStepSolution: `
          1. 尋找突破切入點：識別動詞詞根
          首先，我們通過比較具有相同動詞含義的句子來分離動詞詞根。
          • "Forgive" (原諒) 出現在句 1, 3, 6, 9, 11。
          o 1: hitolikaju
          o 3: yikvtolije
          o 6: hitolijv
          o 9: yvjitolikas
          o 11: yiskitolika
          o 共同部分： toli。
          o 結論： 動詞詞根 toli = forgive。
          • "Bite" (咬) 出現在句 2, 5, 8, 10。
          o 2: yvskiskahljv
          o 5: skiskahljes
          o 8: kvskahljes
          o 10: jiskahlje
          o 共同部分： skahl。
          o 結論： 動詞詞根 skahl = bite。
          • "Recognise" (認出) 出現在句 4, 7。
          o 4: vjvyohlkaju
          o 7: yvhiyohljv
          o 共同部分： yohl。
          o 結論： 動詞詞根 yohl = recognise。
          2. 滾雪球式推導：人稱前綴
          接下來，我們觀察動詞詞根之前的部分，找出表示「主語 -> 賓語」的人稱前
          綴。
          • You(SG) -> Them
          o 1: hi-toli...
          o 6: hi-toli...
          o 7: ...hi-yohl... (在 yv- 之後)
          o 假設： hi- = You(SG) -> Them。
          • You(SG) -> Me
          o 5: ski-skahl...
          o 2: ...ski-skahl... (在 yv- 之後)
          o 11: ...ski-toli... (在 yi- 之後)
          o 假設： ski- = You(SG) -> Me。
          • I -> Them
          o 10: ji-skahl...
          o 9: ...ji-toli... (在 yv- 之後)
          o 假設： ji- = I -> Them。
          • I -> You(SG)
          o 8: kv-skahl...
          o 3: ...kv-toli... (在 yi- 之後)
          o 假設： kv- = I -> You(SG)。
          • I -> You(PL)
          o 句 4: vjvyohlkaju 翻譯為 "I am recognising youPL again, right?"
          o 結構分析：v- (待分析前綴) + [人稱] + yohl (詞根) + ...
          o 如果詞根是 yohl，那麼人稱部分是 jv (因為 y 屬於詞根)。
          o 假設： jv- = I -> You(PL)。
          3. 歸納深層規律：前綴系統（Again, If, Not）
          我們觀察到人稱前綴之前還有其他前綴（yv-
          , yi-
          , v-），這些似乎與 "Again"
          （再次）、"If"（如果）和 "Not"（否定）有關。
          • "Again" (再次)
          o 句 4 (Again, Statement): v-jv... -> 前綴 v-。
          o 句 2 (Again, If): yv-ski... -> 前綴 yv-。
          o 句 7 (Again, Not): thla yv-hi... -> 前綴 yv-。
          o 句 9 (Again, Not): thla yv-ji... -> 前綴 yv-。
          o 觀察： 只要有 "Again"，就會出現 v- 或 yv-。
          • "If" (如果) 與 "Not" (否定)
          o 句 3 (If, No Again): yi-kv... -> 前綴 yi-。
          o 句 11 (Not, No Again): thla yi-ski... -> 前綴 yi-。
          o 句 5, 6, 8, 10 (Statement/Question, No Again): 無前綴。
          • 綜合規則：
          o Realis (現實/陳述/疑問):
          § 無 "Again": 零前綴 (Ø-)。
          § 有 "Again": 前綴 v-。
          o Irrealis (非現實 - If / Negation):
          § 無 "Again": 前綴 yi-。
          § 有 "Again": 前綴 yv- (可能是 yi + v 的融合)。
          o 否定詞： 句首加獨立詞 thla，動詞必須使用 Irrealis 前綴。
          4. 歸納深層規律：後綴系統（時態、語氣、句型）
          最後，我們分析動詞詞根之後的部分。
          • 時態與親知性 (Evidentiality)
          o Present (現在時):
          § 1: ...toli-ka...
          § 4: ...yohl-ka...
          § 9: ...toli-ka...
          § 11: ...toli-ka
          § 標記： -ka。
          o Past EXP (過去時，親身經歷):
          § 2: ...skahl-jv
          § 6: ...toli-jv
          § 7: ...yohl-jv
          § 標記： -jv。
          o Past NXP (過去時，非親身經歷):
          § 3: ...toli-je
          § 5: ...skahl-jes
          § 8: ...skahl-jes
          § 10: ...skahl-je
          § 標記： -je。
          • 句型標記 (Sentence Type)
          o 這些標記出現在時態後綴的末尾。
          o Statement (陳述句): 母音結尾 (如 -ka,
          o Yes/No Question (是非問句): 添加 -s。
          § 5: -je -> -jes。
          -jv,
          -je)。
          § 8: -je -> -jes。
          § 9: -ka -> -kas。
          o Tag Question ("...right?"): 添加 -ju。
          § 1: -ka -> -kaju。
          § 4: -ka -> -kaju。
          5. 系統化總結：切羅基語語法摘要
          詞序： (Neg) - [Prefix 1] - [Prefix 2] - [Root] - [Suffix 1] - [Suffix 2]
          1. 否定詞 (Neg): thla (置於動詞前)
          2. 情態/重複前綴 (Prefix 1):
          o Ø-: 一般陳述/疑問 (無 Again)
          o v-: 一般陳述/疑問 + Again
          o yi-: If / Negative (無 Again)
          o yv-: If / Negative + Again
          3. 人稱前綴 (Prefix 2):
          o ji-: I -> Them
          o kv-: I -> You(SG)
          o jv-: I -> You(PL)
          o hi-: You(SG) -> Them
          o ski-: You(SG) -> Me
          4. 動詞詞根 (Root):
          o toli: forgive
          o skahl: bite
          o yohl: recognise
          5. 時態/親知後綴 (Suffix 1):
          o -ka: Present
          o -jv: Past EXP (Experienced)
          o -je: Past NXP (Not Experienced)
          6. 句型後綴 (Suffix 2):
          o Ø: 陳述句 / If 子句
          o -s: 是非問句
          o -ju: 附加問句 ("...right?")
          6. 解答題目
          Q 9.1 Translate the following into English:
          1. yijvskahlje
          o 分析: yi (If) - jv (I->YouPL) - skahl (bite) - je (Past NXP)
          o 翻譯: if I bit(NXP) you(PL)
          2. thla yijvyohljvs
          o 分析: thla (Not) ... yi (Irrealis) - jv (I->YouPL) - yohl (recognise)
          - jv (Past EXP) - s (Question)
          o 注意: 這裡 yi 用於否定句。thla ... s 構成否定疑問句。
          o 翻譯: did I not recognise(EXP) you(PL)?
          3. vhitolikaju
          o 分析: v (Again) - hi (You->Them) - toli (forgive) - ka (Present)
          - ju (Right?)
          o 翻譯: you(SG) are forgiving them again, right?
          4. thla yvkvyohlka
          o 分析: thla (Not) ... yv (Irrealis+Again) - kv (I->YouSG)
          - yohl (recognise) - ka (Present)
          o 翻譯: I am not recognising you(SG) again
          5. yihitolije
          o 分析: yi (If) - hi (You->Them) - toli (forgive) - je (Past NXP)
          o 翻譯: if you(SG) forgave(NXP) them
          Q 9.2 Translate into Cherokee:
          1. did youSG forgiveNXP them?
          o 結構: [You->Them] - [forgive] - [Past NXP] - [Question]
          o 詞素: hi - toli - je - s
          o 組合: hitolijes
          2. if I recognisedNXP them again
          o 結構: [If+Again] - [I->Them] - [recognise] - [Past NXP]
          o 詞素: yv - ji - yohl - je
          o 組合: yvjiyohlje
          3. I forgaveEXP youPL again, right?
          o 結構: [Again] - [I->YouPL] - [forgive] - [Past EXP] - [Right?]
          o 詞素: v - jv - toli - jv - ju
          o 組合: vjvtolijvju
          4. 5. am I not biting youSG again?
          o 結構: [Not] ... [Irrealis+Again] - [I->YouSG] - [bite] - [Present] -
          [Question]
          o 詞素: thla ... yv - kv - skahl - ka - s
          o 組合: thla yvkvskahlkas
          if youSG are biting me
          o 結構: [If] - [You->Me] - [bite] - [Present]
          o 詞素: yi - ski - skahl - ka
          o 組合: yiskiskahlka 
        
        `,
        
        finalAnswer: `Based on the systematic analysis, the solution demonstrates a clear pattern where [specific rule applies].

The final answer follows the established pattern and can be verified through the methodology outlined above. All transformations are consistent with the identified linguistic rules.`
      };


      
     // 顯示假資料（只在有元素時才塞內容）
        if (analysisContent) {
          analysisContent.textContent = updatedDemoData.problemAnalysis;
        }
        if (stepsContent) {
          stepsContent.textContent = updatedDemoData.stepByStepSolution;
        }
        if (finalContent) {
          finalContent.textContent = updatedDemoData.finalAnswer;
        }

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
      if (!section) return;              // ★ 沒有這個區塊就跳過
  
      const content = section.querySelector('.result-content');
      if (!content) return;
  
      const contentHeight = content.scrollHeight;
  
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
      // 重設表單
      solveForm.reset();
      problemFileName_demo = null;
      answerFileName_demo = null;
    
      // 隱藏檔案資訊
      problemFileInfo.classList.remove('active');   // 或 .remove('visible') 看你 CSS
      answerFileInfo.classList.remove('active');
    
      // 清空結果內容（元素存在時才清）
      if (analysisContent) analysisContent.textContent = '';
      if (stepsContent) stepsContent.textContent = '';
      if (finalContent) finalContent.textContent = '';
    
      // 回到首頁（上傳頁）
      showPage('upload');
    });

  // ============================================================================
  // PDF下載功能（演示模式）
  // ============================================================================
  document.getElementById('download-pdf-btn').addEventListener('click', () => {
    alert('演示模式：PDF下載功能需在實際版本中串接後端API');
  });
});

